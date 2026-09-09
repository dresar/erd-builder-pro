import { prisma } from "../../lib/prisma.js";
import { s3Client, R2_BUCKET_NAME } from "../../lib/config.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { logger } from "../../lib/logger.js";
import { randomUUID } from "crypto";
import { getStorageClientForUser } from "../../lib/storage.js";
import { isDesktopMode } from "../../lib/config.js";
import { toProjectId } from "../../lib/utils.js";

export async function listProjects(
  userId: string,
  params: { limit: number; offset: number; q?: string }
) {
  const { limit, offset, q } = params;
  const searchTerm = q?.trim();

  let whereClause: Record<string, any> = { userId, isDeleted: false };

  if (searchTerm) {
    const containsFilter = (value: string) => ({ contains: value } as any);

    const [dMatches, nMatches, drMatches, fMatches, cMatches] = await Promise.all([
      prisma?.diagram.findMany({
        where: { name: containsFilter(searchTerm), userId, projectId: { not: null }, isDeleted: false, OR: [{ sourceType: null }, { sourceType: { not: "production_db" } }] },
        select: { projectId: true },
      }),
      prisma?.note.findMany({
        where: { title: containsFilter(searchTerm), userId, projectId: { not: null }, isDeleted: false },
        select: { projectId: true },
      }),
      prisma?.drawing.findMany({
        where: { title: containsFilter(searchTerm), userId, projectId: { not: null }, isDeleted: false },
        select: { projectId: true },
      }),
      prisma?.flowchart.findMany({
        where: { title: containsFilter(searchTerm), userId, projectId: { not: null }, isDeleted: false },
        select: { projectId: true },
      }),
      isDesktopMode() ? (prisma as any)?.dbClient.findMany({
        where: { name: containsFilter(searchTerm), userId, projectId: { not: null }, isDeleted: false },
        select: { projectId: true },
      }) : Promise.resolve([]),
    ]);

    const matchingProjectIds = new Set<number>([
      ...(dMatches || []).map(m => Number(m.projectId)).filter(n => !isNaN(n)),
      ...(nMatches || []).map(m => Number(m.projectId)).filter(n => !isNaN(n)),
      ...(drMatches || []).map(m => Number(m.projectId)).filter(n => !isNaN(n)),
      ...(fMatches || []).map(m => Number(m.projectId)).filter(n => !isNaN(n)),
      ...(cMatches || []).map((m: any) => Number(m.projectId)).filter((n: number) => !isNaN(n)),
    ]);

    if (matchingProjectIds.size > 0) {
      whereClause.OR = [
        { name: { contains: searchTerm, mode: "insensitive" } },
        { id: { in: Array.from(matchingProjectIds) } },
      ];
    } else {
      whereClause.name = { contains: searchTerm, mode: "insensitive" };
    }
  }

  const [projects, total] = await Promise.all([
    prisma?.project.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            diagrams: {
              where: {
                isDeleted: false,
                OR: [{ sourceType: null }, { sourceType: { not: "production_db" } }],
              },
            },
            flowcharts: { where: { isDeleted: false } },
            notes: { where: { isDeleted: false } },
            drawings: { where: { isDeleted: false } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    }) || Promise.resolve([]),
    prisma?.project.count({ where: whereClause }) || Promise.resolve(0),
  ]);

  const projectsWithFiles = (projects || []).map((project: any) => {
    const diagCount = project._count?.diagrams ?? 0;
    const fcCount = project._count?.flowcharts ?? 0;
    const notesCount = project._count?.notes ?? 0;
    const dwCount = project._count?.drawings ?? 0;
    return {
      ...project,
      diagrams: [], notes: [], drawings: [], flowcharts: [],
      diagrams_count: diagCount,
      flowcharts_count: fcCount,
      notes_count: notesCount,
      drawings_count: dwCount,
      files_count: diagCount + fcCount + notesCount + dwCount,
    };
  });

  return {
    data: projectsWithFiles,
    uncategorized: {
      diagrams: [],
      notes: [],
      drawings: [],
      flowcharts: [],
    },
    total: total || 0,
  };
}

export async function createProject(name: string, userId: string, uid?: string) {
  const project = await prisma?.project.create({
    data: { name, userId, uid: uid || randomUUID() },
  });
  return project || null;
}

