import JSZip from 'jszip';

export type TargetEditor = 'claude_cli' | 'antigravity' | 'cursor' | 'windsurf' | 'claude_external';

export interface PromptFile {
  filename: string;
  title: string;
  description: string;
  language: 'markdown' | 'dbml' | 'json';
  content: string;
}

export interface GeneratorOptions {
  targetEditor: TargetEditor;
  projectName: string;
  domain: string;
  techStack: string;
  scale?: 'large' | 'enterprise' | 'ecosystem';
  diagrams?: any[];
  flowcharts?: any[];
  notes?: any[];
  customRequirements?: string;
}

export const TARGET_EDITORS: { id: TargetEditor; label: string; fileLabel: string; badge: string; desc: string }[] = [
  {
    id: 'claude_cli',
    label: 'Claude Code CLI',
    fileLabel: 'CLAUDE.md',
    badge: 'CLI Agent',
    desc: 'Format CLAUDE.md untuk Claude Code CLI dengan perintah eksekusi terminal piped.',
  },
  {
    id: 'antigravity',
    label: 'Google Antigravity',
    fileLabel: 'AGENTS.md',
    badge: 'AGY System',
    desc: 'Format AGENTS.md untuk Antigravity IDE dengan instruksi planning mode & artefak.',
  },
  {
    id: 'cursor',
    label: 'Cursor IDE',
    fileLabel: '.cursorrules',
    badge: 'Ruleset',
    desc: 'Format .cursorrules dengan aturan stack, konvensi kode, dan konteks skema.',
  },
  {
    id: 'windsurf',
    label: 'Windsurf Cascade',
    fileLabel: '.windsurfrules',
    badge: 'Cascade',
    desc: 'Format .windsurfrules untuk Windsurf AI dengan integrasi konteks proyek.',
  },
  {
    id: 'claude_external',
    label: 'Claude / Web AI',
    fileLabel: 'Master Prompt',
    badge: 'XML Tags',
    desc: 'Master prompt terstruktur dengan XML tags untuk Claude Web, ChatGPT, atau DeepSeek.',
  },
];

