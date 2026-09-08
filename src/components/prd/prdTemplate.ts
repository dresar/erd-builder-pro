export interface PrdHeading {
  id: string;
  title: string;
  level: number;
}

export interface PrdMetadata {
  title: string;
  version: string;
  status: 'draft' | 'in_review' | 'approved' | 'production';
  domain: string;
  targetDeployment: string;
  sla: string;
  latency: string;
}

export function getDefaultPrdTemplate(projectName: string = 'Sistem Enterprise', domain: string = 'SaaS Multi-Tenant'): string {
  return `# SPESIFIKASI PERSYARATAN PRODUK & ARSITEKTUR (PRD)

> **Proyek**: ${projectName}  
> **Versi**: 1.0.0 | **Status**: Draft | **Domain**: ${domain}  
> **Target**: Serverless on Vercel + Supabase PostgreSQL + Edge Functions

---

## 1. Ringkasan Eksekutif & Sasaran Bisnis

Sistem dirancang untuk menyediakan fondasi *enterprise-grade* dengan ketersediaan tinggi, latensi rendah, serta pemisahan data penyewa yang aman (*multi-tenant isolation*).

### Metrik Keberhasilan Utama
- **Target Ketersediaan (SLA)**: 99.99% Uptime
- **Latensi Respon (P95)**: < 200 ms untuk eksekusi fungsi serverless
- **Target Pemulihan**: RPO < 5 menit, RTO < 30 menit
- **Skalabilitas**: Stateless compute dengan penyesuaian skala otomatis

---

## 2. Topologi Solusi & Infrastruktur

- **Komputasi & Runtime**: Vercel Serverless Functions + Edge Middleware
- **Basis Data**: Supabase PostgreSQL dengan Supavisor Connection Pooling
- **Cache & Rate Limiting**: Upstash Redis terdistribusi
- **Penyimpanan Aset**: Cloudflare R2 / AWS S3 terenkripsi
- **Pemrosesan Asinkron**: Background Event Queue

---

## 3. Dekomposisi Modul Domain (DDD)

### 3.1 Modul Identitas, Akses & Multi-Tenancy
- **Entitas Kunci**: \`tenants\`, \`users\`, \`roles\`, \`permissions\`
- **Aturan Bisnis**: Setiap transaksi data wajib mencantumkan \`tenant_id\` untuk penegakan Row-Level Security.
- **State Transisi**: \`Pending\` ➔ \`Active\` ➔ \`Suspended\` ➔ \`Archived\`

### 3.2 Modul Bisnis Inti & Transaksi
- **Entitas Kunci**: Entitas spesifik domain ${domain}
- **Aturan Bisnis**: Mutasi data keuangan dan operasional wajib dicatat dalam transaksi atomik PostgreSQL.

---

## 4. Matriks Akses & Keamanan (RBAC)

| Peran (Role) | Baca (Read) | Tulis (Write) | Setujui (Approve) | Ekspor Data |
| :--- | :---: | :---: | :---: | :---: |
| **Super Admin** | ✓ | ✓ | ✓ | ✓ |
| **Branch Admin** | ✓ | ✓ | ✓ | ✕ |
| **Operator** | ✓ | ✓ | ✕ | ✕ |
| **Auditor** | ✓ | ✕ | ✕ | ✓ |

---

## 5. Kontrak Data & Spesifikasi API

### Format Respons Standar
\`\`\`json
{
  "success": true,
  "data": {
    "id": "usr_9921",
    "name": "Admin Utama",
    "status": "active"
  },
  "meta": {
    "correlation_id": "req_8812a",
    "timestamp": 1741500000
  }
}
\`\`\`

### Standar Header Permintaan
- \`X-Tenant-ID\`: Pengenal unik penyewa aktif
- \`X-Correlation-ID\`: Pelacak jejak permintaan terdistribusi
- \`Idempotency-Key\`: Penjamin eksekusi transaksi tunggal

---

## 6. Tata Kelola Data & Audit Trail

- Pencatatan seluruh mutasi kritis pada tabel \`audit_logs\` yang bersifat kekal (*immutable*).
- Penerapan penghapusan logis (*soft delete*) dengan kolom \`deleted_at\`.
- Enkripsi data sensitif (PII) menggunakan enkripsi tingkat kolom.
`;
}

