import type { Request as ExpressRequest, Response as ExpressResponse } from "express";
import type { PrismaClient } from "@prisma/client";
import { isDesktopMode, isLocalPostgres } from "./config.js";

export const isAdminUser = (req: ExpressRequest) => {
  // Desktop/SQLite is a single-user install. Local PostgreSQL can have multiple users.
  if (isDesktopMode()) return true;

  const user = (req as any).user;
  if (!user) return false;

  if (isLocalPostgres()) return Boolean(user.isSuperAdmin || user.is_super_admin);

  return Boolean(
    user.isSuperAdmin ||
    user.is_super_admin ||
    user.app_metadata?.is_super_admin ||
    user.app_metadata?.role === "admin" ||
    user.user_metadata?.is_super_admin ||
    user.user_metadata?.role === "admin"
  );
};

export const requireAdmin = (req: ExpressRequest, res: ExpressResponse) => {
  if (!isAdminUser(req)) {
    res.status(403).json({ error: "Forbidden" });
    return false;
  }

  return true;
};

export const resolveOwnedProjectId = async (
  prisma: PrismaClient,
  userId: string,
  projectId: unknown,
): Promise<number | null> => {
  if (projectId === null || projectId === undefined || projectId === "" || projectId === "null" || projectId === "none" || projectId === "uncategorized") {
    return null;
  }

  if (typeof projectId !== "number" && typeof projectId !== "string" && typeof projectId !== "bigint") {
    return null;
  }

  const strId = String(projectId).trim();
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(strId);
  const numId = Number(strId);

  let whereClause: any;
  if (isUuid) {
    whereClause = { uid: strId, userId, isDeleted: false };
  } else if (Number.isFinite(numId)) {
    whereClause = { id: numId, userId, isDeleted: false };
  } else {
    return null;
  }

  const project = await prisma.project.findFirst({
    where: whereClause,
    select: { id: true },
  });

  if (!project) {
    return null;
  }

  return Number(project.id);
};