export async function resolveProject(rawId: string | number, userId: string) {
  const strId = String(rawId);
  const isDigits = /^\d+$/.test(strId);
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(strId);
  const numericId = isDigits ? toProjectId(strId) : null;

  const orConditions: any[] = [];
  if (isUuid) orConditions.push({ uid: strId });
  if (numericId !== null) orConditions.push({ id: numericId as any });
  if (orConditions.length === 0) return null;

  const project = await prisma?.project.findFirst({
    where: {
      userId,
      OR: orConditions,
    },
    select: { id: true, uid: true, name: true },
  });
  return project || null;
}

export async function updateProject(projectIdOrUid: number | string, userId: string, name: string) {
  const project = await resolveProject(projectIdOrUid, userId);
  if (!project) return { success: false, error: "Project not found" };

  await prisma?.project.updateMany({
    where: { id: project.id, userId },
    data: { name },
  });
  return { success: true };
}

export async function softDeleteProject(projectIdOrUid: number | string, userId: string) {
  const project = await resolveProject(projectIdOrUid, userId);
  if (!project) return { success: false, error: "Project not found" };

  const now = new Date();
  const targetId = project.id;

  await prisma?.project.updateMany({
    where: { id: targetId, userId },
    data: { isDeleted: true, deletedAt: now },
  });

  await Promise.all([
    prisma?.diagram.updateMany({ where: { projectId: targetId }, data: { isDeleted: true, deletedAt: now } }),
    prisma?.note.updateMany({ where: { projectId: targetId }, data: { isDeleted: true, deletedAt: now } }),
    prisma?.drawing.updateMany({ where: { projectId: targetId }, data: { isDeleted: true, deletedAt: now } }),
    prisma?.flowchart.updateMany({ where: { projectId: targetId }, data: { isDeleted: true, deletedAt: now } }),
    isDesktopMode() && (prisma as any)?.dbClient
      ? (prisma as any).dbClient.updateMany({ where: { projectId: targetId }, data: { isDeleted: true, deletedAt: now } })
      : Promise.resolve(),
  ]);

  const remainingActive = await prisma?.project.count({
    where: { userId, isDeleted: false },
  });

  if (remainingActive === 0) {
    await Promise.all([
      prisma?.diagram.updateMany({ where: { userId, isDeleted: false }, data: { isDeleted: true, deletedAt: now } }),
      prisma?.note.updateMany({ where: { userId, isDeleted: false }, data: { isDeleted: true, deletedAt: now } }),
      prisma?.drawing.updateMany({ where: { userId, isDeleted: false }, data: { isDeleted: true, deletedAt: now } }),
      prisma?.flowchart.updateMany({ where: { userId, isDeleted: false }, data: { isDeleted: true, deletedAt: now } }),
      isDesktopMode() && (prisma as any)?.dbClient
        ? (prisma as any).dbClient.updateMany({ where: { userId, isDeleted: false }, data: { isDeleted: true, deletedAt: now } })
        : Promise.resolve(),
    ]);
  }

  return { success: true };
}

export async function restoreProject(projectIdOrUid: number | string, userId: string) {
  const project = await resolveProject(projectIdOrUid, userId);
  if (!project) return { success: false, error: "Project not found" };

  const targetId = project.id;

  await prisma?.project.updateMany({
    where: { id: targetId, userId },
    data: { isDeleted: false, deletedAt: null },
  });

  await Promise.all([
    prisma?.diagram.updateMany({ where: { projectId: targetId }, data: { isDeleted: false, deletedAt: null } }),
    prisma?.note.updateMany({ where: { projectId: targetId }, data: { isDeleted: false, deletedAt: null } }),
    prisma?.drawing.updateMany({ where: { projectId: targetId }, data: { isDeleted: false, deletedAt: null } }),
    prisma?.flowchart.updateMany({ where: { projectId: targetId }, data: { isDeleted: false, deletedAt: null } }),
    isDesktopMode() && (prisma as any)?.dbClient
      ? (prisma as any).dbClient.updateMany({ where: { projectId: targetId }, data: { isDeleted: false, deletedAt: null } })
      : Promise.resolve(),
  ]);

  return { success: true };
}

