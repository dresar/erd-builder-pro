export type PromptStrategy = 'all_in_one' | 'prd_only' | 'notes_to_erd' | 'notes_to_flowchart';

export interface PromptConfig {
  strategy?: PromptStrategy;
  projectName: string;
  domain: string;
  scale: 'large' | 'enterprise' | 'ecosystem';
  deploymentMethod?: string;
  customDeployment?: string;
  architectureStyle?: string;
  compliance: string[];
  techStack: string;
  notesRequirement?: string;
  existingNotesContext?: string;
  existingErdContext?: string;
}

export const STRATEGY_PRESETS = [
  {
    id: 'all_in_one' as PromptStrategy,
    label: 'All-in-One',
    badge: 'Rekomendasi',
    description: 'PRD komprehensif HTML views, 50+ tabel ERD DBML, dan Flowchart logika bisnis dalam 1 bundel JSON.',
  },
  {
    id: 'prd_only' as PromptStrategy,
    label: 'Catatan PRD',
    badge: 'Tahap 1',
    description: 'Dokumen PRD HTML views ribuan kata siap pakai untuk ditempel di modul PRD / Catatan.',
  },
  {
    id: 'notes_to_erd' as PromptStrategy,
    label: 'PRD → ERD',
    badge: 'Tahap 2',
    description: 'Sintesis catatan PRD menjadi skema relasional DBML minimal 50 tabel terstruktur.',
  },
  {
    id: 'notes_to_flowchart' as PromptStrategy,
    label: 'PRD → Alur',
    badge: 'Tahap 3',
    description: 'Sintesis PRD & ERD menjadi flowchart logika bisnis kaya simbol keputusan.',
  },
];

export const DOMAIN_PRESETS = [
  { id: 'saas', label: 'SaaS', description: 'Organisasi, keanggotaan, RBAC, billing, audit, webhook.' },
  { id: 'fintech', label: 'FinTech', description: 'Dompet digital, transaksi, double-entry ledger, KYC, fraud.' },
  { id: 'ecommerce', label: 'E-Commerce', description: 'Katalog, keranjang, pesanan, kurir, ulasan, komisi.' },
  { id: 'healthcare', label: 'Kesehatan', description: 'Pasien, dokter, janji temu, rekam medis, resep, asuransi.' },
  { id: 'erp', label: 'ERP', description: 'Inventaris, vendor, purchase order, gudang, faktur, aset.' },
  { id: 'custom', label: 'Kustom', description: 'Tentukan domain bisnis sendiri sesuai kebutuhan.' },
];

export const SCALE_PRESETS = [
  { id: 'large', label: '25+ Tabel', minTables: 25, description: 'Sistem core terpadu lengkap dengan relasi dan audit trail.' },
  { id: 'enterprise', label: '35+ Tabel', minTables: 35, description: 'Skala enterprise penuh mencakup billing, notifikasi, dan analitik.' },
  { id: 'ecosystem', label: '50+ Tabel', minTables: 50, description: 'Ekosistem besar multi-modul untuk skala korporasi.' },
];

function resolveInfrastructure(config: PromptConfig) {
  let resolvedDeployment = 'Serverless on Vercel (Recommended: Serverless Functions + Edge Runtime)';
  if (config.deploymentMethod === 'vps') resolvedDeployment = 'Self-Hosted Docker Container / VPS Linux';
  else if (config.deploymentMethod === 'cloudflare') resolvedDeployment = 'Cloudflare Pages & Cloudflare Workers';
  else if (config.deploymentMethod === 'aws') resolvedDeployment = 'AWS ECS / Lambda / RDS Enterprise Cloud';
  else if (config.deploymentMethod === 'other' && config.customDeployment) resolvedDeployment = config.customDeployment;
  else if (config.deploymentMethod === 'ai_choice') resolvedDeployment = 'Serverless on Vercel (Auto-selected: Serverless with Edge API for Website)';

  let resolvedArch = 'Modular Monolith with Clean Architecture & Domain Boundaries';
  if (config.architectureStyle === 'microservices') resolvedArch = 'Microservices & Event-Driven Architecture';
  else if (config.architectureStyle === 'serverless_edge') resolvedArch = 'Serverless API & Edge Backend Architecture';
  else if (config.architectureStyle === 'ai_choice') resolvedArch = 'Serverless Modular Architecture on Vercel';

  const minTables = config.scale === 'ecosystem' ? 50 : config.scale === 'enterprise' ? 35 : 25;
  const complianceList = config.compliance.length > 0 ? config.compliance.join(', ') : 'Audit Trail, RBAC, Soft Deletes, Multi-Tenant Data Isolation';

  return { resolvedDeployment, resolvedArch, minTables, complianceList };
}

