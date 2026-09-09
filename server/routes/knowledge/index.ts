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
    const { project_id, category, q } = req.query as Record<string, string | undefined>;
    let sql = "SELECT * FROM knowledge_entries WHERE user_id=?";
    const params: any[] = [userId];
    if (project_id) { sql += " AND project_id=?"; params.push(project_id); }
    if (category) { sql += " AND category=?"; params.push(category); }
    if (q) { sql += " AND (title LIKE ? OR content LIKE ?)"; params.push("%" + q + "%", "%" + q + "%"); }
    sql += " ORDER BY is_pinned DESC, updated_at DESC LIMIT 200";
    const rows: any[] = await prisma.$queryRawUnsafe(sql, ...params);
    res.json(rows);
  } catch { res.status(500).json({ error: "Failed to list knowledge entries" }); }
});

router.post("/", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const { title, content, category, projectId, isPinned } = req.body;
  if (!title) { res.status(400).json({ error: "title is required" }); return; }
  try {
    const uid = randomUUID();
    await prisma.$executeRawUnsafe(
      "INSERT INTO knowledge_entries (uid, user_id, project_id, category, title, content, is_pinned) VALUES (?, ?, ?, ?, ?, ?, ?)",
      uid, userId, projectId ?? null, category || "general", title, content || "", isPinned ? 1 : 0,
    );
    const rows: any[] = await prisma.$queryRawUnsafe("SELECT * FROM knowledge_entries WHERE uid=?", uid);
    res.status(201).json(rows[0]);
  } catch (err: any) {
    logger.error({ err }, "Failed to create knowledge entry");
    res.status(500).json({ error: "Failed to create entry" });
  }
});

router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const { title, content, category, isPinned } = req.body;
  try {
    await prisma.$executeRawUnsafe(
      "UPDATE knowledge_entries SET title=?, content=?, category=?, is_pinned=?, updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?",
      title, content || "", category || "general", isPinned ? 1 : 0, req.params.id, userId,
    );
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Failed to update entry" }); }
});

router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    await prisma.$executeRawUnsafe("DELETE FROM knowledge_entries WHERE id=? AND user_id=?", req.params.id, userId);
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Failed to delete entry" }); }
});

router.patch("/:id/pin", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }
  const { isPinned } = req.body;
  try {
    await prisma.$executeRawUnsafe(
      "UPDATE knowledge_entries SET is_pinned=?, updated_at=CURRENT_TIMESTAMP WHERE id=? AND user_id=?",
      isPinned ? 1 : 0, req.params.id, userId,
    );
    res.json({ ok: true });
  } catch { res.status(500).json({ error: "Failed to update pin status" }); }
});

export default router;