import { describe, it, expect } from 'vitest';
import { parseDbmlToApiEndpoints, parseFlowchartToWorkflowSteps } from '../schemaParser';
import { InMemDb, simulateApiCall } from '../apiSimulator';
import { generateOpenApiSpec, generatePostmanCollection } from '../exportUtils';

const SAMPLE_DBML = `
Table users {
  id UUID [pk]
  name VARCHAR(255) [not null]
  email VARCHAR(255) [not null, unique]
  status users_status [not null, default: 'active']
  created_at TIMESTAMP [not null]
  updated_at TIMESTAMP [not null]
}

Table orders {
  id UUID [pk]
  user_id UUID [not null]
  total DECIMAL(10,2) [not null]
  status orders_status [not null, default: 'pending']
  created_at TIMESTAMP [not null]
  updated_at TIMESTAMP [not null]
}

Ref: orders.user_id > users.id
`;

const SAMPLE_FLOWCHART = {
  nodes: [
    { id: '1', data: { label: 'Mulai: Permintaan Klien', shape: 'oval' } },
    { id: '2', data: { label: 'Verifikasi Token JWT', shape: 'rectangle' } },
    { id: '3', data: { label: 'Token Valid?', shape: 'diamond' } },
    { id: '4', data: { label: 'Buka Transaksi PostgreSQL', shape: 'database' } },
    { id: '5', data: { label: 'Selesai: Respon 200', shape: 'oval' } },
  ],
  edges: [
    { id: 'e1', source: '1', target: '2' },
    { id: 'e2', source: '2', target: '3' },
    { id: 'e3', source: '3', target: '4' },
    { id: 'e4', source: '4', target: '5' },
  ],
};

describe('API Engine & Simulation Suite', () => {
  it('parses DBML into CRUD endpoints for each table', () => {
    const endpoints = parseDbmlToApiEndpoints(SAMPLE_DBML);
    expect(endpoints.length).toBe(10);

    const userEndpoints = endpoints.filter(e => e.tableName === 'users');
    expect(userEndpoints.length).toBe(5);

    const methods = userEndpoints.map(e => e.method);
    expect(methods).toContain('GET');
    expect(methods).toContain('POST');
    expect(methods).toContain('PUT');
    expect(methods).toContain('DELETE');
  });

  it('parses flowchart into ordered workflow steps', () => {
    const steps = parseFlowchartToWorkflowSteps(SAMPLE_FLOWCHART.nodes);
    expect(steps.length).toBeGreaterThan(0);
    expect(steps[0].title).toBe('Mulai: Permintaan Klien');
    expect(steps[1].title).toBe('Verifikasi Token JWT');
    expect(steps[2].method).toBe('GET');
  });

  it('InMemDb performs full CRUD operations', () => {
    const db = new InMemDb();
    
    const created = db.create('users', { name: 'Ahmad Fauzi', email: 'ahmad@example.com' });
    expect(created.id).toBeDefined();
    expect(created.name).toBe('Ahmad Fauzi');

    const allUsers = db.list('users');
    expect(allUsers.length).toBe(1);

    const single = db.getById('users', created.id);
    expect(single?.email).toBe('ahmad@example.com');

    const updated = db.update('users', created.id, { name: 'Ahmad Fauzi Updated' });
    expect(updated?.name).toBe('Ahmad Fauzi Updated');

    const deleted = db.delete('users', created.id);
    expect(deleted).toBe(true);

    const afterDelete = db.list('users');
    expect(afterDelete.length).toBe(0);
  });

  it('simulateApiCall simulates latency, status code, and CRUD execution', async () => {
    const endpoints = parseDbmlToApiEndpoints(SAMPLE_DBML);
    const postEndpoint = endpoints.find(e => e.tableName === 'users' && e.method === 'POST')!;
    const db = new InMemDb();

    const postResult = await simulateApiCall(
      postEndpoint,
      {
        headers: { 'Content-Type': 'application/json' },
        queryParams: {},
        body: { name: 'Siti Rahma', email: 'siti@example.com' },
      },
      db
    );

    expect(postResult.status).toBe(201);
    expect(postResult.data.success).toBe(true);
    expect(postResult.data.data.name).toBe('Siti Rahma');
    expect(postResult.latencyMs).toBeGreaterThan(0);

    const getEndpoint = endpoints.find(e => e.tableName === 'users' && e.method === 'GET' && !e.path.includes(':'))!;
    const getResult = await simulateApiCall(getEndpoint, { queryParams: {}, headers: {} }, db);

    expect(getResult.status).toBe(200);
    expect(getResult.data.data.length).toBe(1);
    expect(getResult.data.meta.total).toBe(1);
  });

  it('generates valid OpenAPI 3.0 spec JSON and Postman Collection', () => {
    const endpoints = parseDbmlToApiEndpoints(SAMPLE_DBML);
    
    const openApi = generateOpenApiSpec('Test Project', 'SaaS', endpoints);
    expect(openApi.openapi).toBe('3.0.3');
    expect(openApi.info.title).toContain('Test Project');
    expect(openApi.paths['/api/v1/users']).toBeDefined();

    const postman = generatePostmanCollection('Test Project', endpoints);
    expect(postman.info.schema).toContain('v2.1.0');
    expect(postman.item.length).toBe(2);
  });
});
