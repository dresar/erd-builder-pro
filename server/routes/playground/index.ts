import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { resolveAiConfig } from "../ai/service.js";
import { logger } from "../../lib/logger.js";
import { supabase, useLocalAuth } from "../../lib/config.js";
import { getSession } from "../../lib/desktop-auth.js";
import { randomUUID } from "crypto";

const router = Router();

async function resolveUserId(req: Request): Promise<string | undefined> {
  try {
    const token = req.cookies?.token || (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : undefined);
    if (!token) return undefined;
    if (useLocalAuth()) return (await getSession(token))?.userId;
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser(token);
      return user?.id;
    }
  } catch { }
  return undefined;
}

const PRICE_PER_1K: Record<string, { prompt: number; completion: number }> = {
  "gpt-4o": { prompt: 0.005, completion: 0.015 },
  "gpt-4o-mini": { prompt: 0.00015, completion: 0.0006 },
  "gpt-4-turbo": { prompt: 0.01, completion: 0.03 },
  "claude-3-5-sonnet-20241022": { prompt: 0.003, completion: 0.015 },
  "claude-3-5-haiku-20241022": { prompt: 0.0008, completion: 0.004 },
  "claude-opus-4-5": { prompt: 0.015, completion: 0.075 },
  "gemini-2.0-flash": { prompt: 0.000075, completion: 0.0003 },
  "gemini-2.5-pro": { prompt: 0.00125, completion: 0.01 },
  "deepseek-chat": { prompt: 0.00014, completion: 0.00028 },
};

