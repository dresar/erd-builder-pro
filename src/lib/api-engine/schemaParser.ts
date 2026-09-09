import { ApiEndpoint, WorkflowStep } from './types';
import { ColumnDefinition, generateCreateMockPayload, generateUpdateMockPayload, generateRealisticValue } from './mockDataGenerator';

export interface ParsedTable {
  name: string;
  columns: ColumnDefinition[];
}

export function parseDbmlToTables(dbmlSource: string): ParsedTable[] {
  if (!dbmlSource || !dbmlSource.trim()) return [];

  const tables: ParsedTable[] = [];
  const tableRegex = /Table\s+["']?([a-zA-Z0-9_.]+)["']?\s*\{([^}]+)\}/gi;
  let match: RegExpExecArray | null;

  while ((match = tableRegex.exec(dbmlSource)) !== null) {
    const rawTableName = match[1];
    const tableName = rawTableName.includes('.') ? rawTableName.split('.').pop()! : rawTableName;
    const body = match[2];
    const lines = body.split('\n');
    const columns: ColumnDefinition[] = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line || line.startsWith('//') || line.startsWith('Indexes') || line.startsWith('Note:')) continue;

      const colMatch = line.match(/^["']?([a-zA-Z0-9_]+)["']?\s+([a-zA-Z0-9_()]+)(.*)$/);
      if (colMatch) {
        const colName = colMatch[1];
        const colType = colMatch[2];
        const rest = colMatch[3] || '';

        const is_pk = /\[.*?\bpk\b.*?\]/i.test(rest);
        const is_nullable = !/\[.*?\bnot\s+null\b.*?\]/i.test(rest);
        const is_unique = /\[.*?\bunique\b.*?\]/i.test(rest);

        let default_value: string | undefined;
        const defMatch = rest.match(/default:\s*`?([^`,\]]+)`?/i);
        if (defMatch) default_value = defMatch[1].trim();

        columns.push({
          name: colName,
          type: colType,
          is_pk,
          is_nullable,
          is_unique,
          default_value,
        });
      }
    }

    if (columns.length > 0) {
      tables.push({ name: tableName, columns });
    }
  }

  return tables;
}

export function buildEndpointsFromTables(tables: ParsedTable[]): ApiEndpoint[] {
  const endpoints: ApiEndpoint[] = [];

  for (const t of tables) {
    const tableName = t.name;
    const tableTitle = tableName.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const pkCol = t.columns.find(c => c.is_pk) || t.columns[0] || { name: 'id', type: 'uuid' };
    const pkType = pkCol.type.toLowerCase().includes('uuid') ? 'UUID' : 'Integer';

    const createBody = generateCreateMockPayload(t.columns, tableName);
    const updateBody = generateUpdateMockPayload(t.columns, tableName);
    const sampleRecord = { [pkCol.name]: generateRealisticValue(pkCol, tableName), ...createBody };

    endpoints.push({
      id: `get_list_${tableName}`,
      method: 'GET',
      path: `/api/v1/${tableName}`,
      tableName,
      tableTitle,
      summary: `Mendapatkan daftar ${tableTitle}`,
      description: `Mengembalikan kumpulan data ${tableTitle} terpaginasi dengan filter, pengurutan, dan pencarian teks.`,
      tags: [tableTitle],
      params: [
        { name: 'page', type: 'integer', required: false, default: '1', in: 'query', description: 'Nomor halaman aktif' },
        { name: 'limit', type: 'integer', required: false, default: '10', in: 'query', description: 'Jumlah item per halaman' },
        { name: 'sort_by', type: 'string', required: false, default: pkCol.name, in: 'query', description: 'Kolom dasar pengurutan' },
        { name: 'order', type: 'string', required: false, default: 'desc', in: 'query', description: 'Arah urutan (asc / desc)' },
        { name: 'q', type: 'string', required: false, in: 'query', description: 'Kata kunci pencarian' },
      ],
      responseExample: {
        status: 200,
        data: {
          success: true,
          meta: { page: 1, limit: 10, total: 42, total_pages: 5 },
          data: [sampleRecord],
        },
      },
    });

    endpoints.push({
      id: `get_one_${tableName}`,
      method: 'GET',
      path: `/api/v1/${tableName}/:${pkCol.name}`,
      tableName,
      tableTitle,
      summary: `Detail ${tableTitle} berdasarkan ID`,
      description: `Mencari dan menampilkan satu entitas ${tableTitle} secara spesifik menggunakan kunci identitas.`,
      tags: [tableTitle],
      params: [
        { name: pkCol.name, type: pkType, required: true, in: 'path', description: `Identifier unik entitas (${pkType})` },
      ],
      responseExample: {
        status: 200,
        data: { success: true, data: sampleRecord },
      },
    });

    endpoints.push({
      id: `post_create_${tableName}`,
      method: 'POST',
      path: `/api/v1/${tableName}`,
      tableName,
      tableTitle,
      summary: `Membuat data baru ${tableTitle}`,
      description: `Memvalidasi skema data masuk dan merekam entitas ${tableTitle} baru ke dalam basis data dengan audit trail.`,
      tags: [tableTitle],
      params: [
        { name: 'body', type: 'object', required: true, in: 'body', description: 'Payload atribut entitas baru' },
      ],
      requestBodyExample: createBody,
      responseExample: {
        status: 201,
        data: { success: true, message: `${tableTitle} berhasil dibuat`, data: sampleRecord },
      },
    });

    endpoints.push({
      id: `put_update_${tableName}`,
      method: 'PUT',
      path: `/api/v1/${tableName}/:${pkCol.name}`,
      tableName,
      tableTitle,
      summary: `Memperbarui ${tableTitle}`,
      description: `Memperbarui satu atau lebih atribut pada entitas ${tableTitle} yang sudah ada.`,
      tags: [tableTitle],
      params: [
        { name: pkCol.name, type: pkType, required: true, in: 'path', description: `Identifier unik entitas (${pkType})` },
        { name: 'body', type: 'object', required: true, in: 'body', description: 'Payload perubahan atribut' },
      ],
      requestBodyExample: updateBody,
      responseExample: {
        status: 200,
        data: { success: true, message: `${tableTitle} berhasil diperbarui`, data: { ...sampleRecord, ...updateBody } },
      },
    });

    endpoints.push({
      id: `delete_remove_${tableName}`,
      method: 'DELETE',
      path: `/api/v1/${tableName}/:${pkCol.name}`,
      tableName,
      tableTitle,
      summary: `Menghapus ${tableTitle}`,
      description: `Melakukan soft-delete pada entitas ${tableTitle} dengan menandai stempel deleted_at.`,
      tags: [tableTitle],
      params: [
        { name: pkCol.name, type: pkType, required: true, in: 'path', description: `Identifier unik entitas (${pkType})` },
      ],
      responseExample: {
        status: 200,
        data: { success: true, message: `${tableTitle} berhasil dihapus` },
      },
    });
  }

  return endpoints;
}

export function buildWorkflowStepsFromFlowchart(flowchart: any, tables: ParsedTable[] = []): WorkflowStep[] {
  if (!flowchart) return buildDefaultWorkflowSteps(tables);

  let data = flowchart.data || flowchart;
  if (typeof data === 'string') {
    try { data = JSON.parse(data); } catch {}
  }

  const nodes = Array.isArray(flowchart) ? flowchart : (Array.isArray(data?.nodes) ? data.nodes : (Array.isArray(data) ? data : []));
  if (nodes.length === 0) return buildDefaultWorkflowSteps(tables);

  const steps: WorkflowStep[] = [];
  let order = 1;

  for (const node of nodes) {
    const label = node.data?.label || node.label || '';
    if (!label || label.toLowerCase().includes('selesai') || label.toLowerCase().includes('finish')) continue;

    const shape = (node.data?.shape || node.shape || '').toLowerCase();
    const matchedTable = tables.find(t => label.toLowerCase().includes(t.name.replace(/_/g, ' ')) || label.toLowerCase().includes(t.name)) || tables[0];
    const tblName = matchedTable ? matchedTable.name : 'records';

    let method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST';
    if (shape === 'diamond' || label.includes('?')) {
      method = 'GET';
    } else if (label.toLowerCase().includes('update') || label.toLowerCase().includes('alokasi') || label.toLowerCase().includes('ubah')) {
      method = 'PUT';
    }

    const endpoint = method === 'GET' ? `/api/v1/${tblName}` : method === 'PUT' ? `/api/v1/${tblName}/550e8400-e29b-41d4-a716-446655440000` : `/api/v1/${tblName}`;
    const payload = matchedTable ? generateCreateMockPayload(matchedTable.columns, matchedTable.name) : { action: label };

    steps.push({
      id: `step_${order}`,
      order,
      title: label,
      method,
      endpoint,
      tableName: tblName,
      description: `Eksekusi transaksional langkah: ${label}`,
      requestPayload: payload,
      expectedStatus: method === 'POST' ? 201 : 200,
      status: 'idle',
    });

    order++;
    if (order > 8) break;
  }

  return steps.length > 0 ? steps : buildDefaultWorkflowSteps(tables);
}

function buildDefaultWorkflowSteps(tables: ParsedTable[]): WorkflowStep[] {
  if (!tables || tables.length === 0) return [];

  const selectedTables = tables.slice(0, 3);
  return selectedTables.map((t, idx) => {
    const formatted = t.name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const payload = generateCreateMockPayload(t.columns, t.name);
    return {
      id: `step_${idx + 1}`,
      order: idx + 1,
      title: `Buat Data ${formatted}`,
      method: 'POST',
      endpoint: `/api/v1/${t.name}`,
      tableName: t.name,
      description: `Menyimpan entitas baru pada tabel ${t.name}`,
      requestPayload: payload,
      expectedStatus: 201,
      status: 'idle',
    };
  });
}

export function parseDbmlToApiEndpoints(dbmlSource: string): ApiEndpoint[] {
  const tables = parseDbmlToTables(dbmlSource);
  return buildEndpointsFromTables(tables);
}

export function parseFlowchartToWorkflowSteps(flowchart: any, tables: ParsedTable[] = []): WorkflowStep[] {
  return buildWorkflowStepsFromFlowchart(flowchart, tables);
}
