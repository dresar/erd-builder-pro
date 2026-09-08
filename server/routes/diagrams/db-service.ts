import { prisma } from "../../lib/prisma.js";
import { fetchSchema, testConnection } from "../../lib/db-connectors/registry.js";
import { erdColumnType } from "../../lib/db-connectors/types.js";
import type { ConnectionInfo } from "../../lib/db-connectors/types.js";
import { encrypt } from "../../lib/crypto.js";

export async function fetchDBSchema(connInfo: ConnectionInfo) {
  const tables = await fetchSchema(connInfo);
  return tables;
}

export async function testDBConnection(connInfo: ConnectionInfo) {
  const result = await testConnection(connInfo);
  return result;
}

export async function createDiagramFromDB(data: {
  name: string;
  type: "postgresql" | "mysql" | "sqlite";
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database: string;
  userId: string;
}) {
  if (!prisma) throw new Error("Database connection not available");

  const connInfo: ConnectionInfo = {
    type: data.type,
    host: data.host || undefined,
    port: data.port || undefined,
    user: data.user || undefined,
    password: data.password || undefined,
    database: data.database,
  };

  const tables = await fetchSchema(connInfo);

  const entities = tables.map((t: any, i: number) => ({
    name: t.table_name,
    x: (i % 4) * 280 + 50,
    y: Math.floor(i / 4) * 200 + 50,
    color: "#6b7280",
    columns: (t.columns || []).map((c: any) => ({
      name: c.name,
      type: erdColumnType(c),
      is_pk: !!c.is_pk,
      is_nullable: !!c.is_nullable,
      comment: c.comment || "",
      max_length: c.max_length ?? null,
      numeric_precision: c.numeric_precision ?? null,
      numeric_scale: c.numeric_scale ?? null,
      sort_order: c.sort_order || 0,
      _is_fk: (t.foreign_keys || []).some((fk: any) => fk.column === c.name),
    })),
  }));

  const positions: Record<string, any> = {};
  entities.forEach(e => {
    positions[e.name] = { x: e.x, y: e.y, color: e.color, collapsed: false, hidden_columns: [], note: "" };
  });

  const encryptedPassword = data.password ? encrypt(data.password) : undefined;

  const diagramData = {
    nodes: positions,
    viewport: { x: 0, y: 0, zoom: 1 },
    _type: "production_db_positions",
    source: {
      type: data.type,
      host: data.host || undefined,
      port: data.port || undefined,
      user: data.user || undefined,
      database: data.database,
      password_encrypted: encryptedPassword,
    },
  };

  const diagram = await prisma.diagram.create({
    data: {
      name: data.name.trim(),
      uid: crypto.randomUUID(),
      userId: data.userId,
      sourceType: "production_db",
      data: JSON.stringify(diagramData),
    },
    select: { id: true, uid: true, name: true, data: true, sourceType: true, updatedAt: true },
  });

  return { diagram, schema: tables };
}
