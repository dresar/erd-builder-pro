import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { logger } from "../../lib/logger.js";
import { supabase, useLocalAuth } from "../../lib/config.js";
import { getSession } from "../../lib/desktop-auth.js";
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

router.get("/", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const { project_id, status } = req.query as Record<string, string | undefined>;
    let sql = "SELECT id,uid,name,version_label,status,eval_result_json,security_result_json,created_by,created_at,updated_at,substr(prompt_text,1,200) as prompt_preview FROM prompt_versions WHERE user_id=?";
    const params: any[] = [userId];
    if (project_id) { sql += " AND project_id=?"; params.push(project_id); }
    if (status) { sql += " AND status=?"; params.push(status); }
    sql += " ORDER BY created_at DESC LIMIT 100";
    const rows: any[] = await prisma.$queryRawUnsafe(sql, ...params);
    res.json(rows);
  } catch { res.status(500).json({ error: "Failed to list versions" }); }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const { name, promptText, systemPrompt, projectId, variablesJson, modelsJson, versionLabel, status } = req.body;
  if (!promptText) { res.status(400).json({ error: "promptText is required" }); return; }
  try {
    const uid = randomUUID();
    await prisma.$executeRawUnsafe(
      "INSERT INTO prompt_versions (uid, user_id, project_id, name, prompt_text, system_prompt, variables_json, models_json, version_label, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      uid, userId, projectId ?? null, name || "Untitled Prompt", promptText, systemPrompt || null,
      JSON.stringify(variablesJson || []), JSON.stringify(modelsJson || []),
      versionLabel || "draft", status || "draft", userId,
    );
    const rows: any[] = await prisma.$queryRawUnsafe("SELECT * FROM prompt_versions WHERE uid=?", uid);
    res.status(201).json(rows[0]);
  } catch (err: any) {
    logger.error({ err }, "Failed to create prompt version");
    res.status(500).json({ error: "Failed to create version" });
  }
});

router.get("/:uid", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const rows: any[] = await prisma.$queryRawUnsafe("SELECT * FROM prompt_versions WHERE uid=? AND user_id=?", req.params.uid, userId);
    if (!rows.length) { res.status(404).json({ error: "Not found" }); return; }
    res.json(rows[0]);
  } catch { res.status(500).json({ error: "Failed to get version" }); }
});

router.patch("/:uid/status", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const { status } = req.body;
  const allowed = ["draft", "stable", "archived"];
  if (!allowed.includes(status)) { res.status(400).json({ error: "Invalid status" }); return; }
  try {
    await prisma.$executeRawUnsafe(
      "UPDATE prompt_versions SET status=?, updated_at=CURRENT_TIMESTAMP WHERE uid=? AND user_id=?",
      status, req.params.uid, userId,
    );
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Failed to update status" }); }
});

router.delete("/:uid", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    await prisma.$executeRawUnsafe("DELETE FROM prompt_versions WHERE uid=? AND user_id=?", req.params.uid, userId);
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Failed to delete version" }); }
});

router.get("/compare/:uid1/:uid2", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const [v1s, v2s]: [any[], any[]] = await Promise.all([
      prisma.$queryRawUnsafe("SELECT * FROM prompt_versions WHERE uid=? AND user_id=?", req.params.uid1, userId) as Promise<any[]>,
      prisma.$queryRawUnsafe("SELECT * FROM prompt_versions WHERE uid=? AND user_id=?", req.params.uid2, userId) as Promise<any[]>,
    ]);
    if (!v1s.length || !v2s.length) { res.status(404).json({ error: "One or both versions not found" }); return; }
    const v1 = v1s[0];
    const v2 = v2s[0];
    const a = (v1.prompt_text || "").split("\n");
    const b = (v2.prompt_text || "").split("\n");
    const diff: Array<{ type: "added" | "removed" | "unchanged"; line: string }> = [];
    const setB = new Set(b);
    const setA = new Set(a);
    const allLines = [...new Set([...a, ...b])];
    for (const line of allLines) {
      if (setA.has(line) && setB.has(line)) diff.push({ type: "unchanged", line });
      else if (!setA.has(line)) diff.push({ type: "added", line });
      else diff.push({ type: "removed", line });
    }
    res.json({ v1: { uid: v1.uid, name: v1.name, version_label: v1.version_label, created_at: v1.created_at }, v2: { uid: v2.uid, name: v2.name, version_label: v2.version_label, created_at: v2.created_at }, diff, linesAdded: diff.filter(d => d.type === "added").length, linesRemoved: diff.filter(d => d.type === "removed").length });
  } catch { res.status(500).json({ error: "Failed to compare versions" }); }
});

export default router;