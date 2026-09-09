export function getApiEndpointsSection(projectName: string, dbmlSource: string): string {
  const tableNames: string[] = [];
  const tableRegex = /Table\s+["']?([a-zA-Z0-9_.]+)["']?/gi;
  let match: RegExpExecArray | null;
  while ((match = tableRegex.exec(dbmlSource)) !== null) {
    const raw = match[1];
    const name = raw.includes('.') ? raw.split('.').pop()! : raw;
    if (!tableNames.includes(name)) tableNames.push(name);
  }

  const endpointList = tableNames.length > 0 ? tableNames : [
    'users', 'profiles', 'campuses', 'students', 'guardians', 'psb_registrants',
    'academic_classes', 'dormitories', 'rooms', 'fee_types', 'invoices', 'payments', 'audit_logs'
  ];

  const crudDoc = endpointList.map((t, idx) => {
    const title = t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return `### ${idx + 1}. MODUL ENDPOINT: /api/v1/${t} (${title})
- GET /api/v1/${t}
  * Summary: Mengambil kumpulan data ${title} terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/${t}/:id
  * Summary: Detail tunggal ${title} berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/${t}
  * Summary: Membuat rekaman ${title} baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "${title} berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/${t}/:id
  * Summary: Memperbarui data ${title}. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "${title} berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/${t}/:id
  * Summary: Menghapus rekaman ${title} dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "${title} berhasil dihapus" } | 404 Not Found`;
  }).join('\n\n');

  return `=======================================================================
[SECTION 8: SPESIFIKASI KONTRAK REST API & ENDPOINTS CRUD PENUH]
=======================================================================
Sistem "${projectName}" WAJIB menyediakan implementasi RESTful API terstandarisasi untuk seluruh modul entitas basis data:

1. STANDAR PROTOKOL & FORMAT UMUM:
- Base Path: /api/v1
- Format Payload: application/json; charset=utf-8
- Skema Sukses Standar:
  {
    "success": true,
    "message"?: string,
    "meta"?: { "page": number, "limit": number, "total": number, "total_pages": number },
    "data": any
  }
- Skema Kegagalan Standar:
  {
    "success": false,
    "error": {
      "code": string,
      "message": string,
      "details"?: any
    }
  }

2. ATURAN HEADERS WAJIB:
- Authorization: Bearer <jwt_access_token> (Wajib pada seluruh private route)
- X-Tenant-Id / X-Campus-Id: <uuid> (Wajib untuk isolasi multi-tenant)
- Content-Type: application/json
- Idempotency-Key: <uuid> (Wajib pada transaksi finansial / pembayaran)

3. INVENTARIS ENDPOINTS CRUD LENGKAP TIAP TABEL:
${crudDoc}

4. ENDPOINTS ALUR TRANSAKSI & WORKFLOW ENGINE (SIMULASI SISTEM):
- POST /api/v1/auth/login -> Autentikasi sesi & penerbitan refresh token.
- POST /api/v1/psb/registrants/submit -> Validasi berkas & pendaftaran calon santri baru.
- POST /api/v1/payments/generate-va -> Pembuatan Virtual Account payment gateway otomatis.
- POST /api/v1/webhooks/payment-gateway -> Callback settlement pembayaran same-day.
- PUT /api/v1/students/enroll -> Aktivasi status santri aktif & alokasi asrama/kelas.
`;
}
