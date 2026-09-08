export interface PromptConfig {
  projectName: string;
  domain: string;
  scale: 'large' | 'enterprise' | 'ecosystem';
  deploymentMethod?: string;
  customDeployment?: string;
  architectureStyle?: string;
  compliance: string[];
  techStack: string;
  notesRequirement?: string;
}

export const DOMAIN_PRESETS = [
  { id: 'saas', label: 'SaaS Multi-Tenant', description: 'Organisasi, keanggotaan, RBAC, langganan, tagihan, audit log, webhook.' },
  { id: 'fintech', label: 'FinTech & Pembayaran', description: 'Dompet digital, transaksi multi-mata uang, ledger ganda, KYC, deteksi fraud.' },
  { id: 'ecommerce', label: 'E-Commerce & Logistik', description: 'Multi-vendor, katalog produk, keranjang, pesanan, pengiriman, ulasan, komisi.' },
  { id: 'healthcare', label: 'Kesehatan & EMR/EHR', description: 'Pasien, dokter, janji temu, rekam medis, resep, asuransi, privasi data.' },
  { id: 'erp', label: 'ERP & Rantai Pasok', description: 'Inventaris, vendor, purchase order, gudang, faktur, aset, alur persetujuan.' },
  { id: 'custom', label: 'Kustom', description: 'Tentukan domain dan spesifikasi bisnis khusus sesuai kebutuhan Anda.' },
];

export const SCALE_PRESETS = [
  { id: 'large', label: '25–35 Tabel', minTables: 25, description: 'Sistem core enterprise lengkap dengan relasi dan audit trail.' },
  { id: 'enterprise', label: '35–50 Tabel', minTables: 35, description: 'Skala enterprise penuh mencakup modul billing, notifikasi, dan analitik.' },
  { id: 'ecosystem', label: '50+ Tabel', minTables: 50, description: 'Ekosistem komprehensif multi-modul untuk skala perusahaan besar.' },
];