export async function permanentDeleteProject(projectIdOrUid: number | string, userId: string) {
  const project = await resolveProject(projectIdOrUid, userId);
  if (!project) return { success: false, error: "Project not found" };

  const projectId = project.id;

  if (isDesktopMode() && (prisma as any)?.dbClient) {
    await (prisma as any).dbClient.deleteMany({ where: { projectId } });
  }
  const diagramIds = (await prisma?.diagram.findMany({ where: { projectId }, select: { id: true } }))?.map(d => d.id) || [];
  if (diagramIds.length > 0) {
    await prisma?.relationship.deleteMany({ where: { diagramId: { in: diagramIds } } });
    const entityIds = (await prisma?.entity.findMany({ where: { diagramId: { in: diagramIds } }, select: { id: true } }))?.map(e => e.id) || [];
    if (entityIds.length > 0) {
      await prisma?.column.deleteMany({ where: { entityId: { in: entityIds } } });
    }
    await prisma?.entity.deleteMany({ where: { diagramId: { in: diagramIds } } });
    await prisma?.diagram.deleteMany({ where: { id: { in: diagramIds } } });
  }

  const notes = await prisma?.note.findMany({
    where: { projectId },
    select: { content: true },
  });
  const userStorage = await getStorageClientForUser(userId, prisma);
  const cleanupClient = userStorage?.client ?? s3Client;
  const cleanupBucket = userStorage?.bucketName ?? R2_BUCKET_NAME;
  if (notes && notes.length > 0 && cleanupClient && cleanupBucket) {
    for (const note of notes) {
      if (note.content) {
        const regex = /<img[^>]+src="([^">]+)"/g;
        let match;
        while ((match = regex.exec(note.content)) !== null) {
          const url = match[1];
          if (url.includes("erd-builder-pro/")) {
            const key = url.substring(url.indexOf("erd-builder-pro/"));
            try {
              await cleanupClient.send(new DeleteObjectCommand({ Bucket: cleanupBucket, Key: key }));
            } catch (err) {
              logger.error({ err }, "Failed to delete image from storage during project deletion:");
            }
          }
        }
      }
    }
  }

  await prisma?.note.deleteMany({ where: { projectId } });
  await prisma?.drawing.deleteMany({ where: { projectId } });
  await prisma?.flowchart.deleteMany({ where: { projectId } });

  const sessions = await prisma?.aiChatSession.findMany({
    where: { projectId },
    select: { id: true },
  });
  const sessionIds = sessions?.map(s => s.id) || [];
  if (sessionIds.length > 0) {
    await prisma?.aiChatMessage.deleteMany({ where: { sessionId: { in: sessionIds } } });
    await prisma?.aiChatSession.deleteMany({ where: { id: { in: sessionIds } } });
  }

  await prisma?.project.deleteMany({ where: { id: projectId, userId } });

  const remainingActive = await prisma?.project.count({
    where: { userId, isDeleted: false },
  });

  if (remainingActive === 0) {
    await Promise.all([
      prisma?.note.deleteMany({ where: { userId, projectId: null } }),
      prisma?.drawing.deleteMany({ where: { userId, projectId: null } }),
      prisma?.flowchart.deleteMany({ where: { userId, projectId: null } }),
      prisma?.diagram.deleteMany({ where: { userId, projectId: null } }),
    ]);
  }

  return { success: true };
}

