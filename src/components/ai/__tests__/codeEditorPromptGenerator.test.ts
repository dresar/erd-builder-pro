import { describe, it, expect } from 'vitest';
import {
  generateModularPromptFiles,
  generateAllInOnePrompt,
  TARGET_EDITORS,
} from '../codeEditorPromptGenerator';

describe('codeEditorPromptGenerator', () => {
  it('generates Claude CLI prompt bundle with CLAUDE.md and tasks', () => {
    const files = generateModularPromptFiles({
      targetEditor: 'claude_cli',
      projectName: 'Aplikasi Toko Online',
      domain: 'E-Commerce',
      techStack: 'React + Node.js + PostgreSQL',
      diagrams: [
        {
          name: 'Main',
          entities: [
            {
              name: 'products',
              columns: [
                { name: 'id', type: 'bigint', is_pk: true },
                { name: 'title', type: 'varchar(255)', is_nullable: false },
                { name: 'price', type: 'decimal(12,2)', is_nullable: false },
              ],
            },
          ],
        },
      ],
      flowcharts: [
        {
          title: 'Alur Checkout',
          data: {
            nodes: [
              { id: '1', data: { label: 'Pilih Produk', shape: 'oval' } },
              { id: '2', data: { label: 'Bayar Pesanan', shape: 'rectangle' } },
            ],
            edges: [{ source: '1', target: '2', label: 'Lanjut' }],
          },
        },
      ],
    });

    expect(files.length).toBe(5);
    expect(files[0].filename).toBe('CLAUDE.md');
    expect(files[0].content).toContain('CLAUDE.md — Panduan Arsitektur');
    expect(files[0].content).toContain('Aplikasi Toko Online');
    expect(files[0].content).toContain('Get-Content 05_IMPLEMENTATION_TASKS.md | claude -p');

    // Check DBML
    const dbmlFile = files.find((f) => f.filename === '03_DATABASE_SCHEMA.dbml');
    expect(dbmlFile).toBeDefined();
    expect(dbmlFile?.content).toContain('Table products {');
    expect(dbmlFile?.content).toContain('id BIGINT [pk, not null]');

    // Check Flowchart
    const fcFile = files.find((f) => f.filename === '04_WORKFLOWS_LOGIC.md');
    expect(fcFile).toBeDefined();
    expect(fcFile?.content).toContain('Pilih Produk');

    // Check Tasks
    const taskFile = files.find((f) => f.filename === '05_IMPLEMENTATION_TASKS.md');
    expect(taskFile).toBeDefined();
    expect(taskFile?.content).toContain('ROADMAP TUGAS IMPLEMENTASI');
  });

  it('generates Antigravity prompt bundle with AGENTS.md', () => {
    const files = generateModularPromptFiles({
      targetEditor: 'antigravity',
      projectName: 'SaaS Multi-Tenant',
      domain: 'SaaS',
      techStack: 'Vite + Express',
    });

    expect(files[0].filename).toBe('AGENTS.md');
    expect(files[0].content).toContain('AGENTS.md — Memori & Protokol Antigravity');
    expect(files[0].content).toContain('implementation_plan.md');
  });

  it('generates Cursor rules with .cursorrules', () => {
    const files = generateModularPromptFiles({
      targetEditor: 'cursor',
      projectName: 'Fintech Engine',
      domain: 'Fintech',
      techStack: 'Next.js + Prisma',
    });

    expect(files[0].filename).toBe('.cursorrules');
    expect(files[0].content).toContain('Cursor Rules untuk Proyek Fintech Engine');
  });

  it('generates Master Prompt concatenation correctly', () => {
    const files = generateModularPromptFiles({
      targetEditor: 'claude_cli',
      projectName: 'Test App',
      domain: 'Test',
      techStack: 'Test Stack',
    });

    const combined = generateAllInOnePrompt(files, 'Test App');
    expect(combined).toContain('# MASTER PROMPT BUNDEL ARSITEKTUR & IMPLEMENTASI: Test App');
    expect(combined).toContain('## BERKAS: `CLAUDE.md`');
    expect(combined).toContain('## BERKAS: `05_IMPLEMENTATION_TASKS.md`');
  });
});