export function generateAllInOnePrompt(config: PromptConfig): string {
  const { resolvedDeployment, resolvedArch, minTables, complianceList } = resolveInfrastructure(config);
  const proj = config.projectName?.trim() || 'Proyek';

  const contextSection = config.existingNotesContext?.trim()
    ? `\n\n=== EXISTING PRD / NOTES CONTEXT ===\nYou MUST base the entire architecture, domain modules, and database schema directly on this existing PRD specification:\n"""\n${config.existingNotesContext.trim()}\n"""\n`
    : '';

  return `PROJECT NAME: "${proj}"
BUSINESS DOMAIN: ${config.domain}
DEPLOYMENT TARGET: ${resolvedDeployment}
ARCHITECTURE STYLE: ${resolvedArch}
TECH STACK TARGET: ${config.techStack || 'Serverless on Vercel + Supabase PostgreSQL + Edge Functions'}
SECURITY & COMPLIANCE: ${complianceList}${contextSection}

ROLE & OBJECTIVE:
You are a Senior Principal Software & Database Architect.
Your task is to design a COMPLETE, PRODUCTION-GRADE, ENTERPRISE-LEVEL SYSTEM SPECIFICATION for the project above.

CRITICAL RULES — DO NOT VIOLATE:
1. NO TOY OR SIMPLIFIED SCHEMAS: You MUST produce an exhaustive, real-world enterprise database schema with AT LEAST ${minTables} TABLES in valid DBML. Do not group multiple tables into one generic table. Break down the system into realistic, normalized relational modules.
2. PRD AS COMPREHENSIVE RICH HTML VIEWS: The PRD in "content_markdown" MUST NOT be a plain markdown README or generic text. It MUST be an exhaustive, enterprise-grade specification rendered as RICH, COLORFUL, THEME-AWARE HTML VIEWS using component-style <div> containers with Tailwind CSS classes.
   - DO NOT START WITH <!DOCTYPE html>, <html>, <head>, or <body>! Start directly with root <div> elements (e.g. <div class="space-y-8">...</div>).
   - Use theme-responsive Tailwind utility classes (bg-card, border-border, text-foreground, text-muted-foreground, bg-indigo-500/10, text-indigo-400, bg-emerald-500/10, text-emerald-400, bg-amber-500/10, text-amber-400, bg-rose-500/10, text-rose-400, border, rounded-xl, shadow-sm, p-4/p-6).
   - Include rich visual components: metric/KPI cards in grid (grid grid-cols-1 md:grid-cols-3 gap-4), infrastructure topology cards, domain module cards with colored status pills and invariants, styled RBAC matrix table with colored badges, API contracts, and SLA cards.
   - Target depth: 2,500–4,000 words in formal Indonesian (Bahasa Indonesia baku kelas enterprise).
3. HOSTING & DEPLOYMENT: The application architecture must be optimized for ${resolvedDeployment}.
4. FLOWCHART MUST BE DECISION-RICH: The flowchart must contain decision logic diamonds for validations, auth checks, status transitions, and error paths. Include at least 15–25 connected nodes.
5. STRICT JSON OUTPUT CONTRACT: You must respond ONLY with a single valid JSON object enclosed within \`\`\`json ... \`\`\` code fence. No conversational filler before or after the JSON.

REQUIRED JSON STRUCTURE:
\`\`\`json
{
  "project": {
    "name": "${proj}",
    "description": "Short executive summary of the system architecture."
  },
  "prd": {
    "title": "Dokumen Spesifikasi Produk & Arsitektur (PRD)",
    "content_markdown": "> **Proyek**: ${proj}\\n> **Domain**: ${config.domain}\\n> **Target Deployment**: ${resolvedDeployment}\\n> **Status**: Produksi\\n> **Versi**: 1.0.0\\n\\n<div class=\\"space-y-8\\">\\n  <div class=\\"grid grid-cols-1 md:grid-cols-3 gap-4\\">\\n    <div class=\\"p-5 rounded-xl border border-indigo-500/30 bg-indigo-500/5\\"><span class=\\"text-xs font-bold text-indigo-400 uppercase\\">Target SLA</span><p class=\\"text-2xl font-extrabold text-foreground mt-1\\">99.99%</p><p class=\\"text-xs text-muted-foreground mt-1\\">High Availability</p></div>\\n    <div class=\\"p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5\\"><span class=\\"text-xs font-bold text-emerald-400 uppercase\\">Latensi P95</span><p class=\\"text-2xl font-extrabold text-foreground mt-1\\">&lt; 150ms</p><p class=\\"text-xs text-muted-foreground mt-1\\">Edge Serverless</p></div>\\n    <div class=\\"p-5 rounded-xl border border-amber-500/30 bg-amber-500/5\\"><span class=\\"text-xs font-bold text-amber-400 uppercase\\">Compliance</span><p class=\\"text-2xl font-extrabold text-foreground mt-1\\">Enterprise</p><p class=\\"text-xs text-muted-foreground mt-1\\">RBAC &amp; Audit Trail</p></div>\\n  </div>\\n\\n  <div class=\\"rounded-xl border border-border bg-card p-6 space-y-4\\">\\n    <h2 class=\\"text-xl font-bold text-foreground\\">1. Ringkasan Eksekutif &amp; Sasaran Strategis</h2>\\n    <p class=\\"text-sm text-muted-foreground leading-relaxed\\">[Uraikan problem statement mendalam, value proposition, dan sasaran strategis bisnis]</p>\\n  </div>\\n  <div class=\\"rounded-xl border border-border bg-card p-6 space-y-4\\">\\n    <h2 class=\\"text-xl font-bold text-foreground\\">2. Arsitektur Solusi &amp; Topologi Infrastruktur</h2>\\n    <div class=\\"grid grid-cols-1 md:grid-cols-2 gap-4 pt-2\\">\\n      <div class=\\"p-4 rounded-lg border border-border/60 bg-muted/10\\"><h3 class=\\"font-semibold text-foreground text-sm\\">Runtime &amp; Hosting</h3><p class=\\"text-xs text-muted-foreground mt-1\\">${resolvedDeployment}</p></div>\\n      <div class=\\"p-4 rounded-lg border border-border/60 bg-muted/10\\"><h3 class=\\"font-semibold text-foreground text-sm\\">Database Layer</h3><p class=\\"text-xs text-muted-foreground mt-1\\">PostgreSQL dengan Connection Pooling</p></div>\\n    </div>\\n  </div>\\n  <div class=\\"rounded-xl border border-border bg-card p-6 space-y-4\\">\\n    <h2 class=\\"text-xl font-bold text-foreground\\">3. Dekomposisi Modul Domain Bisnis (DDD)</h2>\\n    <p class=\\"text-xs text-muted-foreground\\">[Uraikan minimal 8 modul fungsional dalam card grid responsif]</p>\\n  </div>\\n  <div class=\\"rounded-xl border border-border bg-card p-6 space-y-4\\">\\n    <h2 class=\\"text-xl font-bold text-foreground\\">4. Matriks Akses &amp; Keamanan (RBAC)</h2>\\n    <p class=\\"text-xs text-muted-foreground\\">[Tabel peran vs izin bergaya modern dengan badge status]</p>\\n  </div>\\n  <div class=\\"rounded-xl border border-border bg-card p-6 space-y-4\\">\\n    <h2 class=\\"text-xl font-bold text-foreground\\">5. Kontrak Data &amp; Spesifikasi API</h2>\\n    <p class=\\"text-xs text-muted-foreground\\">[Envelope response, headers, idempotency]</p>\\n  </div>\\n  <div class=\\"rounded-xl border border-border bg-card p-6 space-y-4\\">\\n    <h2 class=\\"text-xl font-bold text-foreground\\">6. Persyaratan Non-Fungsional &amp; SLA</h2>\\n    <p class=\\"text-xs text-muted-foreground\\">[Latency, availability, RPO/RTO]</p>\\n  </div>\\n</div>"
  },
  "erd": {
    "title": "Skema Database Enterprise (${minTables}+ Tabel)",
    "dbml": "// Tuliskan minimal ${minTables} tabel relasional terstruktur lengkap dengan Enum, Indexes, dan Ref standalone\\n\\nTable tenants {\\n  id UUID [pk, default: \`gen_random_uuid()\`]\\n  name VARCHAR(255) [not null]\\n  slug VARCHAR(100) [not null, unique]\\n  status tenants_status [not null, default: 'active']\\n  created_at TIMESTAMP [not null, default: \`now()\`]\\n  updated_at TIMESTAMP [not null, default: \`now()\`]\\n  deleted_at TIMESTAMP\\n  Indexes {\\n    slug [unique]\\n  }\\n}\\n// ... lanjutkan hingga minimal ${minTables} tabel ..."
  },
  "flowchart": {
    "title": "Alur Logika Inti & Bisnis",
    "nodes": [
      { "label": "Mulai: Permintaan Klien", "shape": "oval", "color": "#10b981" },
      { "label": "Verifikasi JWT & Tenant Header", "shape": "rectangle", "color": "#8b5cf6" },
      { "label": "Token & Tenant Valid?", "shape": "diamond", "color": "#f59e0b" },
      { "label": "Tolak: 401 Unauthorized", "shape": "rectangle", "color": "#f43f5e" },
      { "label": "Cek Izin Hak Akses (RBAC)", "shape": "diamond", "color": "#f59e0b" },
      { "label": "Tolak: 403 Forbidden", "shape": "rectangle", "color": "#f43f5e" },
      { "label": "Validasi Skema Input & Bisnis", "shape": "rectangle", "color": "#8b5cf6" },
      { "label": "Data Input Valid?", "shape": "diamond", "color": "#f59e0b" },
      { "label": "Tolak: 422 Unprocessable Entity", "shape": "rectangle", "color": "#f43f5e" },
      { "label": "Buka Transaksi Database PostgreSQL", "shape": "database", "color": "#0ea5e9" },
      { "label": "Eksekusi Mutasi Bisnis Inti", "shape": "rectangle", "color": "#8b5cf6" },
      { "label": "Simpan Catatan Audit Log", "shape": "database", "color": "#0ea5e9" },
      { "label": "Kirim Event Antrean Asinkron", "shape": "cloud", "color": "#8b5cf6" },
      { "label": "Commit Transaksi Database", "shape": "database", "color": "#0ea5e9" },
      { "label": "Kirim Respon 200 OK ke Klien", "shape": "rectangle", "color": "#10b981" },
      { "label": "Selesai", "shape": "oval", "color": "#10b981" }
    ],
    "edges": [
      { "sourceLabel": "Mulai: Permintaan Klien", "targetLabel": "Verifikasi JWT & Tenant Header" },
      { "sourceLabel": "Verifikasi JWT & Tenant Header", "targetLabel": "Token & Tenant Valid?" },
      { "sourceLabel": "Token & Tenant Valid?", "targetLabel": "Cek Izin Hak Akses (RBAC)", "label": "Ya (Valid)" },
      { "sourceLabel": "Token & Tenant Valid?", "targetLabel": "Tolak: 401 Unauthorized", "label": "Tidak Valid" },
      { "sourceLabel": "Cek Izin Hak Akses (RBAC)", "targetLabel": "Validasi Skema Input & Bisnis", "label": "Diizinkan" },
      { "sourceLabel": "Cek Izin Hak Akses (RBAC)", "targetLabel": "Tolak: 403 Forbidden", "label": "Ditolak" },
      { "sourceLabel": "Validasi Skema Input & Bisnis", "targetLabel": "Data Input Valid?" },
      { "sourceLabel": "Data Input Valid?", "targetLabel": "Buka Transaksi Database PostgreSQL", "label": "Lolos Validasi" },
      { "sourceLabel": "Data Input Valid?", "targetLabel": "Tolak: 422 Unprocessable Entity", "label": "Format Salah" },
      { "sourceLabel": "Buka Transaksi Database PostgreSQL", "targetLabel": "Eksekusi Mutasi Bisnis Inti" },
      { "sourceLabel": "Eksekusi Mutasi Bisnis Inti", "targetLabel": "Simpan Catatan Audit Log" },
      { "sourceLabel": "Simpan Catatan Audit Log", "targetLabel": "Kirim Event Antrean Asinkron" },
      { "sourceLabel": "Kirim Event Antrean Asinkron", "targetLabel": "Commit Transaksi Database" },
      { "sourceLabel": "Commit Transaksi Database", "targetLabel": "Kirim Respon 200 OK ke Klien" },
      { "sourceLabel": "Kirim Respon 200 OK ke Klien", "targetLabel": "Selesai" }
    ]
  }
}
\`\`\`

DETAILED DBML SPECIFICATION RULES:
1. Minimum ${minTables} Tables covering Tenancy, IAM, Audit, Domain Specific (${config.domain}), Workflows, Notifications, Storage, and System Settings.
2. Column Types: Uppercase portable SQL types: BIGINT, UUID, VARCHAR(length), TEXT, BOOLEAN, DATE, TIMESTAMP, DECIMAL(p,s), JSONB. Every VARCHAR must have explicit length.
3. Audit Columns on EVERY Table: created_at TIMESTAMP [not null], updated_at TIMESTAMP [not null], deleted_at TIMESTAMP.
4. Enums (STRICT RULE): Every Enum MUST be named exactly {table_name}_{column_name} (e.g. users_status, students_gender). NEVER use generic names like "user_status_enum", "gender_enum", or "status_enum". NEVER share an enum between tables: if two tables have a gender column, define separate enums: Enum students_gender and Enum registrants_gender.
5. Relationships: Explicit standalone Ref: child.parent_id > parent.id.
6. Indexes: Include Indexes { ... } blocks inside tables.

Now generate the complete JSON package. Ensure the JSON is completely valid, parseable, and matches all constraints.`;
}

