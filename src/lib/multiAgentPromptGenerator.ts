import JSZip from 'jszip';
import { generateClaudeMasterPrompt } from './megaPrompt/claudeMasterPrompt';

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

function extractFullDbml(diagrams: any[] = []): string {
  if (!diagrams || diagrams.length === 0) {
    return `// Database Schema
Table users {
  id bigint [pk, increment]
  email varchar(255) [not null, unique]
  created_at timestamp [not null, default: \`now()\`]
  updated_at timestamp [not null, default: \`now()\`]
  deleted_at timestamp
}`;
  }

  const chunks: string[] = [];
  for (const diag of diagrams) {
    if (diag.dbml_source || diag.dbmlSource) {
      chunks.push(String(diag.dbml_source || diag.dbmlSource).trim());
      continue;
    }
    const entities = diag.entities || [];
    if (entities.length === 0) continue;

    chunks.push(`// --- Diagram: ${diag.name || 'Core'} ---`);
    for (const ent of entities) {
      const tableName = (ent.name || 'table').toLowerCase().replace(/\s+/g, '_');
      const lines: string[] = [`Table ${tableName} {`];
      const cols = ent.columns || [];
      if (cols.length === 0) {
        lines.push('  id bigint [pk, increment]');
      } else {
        for (const col of cols) {
          const typeStr = (col.type || 'varchar(255)').toUpperCase();
          const flags: string[] = [];
          if (col.is_pk) flags.push('pk');
          if (!col.is_nullable) flags.push('not null');
          if (col.is_unique) flags.push('unique');
          if (col.default_value) flags.push(`default: \`${col.default_value}\``);
          if (col.comment) flags.push(`note: '${col.comment.replace(/'/g, "\\'")}'`);
          const flagStr = flags.length > 0 ? ` [${flags.join(', ')}]` : '';
          lines.push(`  ${col.name} ${typeStr}${flagStr}`);
        }
      }
      lines.push('}');
      chunks.push(lines.join('\n'));
    }
  }

  return chunks.length > 0 ? chunks.join('\n\n') : '// No tables defined';
}

function extractFullWorkflows(flowcharts: any[] = []): string {
  if (!flowcharts || flowcharts.length === 0) {
    return '1. Mulai Permintaan Klien ➔ 2. Validasi Autentikasi ➔ 3. Mutasi Transaksi Basis Data ➔ 4. Respon Berhasil';
  }

  const sections: string[] = [];
  for (const fc of flowcharts) {
    const title = fc.title || fc.name || 'Alur Logika Bisnis';
    const data = fc.data || fc;
    const nodes = Array.isArray(data?.nodes) ? data.nodes : [];
    const edges = Array.isArray(data?.edges) ? data.edges : [];

    sections.push(`### ${title}`);
    if (nodes.length > 0) {
      nodes.forEach((n: any, idx: number) => {
        const label = n.data?.label || n.label || `Langkah ${idx + 1}`;
        const shape = n.data?.shape || n.shape || 'proses';
        sections.push(`${idx + 1}. [${shape.toUpperCase()}] ${label}`);
      });
    }
    if (edges.length > 0) {
      edges.forEach((e: any) => {
        const source = nodes.find((n: any) => n.id === e.source)?.data?.label || e.source;
        const target = nodes.find((n: any) => n.id === e.target)?.data?.label || e.target;
        const edgeLabel = e.label ? ` (Kondisi: ${e.label})` : '';
        sections.push(`- \`${source}\` ➔ \`${target}\`${edgeLabel}`);
      });
    }
    sections.push('');
  }
  return sections.join('\n');
}

function extractFullNotes(notes: any[] = []): string {
  if (!notes || notes.length === 0) return '';
  return notes
    .map((n) => `### Catatan: ${n.title || 'Dokumen'}\n${(n.content || '').replace(/<[^>]+>/g, '').trim()}`)
    .join('\n\n');
}

export function buildClaudeMasterPrompt(config: MultiAgentProjectConfig): string {
  const fullDbml = extractFullDbml(config.diagrams);
  const fullWorkflows = extractFullWorkflows(config.flowcharts);
  const fullNotes = extractFullNotes(config.notes);

  return generateClaudeMasterPrompt({
    projectName: config.projectName,
    domain: config.domain,
    techStack: config.techStack,
    fullDbml,
    fullWorkflows,
    fullNotes,
    customInstructions: config.customInstructions,
  });
}

export function buildDefaultBundleFiles(config: MultiAgentProjectConfig): GeneratedBundleFile[] {
  const proj = config.projectName.trim() || 'Sistem Enterprise';
  const domain = config.domain.trim() || 'SaaS Multi-Tenant';
  const techStack = config.techStack.trim() || 'Next.js 15 + Neon PostgreSQL + Express + Tailwind CSS';
  const fullDbml = extractFullDbml(config.diagrams);

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
- Inspect database/schema.dbml before approving API modifications.
- Require verification passing (npm test & npx tsc --noEmit) before signing off on any phase.`,
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
1. Schema & Migrations: Maintain relational integrity in Neon PostgreSQL based on database/schema.dbml.
2. Service Layer: Write isolated service classes containing pure domain business logic.
3. API Contracts: Deliver uniform REST responses: { success: boolean, data?: T, error?: string }.
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
1. Precision UI: Follow 6px–8px radius (rounded-lg), strictly non-pill, compact 32px–38px buttons.
2. Bottom-Sheet Card: Animate record creation as a slide-up card from the bottom, never a generic center modal.
3. Custom Confirmation: Animate delete confirmation with custom cards, never browser window.confirm.
4. Layout Lock: Header and Sidebar remain pinned/fixed during scrolling.
5. Mobile 2-Grid: All grid views on mobile viewports MUST strictly render in 2 columns (grid-cols-2).
6. Dual View: Provide toggle between Grid View and List View.`,
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
3. Multi-Tenancy: Guarantee that all queries filter strictly by tenant_id to avoid data leakage.
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
4. Release Gate: Execute build verification (npm run build) and report test status.`,
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
      content: fullDbml,
    },
    {
      path: 'AGENTS.md',
      title: 'Protokol Tim Kerja Agen',
      language: 'markdown',
      content: `# Multi-Agent Teamwork Coordination Protocol

## Team Composition
1. Agent 1: Tech Lead & Architect (.agents/01_TECH_LEAD.md)
2. Agent 2: Database & Backend Engineer (.agents/02_DATABASE_BACKEND.md)
3. Agent 3: Frontend & UI/UX Specialist (.agents/03_FRONTEND_UI.md)
4. Agent 4: Security & Compliance Specialist (.agents/04_SECURITY_AUTH.md)
5. Agent 5: QA & Verification Engineer (.agents/05_QA_TESTER.md)

## Synchronization Rules
- All agents consult docs/PRD.md for product requirements.
- Backend and Frontend agents adhere strictly to database/schema.dbml.
- Any proposed schema change must be approved by Agent 1 (Tech Lead).
- No feature branch is merged without sign-off from Agent 5 (QA Tester).`,
    },
  ];
}

export function downloadMegaPromptFile(promptText: string, projectName: string): void {
  const blob = new Blob([promptText], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'project';
  a.href = url;
  a.download = `mega_prompt_${slug}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
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
