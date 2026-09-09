import JSZip from 'jszip';

export interface MultiAgentProjectConfig {
  projectName: string;
  domain: string;
  techStack: string;
  databaseType?: string;
  complianceList?: string[];
  diagrams?: any[];
  flowcharts?: any[];
  notes?: any[];
  customInstructions?: string;
}

export interface GeneratedBundleFile {
  path: string;
  title: string;
  role?: string;
  language: string;
  content: string;
}

export const AGENT_TEAM = [
  {
    id: 'tech_lead',
    name: 'Tech Lead & Architect',
    file: '.agents/01_TECH_LEAD.md',
    desc: 'System architecture, DDD boundaries, task orchestration, code review.',
  },
  {
    id: 'database_backend',
    name: 'Database & Backend',
    file: '.agents/02_DATABASE_BACKEND.md',
    desc: 'Relational schema, migrations, transactional services, API contracts.',
  },
  {
    id: 'frontend_ui',
    name: 'Frontend & UI/UX',
    file: '.agents/03_FRONTEND_UI.md',
    desc: 'Responsive UI components, state management, design system.',
  },
  {
    id: 'security_auth',
    name: 'Security & RBAC',
    file: '.agents/04_SECURITY_AUTH.md',
    desc: 'Auth sessions, RBAC matrices, data isolation, audit logging.',
  },
  {
    id: 'qa_tester',
    name: 'QA & Verification',
    file: '.agents/05_QA_TESTER.md',
    desc: 'Automated tests, verification checklists, regression safeguards.',
  },
];

function extractProjectContext(config: MultiAgentProjectConfig) {
  let schemaSummary = '';
  if (config.diagrams && config.diagrams.length > 0) {
    const tableNames: string[] = [];
    for (const d of config.diagrams) {
      if (d.entities) {
        for (const e of d.entities) {
          tableNames.push(e.name);
        }
      }
    }
    if (tableNames.length > 0) {
      schemaSummary = `Existing Tables in Workspace: ${tableNames.slice(0, 30).join(', ')}`;
    }
  }

  let notesSummary = '';
  if (config.notes && config.notes.length > 0) {
    const noteTitles = config.notes.map((n) => n.title).filter(Boolean);
    if (noteTitles.length > 0) {
      notesSummary = `Existing Project Notes: ${noteTitles.join(', ')}`;
    }
  }

  return { schemaSummary, notesSummary };
}

