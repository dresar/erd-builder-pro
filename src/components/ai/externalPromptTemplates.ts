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
  websiteDescription?: string;
  includedModules?: string[];
}

export interface ModuleOption {
  id: string;
  label: string;
  badge: string;
  desc: string;
}

export const AVAILABLE_MODULES: ModuleOption[] = [
  { id: 'prd', label: 'PRD', badge: 'Dokumen', desc: 'Spesifikasi produk & arsitektur HTML views' },
  { id: 'erd', label: 'ERD', badge: 'DBML', desc: 'Skema database relasional 25-50+ tabel' },
  { id: 'flowchart', label: 'Alur', badge: 'Logika', desc: 'Flowchart logika bisnis & state transisi' },
  { id: 'api', label: 'API', badge: 'Endpoints', desc: 'Kontrak REST API CRUD & alur sistem' },
];

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

  const websiteSection = config.websiteDescription?.trim()
    ? `\n\n=== WEBSITE / SYSTEM CONCEPT & SPECIFICATION ===\nKonsep & Penjelasan Website Kustom:\n"""\n${config.websiteDescription.trim()}\n"""\nPastikan seluruh modul domain, tabel database, alur kerja, dan API endpoints dirancang spesifik untuk mewujudkan deskripsi website di atas.\n`
    : '';

  const modules = config.includedModules && config.includedModules.length > 0 
    ? config.includedModules 
    : ['prd', 'erd', 'flowchart', 'api'];
  const hasPrd = modules.includes('prd');
  const hasErd = modules.includes('erd');
  const hasFlowchart = modules.includes('flowchart');
  const hasApi = modules.includes('api');

  const jsonBlocks: string[] = [
    `  "project": {\n    "name": "${proj}",\n    "description": "Short executive summary of the system architecture."\n  }`
  ];

  if (hasPrd) {
    jsonBlocks.push(`  "prd": {\n    "title": "Dokumen Spesifikasi Produk & Arsitektur (PRD)",\n    "content_markdown": "# SPESIFIKASI PERSYARATAN PRODUK & ARSITEKTUR (PRD)\\n\\n> **Proyek**: ${proj}\\n> **Domain Bisnis**: ${config.domain}\\n> **Target Deployment**: ${resolvedDeployment}\\n> **Gaya Arsitektur**: ${resolvedArch}\\n> **Target Ketersediaan (SLA)**: 99.99% Uptime\\n> **Latensi Respon (P95)**: < 150ms\\n> **Keamanan & Kepatuhan**: ${complianceList}\\n> **Status**: Produksi | **Versi**: 1.0.0\\n\\n---\\n\\n## 1. Ringkasan Eksekutif & Sasaran Bisnis\\n\\n[Uraikan problem statement mendalam, arsitektur solusi, value proposition, dan sasaran strategis bisnis]\\n\\n### Metrik Kinerja Utama\\n- **Target Ketersediaan (SLA)**: 99.99% Uptime\\n- **Latensi Respon (P95)**: < 150ms\\n- **Keamanan**: ${complianceList}\\n- **Pola Arsitektur**: ${resolvedArch}\\n\\n---\\n\\n## 2. Topologi Solusi & Infrastruktur\\n\\n- **Runtime & Hosting**: ${resolvedDeployment}\\n- **Database Layer**: PostgreSQL dengan Connection Pooling & High Availability\\n- **Cache & Message Broker**: Redis Caching & Event Bus\\n\\n---\\n\\n## 3. Dekomposisi Modul Domain Bisnis (DDD)\\n\\n[Uraikan minimal 8 modul domain fungsional lengkap dengan entitas kunci, invariant aturan bisnis, dan relasi]\\n\\n---\\n\\n## 4. Matriks Akses & Keamanan (RBAC)\\n\\n| Peran (Role) | Baca (Read) | Tulis (Write) | Setujui (Approve) | Ekspor Data |\\n| :--- | :---: | :---: | :---: | :---: |\\n| **Super Admin** | ✓ | ✓ | ✓ | ✓ |\\n| **Manager** | ✓ | ✓ | ✓ | ✕ |\\n| **Operator** | ✓ | ✓ | ✕ | ✕ |\\n| **Auditor** | ✓ | ✕ | ✕ | ✓ |\\n\\n---\\n\\n## 5. Kontrak Data & Spesifikasi API\\n\\n[Spesifikasi envelope response, standard headers (X-Tenant-ID, Idempotency-Key), dan alur CRUD]\\n\\n---\\n\\n## 6. Persyaratan Non-Fungsional & Tata Kelola\\n\\n- **Audit Trail**: Pencatatan kekal seluruh mutasi data ke audit_logs.\\n- **Soft Deletes**: Seluruh entitas utama menggunakan deleted_at.\\n- **Data Isolation**: Isolasi ketat berbasis tenant_id."\n  }`);
  }

  if (hasErd) {
    jsonBlocks.push(`  "erd": {\n    "title": "Skema Database Enterprise (${minTables}+ Tabel)",\n    "dbml": "// Tuliskan minimal ${minTables} tabel relasional terstruktur lengkap dengan Enum, Indexes, dan Ref standalone\\n\\nTable tenants {\\n  id UUID [pk, default: \`gen_random_uuid()\`]\\n  name VARCHAR(255) [not null]\\n  slug VARCHAR(100) [not null, unique]\\n  status tenants_status [not null, default: 'active']\\n  created_at TIMESTAMP [not null, default: \`now()\`]\\n  updated_at TIMESTAMP [not null, default: \`now()\`]\\n  deleted_at TIMESTAMP\\n  Indexes {\\n    slug [unique]\\n  }\\n}\\n// ... lanjutkan hingga minimal ${minTables} tabel ..."\n  }`);
  }

  if (hasFlowchart) {
    jsonBlocks.push(`  "flowchart": {\n    "title": "Alur Logika Inti & Bisnis",\n    "nodes": [\n      { "label": "Mulai: Permintaan Klien", "shape": "oval", "color": "#10b981" },\n      { "label": "Verifikasi JWT & Tenant Header", "shape": "rectangle", "color": "#8b5cf6" },\n      { "label": "Token & Tenant Valid?", "shape": "diamond", "color": "#f59e0b" },\n      { "label": "Tolak: 401 Unauthorized", "shape": "rectangle", "color": "#f43f5e" },\n      { "label": "Buka Transaksi Database", "shape": "database", "color": "#0ea5e9" },\n      { "label": "Eksekusi Mutasi Bisnis Inti", "shape": "rectangle", "color": "#8b5cf6" },\n      { "label": "Selesai", "shape": "oval", "color": "#10b981" }\n    ],\n    "edges": [\n      { "sourceLabel": "Mulai: Permintaan Klien", "targetLabel": "Verifikasi JWT & Tenant Header" },\n      { "sourceLabel": "Verifikasi JWT & Tenant Header", "targetLabel": "Token & Tenant Valid?" },\n      { "sourceLabel": "Token & Tenant Valid?", "targetLabel": "Buka Transaksi Database", "label": "Valid" },\n      { "sourceLabel": "Token & Tenant Valid?", "targetLabel": "Tolak: 401 Unauthorized", "label": "Tidak Valid" },\n      { "sourceLabel": "Buka Transaksi Database", "targetLabel": "Eksekusi Mutasi Bisnis Inti" },\n      { "sourceLabel": "Eksekusi Mutasi Bisnis Inti", "targetLabel": "Selesai" }\n    ]\n  }`);
  }

  if (hasApi) {
    jsonBlocks.push(`  "api": {\n    "title": "Katalog REST API & Endpoints",\n    "base_url": "/api/v1",\n    "endpoints": [\n      {\n        "method": "GET",\n        "path": "/api/v1/users",\n        "summary": "Paginasi data pengguna",\n        "tags": ["Users"],\n        "request": { "query_params": ["page", "limit", "sort_by", "q"] },\n        "response": {\n          "status": 200,\n          "description": "Daftar pengguna berhasil diambil",\n          "envelope": { "success": true, "meta": { "page": 1, "limit": 10, "total": 42 }, "data": [] }\n        }\n      },\n      {\n        "method": "POST",\n        "path": "/api/v1/users",\n        "summary": "Pendaftaran pengguna baru",\n        "tags": ["Users"],\n        "request": { "body": { "email": "string", "name": "string", "role": "string" } },\n        "response": { "status": 201, "description": "Pengguna berhasil dibuat" }\n      }\n    ]\n  }`);
  }

  return `PROJECT NAME: "${proj}"
BUSINESS DOMAIN: ${config.domain}
DEPLOYMENT TARGET: ${resolvedDeployment}
ARCHITECTURE STYLE: ${resolvedArch}
TECH STACK TARGET: ${config.techStack || 'Serverless on Vercel + Supabase PostgreSQL + Edge Functions'}
SECURITY & COMPLIANCE: ${complianceList}${websiteSection}${contextSection}

ROLE & OBJECTIVE:
You are a Senior Principal Software & Database Architect.
Your task is to design a COMPLETE, PRODUCTION-GRADE, ENTERPRISE-LEVEL SYSTEM SPECIFICATION for the project above.

CRITICAL RULES — DO NOT VIOLATE:
${hasErd ? `1. NO TOY OR SIMPLIFIED SCHEMAS: You MUST produce an exhaustive, real-world enterprise database schema with AT LEAST ${minTables} TABLES in valid DBML. Do not group multiple tables into one generic table. Break down the system into realistic, normalized relational modules.\n` : ''}${hasPrd ? `2. PRD AS PURE MARKDOWN SPECIFICATION (STRICT NO RAW HTML): The PRD in "content_markdown" MUST be an exhaustive, enterprise-grade specification written in 100% PURE GITHUB FLAVORED MARKDOWN (headings, bullet points, blockquotes, code blocks, tables).
   - STRICT PROHIBITION: DO NOT output any raw HTML tags (NO <div>, <span>, <p>, <style>, <script>, or class attributes). The system renders markdown natively with high-craft styling.
   - You MUST include the metadata blockquote at the very top:
     > **Proyek**: ${proj}
     > **Domain Bisnis**: ${config.domain}
     > **Target Deployment**: ${resolvedDeployment}
     > **Gaya Arsitektur**: ${resolvedArch}
     > **Target Ketersediaan (SLA)**: 99.99% Uptime
     > **Latensi Respon (P95)**: < 150ms
     > **Keamanan & Kepatuhan**: ${complianceList}
     > **Status**: Produksi | **Versi**: 1.0.0
   - MANDATORY SECTIONS TO COVER EXHAUSTIVELY:
     1. Ringkasan Eksekutif & Metrik KPI Strategis (SLA, Latensi P95, RPO/RTO).
     2. Topologi Solusi & Tech Stack (Tabel tools/teknologi lengkap: Frontend, Backend, Database, Caching, Auth, Object Storage, CI/CD, Observabilitas/Logging).
     3. Dekomposisi Modul Domain Bisnis (DDD minimal 8-10 modul: entitas kunci, invariant aturan bisnis, dan relasi).
     4. Alur Kerja Sistem & End-to-End User Journey (Langkah detail step-by-step dari registrasi/login, transaksi, approval, hingga settlement & audit logging).
     5. Matriks Hak Akses & Keamanan (Tabel RBAC lengkap peran vs izin).
     6. Kontrak Data & Spesifikasi REST API (Format envelope response, headers standar X-Tenant-ID & Idempotency-Key, serta alur simulasi CRUD).
     7. Persyaratan Non-Fungsional, Skalabilitas, & Tata Kelola (High availability, multi-tenant data isolation, soft delete, audit trail).
   - Target depth: 2,500–4,000 words in formal Indonesian (Bahasa Indonesia baku kelas enterprise).\n` : ''}3. HOSTING & DEPLOYMENT: The application architecture must be optimized for ${resolvedDeployment}.
${hasFlowchart ? `4. FLOWCHART MUST BE DECISION-RICH: The flowchart must contain decision logic diamonds for validations, auth checks, status transitions, and error paths. Include at least 15–25 connected nodes.\n` : ''}${hasApi ? `5. REST API CRUD & WORKFLOW CONTRACT (MANDATORY 'api' OBJECT IN JSON): You MUST provide an explicit 'api' root object in the JSON containing full REST API endpoint specifications for every core domain entity (at least 20–35 endpoints). Every endpoint must define 'method' (GET/POST/PUT/DELETE), 'path', 'summary', 'tags', 'request' (query_params and/or body schema), and 'response' (HTTP status, description, and envelope).\n` : ''}6. STRICT JSON OUTPUT CONTRACT: You must respond ONLY with a single valid JSON object enclosed within \`\`\`json ... \`\`\` code fence. No conversational filler before or after the JSON.
7. DOWNLOADABLE FILE REQUIREMENT (MANDATORY):
   - You MUST ensure the user can directly DOWNLOAD the resulting architecture specification as a file named "project_architecture.json".
   - IF YOU ARE CLAUDE: Wrap the JSON inside a Claude Artifact with identifier="project_architecture" type="application/json" and title="project_architecture.json" so the user has an instant "Download" button on the UI.
   - IF YOU ARE CHATGPT: If Python / Code Interpreter / Advanced Data Analysis is enabled, write the full JSON string to '/mnt/data/project_architecture.json' and provide a direct download link: [Download project_architecture.json](sandbox:/mnt/data/project_architecture.json) in addition to the standard \`\`\`json code fence.
   - ZERO TRUNCATION / NO PLACEHOLDERS: NEVER use placeholders like "// ... rest of tables", "// TODO", or abbreviate. The JSON must be 100% complete, fully formed, and immediately importable.

REQUIRED JSON STRUCTURE:
\`\`\`json
{
${jsonBlocks.join(',\n')}
}
\`\`\`
${hasErd ? `
DETAILED DBML SPECIFICATION RULES:
1. Minimum ${minTables} Tables covering Tenancy, IAM, Audit, Domain Specific (${config.domain}), Workflows, Notifications, Storage, and System Settings.
2. Column Types: Uppercase portable SQL types: BIGINT, UUID, VARCHAR(length), TEXT, BOOLEAN, DATE, TIMESTAMP, DECIMAL(p,s), JSONB. Every VARCHAR must have explicit length.
3. Audit Columns on EVERY Table: created_at TIMESTAMP [not null], updated_at TIMESTAMP [not null], deleted_at TIMESTAMP.
4. Enums (STRICT RULE): Every Enum MUST be named exactly {table_name}_{column_name} (e.g. users_status, students_gender). NEVER use generic names like "user_status_enum", "gender_enum", or "status_enum". NEVER share an enum between tables: if two tables have a gender column, define separate enums: Enum students_gender and Enum registrants_gender.
5. Relationships: Explicit standalone Ref: child.parent_id > parent.id.
6. Indexes: Include Indexes { ... } blocks inside tables.
` : ''}
Now generate the complete JSON package. Ensure the JSON is completely valid, parseable, and matches all constraints.`;
}

