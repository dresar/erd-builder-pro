export function getApiEndpointsSection(projectName: string, dbmlSource: string): string {
  const tableNames: string[] = [];
  const tableRegex = /(?:^|\n)\s*Table\s+["']?([a-zA-Z0-9_.]+)["']?/gi;
  let match: RegExpExecArray | null;
  while ((match = tableRegex.exec(dbmlSource)) !== null) {
    const raw = match[1];
    const name = raw.includes('.') ? raw.split('.').pop()! : raw;
    if (!tableNames.includes(name)) tableNames.push(name);
  }

  const endpointList = tableNames.length > 0 ? tableNames : [
    'users', 'organizations', 'members', 'projects', 'items', 'invoices', 'payments', 'audit_logs'
  ];

  const primaryEntity = endpointList.find(t => !['users', 'audit_logs', 'organizations'].includes(t)) || 'items';

  const crudDoc = endpointList.map((t, idx) => {
    const title = t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return `### ${idx + 1}. MODUL ENTITAS: /api/v1/${t} (${title})
- GET /api/v1/${t}
  * Deskripsi: Mengambil koleksi data ${title} terpaginasi.
  * Query Params Standar: page=1, limit=20, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 20, total: 42, total_pages: 3 }, data: [...] }
- GET /api/v1/${t}/:id
  * Deskripsi: Detail tunggal ${title} berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/${t}
  * Deskripsi: Membuat rekaman ${title} baru. Validasi ketat skema Zod dan verifikasi RBAC.
  * Status: 201 Created -> { success: true, message: "${title} berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/${t}/:id
  * Deskripsi: Penggantian data penuh (Full Replacement). Seluruh field wajib dikirimkan.
  * Status: 200 OK -> { success: true, message: "${title} berhasil diperbarui (penuh)", data: { ... } } | 404 Not Found
- PATCH /api/v1/${t}/:id
  * Deskripsi: Pembaruan sebagian data (Partial Update). Hanya field yang dimodifikasi yang dikirimkan.
  * Status: 200 OK -> { success: true, message: "${title} berhasil diperbarui (parsial)", data: { ... } } | 404 Not Found
- DELETE /api/v1/${t}/:id
  * Deskripsi: Penghapusan logis (Soft-Delete) dengan mengisi timestamp deleted_at. Dilarang physical DELETE.
  * Status: 200 OK -> { success: true, message: "${title} berhasil dihapus" } | 404 Not Found`;
  }).join('\n\n');

  return `=======================================================================
[SECTION 8: CANONICAL API REGISTRY & REST SPECIFICATION]
=======================================================================
Sistem "${projectName}" WAJIB mengimplementasikan Canonical API Registry terpadu tanpa endpoint terfragmentasi:

1. STANDAR PROTOKOL, RESPONSE ENVELOPE & PAGINASI:
- Base Path: /api/v1
- Format Payload: application/json; charset=utf-8
- Standar Paginasi Universal:
  Query Parameters: page=1, limit=20, sort_by=created_at, order=desc|asc
- Skema Sukses Terstandarisasi:
  {
    "success": true,
    "message"?: string,
    "meta"?: { "page": number, "limit": number, "total": number, "total_pages": number },
    "data": any
  }
- Skema Kegagalan Terstandarisasi:
  {
    "success": false,
    "error": {
      "code": string,
      "message": string,
      "details"?: any
    }
  }

2. ATURAN HEADERS & KEAMANAN:
- Authorization: Bearer <jwt_access_token> (Wajib pada seluruh endpoint privat)
- X-Tenant-Id: <uuid> (Wajib untuk isolasi multi-tenant)
- Idempotency-Key: <uuid> (Wajib pada seluruh transaksi pembayaran dan alur status krusial)
- Content-Type: application/json

3. CANONICAL AUTHENTICATION & SESSION REGISTRY:
- POST /api/v1/auth/login -> Autentikasi email/password, emit access token (15m) + secure refresh cookie (7d).
- POST /api/v1/auth/refresh -> Rotasi token akses menggunakan refresh token.
- GET  /api/v1/auth/me -> Mengambil profil pengguna dan matriks peran RBAC saat ini.
- POST /api/v1/auth/logout -> Invalidasi sesi dan pembersihan cookie aman.

4. CANONICAL DOMAIN ENTITY CRUD REGISTRY:
${crudDoc}

5. CANONICAL BUSINESS WORKFLOW, PAYMENTS & OBSERVABILITY REGISTRY:
- POST /api/v1/${primaryEntity}/submit -> Validasi form dan inisialisasi status entitas awal.
- POST /api/v1/payments/generate-va -> Penerbitan virtual account payment gateway otomatis.
- POST /api/v1/webhooks/payment-gateway -> Callback settlement payment gateway dengan validasi tanda tangan HMAC-SHA256.
- PATCH /api/v1/${primaryEntity}/:id/transition -> Eksekusi transisi status state machine berdasar aturan RBAC.
- GET  /api/v1/health -> Healthcheck observabilitas (status database Neon, uptime sistem, memory usage).
`;
}