export function buildClaudeMasterPrompt(config: MultiAgentProjectConfig): string {
  const proj = config.projectName.trim() || 'Enterprise System';
  const domain = config.domain.trim() || 'SaaS Multi-Tenant';
  const techStack = config.techStack.trim() || 'Next.js 15 + PostgreSQL (Prisma) + Express + Tailwind CSS';
  const { schemaSummary, notesSummary } = extractProjectContext(config);

  return `=== CLAUDE ENTERPRISE MULTI-AGENT PROJECT GENERATOR PROMPT ===

PROJECT NAME: "${proj}"
BUSINESS DOMAIN: ${domain}
CORE TECH STACK: ${techStack}
${schemaSummary ? `DATABASE CONTEXT: ${schemaSummary}\n` : ''}${notesSummary ? `PROJECT NOTES CONTEXT: ${notesSummary}\n` : ''}${config.customInstructions ? `CUSTOM INSTRUCTIONS: ${config.customInstructions}\n` : ''}

=======================================================================
ROLE & OBJECTIVE (STRICT ENGLISH INSTRUCTIONS FOR CLAUDE / AI):
You are a Principal Software Architect and Multi-Agent Systems Engineer.
Your mission is to generate a COMPLETE, PRODUCTION-READY, FULLY SPECIFIED PROJECT BUNDLE packaged as a downloadable ZIP or fully articulated files for "${proj}".

CRITICAL LANGUAGE SPECIFICATION:
1. All AI Agent directives, orchestration protocols, and engineering guidelines must be written in clear, rigorous, professional ENGLISH.
2. The Product Requirements Document (docs/PRD.md) and User Stories must be written in comprehensive, formal INDONESIAN (Bahasa Indonesia baku kelas enterprise) with rich technical depth.

=======================================================================
MANDATORY BUNDLE FILE TREE (MUST BE 100% COMPLETE — ZERO TRUNCATION):

project-bundle/
├── docs/
│   ├── PRD.md                     <-- Exhaustive PRD in formal Indonesian (min. 2,500+ words)
│   ├── ARCHITECTURE.md            <-- System topology, C4 model, microservices/modular boundaries
│   └── WORKFLOWS.md               <-- Business logic flows with Mermaid diagrams
├── database/
│   ├── schema.dbml                <-- Complete relational DBML schema with full relations & indexes
│   ├── schema.sql                 <-- Production DDL with constraints, timestamps & audit trails
│   └── seed.sql                   <-- Comprehensive seed data for master tables & default roles
├── .agents/                       <-- 5-AGENT SYNCHRONIZED TEAMWORK (Written in English):
│   ├── 01_TECH_LEAD.md            <-- Agent 1: Tech Lead & Architect (Orchestration & Governance)
│   ├── 02_DATABASE_BACKEND.md     <-- Agent 2: Database & Backend Engineer (Prisma/SQL & APIs)
│   ├── 03_FRONTEND_UI.md          <-- Agent 3: Frontend & UI Engineer (Tailwind, React, UX)
│   ├── 04_SECURITY_AUTH.md        <-- Agent 4: Security & Compliance (RBAC, JWT, Multi-Tenancy)
│   └── 05_QA_TESTER.md            <-- Agent 5: QA & Verification Engineer (Test plans & Checklist)
├── AGENTS.md                      <-- Root Agent Team Coordination Protocol
└── README.md                      <-- Quickstart commands, environment variables & setup guide

=======================================================================
SPECIFICATION FOR EACH FILE:

1. docs/PRD.md (Bahasa Indonesia):
   - Ringkasan Eksekutif & Sasaran Bisnis Strategis.
   - Metrik Keberhasilan Utama: SLA 99.99%, P95 Latency < 150ms, RPO/RTO.
   - Dekomposisi Modul Domain Bisnis (DDD): Minimal 8 modul fungsional terinci.
   - Matriks Hak Akses & Keamanan (RBAC): Tabel peran (Super Admin, Branch Admin, Operator, Auditor) vs hak aksi.
   - Kontrak API Standar: Struktur response envelope { success, data, error, meta }, pagination, idempotency.
   - Kebijakan Retensi Data, Soft Deletes, dan Audit Logging.

2. database/schema.dbml & schema.sql:
   - Exhaustive tables for ${domain}: Tenancy, Users, Roles, Permissions, Domain Core Entities, Workflows, Audit Logs, Notifications.
   - Explicit foreign keys (Ref: child.parent_id > parent.id).
   - Columns on every table: id, created_at, updated_at, deleted_at.
   - Strict Enum naming convention: {table_name}_{column_name}.

3. .agents/ DIRECTIVES (ENGLISH - 5 SPECIALIZED AGENTS TEAMWORK):
   - 01_TECH_LEAD.md: Oversees project boundaries, breaks down user epics into atomic tasks, approves architectural changes, ensures zero dead code.
   - 02_DATABASE_BACKEND.md: Implements migrations, writes repository layers, enforces database transactions and atomicity, designs REST/GraphQL endpoints.
   - 03_FRONTEND_UI.md: Implements accessible, responsive UI with Tailwind CSS and atomic components, integrates API fetching with optimistic states.
   - 04_SECURITY_AUTH.md: Implements session validation, RBAC middleware, protects against OWASP Top 10, ensures tenant data isolation.
   - 05_QA_TESTER.md: Writes unit tests, edge-case validations, regression checklists, verifies builds (tsc, lint, tests) before marking tasks done.

=======================================================================
DELIVERY FORMAT (MANDATORY):
- IF RUNNING IN CLAUDE: Wrap the result in a Claude Artifact or generate the downloadable ZIP directly so the user has an instant Download button.
- IF RUNNING IN PYTHON ENVIRONMENT: Write the entire file tree into a zip archive at '/mnt/data/project_bundle.zip' and provide the download link.
- NO PLACEHOLDERS: Do not use '// TODO' or '// add remaining tables'. Every file must be complete, functional, and ready to extract into a git repository.

Generate the full package now.`;
}