export function generatePrdOnlyPrompt(config: PromptConfig): string {
  const { resolvedDeployment, resolvedArch, complianceList } = resolveInfrastructure(config);
  const proj = config.projectName?.trim() || 'Proyek';
  const websiteSection = config.websiteDescription?.trim()
    ? `\nKONSEP & FITUR WEBSITE KUSTOM:\n"""\n${config.websiteDescription.trim()}\n"""\n`
    : '';

  return `NAMA PROYEK: "${proj}"
DOMAIN BISNIS: ${config.domain}
TARGET INFRASTRUKTUR: ${resolvedDeployment}
GAYA ARSITEKTUR: ${resolvedArch}
TECH STACK: ${config.techStack || 'Serverless on Vercel + Supabase PostgreSQL + Edge Functions'}
KEAMANAN & KEPATUHAN: ${complianceList}
${websiteSection}
TUGAS ARSITEK:
Bertindaklah sebagai Senior Principal Solutions & Enterprise Software Architect.
Susun DOKUMEN PERSYARATAN PRODUK (PRD) & ARSITEKTUR SISTEM LENGKAP untuk proyek di atas.

ATURAN PENULISAN:
1. FORMAT WAJIB: 100% PURE GITHUB FLAVORED MARKDOWN! Gunakan headings (#, ##, ###), blockquotes (>), daftar berpoin, blok kode, dan tabel markdown.
2. DILARANG KERAS MENGGUNAKAN RAW HTML TAGS (TIDAK BOLEH ADA <div>, <span>, <p>, atau atribut class/style)!
3. Tuliskan dalam Bahasa Indonesia formal kelas enterprise, terstruktur, mendalam, dan komprehensif (target: 2.500–4.000 kata) mencakup minimal 8–10 modul domain bisnis, matriks RBAC, kontrak API, dan SLA.

STRUKTUR DOKUMEN MARKDOWN YANG WAJIB DIIKUTI:
# SPESIFIKASI PERSYARATAN PRODUK & ARSITEKTUR (PRD)

> **Proyek**: ${proj}
> **Domain Bisnis**: ${config.domain}
> **Target Deployment**: ${resolvedDeployment}
> **Gaya Arsitektur**: ${resolvedArch}
> **Target Ketersediaan (SLA)**: 99.99% Uptime
> **Latensi Respon (P95)**: < 150ms
> **Keamanan & Kepatuhan**: ${complianceList}
> **Status**: Produksi | **Versi**: 1.0.0

---

## 1. Ringkasan Eksekutif & Sasaran Bisnis
[Uraikan problem statement mendalam, arsitektur solusi, value proposition, dan sasaran strategis bisnis]

### Metrik Kinerja Utama
- **Target Ketersediaan (SLA)**: 99.99% Uptime
- **Latensi Respon (P95)**: < 150ms
- **Keamanan**: ${complianceList}
- **Pola Arsitektur**: ${resolvedArch}

---

## 2. Topologi Solusi & Infrastruktur
- **Runtime & Hosting**: ${resolvedDeployment}
- **Basis Data**: PostgreSQL dengan Connection Pooling & High Availability
- **Cache & Rate Limiting**: Redis Caching

---

## 3. Dekomposisi Modul Domain Bisnis (DDD)
[Uraikan minimal 8-10 modul fungsional lengkap dengan entitas kunci, invariant aturan bisnis, dan relasi]
---

## 4. Matriks Akses & Keamanan (RBAC)
| Peran (Role) | Baca (Read) | Tulis (Write) | Setujui (Approve) | Ekspor Data |
| :--- | :---: | :---: | :---: | :---: |
| **Super Admin** | ✓ | ✓ | ✓ | ✓ |
| **Manager** | ✓ | ✓ | ✓ | ✕ |
| **Operator** | ✓ | ✓ | ✕ | ✕ |
| **Auditor** | ✓ | ✕ | ✕ | ✓ |

---

## 5. Kontrak Data & Spesifikasi API CRUD
[Standar envelope response, konvensi header (X-Tenant-ID, Idempotency-Key), dan spesifikasi endpoint CRUD lengkap beserta alur simulasi sistem]

---

## 6. Persyaratan Non-Fungsional & Tata Kelola
- **Target Ketersediaan**: 99.99% Uptime
- **Latensi Respon**: P95 < 150ms
- **Audit Trail**: Seluruh transaksi dicatat di tabel audit_logs
- **Data Isolation**: Isolasi ketat berbasis tenant_id

Mulai susun dokumen PRD Markdown lengkap sekarang.`;
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
8. DOWNLOADABLE FILE: If your platform supports artifacts or file downloads (Claude Artifact or ChatGPT Code Interpreter), save and offer this as a downloadable file named "schema.dbml".

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
6. DOWNLOADABLE FILE: If your platform supports artifacts or file downloads (Claude Artifact or ChatGPT Code Interpreter), save and offer this as a downloadable file named "flowchart.json".

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
