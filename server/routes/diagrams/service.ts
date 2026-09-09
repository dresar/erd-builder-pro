import { prisma } from "../../lib/prisma.js";
import { randomUUID } from "crypto";

function uidWhere(uid: string, userId: string) {
  const id = Number(uid);
  return Number.isFinite(id)
    ? { OR: [{ uid }, { id }], userId }
    : { uid, userId };
}

function whereClause(userId: string, query: {
  projectId?: string | null;
  q?: string;
  isPublic?: boolean | null;
  sourceType?: string;
}) {
  const where: any = { isDeleted: false, userId };

  if (query.isPublic !== null && query.isPublic !== undefined) {
    where.isPublic = query.isPublic;
  }
  if (query.sourceType) {
    where.sourceType = query.sourceType;
  } else {
    where.OR = [{ sourceType: null }, { sourceType: { not: "production_db" } }];
  }
  if (query.q?.trim()) {
    where.name = { contains: query.q.trim(), mode: "insensitive" };
  }
  if (query.projectId === "null") {
    where.projectId = null;
  } else if (query.projectId && query.projectId !== "all" && !isNaN(Number(query.projectId))) {
    where.projectId = Number(query.projectId);
  }
  return where;
}

async function addActiveProjectFilter(where: any, userId: string) {
  const active = await prisma?.project.findMany({
    where: { userId, isDeleted: false },
    select: { id: true },
  });
  const activeIds = active?.map(p => p.id) || [];
  if (activeIds.length === 0) {
    where.id = -1;
    return;
  }
  const activeSet = new Set(activeIds.map(id => String(id)));
  if (where.projectId !== undefined) {
    if (where.projectId === null || !activeSet.has(String(where.projectId))) {
      where.id = -1;
    }
  } else {
    where.projectId = { in: activeIds };
  }
}

export function uidWhereClause(uid: string, userId: string) {
  return uidWhere(uid, userId);
}

const LIST_SELECT = {
  id: true, uid: true, name: true, projectId: true,
  isPublic: true, shareToken: true, expiryDate: true,
  createdAt: true, updatedAt: true, isDeleted: true, userId: true,
  sourceType: true, sourceConnectionId: true, dbmlSource: true,
  project: { select: { name: true, uid: true, id: true } },
} as const;

const TAB_SELECT = {
  id: true, uid: true, name: true, projectId: true,
  createdAt: true, updatedAt: true, isDeleted: true,
  sourceType: true,
} as const;

export {
  dedupe,
  insertEntitiesBulk,
  insertColumnsBulk,
  insertRelationshipsBulk,
  upsertEntities,
  upsertColumns,
  upsertRelationships,
  upsertTableConstraints,
  upsertTableIndexes,
} from "./save-helpers.js";

export async function listDiagrams(
  userId: string,
  params: { limit: number; offset: number; projectId?: string; q?: string; isPublic?: boolean | null; sourceType?: string; summary?: boolean }
) {
  const where = whereClause(userId, params);
  await addActiveProjectFilter(where, userId);

  const [data, total] = await Promise.all([
    prisma?.diagram.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: params.offset,
      take: params.limit,
      select: params.summary ? TAB_SELECT : LIST_SELECT,
    }) || Promise.resolve([]),
    prisma?.diagram.count({ where }) || Promise.resolve(0),
  ]);
  return { data: data || [], total: total || 0 };
}

export async function createDiagram(data: {
  name: string; projectId?: number | null; userId: string; uid?: string;
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
  return prisma.diagram.create({
    data: {
      name: data.name,
      projectId: targetProjectId,
      uid: data.uid || undefined,
      userId: data.userId,
    },
  });
}

export async function getDiagram(uid: string, userId: string) {
  const diagram = await prisma?.diagram.findFirst({
    where: uidWhere(uid, userId),
  });
  return diagram || null;
}

export async function updateDiagram(
  uid: string, userId: string,
  data: { name?: string; projectId?: number | null }
) {
  if (!prisma) throw new Error("Database connection not available");
  const existing = await prisma.diagram.findFirst({
    where: uidWhere(uid, userId),
  });
  if (!existing) return null;

  const updatePayload: any = {};
  if (data.name !== undefined) updatePayload.name = data.name;
  if (data.projectId !== undefined) updatePayload.projectId = data.projectId;

  await prisma.diagram.update({ where: { id: Number(existing.id) }, data: updatePayload });
  return { success: true };
}

export async function softDeleteDiagram(uid: string, userId: string) {
  const existing = await prisma?.diagram.findFirst({
    where: uidWhere(uid, userId),
  });
  if (!existing) return null;

  await prisma?.diagram.update({
    where: { id: Number(existing.id) },
    data: { isDeleted: true, deletedAt: new Date() },
  });
  return { success: true };
}

export async function restoreDiagram(uid: string, userId: string) {
  const existing = await prisma?.diagram.findFirst({
    where: uidWhere(uid, userId),
  });
  if (!existing) return null;

  await prisma?.diagram.update({
    where: { id: Number(existing.id) },
    data: { isDeleted: false, deletedAt: null },
  });
  return { success: true };
}

export async function permanentDeleteDiagram(diagramId: number) {
  if (!prisma) return;
  await prisma.$transaction(async (tx) => {
    await tx.relationship.deleteMany({ where: { diagramId } });
    const entities = await tx.entity.findMany({
      where: { diagramId },
      select: { id: true },
    });
    const entityIds = entities.map(e => e.id);
    if (entityIds.length > 0) {
      await tx.column.deleteMany({ where: { entityId: { in: entityIds } } });
    }
    await tx.entity.deleteMany({ where: { diagramId } });
    await tx.diagram.deleteMany({ where: { id: diagramId } });
  });
}

// ── Public / Share ──

export async function getPublicDiagram(uid: string) {
  return prisma?.diagram.findUnique({
    where: { uid },
    include: { project: { select: { name: true, isDeleted: true } } },
  });
}

export async function updateDiagramShare(
  uid: string, userId: string,
  data: { isPublic: boolean; shareToken?: string | null; expiryDate?: Date | null }
) {
  const current = await prisma?.diagram.findFirst({
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

  return prisma?.diagram.update({ where: { id: Number(current.id) }, data: updateData });
}