export function buildDefaultBundleFiles(config: MultiAgentProjectConfig): GeneratedBundleFile[] {
  const proj = config.projectName.trim() || 'Sistem Enterprise';
  const domain = config.domain.trim() || 'SaaS Multi-Tenant';
  const techStack = config.techStack.trim() || 'Next.js 15 + PostgreSQL + Express + Tailwind CSS';

  return [
    {
      path: '.agents/01_TECH_LEAD.md',
      title: 'Tech Lead & Architect',
      role: 'Tech Lead',
      language: 'markdown',
      content: `# Agent 1: Tech Lead & System Architect

## Mission
Lead the engineering team, enforce Clean Architecture domain boundaries, and decompose business requirements into atomic tasks.

## Responsibilities
1. Architecture Governance: Ensure all components adhere to modular domain boundaries.
2. Code Review & Standards: Strictly prevent bloated code, enforce type safety, and verify error boundaries.
3. Task Orchestration: Assign backend tasks to Agent 2 and UI tasks to Agent 3.
4. Conflict Resolution: Mediate schema and contract decisions between frontend and backend.

## Execution Protocol
- Always inspect \`database/schema.dbml\` before approving API modifications.
- Require verification passing (\`npm test\` & \`npx tsc --noEmit\`) before signing off on any phase.`,
    },
    {
      path: '.agents/02_DATABASE_BACKEND.md',
      title: 'Database & Backend Engineer',
      role: 'Backend',
      language: 'markdown',
      content: `# Agent 2: Database & Backend Engineer

## Mission
Implement robust relational data models, atomic database transactions, and standardized API services for domain: ${domain}.

## Responsibilities
1. Schema & Migrations: Maintain relational integrity in PostgreSQL based on \`database/schema.dbml\`.
2. Service Layer: Write isolated service classes containing pure domain business logic.
3. API Contracts: Deliver uniform REST / RPC responses: \`{ success: boolean, data?: T, error?: string }\`.
4. Performance: Index foreign keys, implement query optimization, and prevent N+1 query patterns.`,
    },
    {
      path: '.agents/03_FRONTEND_UI.md',
      title: 'Frontend & UI/UX Engineer',
      role: 'Frontend',
      language: 'markdown',
      content: `# Agent 3: Frontend & UI/UX Specialist

## Mission
Build responsive, accessible, high-craft user interfaces using modern Tailwind CSS and modular component architecture.

## Responsibilities
1. Design System: Follow precision card and compact button UI standards with clean spacing.
2. State & Data Fetching: Handle loading, error, and optimistic states gracefully.
3. User Experience: Adhere to microcopy guidelines (1-word placeholders, 1-2 word button labels).
4. Accessibility: Ensure proper ARIA attributes, keyboard navigation, and responsive mobile layouts.`,
    },
    {
      path: '.agents/04_SECURITY_AUTH.md',
      title: 'Security & RBAC Specialist',
      role: 'Security',
      language: 'markdown',
      content: `# Agent 4: Security & Compliance Specialist

## Mission
Protect system assets, enforce tenant isolation, and validate identity and permissions across all operations.

## Responsibilities
1. Authentication: Secure JWT / session cookies with HTTP-only, secure, and SameSite flags.
2. Authorization: Enforce Role-Based Access Control (RBAC) at both API route and data query layers.
3. Multi-Tenancy: Guarantee that all queries filter strictly by \`tenant_id\` to avoid data leakage.
4. Audit Trails: Log sensitive actions (mutations, role changes, exports) to an immutable audit table.`,
    },
    {
      path: '.agents/05_QA_TESTER.md',
      title: 'QA & Test Engineer',
      role: 'QA & Test',
      language: 'markdown',
      content: `# Agent 5: QA & Verification Engineer

## Mission
Verify correctness, guard against regressions, and execute comprehensive test suites before release.

## Responsibilities
1. Automated Testing: Write unit tests for core domain calculation and business rules.
2. Edge Case Auditing: Test boundary conditions (empty inputs, oversized payloads, invalid IDs).
3. Integration Testing: Verify end-to-end API workflows and error status codes (400, 401, 403, 404, 422).
4. Release Gate: Execute build verification (\`npm run build\`) and report test status.`,
    },
    {
      path: 'docs/PRD.md',
      title: 'Dokumen Spesifikasi Produk (PRD)',
      language: 'markdown',
      content: `# DOKUMEN SPESIFIKASI PERSYARATAN PRODUK & ARSITEKTUR (PRD)

> **Proyek**: ${proj}  
> **Domain Bisnis**: ${domain}  
> **Tech Stack**: ${techStack}  
> **Status**: Disetujui untuk Implementasi Tim Multi-Agent

---

## 1. Ringkasan Eksekutif
Sistem dirancang untuk menyediakan platform terpadu dengan performa tinggi, pemisahan data multi-tenant yang aman, serta kemampuan otomatisasi operasional penuh.

## 2. Metrik Kunci & Sasaran Layanan (SLA)
- Ketersediaan Sistem: 99.99% Uptime.
- Latensi Transaksi (P95): < 150ms.
- Integritas Transaksi: Pemulihan RPO < 5 menit.

## 3. Dekomposisi Modul Domain Bisnis (DDD)
- **Modul Identitas & Akses (IAM)**: Autentikasi, manajemen tenant, dan RBAC terpusat.
- **Modul Operasional Inti**: Layanan bisnis khusus domain ${domain}.
- **Modul Notifikasi & Antrean**: Pengiriman event asinkron dan webhook eksternal.
- **Modul Audit & Kepatuhan**: Pencatatan aktivitas mutasi data dan audit trail.

## 4. Matriks Akses (RBAC)
| Peran (Role) | Baca | Tulis | Hapus | Ekspor |
| :--- | :---: | :---: | :---: | :---: |
| Super Admin | ✓ | ✓ | ✓ | ✓ |
| Admin Tenant | ✓ | ✓ | ✓ | ✕ |
| Operator | ✓ | ✓ | ✕ | ✕ |
| Auditor | ✓ | ✕ | ✕ | ✓ |`,
    },
    {
      path: 'database/schema.dbml',
      title: 'Skema Basis Data (DBML)',
      language: 'dbml',
      content: `// Skema Database ${proj}
Table tenants {
  id bigint [pk, increment]
  name varchar(255) [not null]
  slug varchar(100) [not null, unique]
  created_at timestamp [not null, default: \`now()\`]
  updated_at timestamp [not null, default: \`now()\`]
  deleted_at timestamp
}

Table users {
  id bigint [pk, increment]
  tenant_id bigint [not null, ref: > tenants.id]
  email varchar(255) [not null, unique]
  role varchar(50) [not null, default: 'operator']
  created_at timestamp [not null, default: \`now()\`]
  updated_at timestamp [not null, default: \`now()\`]
  deleted_at timestamp
}

Table audit_logs {
  id bigint [pk, increment]
  tenant_id bigint [not null, ref: > tenants.id]
  user_id bigint [ref: > users.id]
  action varchar(100) [not null]
  details text
  created_at timestamp [not null, default: \`now()\`]
}`,
    },
    {
      path: 'AGENTS.md',
      title: 'Protokol Tim Kerja Agen',
      language: 'markdown',
      content: `# Multi-Agent Teamwork Coordination Protocol

## Team Composition
1. Agent 1: Tech Lead & Architect (\`.agents/01_TECH_LEAD.md\`)
2. Agent 2: Database & Backend Engineer (\`.agents/02_DATABASE_BACKEND.md\`)
3. Agent 3: Frontend & UI/UX Specialist (\`.agents/03_FRONTEND_UI.md\`)
4. Agent 4: Security & Compliance Specialist (\`.agents/04_SECURITY_AUTH.md\`)
5. Agent 5: QA & Verification Engineer (\`.agents/05_QA_TESTER.md\`)

## Synchronization Rules
- All agents consult \`docs/PRD.md\` for product requirements.
- Backend and Frontend agents adhere strictly to \`database/schema.dbml\`.
- Any proposed schema change must be approved by Agent 1 (Tech Lead).
- No feature branch is merged without sign-off from Agent 5 (QA Tester).`,
    },
  ];
}

export async function downloadAgentBundleZip(files: GeneratedBundleFile[], projectName: string): Promise<void> {
  const zip = new JSZip();
  const folderName = `${projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'project'}-multiagent-bundle`;
  const root = zip.folder(folderName) || zip;

  for (const f of files) {
    root.file(f.path, f.content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
