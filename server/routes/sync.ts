import { Router } from "express";
import { authenticate } from "../lib/middleware.js";
import { prisma } from "../lib/prisma.js";
import rateLimit from "express-rate-limit";

const router = Router();

const syncLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many sync requests" },
});

const ALLOWED_ENTITIES = new Set(["projects", "diagrams", "notes", "flowcharts", "drawings"]);

router.get("/sync", syncLimiter, authenticate, async (req, res) => {
  const user = (req as any).user;
  const userId = user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  const sinceRaw = req.query.since as string | undefined;
  const entitiesRaw = req.query.entities as string | undefined;

  const sinceDate = sinceRaw ? new Date(sinceRaw) : null;
  const isValidSince = sinceDate && !isNaN(sinceDate.getTime());

  const requestedEntities = entitiesRaw
    ? entitiesRaw.split(",").map(e => e.trim()).filter(e => ALLOWED_ENTITIES.has(e))
    : Array.from(ALLOWED_ENTITIES);

  const since = isValidSince ? sinceDate : new Date(0);
  const gt = { gt: since };

  try {
    const [projects, diagrams, notes, flowcharts, drawings] = await Promise.allSettled([
      requestedEntities.includes("projects") && prisma
        ? prisma.project.findMany({
            where: isValidSince ? { userId, createdAt: gt } : { userId },
            select: {
              id: true, uid: true, name: true,
              isDeleted: true, createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          })
        : Promise.resolve([]),

      requestedEntities.includes("diagrams") && prisma
        ? prisma.diagram.findMany({
            where: { userId, updatedAt: gt },
            select: {
              id: true, uid: true, name: true, projectId: true,
              isDeleted: true, isPublic: true, sourceType: true,
              createdAt: true, updatedAt: true,
            },
            orderBy: { updatedAt: "desc" },
          })
        : Promise.resolve([]),

      requestedEntities.includes("notes") && prisma
        ? prisma.note.findMany({
            where: { userId, updatedAt: gt },
            select: {
              id: true, uid: true, title: true, projectId: true,
              isDeleted: true, isPublic: true, createdAt: true, updatedAt: true,
            },
            orderBy: { updatedAt: "desc" },
          })
        : Promise.resolve([]),

      requestedEntities.includes("flowcharts") && prisma
        ? prisma.flowchart.findMany({
            where: { userId, updatedAt: gt },
            select: {
              id: true, uid: true, title: true, projectId: true,
              isDeleted: true, isPublic: true, createdAt: true, updatedAt: true,
            },
            orderBy: { updatedAt: "desc" },
          })
        : Promise.resolve([]),

      requestedEntities.includes("drawings") && prisma
        ? prisma.drawing.findMany({
            where: { userId, updatedAt: gt },
            select: {
              id: true, uid: true, title: true, projectId: true,
              isDeleted: true, isPublic: true, createdAt: true, updatedAt: true,
            },
            orderBy: { updatedAt: "desc" },
          })
        : Promise.resolve([]),
    ]);

    const extract = (r: PromiseSettledResult<any>) =>
      r.status === "fulfilled" ? (r.value ?? []) : [];

    res.json({
      projects: extract(projects),
      diagrams: extract(diagrams),
      notes: extract(notes),
      flowcharts: extract(flowcharts),
      drawings: extract(drawings),
      synced_at: new Date().toISOString(),
    });
  } catch (err: any) {
    res.status(500).json({ error: "Sync failed" });
  }
});

export default router;
