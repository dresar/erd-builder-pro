import { Router, Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { logger } from "../../lib/logger.js";
import { supabase, useLocalAuth } from "../../lib/config.js";
import { getSession } from "../../lib/desktop-auth.js";

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

router.get("/:projectSlug", async (req: Request, res: Response): Promise<void> => {
  if (!prisma) { res.status(503).json({ error: "Database not available" }); return; }
  const userId = await resolveUserId(req);
  if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const { projectSlug } = req.params;
    const projects: any[] = await prisma.$queryRawUnsafe(
      "SELECT id, name, description FROM projects WHERE (uid=? OR slug=? OR CAST(id AS TEXT)=?) LIMIT 1",
      projectSlug, projectSlug, projectSlug,
    );
    if (!projects.length) { res.status(404).json({ error: "Project not found" }); return; }
    const project = projects[0];

    const [noteCount, diagramCount, flowchartCount, drawingCount, promptVersionCount, knowledgeCount, promptTestCount] = await Promise.all([
      prisma.$queryRawUnsafe("SELECT COUNT(*) as c FROM notes WHERE project_id=?", project.id) as Promise<any[]>,
      prisma.$queryRawUnsafe("SELECT COUNT(*) as c FROM diagrams WHERE project_id=?", project.id) as Promise<any[]>,
      prisma.$queryRawUnsafe("SELECT COUNT(*) as c FROM flowcharts WHERE project_id=?", project.id) as Promise<any[]>,
      prisma.$queryRawUnsafe("SELECT COUNT(*) as c FROM drawings WHERE project_id=?", project.id) as Promise<any[]>,
      prisma.$queryRawUnsafe("SELECT COUNT(*) as c FROM prompt_versions WHERE project_id=?", project.id) as Promise<any[]>,
      prisma.$queryRawUnsafe("SELECT COUNT(*) as c FROM knowledge_entries WHERE project_id=?", project.id) as Promise<any[]>,
      prisma.$queryRawUnsafe("SELECT COUNT(*) as c FROM prompt_tests WHERE project_id=?", project.id) as Promise<any[]>,
    ]);

    const n = Number(noteCount[0]?.c || 0);
    const d = Number(diagramCount[0]?.c || 0);
    const f = Number(flowchartCount[0]?.c || 0);
    const dr = Number(drawingCount[0]?.c || 0);
    const pv = Number(promptVersionCount[0]?.c || 0);
    const kb = Number(knowledgeCount[0]?.c || 0);
    const pt = Number(promptTestCount[0]?.c || 0);

    const hasPrd = n > 0;
    const hasArch = f > 0;
    const hasDb = d > 0;
    const hasApi = n > 0;
    const hasWorkflow = f > 0;
    const hasSecurity = kb > 0;
    const hasTesting = pt > 0;
    const hasDoc = n > 0;

    const coverageScores = {
      requirements: hasPrd ? Math.min(100, n * 20) : 0,
      architecture: hasArch ? Math.min(100, f * 25) : 0,
      database: hasDb ? Math.min(100, d * 33) : 0,
      api: hasApi ? Math.min(100, n * 15) : 0,
      workflow: hasWorkflow ? Math.min(100, f * 20) : 0,
      security: hasSecurity ? Math.min(100, kb * 10) : 0,
      testing: hasTesting ? Math.min(100, pt * 15) : 0,
      documentation: hasDoc ? Math.min(100, n * 10) : 0,
    };

    const scores = Object.values(coverageScores);
    const overall = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    const criticalIssues: string[] = [];
    const warnings: string[] = [];
    const nextActions: string[] = [];

    if (!hasPrd) { criticalIssues.push("No requirements documentation found — create notes to document PRD"); }
    if (!hasDb) { criticalIssues.push("No database schema (ERD) found"); nextActions.push("Create an ERD diagram"); }
    if (!hasArch) { warnings.push("No architecture/workflow diagrams found"); nextActions.push("Add a flowchart for system overview"); }
    if (!hasTesting) { warnings.push("No prompt tests defined"); nextActions.push("Add prompt tests to validate AI outputs"); }
    if (kb === 0) { warnings.push("Knowledge Base is empty — no reusable context defined"); nextActions.push("Add business rules to Knowledge Base"); }
    if (pv === 0) { nextActions.push("Save prompt versions to track iteration history"); }
    if (overall >= 80) nextActions.push("Project health is strong — consider running a full prompt evaluation");

    res.json({
      project: { id: project.id, name: project.name, description: project.description },
      counts: { notes: n, diagrams: d, flowcharts: f, drawings: dr, promptVersions: pv, knowledgeEntries: kb, promptTests: pt },
      coverageScores,
      overallScore: overall,
      criticalIssues,
      warnings,
      nextActions,
    });
  } catch (err: any) {
    logger.error({ err }, "Project health error");
    res.status(500).json({ error: "Failed to compute project health" });
  }
});

export default router;