export async function runPromptAgainstProvider(params: {
  systemPrompt?: string;
  userPrompt: string;
  userId?: string;
  providerCode?: string;
  model?: string;
  apiKey?: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
  responseFormat?: string;
}): Promise<{
  output: string;
  model: string;
  provider?: string;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  finishReason: string;
}> {
  const resolved = await resolveAiConfig({
    userId: params.userId,
    model: params.model,
    providerCode: params.providerCode,
    apiKey: params.apiKey,
    baseUrl: params.baseUrl,
  });

  const messages: any[] = [];
  if (params.systemPrompt) messages.push({ role: "system", content: params.systemPrompt });
  messages.push({ role: "user", content: params.userPrompt });

  const isGemini =
    resolved.providerCode === "gemini" ||
    (resolved.baseUrl || "").includes("generativelanguage.googleapis.com");

  const temperature = params.temperature ?? 0.7;
  const maxTokens = params.maxTokens ?? 2048;
  const responseFormat = params.responseFormat || "text";

  let fetchUrl: string;
  let fetchBody: any;
  let fetchHeaders: Record<string, string>;

  if (isGemini) {
    const safeModel = resolved.model || "gemini-2.0-flash";
    fetchUrl = `${resolved.baseUrl || "https://generativelanguage.googleapis.com/v1beta"}/models/${safeModel}:generateContent?key=${resolved.apiKey}`;
    fetchHeaders = { "Content-Type": "application/json" };
    const geminiContents = messages
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] }));
    const systemInstruction = messages.find((m) => m.role === "system");
    fetchBody = {
      contents: geminiContents,
      ...(systemInstruction ? { system_instruction: { parts: [{ text: systemInstruction.content }] } } : {}),
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
        ...(responseFormat === "json" ? { responseMimeType: "application/json" } : {}),
      },
    };
  } else {
    fetchUrl = `${resolved.baseUrl || "https://api.openai.com/v1"}/chat/completions`;
    fetchHeaders = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resolved.apiKey}`,
    };
    fetchBody = {
      model: resolved.model,
      messages,
      temperature,
      max_tokens: maxTokens,
      ...(responseFormat === "json" ? { response_format: { type: "json_object" } } : {}),
    };
  }

  const start = Date.now();
  const aiRes = await fetch(fetchUrl, {
    method: "POST",
    headers: fetchHeaders,
    body: JSON.stringify(fetchBody),
  });
  const latencyMs = Date.now() - start;

  if (!aiRes.ok) {
    const errText = await aiRes.text();
    throw new Error(`AI provider error ${aiRes.status}: ${errText}`);
  }

  const data = await aiRes.json() as any;
  let output = "";
  let promptTokens = 0;
  let completionTokens = 0;
  let finishReason = "stop";

  if (isGemini) {
    output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    finishReason = data?.candidates?.[0]?.finishReason || "STOP";
    promptTokens = data?.usageMetadata?.promptTokenCount || 0;
    completionTokens = data?.usageMetadata?.candidatesTokenCount || 0;
  } else {
    output = data?.choices?.[0]?.message?.content || "";
    finishReason = data?.choices?.[0]?.finish_reason || "stop";
    promptTokens = data?.usage?.prompt_tokens || 0;
    completionTokens = data?.usage?.completion_tokens || 0;
  }

  const prices = PRICE_PER_1K[resolved.model] || { prompt: 0.001, completion: 0.002 };
  const estimatedCostUsd =
    (promptTokens / 1000) * prices.prompt +
    (completionTokens / 1000) * prices.completion;

  return {
    output,
    model: resolved.model,
    provider: resolved.providerCode,
    latencyMs,
    promptTokens,
    completionTokens,
    totalTokens: promptTokens + completionTokens,
    estimatedCostUsd: parseFloat(estimatedCostUsd.toFixed(6)),
    finishReason,
  };
}

router.post("/run", async (req: Request, res: Response): Promise<void> => {
  const userId = await resolveUserId(req);
  const { systemPrompt, userPrompt, providerCode, model, apiKey, baseUrl, temperature, maxTokens, responseFormat } = req.body;

  if (!userPrompt) { res.status(400).json({ error: "userPrompt is required" }); return; }

  try {
    const result = await runPromptAgainstProvider({
      systemPrompt, userPrompt, userId, providerCode, model, apiKey, baseUrl, temperature, maxTokens, responseFormat,
    });
    res.json(result);
  } catch (err: any) {
    logger.error({ err }, "Playground run error");
    if (err.message?.includes("No AI provider") || err.message?.includes("unavailable")) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(502).json({ error: "Failed to run prompt" });
    }
  }
});

router.post("/sessions", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  const { name, systemPrompt, userPrompt, modelsJson, temperature, maxTokens, responseFormat, resultsJson, projectId } = req.body;

  try {
    const uid = randomUUID();
    await prisma.$executeRawUnsafe(
      `INSERT INTO playground_sessions (uid, user_id, project_id, name, system_prompt, user_prompt, models_json, temperature, max_tokens, response_format, results_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      uid, userId, projectId ?? null, name || "Untitled Session", systemPrompt || null, userPrompt || "",
      JSON.stringify(modelsJson || []), temperature ?? 0.7, maxTokens ?? 2048, responseFormat || "text", JSON.stringify(resultsJson || []),
    );
    const rows: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM playground_sessions WHERE uid = ?`, uid);
    res.status(201).json(rows[0]);
  } catch (err: any) {
    logger.error({ err }, "Failed to save playground session");
    res.status(500).json({ error: "Failed to save session" });
  }
});

router.get("/sessions", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const projectId = req.query.project_id as string | undefined;
    const rows: any[] = projectId
      ? await prisma.$queryRawUnsafe(`SELECT id,uid,name,models_json,temperature,max_tokens,response_format,created_at,updated_at FROM playground_sessions WHERE user_id=? AND project_id=? ORDER BY updated_at DESC LIMIT 50`, userId, projectId)
      : await prisma.$queryRawUnsafe(`SELECT id,uid,name,models_json,temperature,max_tokens,response_format,created_at,updated_at FROM playground_sessions WHERE user_id=? ORDER BY updated_at DESC LIMIT 50`, userId);
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to list sessions" });
  }
});

router.get("/sessions/:uid", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const rows: any[] = await prisma.$queryRawUnsafe(`SELECT * FROM playground_sessions WHERE uid=? AND user_id=?`, req.params.uid, userId);
    if (!rows.length) { res.status(404).json({ error: "Not found" }); return; }
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to get session" });
  }
});

router.delete("/sessions/:uid", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    await prisma.$executeRawUnsafe(`DELETE FROM playground_sessions WHERE uid=? AND user_id=?`, req.params.uid, userId);
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete session" });
  }
});

export default router;