function extractDbmlFromDiagrams(diagrams: any[] = []): string {
  if (!diagrams || diagrams.length === 0) {
    return `// Skema database belum memiliki tabel\nTable users {\n  id bigint [pk, increment]\n  email varchar(255) [not null, unique]\n  created_at timestamp [default: \`now()\`]\n}`;
  }

  const chunks: string[] = [];

  for (const diag of diagrams) {
    if (diag.dbml_source || diag.dbmlSource) {
      chunks.push(String(diag.dbml_source || diag.dbmlSource).trim());
      continue;
    }

    const entities = diag.entities || [];
    if (entities.length === 0) continue;

    const diagName = diag.name || 'Diagram';
    chunks.push(`// --- Diagram: ${diagName} ---`);

    for (const ent of entities) {
      const tableName = (ent.name || 'table').toLowerCase().replace(/\s+/g, '_');
      const lines: string[] = [];
      lines.push(`Table ${tableName} {`);

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

  return chunks.length > 0 ? chunks.join('\n\n') : '// Belum ada tabel database terdefinisi.';
}

function extractFlowchartWorkflows(flowcharts: any[] = []): string {
  if (!flowcharts || flowcharts.length === 0) {
    return '### Alur Kerja Bisnis Inti\n- Mulai Permintaan Klien ➔ Validasi Input ➔ Proses Transaksi Basis Data ➔ Kirim Respon Sukses';
  }

  const sections: string[] = [];

  for (const fc of flowcharts) {
    const title = fc.title || fc.name || 'Alur Logika Bisnis';
    const data = fc.data || fc;
    const nodes = Array.isArray(data?.nodes) ? data.nodes : [];
    const edges = Array.isArray(data?.edges) ? data.edges : [];

    sections.push(`### ${title}`);

    if (nodes.length === 0) {
      sections.push('*(Tidak ada simbol alur terdefinisi)*');
      continue;
    }

    sections.push('#### Daftar Langkah & Simbol:');
    nodes.forEach((n: any, idx: number) => {
      const label = n.data?.label || n.label || `Langkah ${idx + 1}`;
      const shape = n.data?.shape || n.shape || 'proses';
      sections.push(`${idx + 1}. **[${shape.toUpperCase()}]** ${label}`);
    });

    if (edges.length > 0) {
      sections.push('\n#### Transisi Antar Langkah:');
      edges.forEach((e: any) => {
        const source = nodes.find((n: any) => n.id === e.source)?.data?.label || e.source;
        const target = nodes.find((n: any) => n.id === e.target)?.data?.label || e.target;
        const edgeLabel = e.label ? ` *(Kondisi: ${e.label})*` : '';
        sections.push(`- \`${source}\` ➔ \`${target}\`${edgeLabel}`);
      });
    }

    sections.push('\n');
  }

  return sections.join('\n');
}

function extractNotesPrd(notes: any[] = [], defaultProjectName: string, domain: string, techStack: string): string {
  const prdNote = notes.find((n) => {
    const title = (n.title || '').toLowerCase();
    return title.includes('prd') || title.includes('spesifikasi') || title.includes('requirement');
  });

  if (prdNote && prdNote.content) {
    return prdNote.content.replace(/<[^>]+>/g, '').trim();
  }

  return `# SPESIFIKASI PERSYARATAN PRODUK (PRD)

> **Proyek**: ${defaultProjectName}  
> **Domain**: ${domain}  
> **Tech Stack**: ${techStack}  
> **Status**: Disetujui untuk Implementasi

---

## 1. Ringkasan Eksekutif
Sistem enterprise kelas produksi yang dirancang untuk mendukung skalabilitas tinggi, integritas data transaksional, serta isolasi multi-tenant yang ketat.

## 2. Sasaran & Metrik Utama
- Ketersediaan layanan (SLA) 99.9%.
- Waktu respon transaksi P95 di bawah 200 milidetik.
- Audit trail penuh untuk setiap perubahan data sensitif.

## 3. Modul Domain Utama
- **Autentikasi & Otorisasi**: Manajemen sesi, RBAC granular, dan audit log.
- **Bisnis Inti**: Layanan transaksional domain ${domain} dengan validasi skema ketat.
- **Integrasi & Pelaporan**: Webhook aman, pemrosesan latar belakang, dan ekspor data terstruktur.

## 4. Matriks Hak Akses (RBAC)
- **Administrator**: Akses penuh ke seluruh konfigurasi dan mutasi data.
- **Operator**: Akses operasional harian sesuai modul yang ditugaskan.
- **Auditor**: Akses hanya-baca (Read-Only) ke log audit dan laporan transaksi.`;
}

export function generateModularPromptFiles(opts: GeneratorOptions): PromptFile[] {
  const {
    targetEditor,
    projectName = 'Sistem Enterprise',
    domain = 'SaaS Multi-Tenant',
    techStack = 'Next.js / Vite + Node.js Express + PostgreSQL (Prisma) + Tailwind CSS',
    diagrams = [],
    flowcharts = [],
    notes = [],
    customRequirements = '',
  } = opts;

  const dbmlContent = extractDbmlFromDiagrams(diagrams);
  const flowchartContent = extractFlowchartWorkflows(flowcharts);
  const prdContent = extractNotesPrd(notes, projectName, domain, techStack);

  const files: PromptFile[] = [];

  if (targetEditor === 'claude_cli') {
    files.push({
      filename: 'CLAUDE.md',
      title: 'Panduan & Aturan Claude Code CLI',
      description: 'Berkas konfigurasi utama untuk Claude Code CLI yang diletakkan di root repositori.',
      language: 'markdown',
      content: `# CLAUDE.md — Panduan Arsitektur & Perintah Proyek

## 1. Ikhtisar Proyek
- **Nama Proyek**: ${projectName}
- **Domain Bisnis**: ${domain}
- **Tech Stack**: ${techStack}

## 2. Perintah Pengembangan Inti
- Build Proyek: \`npm run build\`
- Jalankan Development: \`npm run dev\`
- Jalankan Pengujian: \`npm test\`
- Pengecekan Type / Lint: \`npx tsc --noEmit\`

## 3. Konvensi Rekayasa & Arsitektur
- **Struktur Kode Bersih**: Pisahkan logika bisnis domain di folder layanan/hook, bukan langsung di dalam komponen UI.
- **Integritas Basis Data**: Semua mutasi data wajib mematuhi skema relasional di \`03_DATABASE_SCHEMA.dbml\`.
- **Standar Eksekusi Mandiri**: Jalankan pengujian dan build verification sebelum mengonfirmasi penyelesaian tugas kepada pengguna.
- **Anti-Bloat**: Tulis kode yang ramping, modular, dan terstruktur rapi.

## 4. Perintah Eksekusi Otomatis Piped (Terminal)
\`\`\`powershell
# PowerShell:
Get-Content 05_IMPLEMENTATION_TASKS.md | claude -p "Laksanakan daftar tugas implementasi berikut secara bertahap dan mandiri."
\`\`\`
\`\`\`bash
# Bash / Zsh:
cat 05_IMPLEMENTATION_TASKS.md | claude -p "Laksanakan daftar tugas implementasi berikut secara bertahap dan mandiri."
\`\`\`
${customRequirements ? `\n## 5. Instruksi Khusus\n${customRequirements}\n` : ''}`,
    });
  } else if (targetEditor === 'antigravity') {
    files.push({
      filename: 'AGENTS.md',
      title: 'Aturan Google Antigravity Agent',
      description: 'Aturan kerja dan memori agen Google Antigravity untuk sesi pair programming.',
      language: 'markdown',
      content: `# AGENTS.md — Memori & Protokol Antigravity

## 1. Definisi Sistem
- **Proyek**: ${projectName}
- **Domain**: ${domain}
- **Stack**: ${techStack}

## 2. Alur Kerja Wajib (Planning Mode)
1. **Riset & Konteks**: Telusuri skema relasional di \`03_DATABASE_SCHEMA.dbml\` dan alur di \`04_WORKFLOWS_LOGIC.md\`.
2. **Buat Rencana Implementasi**: Sebelum memodifikasi kode inti, tulis \`implementation_plan.md\` dan minta konfirmasi jika terdapat perubahan arsitektur besar.
3. **Eksekusi Bertahap**: Kerjakan tugas per komponen sesuai urutan di \`05_IMPLEMENTATION_TASKS.md\`.
4. **Verifikasi Mandiri**: Selalu jalankan validasi build (\`npm run build\` / \`npx tsc --noEmit\`) sebelum mengklaim pekerjaan selesai.

## 3. Prinsip Kode
- Hindari duplikasi logika; abstraksikan logika berulang ke pustaka bersama.
- Selalu tangani validasi input dan penanganan kesalahan (error handling) secara graceful.
${customRequirements ? `\n## 4. Catatan Tambahan\n${customRequirements}\n` : ''}`,
    });
  } else if (targetEditor === 'cursor') {
    files.push({
      filename: '.cursorrules',
      title: 'Aturan Cursor IDE (.cursorrules)',
      description: 'Berkas .cursorrules di root proyek untuk memandu Cursor AI Composer & Chat.',
      language: 'markdown',
      content: `# Cursor Rules untuk Proyek ${projectName}

You are an expert full-stack software engineer and system architect.
Domain: ${domain}
Tech Stack: ${techStack}

## General Guidelines
- Always write production-grade TypeScript with strict type checking.
- Adhere strictly to the relational schema specified in 03_DATABASE_SCHEMA.dbml.
- Never write placeholder code or stub implementations without explicit user request.
- Keep components modular, focused, and maintainable.
- Ensure all API endpoints perform proper authorization and input schema validation.

## Business Workflows
- Follow the business logic rules defined in 04_WORKFLOWS_LOGIC.md.
${customRequirements ? `\n## Custom Directives\n${customRequirements}\n` : ''}`,
    });
  } else if (targetEditor === 'windsurf') {
    files.push({
      filename: '.windsurfrules',
      title: 'Aturan Windsurf Cascade (.windsurfrules)',
      description: 'Berkas .windsurfrules untuk memandu agen Cascade di editor Windsurf.',
      language: 'markdown',
      content: `# Windsurf Cascade Rules for ${projectName}

Domain: ${domain}
Tech Stack: ${techStack}

1. System Architecture:
   - Follow Clean Architecture with clear domain boundaries.
   - Use the database schema in 03_DATABASE_SCHEMA.dbml as the single source of truth for entity models.
2. Code Standards:
   - Type-safe TypeScript.
   - Graceful error boundaries and standardized API error contracts.
3. Implementation Plan:
   - Execute tasks step-by-step from 05_IMPLEMENTATION_TASKS.md.
${customRequirements ? `\n4. Additional Instructions:\n${customRequirements}\n` : ''}`,
    });
  } else {
    files.push({
      filename: '01_SYSTEM_INSTRUCTIONS.md',
      title: 'Instruksi Sistem AI Eksternal',
      description: 'Prompt pembuka berformat XML untuk Claude Web, ChatGPT, atau DeepSeek.',
      language: 'markdown',
      content: `<system_role>
You are a Principal Software Architect and Lead Engineering Agent.
Your objective is to implement the production-grade system for project "${projectName}".
Domain: ${domain}
Tech Stack: ${techStack}
</system_role>

<rules>
1. Strictly follow the database schema provided in <database_schema>.
2. Implement business logic according to <workflow_logic>.
3. Complete each task specified in <implementation_tasks> with full working code.
4. No shortcuts, no dummy placeholders.
</rules>
${customRequirements ? `\n<custom_requirements>\n${customRequirements}\n</custom_requirements>\n` : ''}`,
    });
  }

  files.push({
    filename: '02_PRD_SPECIFICATION.md',
    title: 'Spesifikasi Produk & Persyaratan (PRD)',
    description: 'Dokumen kebutuhan fungsional dan non-fungsional sistem.',
    language: 'markdown',
    content: prdContent,
  });

  files.push({
    filename: '03_DATABASE_SCHEMA.dbml',
    title: 'Skema Basis Data (DBML)',
    description: 'Definisi tabel, relasi, tipe data, dan indeks relasional.',
    language: 'dbml',
    content: dbmlContent,
  });

  files.push({
    filename: '04_WORKFLOWS_LOGIC.md',
    title: 'Alur Kerja & Logika Bisnis',
    description: 'Transisi state dan alur keputusan yang diekstrak dari diagram alir proyek.',
    language: 'markdown',
    content: flowchartContent,
  });

  files.push({
    filename: '05_IMPLEMENTATION_TASKS.md',
    title: 'Daftar Tugas Implementasi Bertahap',
    description: 'Roadmap tugas eksekusi mandiri untuk asisten koding AI.',
    language: 'markdown',
    content: `# ROADMAP TUGAS IMPLEMENTASI: ${projectName}

Laksanakan tugas-tugas berikut secara berurutan. Setiap tahap harus diverifikasi sebelum beralih ke tahap berikutnya.

---

### Tahap 1: Inisialisasi Fondasi & Migrasi Basis Data
- [ ] Buat file migrasi atau skema ORM (Prisma / Drizzle / SQL) berdasarkan \`03_DATABASE_SCHEMA.dbml\`.
- [ ] Terapkan relasi foreign key, constraint unik, serta kolom audit (\`created_at\`, \`updated_at\`, \`deleted_at\`).
- [ ] Buat skrip seeder data awal untuk tabel master dan peran pengguna dasar.
- [ ] *Verifikasi*: Pastikan migrasi database berjalan sukses tanpa error relasi.

### Tahap 2: Lapisan Domain & Logika Bisnis Inti
- [ ] Buat modul layanan (services) untuk domain **${domain}**.
- [ ] Implementasikan validasi skema input untuk setiap entitas.
- [ ] Terapkan aturan transisi alur kerja sesuai spesifikasi di \`04_WORKFLOWS_LOGIC.md\`.
- [ ] *Verifikasi*: Uji validasi input dengan data valid dan data invalid.

### Tahap 3: Kontrak API & Autentikasi / RBAC
- [ ] Rancang endpoint REST / Server Actions dengan amplop respon seragam (\`{ success, data, error }\`).
- [ ] Terapkan middleware verifikasi token dan isolasi multi-tenant.
- [ ] Pasang pemeriksaan hak akses (RBAC) pada setiap endpoint sensitif.
- [ ] *Verifikasi*: Pastikan endpoint mengembalikan 401/403 jika izin tidak mencukupi.

### Tahap 4: Antarmuka Pengguna & Komponen Frontend
- [ ] Bangun halaman antarmuka responsif mengacu pada modul PRD di \`02_PRD_SPECIFICATION.md\`.
- [ ] Integrasikan panggilan API dengan penanganan loading state dan toast notifikasi.
- [ ] Pastikan tampilan rapi pada perangkat mobile dan desktop.

### Tahap 5: Verifikasi Akhir & Pengujian End-to-End
- [ ] Jalankan pengecekan tipe (\`npx tsc --noEmit\`).
- [ ] Jalankan kompilasi produksi (\`npm run build\`).
- [ ] Buat ringkasan implementasi dan catatan operasional.`,
  });

  return files;
}

export function generateAllInOnePrompt(files: PromptFile[], projectName: string): string {
  const parts: string[] = [
    `# MASTER PROMPT BUNDEL ARSITEKTUR & IMPLEMENTASI: ${projectName}`,
    `> Dokumen ini memuat seluruh spesifikasi arsitektur, skema relasional, alur logika, dan panduan kode untuk proyek "${projectName}".`,
    `---`,
  ];

  for (const file of files) {
    parts.push(`\n## BERKAS: \`${file.filename}\` (${file.title})\n`);
    parts.push(`\`\`\`${file.language}\n${file.content}\n\`\`\`\n---`);
  }

  return parts.join('\n');
}

export async function exportPromptBundleZip(files: PromptFile[], projectName: string): Promise<void> {
  const zip = new JSZip();
  const folderName = `ai-prompt-${projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'project'}`;
  const root = zip.folder(folderName) || zip;

  for (const f of files) {
    root.file(f.filename, f.content);
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
