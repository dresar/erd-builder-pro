import { ApiEndpoint, SimulationResult, WorkflowStep } from './types';

export class InMemDb {
  private tables: Map<string, any[]> = new Map();

  getTable(name: string): any[] {
    if (!this.tables.has(name)) {
      this.tables.set(name, []);
    }
    return this.tables.get(name)!;
  }

  create(name: string, item: any): any {
    return this.insert(name, item);
  }

  list(name: string): any[] {
    return this.getTable(name);
  }

  getById(name: string, id: any): any | null {
    const list = this.getTable(name);
    return list.find(r => String(r.id) === String(id)) || null;
  }

  insert(name: string, item: any): any {
    const list = this.getTable(name);
    const id = item.id || `550e8400-e29b-41d4-a716-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    const now = new Date().toISOString();
    const record = { ...item, id, created_at: now, updated_at: now };
    list.unshift(record);
    return record;
  }

  update(name: string, id: any, updates: any): any | null {
    const list = this.getTable(name);
    const idx = list.findIndex(r => String(r.id) === String(id));
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, updated_at: new Date().toISOString() };
    return list[idx];
  }

  delete(name: string, id: any): boolean {
    return this.remove(name, id);
  }

  remove(name: string, id: any): boolean {
    const list = this.getTable(name);
    const idx = list.findIndex(r => String(r.id) === String(id));
    if (idx === -1) return false;
    list.splice(idx, 1);
    return true;
  }

  clear() {
    this.tables.clear();
  }
}

export const simulatedDb = new InMemDb();

export async function simulateApiCall(
  endpoint: ApiEndpoint,
  requestData: {
    headers?: Record<string, string>;
    queryParams?: Record<string, string>;
    body?: any;
    pathParam?: string;
  },
  customDb?: InMemDb
): Promise<SimulationResult> {
  const db = customDb || simulatedDb;
  const start = performance.now();
  const delay = Math.floor(40 + Math.random() * 90);
  await new Promise(r => setTimeout(r, delay));

  const latencyMs = Math.round(performance.now() - start);
  const now = new Date().toISOString();
  const requestId = `req_${Math.random().toString(36).slice(2, 10)}`;

  const resHeaders: Record<string, string> = {
    'content-type': 'application/json; charset=utf-8',
    'x-response-time': `${latencyMs}ms`,
    'x-request-id': requestId,
    'x-ratelimit-limit': '100',
    'x-ratelimit-remaining': '99',
    'access-control-allow-origin': '*',
  };

  const { method, tableName } = endpoint;
  const store = db.getTable(tableName);

  if (method === 'GET') {
    if (endpoint.path.includes(':')) {
      const id = requestData.pathParam || '550e8400-e29b-41d4-a716-446655440000';
      const found = store.find(r => String(r.id) === String(id)) || endpoint.responseExample.data.data;
      return {
        status: 200,
        statusText: 'OK',
        latencyMs,
        headers: resHeaders,
        data: { success: true, data: found },
        timestamp: now,
      };
    }

    const page = parseInt(requestData.queryParams?.page || '1', 10);
    const limit = parseInt(requestData.queryParams?.limit || '10', 10);
    const q = requestData.queryParams?.q?.toLowerCase();

    let records = store.length > 0 ? [...store] : (Array.isArray(endpoint.responseExample.data.data) ? endpoint.responseExample.data.data : []);
    if (q) {
      records = records.filter(r => JSON.stringify(r).toLowerCase().includes(q));
    }

    const total = records.length;
    const startIdx = (page - 1) * limit;
    const paged = records.slice(startIdx, startIdx + limit);

    return {
      status: 200,
      statusText: 'OK',
      latencyMs,
      headers: resHeaders,
      data: {
        success: true,
        meta: {
          page,
          limit,
          total,
          total_pages: Math.max(1, Math.ceil(total / limit)),
        },
        data: paged,
      },
      timestamp: now,
    };
  }

  if (method === 'POST') {
    const payload = requestData.body || endpoint.requestBodyExample || {};
    const created = db.insert(tableName, payload);
    return {
      status: 201,
      statusText: 'Created',
      latencyMs,
      headers: resHeaders,
      data: {
        success: true,
        message: `${endpoint.tableTitle} berhasil dibuat`,
        data: created,
      },
      timestamp: now,
    };
  }

  if (method === 'PUT') {
    const id = requestData.pathParam || '550e8400-e29b-41d4-a716-446655440000';
    const payload = requestData.body || endpoint.requestBodyExample || {};
    const updated = db.update(tableName, id, payload) || { id, ...payload, updated_at: now };
    return {
      status: 200,
      statusText: 'OK',
      latencyMs,
      headers: resHeaders,
      data: {
        success: true,
        message: `${endpoint.tableTitle} berhasil diperbarui`,
        data: updated,
      },
      timestamp: now,
    };
  }

  if (method === 'DELETE') {
    const id = requestData.pathParam || '550e8400-e29b-41d4-a716-446655440000';
    db.remove(tableName, id);
    return {
      status: 200,
      statusText: 'OK',
      latencyMs,
      headers: resHeaders,
      data: {
        success: true,
        message: `${endpoint.tableTitle} berhasil dihapus (soft-delete)`,
      },
      timestamp: now,
    };
  }

  return {
    status: 200,
    statusText: 'OK',
    latencyMs,
    headers: resHeaders,
    data: { success: true },
    timestamp: now,
  };
}

export async function executeWorkflowStep(
  step: WorkflowStep,
  previousResult?: SimulationResult
): Promise<SimulationResult> {
  const start = performance.now();
  const delay = Math.floor(120 + Math.random() * 150);
  await new Promise(r => setTimeout(r, delay));

  const latencyMs = Math.round(performance.now() - start);
  const now = new Date().toISOString();

  let payload = { ...step.requestPayload };
  if (previousResult?.data?.data?.id) {
    const prevId = previousResult.data.data.id;
    if (step.tableName.includes('payment') || step.tableName.includes('document') || step.tableName.includes('room')) {
      payload.parent_id = prevId;
    }
  }

  const record = step.method === 'POST' ? simulatedDb.insert(step.tableName, payload) : payload;

  return {
    status: step.expectedStatus,
    statusText: step.expectedStatus === 201 ? 'Created' : 'OK',
    latencyMs,
    headers: {
      'content-type': 'application/json',
      'x-simulated-workflow': 'true',
      'x-workflow-step': String(step.order),
    },
    data: {
      success: true,
      message: `Langkah "${step.title}" berhasil dieksekusi`,
      step_order: step.order,
      data: record,
    },
    timestamp: now,
  };
}

export async function executeRealApiCall(
  baseUrl: string,
  endpoint: ApiEndpoint,
  requestData: {
    headers?: Record<string, string>;
    queryParams?: Record<string, string>;
    body?: any;
    pathParam?: string;
  }
): Promise<SimulationResult> {
  const start = performance.now();
  const cleanBase = baseUrl.replace(/\/+$/, '');
  let resolvedPath = endpoint.path;
  if (endpoint.path.includes(':')) {
    const id = requestData.pathParam || '1';
    resolvedPath = endpoint.path.replace(/:[a-zA-Z0-9_]+/, encodeURIComponent(id));
  }

  let finalUrl = `${cleanBase}${resolvedPath}`;
  if (requestData.queryParams && Object.keys(requestData.queryParams).length > 0) {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(requestData.queryParams)) {
      if (v !== undefined && v !== '') qs.append(k, v);
    }
    const queryString = qs.toString();
    if (queryString) finalUrl += `?${queryString}`;
  }

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(requestData.headers || {}),
  };

  const options: RequestInit = {
    method: endpoint.method,
    headers: reqHeaders,
  };

  if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && requestData.body) {
    options.body = typeof requestData.body === 'string' ? requestData.body : JSON.stringify(requestData.body);
  }

  try {
    const res = await fetch(finalUrl, options);
    const latencyMs = Math.round(performance.now() - start);
    const resHeaders: Record<string, string> = {};
    res.headers.forEach((val, key) => {
      resHeaders[key] = val;
    });

    let resData: any;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      resData = await res.json();
    } else {
      resData = await res.text();
    }

    return {
      status: res.status,
      statusText: res.statusText || (res.ok ? 'OK' : 'Error'),
      latencyMs,
      headers: resHeaders,
      data: resData,
      timestamp: new Date().toISOString(),
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      status: 0,
      statusText: 'Network Error',
      latencyMs,
      headers: {
        'x-error-type': 'FetchException',
        'x-target-url': finalUrl,
      },
      data: {
        success: false,
        error: {
          message: err?.message || 'Gagal menghubungi server target.',
          targetUrl: finalUrl,
          hint: 'Pastikan server backend berjalan (misal: http://localhost:3000) dan mengizinkan CORS.',
        },
      },
      timestamp: new Date().toISOString(),
    };
  }
}
