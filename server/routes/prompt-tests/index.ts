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

router.post("/", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const { name, promptText, systemPrompt, projectId, expectedBehavior, forbiddenBehavior, rulesJson, threshold } = req.body;
  if (!name || !promptText) { res.status(400).json({ error: "name and promptText are required" }); return; }
  try {
    const uid = randomUUID();
    await prisma.$executeRawUnsafe(
      "INSERT INTO prompt_tests (uid, user_id, project_id, name, prompt_text, system_prompt, expected_behavior, forbidden_behavior, rules_json, threshold) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      uid, userId, projectId ?? null, name, promptText, systemPrompt || null,
      expectedBehavior || "", forbiddenBehavior || "", JSON.stringify(rulesJson || []), threshold ?? 0.7,
    );
    const rows: any[] = await prisma.$queryRawUnsafe("SELECT * FROM prompt_tests WHERE uid=?", uid);
    res.status(201).json(rows[0]);
  } catch (err: any) {
    logger.error({ err }, "Failed to create prompt test");
    res.status(500).json({ error: "Failed to create test" });
  }
});

router.get("/", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const projectId = req.query.project_id as string | undefined;
    const rows: any[] = projectId
      ? await prisma.$queryRawUnsafe("SELECT * FROM prompt_tests WHERE user_id=? AND project_id=? ORDER BY created_at DESC", userId, projectId)
      : await prisma.$queryRawUnsafe("SELECT * FROM prompt_tests WHERE user_id=? ORDER BY created_at DESC LIMIT 100", userId);
    res.json(rows);
  } catch { res.status(500).json({ error: "Failed to list tests" }); }
});

router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const { name, promptText, systemPrompt, expectedBehavior, forbiddenBehavior, rulesJson, threshold } = req.body;
  try {
    await prisma.$executeRawUnsafe(
      "UPDATE prompt_tests SET name=?, prompt_text=?, system_prompt=?, expected_behavior=?, forbidden_behavior=?, rules_json=?, threshold=?, updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?",
      name, promptText, systemPrompt || null, expectedBehavior || "", forbiddenBehavior || "", JSON.stringify(rulesJson || []), threshold ?? 0.7, req.params.id, userId,
    );
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Failed to update test" }); }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    await prisma.$executeRawUnsafe("DELETE FROM prompt_tests WHERE id=? AND user_id=?", req.params.id, userId);
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Failed to delete test" }); }
});

router.post("/:id/run", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const tests: any[] = await prisma.$queryRawUnsafe("SELECT * FROM prompt_tests WHERE id=? AND user_id=?", req.params.id, userId);
    if (!tests.length) { res.status(404).json({ error: "Test not found" }); return; }
    const test = tests[0];

    const JUDGE_SYSTEM = "You are a strict test evaluator. Given an AI output and test criteria, return ONLY JSON: {\"passed\": true/false, \"score\": 0-1, \"reason\": \"...\"}. No extra text.";
    const judgePrompt = "Output to evaluate:\n---\n{{OUTPUT}}\n---\nExpected behavior: " + test.expected_behavior + "\nForbidden behavior: " + test.forbidden_behavior;

    let actualOutput = "";
    let model = "";
    try {
      const runResult = await runPromptAgainstProvider({
        systemPrompt: test.system_prompt || undefined,
        userPrompt: test.prompt_text,
        userId,
      });
      actualOutput = runResult.output;
      model = runResult.model;
    } catch (err: any) {
      res.status(502).json({ error: "Failed to run prompt: " + err.message });
      return;
    }

    let passed = false;
    let score = 0;
    let reason = "";
    try {
      const judgeResult = await runPromptAgainstProvider({
        systemPrompt: JUDGE_SYSTEM,
        userPrompt: judgePrompt.replace("{{OUTPUT}}", actualOutput.slice(0, 2000)),
        userId,
        responseFormat: "json",
      });
      const parsed = JSON.parse(judgeResult.output);
      passed = !!parsed.passed;
      score = typeof parsed.score === "number" ? parsed.score : (passed ? 1 : 0);
      reason = parsed.reason || "";
    } catch {
      passed = actualOutput.toLowerCase().includes(test.expected_behavior.toLowerCase().slice(0, 30));
      score = passed ? 0.7 : 0;
      reason = "Automated judge failed; fallback string match used.";
    }

    const lastRuns: any[] = await prisma.$queryRawUnsafe(
      "SELECT passed FROM prompt_test_runs WHERE test_id=? ORDER BY created_at DESC LIMIT 1",
      test.id,
    );
    const wasPassingBefore = lastRuns.length > 0 && lastRuns[0].passed === 1;
    const isRegression = wasPassingBefore && !passed;

    await prisma.$executeRawUnsafe(
      "INSERT INTO prompt_test_runs (test_id, prompt_text, model_used, passed, score, actual_output, details_json, is_regression) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      test.id, test.prompt_text, model, passed ? 1 : 0, score, actualOutput.slice(0, 4000),
      JSON.stringify({ reason, expected: test.expected_behavior, forbidden: test.forbidden_behavior }), isRegression ? 1 : 0,
    );
    await prisma.$executeRawUnsafe(
      "UPDATE prompt_tests SET last_status=?, last_run_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP WHERE id=?",
      isRegression ? "regression" : (passed ? "pass" : "fail"), test.id,
    );

    res.json({ passed, score, isRegression, actualOutput: actualOutput.slice(0, 1000), model, reason });
  } catch (err: any) {
    logger.error({ err }, "Prompt test run error");
    res.status(500).json({ error: "Test execution failed" });
  }
});

router.get("/:id/runs", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const rows: any[] = await prisma.$queryRawUnsafe(
      "SELECT r.* FROM prompt_test_runs r JOIN prompt_tests t ON r.test_id=t.id WHERE r.test_id=? AND t.user_id=? ORDER BY r.created_at DESC LIMIT 20",
      req.params.id, userId,
    );
    res.json(rows);
  } catch { res.status(500).json({ error: "Failed to get run history" }); }
});

export default router;