export function generateExternalAIPrompt(config: PromptConfig): string {
  const minTables = config.scale === 'ecosystem' ? 50 : config.scale === 'enterprise' ? 35 : 25;
  const complianceList = config.compliance.length > 0 ? config.compliance.join(', ') : 'Audit Trail, RBAC, Soft Deletes, Data Masking';

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

  return `You are a Senior Principal Software & Database Architect. 

Your task is to design a COMPLETE, PRODUCTION-GRADE, ENTERPRISE-LEVEL SYSTEM SPECIFICATION for:
PROJECT NAME: "${config.projectName || 'Enterprise Platform'}"
BUSINESS DOMAIN: ${config.domain}
DEPLOYMENT TARGET: ${resolvedDeployment}
ARCHITECTURE STYLE: ${resolvedArch}
TECH STACK TARGET: ${config.techStack || 'Serverless on Vercel + Managed PostgreSQL (Supabase/Neon) + Edge Functions + Cloudflare R2'}
SECURITY & COMPLIANCE: ${complianceList}

CRITICAL RULES — DO NOT VIOLATE:
1. NO TOY OR SIMPLIFIED SCHEMAS: You MUST produce an exhaustive, real-world enterprise database schema with AT LEAST ${minTables} TABLES. Do not group multiple tables into one generic table. Break down the system into realistic, normalized relational modules.
2. NO SHORT PRD: The PRD must be comprehensive, professional, and detailed enough for an engineering team to start building immediately.
3. HOSTING & DEPLOYMENT: The application architecture must be optimized for ${resolvedDeployment}.
4. FLOWCHART MUST BE DECISION-RICH: The flowchart must contain decision logic diamonds for validations, auth checks, status transitions, and error paths. Never produce a trivial linear sequence.
5. STRICT JSON OUTPUT CONTRACT: You must respond ONLY with a single valid JSON object enclosed within \`\`\`json ... \`\`\` code fence. No conversational filler before or after the JSON.

REQUIRED JSON STRUCTURE:
\`\`\`json
{
  "project": {
    "name": "${config.projectName || 'Enterprise Platform'}",
    "description": "Short executive summary of the system architecture."
  },
  "prd": {
    "title": "Dokumen Spesifikasi Produk & Arsitektur (PRD)",
    "content_markdown": "# PRD & Arsitektur Sistem\\n\\n## 1. Executive Summary\\n...\\n\\n## 2. Arsitektur Teknis\\n...\\n\\n## 3. Modul Sistem\\n...\\n\\n## 4. Keamanan, RBAC & Kepatuhan\\n...\\n\\n## 5. Spesifikasi API & Kontrak Data\\n...\\n\\n## 6. Non-Functional Requirements (SLA, Scalability)"
  },
  "erd": {
    "title": "Skema Database Enterprise",
    "dbml": "DBML syntax goes here (minimum ${minTables} tables)..."
  },
  "flowchart": {
    "title": "Alur Logika Inti & Bisnis",
    "nodes": [
      { "label": "Start", "shape": "oval", "color": "#10b981" },
      { "label": "Input Request", "shape": "rectangle", "color": "#8b5cf6" },
      { "label": "Validasi & Auth Check?", "shape": "diamond", "color": "#f59e0b" },
      { "label": "Catat Audit Log", "shape": "database", "color": "#0ea5e9" },
      { "label": "Error: Unauthorized", "shape": "rectangle", "color": "#f43f5e" },
      { "label": "End", "shape": "oval", "color": "#10b981" }
    ],
    "edges": [
      { "sourceLabel": "Start", "targetLabel": "Input Request" },
      { "sourceLabel": "Input Request", "targetLabel": "Validasi & Auth Check?" },
      { "sourceLabel": "Validasi & Auth Check?", "targetLabel": "Catat Audit Log", "label": "Valid" },
      { "sourceLabel": "Validasi & Auth Check?", "targetLabel": "Error Handler", "label": "Invalid" },
      { "sourceLabel": "Catat Audit Log", "targetLabel": "End" }
    ]
  }
}
\`\`\`

DETAILED DBML SPECIFICATION RULES:
1. Minimum ${minTables} Tables:
   - Core & Identity (e.g. users, user_credentials, roles, permissions, role_permissions, user_roles, user_sessions, audit_logs)
   - Domain Specific Entities (e.g. products, categories, inventory, orders, order_items, payments, invoices, shipments, webhooks, notifications, etc.)
   - Configuration, Tenancy & Preferences (e.g. tenants, tenant_settings, feature_flags, api_keys)
2. Column Types: Use uppercase portable SQL types: BIGINT, UUID, VARCHAR(length), TEXT, BOOLEAN, DATE, TIMESTAMP, DECIMAL(precision, scale), JSONB. Every VARCHAR must have an explicit length, e.g. VARCHAR(255).
3. Audit Columns on EVERY Table:
   - \`created_at TIMESTAMP [not null, default: \`now()\`]\`
   - \`updated_at TIMESTAMP [not null, default: \`now()\`]\`
   - \`deleted_at TIMESTAMP\` (for soft-deletable records)
4. Enums: Every enum-typed column must reference a dedicated Enum formatted as {table_name}_{column_name} (e.g. \`users_status\`, \`orders_payment_status\`).
5. Relationships: Explicit standalone relationships using \`Ref: child.parent_id > parent.id\`.
6. Indexes: Include \`Indexes { ... }\` blocks inside tables for foreign keys and lookup queries.

DETAILED FLOWCHART RULES:
1. Include at least 15–25 connected nodes covering end-to-end business workflows.
2. Mandatory "diamond" decision nodes for validation, permissions, error checks, and conditional branches.
3. Every edge originating from a decision node must have a distinct label (e.g. "Yes", "No", "Success", "Failed").
4. Allowed shapes: "oval", "rectangle", "diamond", "database", "cloud", "document", "circle".
5. Proper colors: Emerald (#10b981) for success/endpoints, Amber (#f59e0b) for decisions, Violet (#8b5cf6) for compute/process, Sky (#0ea5e9) for database/storage, Rose (#f43f5e) for errors/external.

Now generate the complete JSON package. Ensure the JSON is completely valid, parseable, and matches all constraints.`;
}
