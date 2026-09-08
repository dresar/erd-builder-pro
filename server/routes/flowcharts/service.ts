import { prisma } from "../../lib/prisma.js";
import { captureEntityRevisionSafely } from "../../lib/entity-history.js";
import { isDesktopMode, isLocalPostgres } from "../../lib/config.js";
import { randomUUID } from "crypto";

function uidWhere(uid: string, userId: string) {
  const id = Number(uid);
  return Number.isFinite(id)
    ? { OR: [{ uid }, { id }], userId }
    : { uid, userId };
}

function conditions(userId: string, query: {
  projectId?: string | null;
  q?: string;
  isPublic?: boolean | null;
}) {
  const conditions: any[] = [
    { isDeleted: false },
    { userId },
  ];

  if (query.isPublic !== null && query.isPublic !== undefined) {
    conditions.push({ isPublic: query.isPublic });
  }
  if (query.q?.trim()) {
    conditions.push({ title: { contains: query.q.trim(), mode: "insensitive" } });
  }
  if (query.projectId === "null") {
    conditions.push({ id: -1 });
  } else if (query.projectId && query.projectId !== "all" && !isNaN(Number(query.projectId))) {
    conditions.push({ projectId: Number(query.projectId) });
  }
  return conditions;
}

async function addActiveProjectFilter(conds: any[], userId: string, queryProjectId?: string | null) {
  const active = await prisma?.project.findMany({
    where: { userId, isDeleted: false },
    select: { id: true },
  });
  const activeIds = active?.map(p => p.id) || [];
  if (activeIds.length === 0) {
    conds.push({ id: -1 });
    return;
  }
  const activeSet = new Set(activeIds.map(id => String(id)));
  if (queryProjectId === "null") {
    conds.push({ id: -1 });
  } else if (queryProjectId && queryProjectId !== "all" && !isNaN(Number(queryProjectId))) {
    if (!activeSet.has(String(queryProjectId))) {
      conds.push({ id: -1 });
    }
  } else {
    conds.push({ projectId: { in: activeIds } });
  }
}

const LIST_SELECT = {
  id: true, uid: true, title: true, projectId: true,
  isPublic: true, shareToken: true, expiryDate: true,
  createdAt: true, updatedAt: true, isDeleted: true, userId: true,
  project: { select: { name: true, uid: true, id: true } },
} as const;

export async function listFlowcharts(
  userId: string,
  params: { limit: number; offset: number; projectId?: string; q?: string; isPublic?: boolean | null }
) {
  const conds = conditions(userId, params);
  await addActiveProjectFilter(conds, userId, params.projectId);
  const where = { AND: conds };

  const [data, total] = await Promise.all([
    prisma?.flowchart.findMany({
      where,
      select: LIST_SELECT,
      orderBy: { createdAt: "desc" },
      skip: params.offset,
      take: params.limit,
    }),
    prisma?.flowchart.count({ where }),
  ]);
  return { data: data || [], total: total || 0 };
}

export async function createFlowchart(data: {
  title: string; fcData?: string; projectId?: number | null; userId: string; uid?: string;
}) {
  if (!prisma) throw new Error("Database connection not available");
  let targetProjectId = data.projectId ?? null;
  if (!targetProjectId) {
    const activeProject = await prisma.project.findFirst({
      where: { userId: data.userId, isDeleted: false },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    });
    if (activeProject) {
      targetProjectId = activeProject.id as any;
    } else {
      const newProj = await prisma.project.create({
        data: { name: "Ruang Kerja Utama", userId: data.userId, uid: randomUUID() },
      });
      targetProjectId = newProj.id as any;
    }
  }
  return prisma.flowchart.create({
    data: {
      title: data.title,
      data: data.fcData || '{"nodes":[], "edges":[]}',
      projectId: targetProjectId,
      userId: data.userId,
      ...(data.uid ? { uid: data.uid } : {}),
    },
  });
}

export async function getFlowchart(uid: string, userId: string) {
  const flowchart = await prisma?.flowchart.findFirst({
    where: uidWhere(uid, userId),
  });
  return flowchart || null;
}

export async function updateFlowchart(
  uid: string, userId: string,
  data: { title?: string; fcData?: string; projectId?: number | null }
) {
  if (!prisma) throw new Error("Database connection not available");
  const existing = await prisma.flowchart.findFirst({
    where: uidWhere(uid, userId),
  });
  if (!existing) return null;

  await captureEntityRevisionSafely({
    entityType: "flowcharts",
    entityId: existing.id,
    userId,
    snapshot: { title: existing.title, data: existing.data ?? "", project_id: existing.projectId ?? null },
  });

  const updatePayload: any = { updatedAt: new Date() };
  if (isDesktopMode() || isLocalPostgres()) updatePayload.version = (existing.version ?? 0) + 1;
  if (data.title !== undefined) updatePayload.title = data.title;
  if (data.fcData !== undefined) updatePayload.data = data.fcData;
  if (data.projectId !== undefined) updatePayload.projectId = data.projectId;

  const updated = await prisma.flowchart.update({ where: { id: existing.id }, data: updatePayload, select: { version: true, updatedAt: true } });
  return { success: true, version: updated.version, updatedAt: updated.updatedAt };
}

export async function softDeleteFlowchart(uid: string, userId: string) {
  const existing = await prisma?.flowchart.findFirst({
    where: uidWhere(uid, userId),
  });
  if (!existing) return null;

  await prisma?.flowchart.update({
    where: { id: existing.id },
    data: { isDeleted: true, deletedAt: new Date() },
  });
  return { success: true };
}

export async function restoreFlowchart(uid: string, userId: string) {
  const existing = await prisma?.flowchart.findFirst({
    where: uidWhere(uid, userId),
  });
  if (!existing) return null;

  await prisma?.flowchart.update({
    where: { id: existing.id },
    data: { isDeleted: false, deletedAt: null },
  });
  return { success: true };
}

export async function permanentDeleteFlowchart(uid: string, userId: string) {
  const existing = await prisma?.flowchart.findFirst({
    where: uidWhere(uid, userId),
  });
  if (!existing) return null;

  await prisma?.flowchart.delete({ where: { id: existing.id } });
  return { success: true };
}

// ── Public / Share ──

export async function getPublicFlowchart(uid: string) {
  return prisma?.flowchart.findFirst({
    where: { uid },
    include: { project: { select: { name: true, isDeleted: true } } },
  });
}

export async function updateFlowchartShare(
  uid: string, userId: string,
  data: { isPublic: boolean; shareToken?: string | null; expiryDate?: Date | null }
) {
  const current = await prisma?.flowchart.findFirst({
    where: uidWhere(uid, userId),
  });
  if (!current) return null;

  const updateData: any = {
    isPublic: data.isPublic,
    shareToken: data.isPublic ? data.shareToken ?? null : null,
    expiryDate: data.isPublic ? data.expiryDate ?? null : null,
  };

  if (data.isPublic) {
    if (!current.publishedAt) updateData.publishedAt = new Date();
  } else {
    updateData.publishedAt = null;
  }

  return prisma?.flowchart.update({ where: { id: current.id }, data: updateData });
}