export function generatePrdOnlyPrompt(config: PromptConfig): string {
  const { resolvedDeployment, resolvedArch, complianceList } = resolveInfrastructure(config);
  const proj = config.projectName?.trim() || 'Proyek';

  return `NAMA PROYEK: "${proj}"
DOMAIN BISNIS: ${config.domain}
TARGET INFRASTRUKTUR: ${resolvedDeployment}
GAYA ARSITEKTUR: ${resolvedArch}
TECH STACK: ${config.techStack || 'Serverless on Vercel + Supabase PostgreSQL + Edge Functions'}
KEAMANAN & KEPATUHAN: ${complianceList}

TUGAS ARSITEK:
Bertindaklah sebagai Senior Principal Solutions & Enterprise Software Architect.
Susun DOKUMEN PERSYARATAN PRODUK (PRD) & ARSITEKTUR SISTEM LENGKAP untuk proyek di atas.

ATURAN PENULISAN:
1. JANGAN GUNAKAN FORMAT README MARKDOWN BIASA! Format dokumen WAJIB menggunakan RICH HTML VIEWS menggunakan elemen <div> berdesain modern, responsif, dan penuh warna dengan utilitas Tailwind CSS.
2. DILARANG KERAS menggunakan awalan <!DOCTYPE html>, <html>, <head>, atau <body>! Awali langsung dengan kontainer <div> (contoh: <div class="space-y-8">...</div>).
3. Gunakan kelas tema responsif (bg-card, border-border, text-foreground, text-muted-foreground, aksen warna emerald, indigo, amber, violet, rose, dan grid responsif).
4. Tuliskan dalam Bahasa Indonesia formal kelas enterprise, terstruktur, mendalam, dan komprehensif (target: 2.500–4.000 kata) mencakup minimal 8–10 modul domain bisnis, matriks RBAC, kontrak API, dan SLA.

STRUKTUR DOKUMEN HTML VIEWS YANG WAJIB DIIKUTI:
> **Proyek**: ${proj}
> **Domain Bisnis**: ${config.domain}
> **Target Deployment**: ${resolvedDeployment}
> **Status**: Produksi
> **Versi**: 1.0.0

<div class="space-y-8">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div class="p-5 rounded-xl border border-indigo-500/30 bg-indigo-500/5">
      <span class="text-xs font-bold text-indigo-400 uppercase">Target SLA</span>
      <p class="text-2xl font-extrabold text-foreground mt-1">99.99%</p>
      <p class="text-xs text-muted-foreground mt-1">High Availability</p>
    </div>
    <div class="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
      <span class="text-xs font-bold text-emerald-400 uppercase">Latensi P95</span>
      <p class="text-2xl font-extrabold text-foreground mt-1">&lt; 150ms</p>
      <p class="text-xs text-muted-foreground mt-1">Edge Serverless</p>
    </div>
    <div class="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5">
      <span class="text-xs font-bold text-amber-400 uppercase">Keamanan</span>
      <p class="text-2xl font-extrabold text-foreground mt-1">Enterprise</p>
      <p class="text-xs text-muted-foreground mt-1">RBAC, RLS &amp; Audit</p>
    </div>
  </div>

  <div class="rounded-xl border border-border bg-card p-6 space-y-4">
    <h2 class="text-xl font-bold text-foreground">1. Ringkasan Eksekutif &amp; Sasaran Strategis</h2>
    <p class="text-sm text-muted-foreground leading-relaxed">
      Uraikan problem statement mendalam, arsitektur solusi, value proposition, dan sasaran strategis bisnis.
    </p>
  </div>

  <div class="rounded-xl border border-border bg-card p-6 space-y-4">
    <h2 class="text-xl font-bold text-foreground">2. Topologi Solusi &amp; Infrastruktur</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
      <div class="p-4 rounded-lg border border-border/60 bg-muted/10">
        <h3 class="font-semibold text-foreground text-sm">Runtime &amp; Hosting</h3>
        <p class="text-xs text-muted-foreground mt-1">${resolvedDeployment}</p>
      </div>
      <div class="p-4 rounded-lg border border-border/60 bg-muted/10">
        <h3 class="font-semibold text-foreground text-sm">Basis Data</h3>
        <p class="text-xs text-muted-foreground mt-1">PostgreSQL dengan Connection Pooling</p>
      </div>
    </div>
  </div>

  <div class="rounded-xl border border-border bg-card p-6 space-y-6">
    <h2 class="text-xl font-bold text-foreground">3. Dekomposisi Modul Domain Bisnis (DDD)</h2>
    <p class="text-xs text-muted-foreground">Uraikan minimal 8-10 modul fungsional dalam card grid responsif.</p>
  </div>

  <div class="rounded-xl border border-border bg-card p-6 space-y-4">
    <h2 class="text-xl font-bold text-foreground">4. Matriks Akses &amp; Keamanan (RBAC)</h2>
    <p class="text-xs text-muted-foreground">Tabel peran vs izin bergaya modern dengan badge status warna.</p>
  </div>

  <div class="rounded-xl border border-border bg-card p-6 space-y-4">
    <h2 class="text-xl font-bold text-foreground">5. Kontrak Data &amp; Spesifikasi Integrasi API</h2>
    <p class="text-xs text-muted-foreground">Standar envelope response, konvensi header, dan idempotency.</p>
  </div>

  <div class="rounded-xl border border-border bg-card p-6 space-y-4">
    <h2 class="text-xl font-bold text-foreground">6. Persyaratan Non-Fungsional &amp; SLA</h2>
    <p class="text-xs text-muted-foreground">Target latensi, ketersediaan, pemulihan bencana RPO/RTO.</p>
  </div>
</div>

Mulai susun dokumen PRD HTML views lengkap sekarang.`;
}

