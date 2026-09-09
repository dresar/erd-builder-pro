import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { logger } from "../../lib/logger.js";
import { supabase, useLocalAuth } from "../../lib/config.js";
import { getSession } from "../../lib/desktop-auth.js";
import { runPromptAgainstProvider } from "../playground/index.js";
import { randomUUID } from "crypto";

const router = Router();

async function resolveUserId(req: Request): Promise<string | undefined> {
  try {
    const token = req.cookies?.token || (req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.slice(7) : undefined);
    if (!token) return undefined;
    if (useLocalAuth()) return (await getSession(token))?.userId;
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser(token);
      return user?.id;
    }
  } catch { }
  return undefined;
}

const EVAL_SYSTEM = "You are an expert prompt engineer. Evaluate the prompt and return ONLY valid JSON with structure: { overall_score: 0-100, dimensions: { clarity, completeness, specificity, constraint_quality, output_control, reasoning_quality, consistency, ambiguity, safety, model_compatibility }, critical_issues: [], warnings: [], recommendations: [], summary: '' }. ambiguity is inverted (100=zero ambiguity). Return ONLY JSON.";

router.post("/run", async (req: Request, res: Response): Promise<void> => {
  const userId = await resolveUserId(req);
  const { promptText, systemPrompt, providerCode, model } = req.body;
  if (!promptText) { res.status(400).json({ error: "promptText is required" }); return; }
  try {
    const evalInput = "Evaluate this prompt:\n\n---\n" + promptText + "\n---" + (systemPrompt ? "\nSystem context:\n" + systemPrompt : "");
    const result = await runPromptAgainstProvider({
      systemPrompt: EVAL_SYSTEM, userPrompt: evalInput, userId, providerCode, model, responseFormat: "json",
    });
    let evalData: any = {};
    try { evalData = JSON.parse(result.output); } catch {
      evalData = {
        overall_score: 50,
        dimensions: { clarity:50, completeness:50, specificity:50, constraint_quality:50, output_control:50, reasoning_quality:50, consistency:50, ambiguity:50, safety:80, model_compatibility:50 },
        critical_issues: ["Could not parse evaluation response"], warnings: [], recommendations: [], summary: result.output.slice(0, 300),
      };
    }
    if (prisma && userId) {
      try {
        await prisma.$executeRawUnsafe(
          "INSERT INTO prompt_evaluations (uid, user_id, prompt_text, system_prompt, overall_score, eval_results_json, model_used) VALUES (?, ?, ?, ?, ?, ?, ?)",
          randomUUID(), userId, promptText, systemPrompt || null, evalData.overall_score || 0, JSON.stringify(evalData), result.model,
        );
      } catch (dbErr: any) { logger.warn({ err: dbErr?.message }, "Failed to persist eval"); }
    }
    res.json({ ...evalData, meta: { model: result.model, latencyMs: result.latencyMs, totalTokens: result.totalTokens, estimatedCostUsd: result.estimatedCostUsd } });
  } catch (err: any) {
    logger.error({ err }, "Eval run error");
    if (err.message?.includes("No AI provider") || err.message?.includes("unavailable")) {
      res.status(400).json({ error: err.message });
    } else { res.status(500).json({ error: "Failed to evaluate prompt" }); }
  }
});

router.post("/benchmark", async (req: Request, res: Response): Promise<void> => {
  const userId = await resolveUserId(req);
  const { promptText, systemPrompt, providerCodes } = req.body;
  if (!promptText) { res.status(400).json({ error: "promptText is required" }); return; }
  if (!Array.isArray(providerCodes) || providerCodes.length === 0) { res.status(400).json({ error: "providerCodes array required" }); return; }
  if (providerCodes.length > 6) { res.status(400).json({ error: "Maximum 6 providers" }); return; }
  const results: any[] = [];
  for (const providerCode of providerCodes) {
    try {
      const result = await runPromptAgainstProvider({ systemPrompt, userPrompt: promptText, userId, providerCode });
      results.push({ providerCode, model: result.model, status: "success", output: result.output,
        latencyMs: result.latencyMs, promptTokens: result.promptTokens, completionTokens: result.completionTokens,
        totalTokens: result.totalTokens, estimatedCostUsd: result.estimatedCostUsd, finishReason: result.finishReason });
    } catch (err: any) {
      results.push({ providerCode, model: null, status: "error", error: (err.message || "Error").slice(0, 200), latencyMs: 0, totalTokens: 0, estimatedCostUsd: 0 });
    }
  }
  res.json({ results });
});

router.get("/history", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const rows: any[] = await prisma.$queryRawUnsafe(
      "SELECT id, uid, overall_score, model_used, created_at, substr(prompt_text,1,100) as prompt_preview FROM prompt_evaluations WHERE user_id=? ORDER BY created_at DESC LIMIT 20",
      userId,
    );
    res.json(rows);
  } catch { res.status(500).json({ error: "Failed to list evaluations" }); }
});

export default router;