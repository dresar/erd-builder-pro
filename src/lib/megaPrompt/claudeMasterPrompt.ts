import { getSkillsStandardsSection } from './skillsStandardsSection';
import { getUiArchitecturalBehaviorsSection } from './uiArchitecturalBehaviorsSection';
import { getAgentTeamworkSection } from './agentTeamworkSection';
import { getClaudeZipExecutionSection } from './claudeZipExecutionSection';

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
[SECTION 1: CORE PROJECT CONTEXT & ENTITY DATA]
=======================================================================
Project Name: "${proj}"
Business Domain: "${domain}"
Default Infrastructure: Serverless on Neon PostgreSQL (or Supabase) + Edge Functions
Target Tech Stack: ${techStack}
Single Monorepo Rule: 1 unified package.json at root. Strictly no duplicated node_modules. Backend and frontend unified.

--- DATABASE SCHEMA (EXTRACTED RELATIONAL DBML):
\`\`\`dbml
${context.fullDbml}
\`\`\`

--- BUSINESS LOGIC & WORKFLOWS (EXTRACTED FLOWCHARTS):
${context.fullWorkflows}

${context.fullNotes ? `--- EXISTING PROJECT NOTES & SPECIFICATIONS:\n${context.fullNotes}\n` : ''}${context.customInstructions ? `--- CUSTOM INSTRUCTIONS:\n${context.customInstructions}\n` : ''}
${getSkillsStandardsSection()}

${getUiArchitecturalBehaviorsSection()}

${getAgentTeamworkSection()}

${getClaudeZipExecutionSection(proj)}
`;
}