export function generateNotesToErdPrompt(config: PromptConfig, notesText?: string): string {
  const { minTables } = resolveInfrastructure(config);
  const proj = config.projectName?.trim() || 'Proyek';
  const prdContent = notesText?.trim() || config.existingNotesContext?.trim() || '<<<TEMPELKAN_TEKS_PRD_DARI_CATATAN_DI_SINI>>>';

  return `PROJECT: "${proj}"
DOMAIN: ${config.domain}
TARGET: Relational Database Schema in DBML (Minimal ${minTables} Tables)

ROLE:
You are a Principal Database Architect for ERD Builder Pro.
Analyze EVERY module, entity, relationship, and business rule in the PRD below, and convert them into an exhaustive, production-ready relational database schema in DBML format with AT LEAST ${minTables} TABLES.

CRITICAL RULES:
1. Output ONLY a valid \`\`\`dbml ... \`\`\` code block. No explanations before or after.
2. Minimum ${minTables} relational tables covering all modules described in the PRD.
3. Every table MUST have: created_at TIMESTAMP [not null], updated_at TIMESTAMP [not null], deleted_at TIMESTAMP.
4. Standard portable uppercase types: BIGINT, UUID, VARCHAR(length), TEXT, BOOLEAN, DATE, TIMESTAMP, DECIMAL(p,s), JSONB. Every VARCHAR must have explicit length.
5. All relationships must be standalone Ref: child_table.fk_id > parent_table.id.
6. Enums (STRICT): Every Enum MUST be named {table_name}_{column_name} (e.g. users_status, students_gender). Never use generic names like "user_status_enum" or "gender_enum". Never share enums between tables.
7. Include Indexes { ... } for all foreign keys and search lookups.

=== DOKUMEN PRD / CATATAN SISTEM ===
${prdContent}`;
}

