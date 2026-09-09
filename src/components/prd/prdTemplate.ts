export interface PrdHeading {
  id: string;
  title: string;
  level: number;
}

export interface PrdMetadata {
  title: string;
  projectName: string;
  version: string;
  status: 'draft' | 'in_review' | 'approved' | 'production';
  domain: string;
  targetDeployment: string;
  sla: string;
  latency: string;
  security: string;
  architecture: string;
}

function isCleanMetric(str: string): boolean {
  if (!str) return false;
  if (/[<>/]|class=|div/i.test(str)) return false;
  if (str.length > 60) return false;
  return true;
}

function cleanVal(str: string): string {
  if (!str) return '';
  const noHtml = str.replace(/<[^>]+>/g, ' ').replace(/&[a-z0-9#]+;/gi, ' ');
  return noHtml
    .replace(/^[*_`\s:>-]+/, '')
    .replace(/[*_`\s]+$/, '')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getDefaultPrdTemplate(
  projectName: string = 'Sistem Enterprise',
  domain: string = 'SaaS Multi-Tenant',
  target: string = 'Serverless / Cloud Native',
  architecture: string = 'Modular Monolith with Clean Architecture',
  security: string = 'RBAC, Audit Trail & Data Isolation'
): string {
  const cleanName = projectName.replace(/^\[PRD\]\s*/, '') || 'Sistem Enterprise';
  return `# SPESIFIKASI PERSYARATAN PRODUK & ARSITEKTUR (PRD)

> **Proyek**: ${cleanName}  
> **Versi**: 1.0.0 | **Status**: Draft | **Domain**: ${domain}  
> **Target**: ${target}  
> **Arsitektur**: ${architecture}  
> **Keamanan**: ${security}

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

- **Komputasi & Runtime**: ${target}
- **Pola Arsitektur**: ${architecture}
- **Standar Keamanan**: ${security}
- **Basis Data**: Database Relasional Terdistribusi dengan Connection Pooling
- **Cache & Rate Limiting**: Redis Caching
- **Penyimpanan Aset**: Cloud Object Storage Terenkripsi

---

## 3. Dekomposisi Modul Domain (DDD)

### 3.1 Modul Identitas, Akses & Multi-Tenancy
- **Entitas Kunci**: \`tenants\`, \`users\`, \`roles\`, \`permissions\`
- **Aturan Bisnis**: Setiap transaksi data wajib mencantumkan \`tenant_id\` untuk penegakan Row-Level Security.
- **State Transisi**: \`Pending\` ➔ \`Active\` ➔ \`Suspended\` ➔ \`Archived\`

### 3.2 Modul Bisnis Inti & Transaksi
- **Entitas Kunci**: Entitas spesifik domain ${domain}
- **Aturan Bisnis**: Mutasi data keuangan dan operasional wajib dicatat dalam transaksi atomik database.

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
    "id": "res_9921",
    "name": "Data Entitas",
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

  const htmlRegex = /<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi;
  let htmlMatch;
  const htmlFound: PrdHeading[] = [];
  while ((htmlMatch = htmlRegex.exec(markdown)) !== null) {
    const level = parseInt(htmlMatch[1], 10);
    const rawInner = htmlMatch[2].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
    if (rawInner) {
      const id = rawInner.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      htmlFound.push({ id, title: rawInner, level });
    }
  }

  if (htmlFound.length > 0) {
    return htmlFound;
  }

  const lines = markdown.split('\n');
  let isFirstH1 = true;
  for (const line of lines) {
    const matchMd = line.match(/^(#{1,3})\s+(.+)$/);
    if (matchMd) {
      const level = matchMd[1].length;
      const rawTitle = cleanVal(matchMd[2]);
      const id = rawTitle.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      if (level === 1 && isFirstH1 && !/^\d+\./.test(rawTitle)) {
        isFirstH1 = false;
        continue;
      }
      isFirstH1 = false;
      headings.push({ id, title: rawTitle, level });
    }
  }

  return headings;
}

export function parsePrdMetadata(markdown: string, defaultTitle: string = 'Spesifikasi PRD'): PrdMetadata {
  const cleanTitle = defaultTitle.replace(/^\[PRD\]\s*/, '');
  
  const projMatch = markdown.match(/(?:[>“"*\s]*Proyek\*{0,2}[:\s]+|Project(?:\s+Name)?[:\s]+["']?)([^"'\n|”]+)/i);
  const projectName = projMatch ? cleanVal(projMatch[1]) : cleanTitle;

  const titleMatch = markdown.match(/^#\s+([^\n]+)$/m);
  const title = titleMatch ? cleanVal(titleMatch[1]) : cleanTitle;

  const versionMatch = markdown.match(/(?:Versi|Version)[^:\n|]*[:\s]+([vV]?[\d.]+[\w-]*)/i);
  const version = versionMatch ? cleanVal(versionMatch[1]).replace(/^[vV]/, '') : '1.0.0';

  const domainMatch = markdown.match(/(?:Domain(?:\s+Bisnis)?)[^:\n|]*[:\s]+([^\n|”"]+)/i);
  const domain = domainMatch ? cleanVal(domainMatch[1]) : 'Enterprise SaaS';

  const targetMatch = markdown.match(/(?:[>“"*\s]*Target(?:\s+Deployment)?\*{0,2}[:\s]+|Deployment Target[:\s]+|Topologi[:\s]+)([^\n|”"]+)/i);
  const targetDeployment = targetMatch ? cleanVal(targetMatch[1]) : 'Serverless / Cloud';

  let sla = '';
  const htmlSlaMatch = markdown.match(/Target SLA<\/span>\s*<p[^>]*>([^<]+)<\/p>/i);
  if (htmlSlaMatch && isCleanMetric(cleanVal(htmlSlaMatch[1]))) {
    sla = cleanVal(htmlSlaMatch[1]);
  } else {
    const slaMatch = markdown.match(/(?:Target Ketersediaan|Ketersediaan \(SLA\)|Target SLA|SLA)[^:\n<]*[:\s]+([^\n|”"<]+)/i);
    if (slaMatch && isCleanMetric(cleanVal(slaMatch[1]))) {
      sla = cleanVal(slaMatch[1]);
    }
  }
  if (!sla) sla = '99.99%';

  let latency = '';
  const htmlLatMatch = markdown.match(/Latensi P95<\/span>\s*<p[^>]*>([^<]+)<\/p>/i);
  if (htmlLatMatch && isCleanMetric(cleanVal(htmlLatMatch[1]))) {
    latency = cleanVal(htmlLatMatch[1]);
  } else {
    const latencyMatch = markdown.match(/(?:Latensi Respon|Latensi P95|Latensi|Latency \(P95\)|P95)[^:\n<]*[:\s]+([^\n|”"<]+)/i);
    if (latencyMatch && isCleanMetric(cleanVal(latencyMatch[1]))) {
      latency = cleanVal(latencyMatch[1]);
    }
  }
  if (!latency) latency = '< 200ms';

  let security = '';
  const htmlSecMatch = markdown.match(/(?:Compliance|Keamanan)<\/span>\s*<p[^>]*>([^<]+)<\/p>/i);
  if (htmlSecMatch && isCleanMetric(cleanVal(htmlSecMatch[1]))) {
    security = cleanVal(htmlSecMatch[1]);
  } else {
    const secMatch = markdown.match(/(?:Security & Compliance|Keamanan & Kepatuhan|Keamanan|Compliance|RBAC)[^:\n<]*[:\s]+([^\n|”"<]+)/i);
    if (secMatch && isCleanMetric(cleanVal(secMatch[1]))) {
      security = cleanVal(secMatch[1]);
    }
  }
  if (!security) {
    if (/RBAC/i.test(markdown)) security = 'RBAC & Audit';
    else if (/Audit/i.test(markdown)) security = 'Audit Trail';
    else security = 'Enterprise Grade';
  }

  let architecture = '';
  const htmlArchMatch = markdown.match(/(?:Arsitektur|Architecture)<\/span>\s*<p[^>]*>([^<]+)<\/p>/i);
  if (htmlArchMatch && isCleanMetric(cleanVal(htmlArchMatch[1]))) {
    architecture = cleanVal(htmlArchMatch[1]);
  } else {
    const archMatch = markdown.match(/(?:Architecture Style|Pola Arsitektur|Gaya Arsitektur|Arsitektur)[^:\n<]*[:\s]+([^\n|”"<]+)/i);
    if (archMatch && isCleanMetric(cleanVal(archMatch[1]))) {
      architecture = cleanVal(archMatch[1]);
    }
  }
  if (!architecture) {
    if (/Serverless/i.test(markdown)) architecture = 'Serverless Edge';
    else if (/Microservices/i.test(markdown)) architecture = 'Microservices';
    else if (/Monolith/i.test(markdown)) architecture = 'Modular Monolith';
    else architecture = 'Clean Architecture';
  }

  let status: PrdMetadata['status'] = 'draft';
  if (/Status[:\s]+Produksi/i.test(markdown)) status = 'production';
  else if (/Status[:\s]+Disetujui/i.test(markdown)) status = 'approved';
  else if (/Status[:\s]+Review/i.test(markdown)) status = 'in_review';

  return {
    title,
    projectName,
    version,
    status,
    domain,
    targetDeployment,
    sla,
    latency,
    security,
    architecture,
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
