import { prisma } from "../../lib/prisma.js";

export function dedupe<T extends { id: any }>(arr: T[], label: string): T[] {
  const seen = new Set();
  const result: T[] = [];
  for (const item of arr) {
    if (seen.has(item.id)) {
      console.warn(`[Save Warning] Duplicate ${label} id=${item.id} removed`);
      continue;
    }
    seen.add(item.id);
    result.push(item);
  }
  return result;
}

function normalizePersistedColumnDefault(value: any, isNullable: boolean): string | null {
  const normalized = value == null ? null : String(value).trim() || null;
  return !isNullable && normalized?.toUpperCase() === 'NULL' ? null : normalized;
}

function columnIsNullable(value: any): boolean {
  return value !== undefined ? Boolean(value) : true;
}

export async function upsertEntities(rows: any[], diagramId: number) {
  if (rows.length === 0 || !prisma) return;
  const CHUNK = 50;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const batch = rows.slice(i, i + CHUNK);
    await prisma.$transaction(
      batch.map(e =>
        prisma!.entity.upsert({
          where: { id: e.id },
          create: {
            id: e.id, diagramId,
            name: e.name, x: e.x, y: e.y,
            color: e.color || "#6366f1",
            comment: e.comment || null,
          },
          update: {
            name: e.name, x: e.x, y: e.y,
            color: e.color || "#6366f1",
            comment: e.comment || null,
          },
        })
      ),
      { timeout: 30000 }
    );
  }
}

export async function upsertColumns(rows: any[]) {
  if (rows.length === 0 || !prisma) return;
  const CHUNK = 50;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const batch = rows.slice(i, i + CHUNK);
    await prisma.$transaction(
      batch.map(col =>
        prisma!.column.upsert({
          where: { id: col.id },
          create: {
            id: col.id, entityId: col._entity_id,
            name: col.name, type: col.type,
            isPk: col.is_pk || false,
            isNullable: columnIsNullable(col.is_nullable),
            isUnique: Boolean(col.is_unique),
            defaultValue: normalizePersistedColumnDefault(col.default_value, columnIsNullable(col.is_nullable)),
            enumValues: col.enum_values || null,
            comment: col.comment || null,
            maxLength: col.max_length ?? null,
            numericPrecision: col.numeric_precision ?? null,
            numericScale: col.numeric_scale ?? null,
            sortOrder: col.sort_order || 0,
          },
          update: {
            entityId: col._entity_id, name: col.name, type: col.type,
            isPk: col.is_pk || false,
            isNullable: columnIsNullable(col.is_nullable),
            isUnique: Boolean(col.is_unique),
            defaultValue: normalizePersistedColumnDefault(col.default_value, columnIsNullable(col.is_nullable)),
            enumValues: col.enum_values || null,
            comment: col.comment || null,
            maxLength: col.max_length ?? null,
            numericPrecision: col.numeric_precision ?? null,
            numericScale: col.numeric_scale ?? null,
            sortOrder: col.sort_order || 0,
          },
        })
      ),
      { timeout: 30000 }
    );
  }
}

export async function upsertRelationships(rows: any[], diagramId: number) {
  if (rows.length === 0 || !prisma) return;
  const CHUNK = 50;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const batch = rows.slice(i, i + CHUNK);
    await prisma.$transaction(
      batch.map(r =>
        prisma!.relationship.upsert({
          where: { id: r.id },
          create: {
            id: r.id, diagramId,
            sourceEntityId: r.source_entity_id,
            targetEntityId: r.target_entity_id,
            sourceColumnId: r.source_column_id || null,
            targetColumnId: r.target_column_id || null,
            sourceHandle: r.source_handle || null,
            targetHandle: r.target_handle || null,
            type: r.type || "one-to-many",
            label: r.label || null,
            onDelete: r.on_delete || null,
            onUpdate: r.on_update || null,
            constraintName: r.constraint_name || null,
          },
          update: {
            diagramId,
            sourceEntityId: r.source_entity_id,
            targetEntityId: r.target_entity_id,
            sourceColumnId: r.source_column_id || null,
            targetColumnId: r.target_column_id || null,
            sourceHandle: r.source_handle || null,
            targetHandle: r.target_handle || null,
            type: r.type || "one-to-many",
            label: r.label || null,
            onDelete: r.on_delete || null,
            onUpdate: r.on_update || null,
            constraintName: r.constraint_name || null,
          },
        })
      ),
      { timeout: 30000 }
    );
  }
}

export async function upsertTableConstraints(rows: any[]) {
  if (rows.length === 0 || !prisma) return;
  const CHUNK = 50;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const batch = rows.slice(i, i + CHUNK);
    await prisma.$transaction(
      batch.map(constraint =>
        prisma!.tableConstraint.upsert({
          where: { id: constraint.id },
          create: {
            id: constraint.id,
            entityId: constraint._entity_id,
            kind: constraint.kind,
            name: constraint.name || null,
            columnIds: Array.isArray(constraint.column_ids) ? JSON.stringify(constraint.column_ids) : constraint.column_ids || null,
            expression: constraint.expression || null,
          },
          update: {
            entityId: constraint._entity_id,
            kind: constraint.kind,
            name: constraint.name || null,
            columnIds: Array.isArray(constraint.column_ids) ? JSON.stringify(constraint.column_ids) : constraint.column_ids || null,
            expression: constraint.expression || null,
          },
        })
      ),
      { timeout: 30000 }
    );
  }
}

export async function upsertTableIndexes(rows: any[]) {
  if (rows.length === 0 || !prisma) return;
  const CHUNK = 50;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const batch = rows.slice(i, i + CHUNK);
    await prisma.$transaction(
      batch.map(index =>
        prisma!.tableIndex.upsert({
          where: { id: index.id },
          create: {
            id: index.id,
            entityId: index._entity_id,
            name: index.name,
            columnIds: Array.isArray(index.column_ids) ? JSON.stringify(index.column_ids) : String(index.column_ids || "[]"),
            isUnique: Boolean(index.is_unique),
            algorithm: index.algorithm || null,
          },
          update: {
            entityId: index._entity_id,
            name: index.name,
            columnIds: Array.isArray(index.column_ids) ? JSON.stringify(index.column_ids) : String(index.column_ids || "[]"),
            isUnique: Boolean(index.is_unique),
            algorithm: index.algorithm || null,
          },
        })
      ),
      { timeout: 30000 }
    );
  }
}