export async function getProjectSiblings(projectIdOrUid: number | string, userId: string) {
  if (!prisma) throw new Error("Database connection not available");
  const project = await resolveProject(projectIdOrUid, userId);
  if (!project) return { project: null, notes: [], diagrams: [], flowcharts: [] };
  const projectId = project.id as any;

  const [notes, diagrams, flowcharts] = await Promise.all([
    prisma.note.findMany({
      where: { projectId, userId, isDeleted: false },
      select: { uid: true, title: true, content: true, updatedAt: true },
    }),
    prisma.diagram.findMany({
      where: { projectId, userId, isDeleted: false, OR: [{ sourceType: null }, { sourceType: { not: "production_db" } }] },
      select: { id: true, uid: true, name: true, sourceType: true, updatedAt: true, dbmlSource: true },
    }),
    prisma.flowchart.findMany({
      where: { projectId, userId, isDeleted: false },
      select: { uid: true, title: true, data: true, updatedAt: true },
    }),
  ]);

  const diagramIds = diagrams.map(d => d.id);
  const entities = diagramIds.length > 0
    ? await prisma.entity.findMany({ where: { diagramId: { in: diagramIds } } })
    : [];
  const entityIds = entities.map(e => e.id);
  const columns = entityIds.length > 0
    ? await prisma.column.findMany({ where: { entityId: { in: entityIds } } })
    : [];

  const colsByEntity: Record<string, typeof columns> = {};
  for (const col of columns) {
    if (!colsByEntity[col.entityId!]) colsByEntity[col.entityId!] = [];
    colsByEntity[col.entityId!].push(col);
  }

  const diagramsWithEntities = diagrams.map(d => ({
    ...d,
    dbml_source: (d as any).dbmlSource || (d as any).dbml_source || "",
    entities: entities
      .filter(e => e.diagramId === d.id)
      .map(e => ({
        ...e,
        columns: colsByEntity[e.id] || [],
      })),
  }));

  return { project, notes, diagrams: diagramsWithEntities, flowcharts };
}

export async function getProjectSummary(projectIdOrUid: number | string, userId: string, includeDbClient = true) {
  if (!prisma) throw new Error("Database connection not available");
  const project = await resolveProject(projectIdOrUid, userId);
  if (!project) return { notes: 0, diagrams: 0, flowcharts: 0, drawings: 0, dbClients: 0 };
  const projectId = project.id as any;

  const diagramWhere = { projectId, userId, isDeleted: false, OR: [{ sourceType: { not: "production_db" } }, { sourceType: null }] };
  const [notes, diagrams, flowcharts, drawings, dbClients] = await Promise.all([
    prisma.note.count({ where: { projectId, userId, isDeleted: false } }),
    prisma.diagram.count({ where: diagramWhere }),
    prisma.flowchart.count({ where: { projectId, userId, isDeleted: false } }),
    prisma.drawing.count({ where: { projectId, userId, isDeleted: false } }),
    includeDbClient && isDesktopMode()
      ? (prisma as any).dbClient.count({ where: { projectId, userId, isDeleted: false } })
      : Promise.resolve(0),
  ]);

  return { notes, diagrams, flowcharts, drawings, dbClients };
}

export async function listProjectFiles(projectIdOrUid: number | string, userId: string, includeDbClient = true) {
  if (!prisma) throw new Error("Database connection not available");
  const project = await resolveProject(projectIdOrUid, userId);
  if (!project) return { data: [] };
  const projectId = project.id as any;

  const where = { projectId, userId, isDeleted: false };
  const [notes, diagrams, flowcharts, drawings, dbClients] = await Promise.all([
    prisma.note.findMany({ where, select: { id: true, uid: true, title: true, createdAt: true } }),
    prisma.diagram.findMany({ where: { ...where, OR: [{ sourceType: null }, { sourceType: { not: "production_db" } }] }, select: { id: true, uid: true, name: true, createdAt: true } }),
    prisma.flowchart.findMany({ where, select: { id: true, uid: true, title: true, createdAt: true } }),
    prisma.drawing.findMany({ where, select: { id: true, uid: true, title: true, createdAt: true } }),
    includeDbClient && isDesktopMode()
      ? (prisma as any).dbClient.findMany({ where, select: { id: true, uid: true, name: true, createdAt: true } })
      : Promise.resolve([]),
  ]);

  const files = [
    ...notes.map(file => ({ type: "notes", uid: String(file.uid ?? file.id), title: file.title, createdAt: file.createdAt })),
    ...diagrams.map(file => ({ type: "erd", uid: String(file.uid ?? file.id), title: file.name, createdAt: file.createdAt })),
    ...flowcharts.map(file => ({ type: "flowchart", uid: String(file.uid ?? file.id), title: file.title, createdAt: file.createdAt })),
    ...drawings.map(file => ({ type: "drawings", uid: String(file.uid ?? file.id), title: file.title, createdAt: file.createdAt })),
    ...(dbClients as any[]).map(file => ({ type: "db-client", uid: String(file.uid ?? file.id), title: file.name, createdAt: file.createdAt })),
  ];

  return { data: files.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) };
}
