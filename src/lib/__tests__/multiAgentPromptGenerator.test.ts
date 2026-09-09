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
    expect(prompt).toContain('01_TECH_LEAD.md');
    expect(prompt).toContain('02_DATABASE_BACKEND.md');
    expect(prompt).toContain('03_FRONTEND_UI.md');
    expect(prompt).toContain('04_SECURITY_AUTH.md');
    expect(prompt).toContain('05_QA_TESTER.md');
  });

  it('builds bundle files including the 5 agents and PRD', () => {
    const files = buildDefaultBundleFiles({
      projectName: 'Fintech Hub',
      domain: 'Fintech',
      techStack: 'Express + PostgreSQL',
    });

    expect(files.length).toBeGreaterThanOrEqual(8);
    expect(files.some((f) => f.path === '.agents/01_TECH_LEAD.md')).toBe(true);
    expect(files.some((f) => f.path === '.agents/02_DATABASE_BACKEND.md')).toBe(true);
    expect(files.some((f) => f.path === '.agents/03_FRONTEND_UI.md')).toBe(true);
    expect(files.some((f) => f.path === '.agents/04_SECURITY_AUTH.md')).toBe(true);
    expect(files.some((f) => f.path === '.agents/05_QA_TESTER.md')).toBe(true);
    expect(files.some((f) => f.path === 'docs/PRD.md')).toBe(true);
    expect(files.some((f) => f.path === 'database/schema.dbml')).toBe(true);
    expect(files.some((f) => f.path === 'AGENTS.md')).toBe(true);

    const prd = files.find((f) => f.path === 'docs/PRD.md');
    expect(prd?.content).toContain('DOKUMEN SPESIFIKASI PERSYARATAN PRODUK');
    expect(prd?.content).toContain('Matriks Akses (RBAC)');
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