export function generateNotesToFlowchartPrompt(config: PromptConfig, notesText?: string, erdText?: string): string {
  const proj = config.projectName?.trim() || 'Proyek';
  const prdContent = notesText?.trim() || config.existingNotesContext?.trim() || '<<<TEMPELKAN_RINGKASAN_PRD_DI_SINI>>>';
  const erdContent = erdText?.trim() || config.existingErdContext?.trim() || '<<<TEMPELKAN_DAFTAR_TABEL_ERD_DI_SINI>>>';

  return `PROJECT: "${proj}"
DOMAIN: ${config.domain}
TARGET: Decision-Rich Business Logic Flowchart JSON

ROLE:
You are a Principal Systems & Workflow Architect for ERD Builder Pro.
Based on the PRD specification and Database Entities provided below, design a DECISION-RICH, END-TO-END BUSINESS LOGIC FLOWCHART.

RULES:
1. Output ONLY a valid JSON object inside a \`\`\`json ... \`\`\` code fence matching this exact format:
   {
     "nodes": [
       { "id": "1", "label": "Text", "shape": "oval|rectangle|diamond|database|cloud|document", "color": "#hex" }
     ],
     "edges": [
       { "sourceLabel": "Source Node Label", "targetLabel": "Target Node Label", "label": "Optional Branch Label" }
     ]
   }
2. Include at least 20–25 nodes.
3. MANDATORY DECISION DIAMONDS ("shape": "diamond", "color": "#f59e0b") for auth check, validation, tenant check, stock/quota check, and error rollbacks.
4. Every decision branch MUST have explicit edge labels ("Lolos", "Gagal", "Valid", "Ditolak", dll).
5. Colors: Emerald (#10b981) for Start/Success, Amber (#f59e0b) for Decisions, Violet (#8b5cf6) for Process/API, Sky (#0ea5e9) for Database/Storage, Rose (#f43f5e) for Errors/Rejections.

=== DOKUMEN PRD / CATATAN SISTEM ===
${prdContent}

=== DAFTAR ENTITAS DATABASE / ERD ===
${erdContent}`;
}

export function generateExternalAIPrompt(config: PromptConfig): string {
  switch (config.strategy) {
    case 'prd_only':
      return generatePrdOnlyPrompt(config);
    case 'notes_to_erd':
      return generateNotesToErdPrompt(config, config.existingNotesContext);
    case 'notes_to_flowchart':
      return generateNotesToFlowchartPrompt(config, config.existingNotesContext, config.existingErdContext);
    case 'all_in_one':
    default:
      return generateAllInOnePrompt(config);
  }
}
