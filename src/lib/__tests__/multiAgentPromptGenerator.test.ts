import { describe, it, expect } from 'vitest';
import {
  buildClaudeMasterPrompt,
  buildDefaultBundleFiles,
  AGENT_TEAM,
} from '../multiAgentPromptGenerator';

describe('multiAgentPromptGenerator', () => {
  it('builds Claude master prompt in English with PRD in Indonesian', () => {
    const prompt = buildClaudeMasterPrompt({
      projectName: 'Sistem Toko Online',
      domain: 'E-Commerce Enterprise',
      techStack: 'Next.js 15 + PostgreSQL + Tailwind CSS',
    });

    // Check English prompt instructions for Claude
    expect(prompt).toContain('# MEGA ORCHESTRATOR PROMPT: COMPLETE MULTI-AGENT PROJECT GENERATOR');
    expect(prompt).toContain('You are a Principal Software Architect, Lead Multi-Agent Systems Engineer');
    expect(prompt).toContain('ALL AI Agent system instructions, teamwork protocols, and engineering governance must be written in authoritative, precise ENGLISH.');
    expect(prompt).toContain('Bahasa Indonesia baku kelas enterprise');
    expect(prompt).toContain('/ui-ux-text');
    expect(prompt).toContain('/precision-card-button-ui & /button-presisi');
    expect(prompt).toContain('/nokomen');
    expect(prompt).toContain('/master');
    expect(prompt).toContain('/env-secrets-management');
    expect(prompt).toContain('/anti-slop-writing');
    expect(prompt).toContain('/graphify');
    expect(prompt).toContain('/supermemory');
    expect(prompt).toContain('SLIDE-UP BOTTOM SHEET CARD (NEVER CENTER MODALS)');
    expect(prompt).toContain('DELETE CONFIRMATION: IN-APP CUSTOM CARD (NEVER BROWSER CONFIRM)');
    expect(prompt).toContain('FIXED STICKY HEADER & SIDEBAR (ZERO MOVEMENT ON SCROLL)');
    expect(prompt).toContain('MANDATORY MOBILE 2-GRID RULE (STRICTLY PROHIBIT 1-GRID ON MOBILE)');
    expect(prompt).toContain('Single Root package.json');
    expect(prompt).toContain('Neon Serverless PostgreSQL');
    expect(prompt).toContain('MANDATORY 20+ MARKDOWN ARCHITECTURE FILES');
    expect(prompt).toContain('MAXIMUM 10 CODE FILES PER DIRECTORY');
    expect(prompt).toContain('MAXIMUM 1,000 LINES PER CODE FILE');
    expect(prompt).toContain('MANDATORY FOLDER DOCUMENTATION (README.md IN EVERY DIRECTORY)');
    expect(prompt).toContain('01_TECH_LEAD.md');
    expect(prompt).toContain('02_DATABASE_BACKEND.md');
    expect(prompt).toContain('03_FRONTEND_UI.md');
    expect(prompt).toContain('04_SECURITY_AUTH.md');
    expect(prompt).toContain('05_QA_TESTER.md');
  });

  it('builds bundle files including 20+ markdown files and folder guides', () => {
    const files = buildDefaultBundleFiles({
      projectName: 'Fintech Hub',
      domain: 'Fintech',
      techStack: 'Express + PostgreSQL',
    });

    expect(files.length).toBeGreaterThanOrEqual(20);
    expect(files.some((f) => f.path === '.agents/01_TECH_LEAD.md')).toBe(true);
    expect(files.some((f) => f.path === '.agents/02_DATABASE_BACKEND.md')).toBe(true);
    expect(files.some((f) => f.path === '.agents/03_FRONTEND_UI.md')).toBe(true);
    expect(files.some((f) => f.path === '.agents/04_SECURITY_AUTH.md')).toBe(true);
    expect(files.some((f) => f.path === '.agents/05_QA_TESTER.md')).toBe(true);
    expect(files.some((f) => f.path === '.agents/README.md')).toBe(true);
    expect(files.some((f) => f.path === 'docs/01_PRD.md')).toBe(true);
    expect(files.some((f) => f.path === 'docs/README.md')).toBe(true);
    expect(files.some((f) => f.path === 'database/README.md')).toBe(true);
    expect(files.some((f) => f.path === 'src/README.md')).toBe(true);
    expect(files.some((f) => f.path === 'database/schema.dbml')).toBe(true);
    expect(files.some((f) => f.path === 'AGENTS.md')).toBe(true);

    const prd = files.find((f) => f.path === 'docs/01_PRD.md');
    expect(prd?.content).toContain('Dokumen Spesifikasi Kebutuhan Produk (PRD)');
    expect(prd?.content).toContain('Matriks Hak Akses (RBAC)');
  });

  it('verifies 5 agent team list', () => {
    expect(AGENT_TEAM.length).toBe(5);
    expect(AGENT_TEAM[0].id).toBe('tech_lead');
    expect(AGENT_TEAM[1].id).toBe('database_backend');
    expect(AGENT_TEAM[2].id).toBe('frontend_ui');
    expect(AGENT_TEAM[3].id).toBe('security_auth');
    expect(AGENT_TEAM[4].id).toBe('qa_tester');
  });
});
