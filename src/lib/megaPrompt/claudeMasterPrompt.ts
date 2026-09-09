import { getEnterprisePrdSection } from './enterprisePrdSection';
import { getSkillsStandardsSection } from './skillsStandardsSection';
import { getUiArchitecturalBehaviorsSection } from './uiArchitecturalBehaviorsSection';
import { getAgentTeamworkSection } from './agentTeamworkSection';
import { getClaudeZipExecutionSection } from './claudeZipExecutionSection';
import { getApiEndpointsSection } from './apiEndpointsSection';

export interface ClaudePromptContext {
  projectName: string;
  domain: string;
  techStack: string;
  fullDbml: string;
  fullWorkflows: string;
  fullNotes: string;
  customInstructions?: string;
}

export function generateClaudeMasterPrompt(context: ClaudePromptContext): string {
  const proj = context.projectName.trim() || 'Sistem Enterprise';
  const domain = context.domain.trim() || 'SaaS Multi-Tenant';
  const techStack = context.techStack.trim() || 'Next.js 15 + Neon PostgreSQL (Prisma) + Express + Tailwind CSS';

  return `# =======================================================================
# MEGA ORCHESTRATOR PROMPT: COMPLETE MULTI-AGENT PROJECT GENERATOR
# TARGET SYSTEM: "${proj}" | DOMAIN: "${domain}"
# =======================================================================

ROLE & MISSION (ENGLISH DIRECTIVE):
You are a Principal Software Architect, Lead Multi-Agent Systems Engineer, and Production Master Orchestrator.
Your objective is to generate an EXHAUSTIVE, PRODUCTION-GRADE, END-TO-END PROJECT PACKAGE for "${proj}".
This package is built for modern AI coding tools (Claude Code CLI, Antigravity, Cursor, Windsurf) and human engineering teams to execute immediately without missing context.

LANGUAGE & FORMATTING RULE:
- ALL AI Agent system instructions, teamwork protocols, and engineering governance must be written in authoritative, precise ENGLISH.
- The Product Requirements Document (docs/PRD.md), user stories, and business domain specifications must be written in comprehensive, formal INDONESIAN (Bahasa Indonesia baku kelas enterprise) with extreme detail.
- Zero placeholders: NEVER emit "// TODO", "// remaining tables", or abbreviations. Every table, column, role, and module must be written in full.

=======================================================================
[PROJECT CORE IDENTITY & TARGET ARCHITECTURE]
=======================================================================
Project Name: "${proj}"
Business Domain: "${domain}"
Target Infrastructure: Serverless on Neon PostgreSQL (Prisma ORM) + Next.js 15 / Express
Target Tech Stack: ${techStack}
Single Monorepo Rule: 1 unified package.json at root. Strictly no duplicated node_modules. Backend and frontend unified.

${getEnterprisePrdSection(proj, domain, context.fullNotes)}

=======================================================================
[SECTION 2: SKEMA BASIS DATA RELASIONAL PENUH (FULL DBML & DDL)]
=======================================================================
Di bawah ini adalah skema relasional lengkap (Database Schema) dari proyek "${proj}" dalam format DBML standar industri.
Seluruh tabel, tipe data, primary key (UUID/BigInt), foreign key referensial, unique index, dan enum wajib diimplementasikan 100% tanpa ada yang dikurangi:

\`\`\`dbml
${context.fullDbml}
\`\`\`

Pedoman Basis Data Wajib:
1. Setiap entitas transaksional wajib memiliki kolom audit: created_at, updated_at, dan deleted_at (soft delete).
2. Setiap entitas berstatus multi-tenant wajib memiliki kolom isolasi tenant (misal: campus_id / tenant_id).
3. Pengindeksan: Kolom referensial (Foreign Keys) dan kolom unik wajib diindeks secara eksplisit.
4. Enkripsi Data: Kolom sensitif (PIN, riwayat medis, nomor telepon pribadi) wajib dienkripsi at-rest.

=======================================================================
[SECTION 3: DIAGRAM ALUR KERJA & LOGIKA BISNIS (WORKFLOW FLOWCHARTS)]
=======================================================================
Di bawah ini adalah alur logika proses bisnis utama yang telah dipetakan untuk "${proj}".
Setiap langkah, percabangan keputusan (decision diamond), dan status transisi wajib diwujudkan dalam flow state engine backend dan antarmuka pengguna:

${context.fullWorkflows}

${context.customInstructions ? `=======================================================================
[INSTRUKSI KHUSUS TAMBAHAN DARI PEMILIK PROYEK]
=======================================================================
${context.customInstructions}
` : ''}
${getSkillsStandardsSection()}

${getUiArchitecturalBehaviorsSection()}

${getAgentTeamworkSection()}

${getClaudeZipExecutionSection(proj)}

${getApiEndpointsSection(proj, context.fullDbml)}
`;
}