export function extractHeadings(markdown: string): PrdHeading[] {
  const headings: PrdHeading[] = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const rawTitle = match[2].trim().replace(/[*_`]/g, '');
      const id = rawTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      headings.push({ id, title: rawTitle, level });
    }
  }

  return headings;
}

export function parsePrdMetadata(markdown: string, defaultTitle: string = 'Spesifikasi PRD'): PrdMetadata {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  const versionMatch = markdown.match(/Versi[:\s]+([\d.]+)/i);
  const domainMatch = markdown.match(/Domain[:\s]+([^\n|]+)/i);
  const targetMatch = markdown.match(/Target[:\s]+([^\n]+)/i);
  const slaMatch = markdown.match(/SLA[^:]*[:\s]+([^\n]+)/i);
  const latencyMatch = markdown.match(/Latensi[^:]*[:\s]+([^\n]+)/i);

  let status: PrdMetadata['status'] = 'draft';
  if (/Status[:\s]+Produksi/i.test(markdown)) status = 'production';
  else if (/Status[:\s]+Disetujui/i.test(markdown)) status = 'approved';
  else if (/Status[:\s]+Review/i.test(markdown)) status = 'in_review';

  return {
    title: titleMatch ? titleMatch[1].trim() : defaultTitle,
    version: versionMatch ? versionMatch[1].trim() : '1.0.0',
    status,
    domain: domainMatch ? domainMatch[1].trim() : 'Enterprise SaaS',
    targetDeployment: targetMatch ? targetMatch[1].trim() : 'Serverless on Vercel',
    sla: slaMatch ? slaMatch[1].trim() : '99.99%',
    latency: latencyMatch ? latencyMatch[1].trim() : '< 200ms',
  };
}

export function generateStandaloneHtml(title: string, renderedHtml: string, metadata: PrdMetadata): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    :root {
      --bg: #ffffff;
      --text: #0f172a;
      --muted: #64748b;
      --border: #e2e8f0;
      --card-bg: #f8fafc;
      --primary: #4f46e5;
      --primary-light: #eef2ff;
      --accent: #10b981;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #090d16;
        --text: #f1f5f9;
        --muted: #94a3b8;
        --border: #1e293b;
        --card-bg: #0f172a;
        --primary: #6366f1;
        --primary-light: #1e1b4b;
        --accent: #34d399;
      }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.65;
      background: var(--bg);
      color: var(--text);
      margin: 0;
      padding: 40px 20px;
    }
    .container {
      max-width: 860px;
      margin: 0 auto;
    }
    .header-card {
      padding: 24px;
      border-radius: 12px;
      background: var(--card-bg);
      border: 1px solid var(--border);
      margin-bottom: 32px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      background: var(--primary-light);
      color: var(--primary);
      margin-right: 8px;
    }
    h1, h2, h3 { color: var(--text); font-weight: 700; }
    h1 { font-size: 28px; margin-top: 0; }
    h2 { font-size: 20px; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-top: 36px; }
    h3 { font-size: 16px; margin-top: 24px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; }
    th, td { padding: 10px 14px; border: 1px solid var(--border); text-align: left; }
    th { background: var(--card-bg); font-weight: 600; }
    code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; background: var(--card-bg); padding: 2px 6px; border-radius: 4px; }
    pre { background: var(--card-bg); border: 1px solid var(--border); padding: 16px; border-radius: 8px; overflow-x: auto; font-size: 12px; }
    pre code { background: transparent; padding: 0; }
    blockquote { border-left: 3px solid var(--primary); margin: 16px 0; padding-left: 16px; color: var(--muted); }
    @media print {
      body { padding: 0; background: #fff; color: #000; }
      .header-card { border: 1px solid #ccc; background: #fafafa; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-card">
      <span class="badge">${metadata.status}</span>
      <span class="badge">v${metadata.version}</span>
      <span class="badge">${metadata.domain}</span>
      <p style="margin: 8px 0 0 0; font-size: 12px; color: var(--muted);">${metadata.targetDeployment}</p>
    </div>
    <div class="content">
      ${renderedHtml}
    </div>
  </div>
</body>
</html>`;
}
