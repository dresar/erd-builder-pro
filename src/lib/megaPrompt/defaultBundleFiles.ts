import { getBundleReadmeDoc } from './bundleReadmeDoc';
import { getBundleAgentsDoc } from './bundleAgentsDoc';

export interface GeneratedBundleFile {
  path: string;
  title: string;
  role?: string;
  language: string;
  content: string;
}

export interface BundleConfig {
  projectName: string;
  domain: string;
  techStack: string;
  fullDbml: string;
}

export function generateDefaultBundleFiles(config: BundleConfig): GeneratedBundleFile[] {
  const proj = config.projectName.trim() || 'Sistem Enterprise';
  const domain = config.domain.trim() || 'SaaS Multi-Tenant';
  const techStack = config.techStack.trim() || 'Next.js 15 + Neon PostgreSQL + Express + Tailwind CSS';
  const dbml = config.fullDbml;

  return [
    {
      path: 'README.md',
      title: 'Master Overview',
      role: 'Project',
      language: 'markdown',
      content: getBundleReadmeDoc(proj, domain, techStack),
    },
    {
      path: 'AGENTS.md',
      title: 'Protokol Tim Agen AI',
      role: 'Orchestration',
      language: 'markdown',
      content: getBundleAgentsDoc(proj, domain, techStack),
    },
    {
      path: 'docs/README.md',
      title: 'Panduan Direktori Docs',
      role: 'Documentation',
      language: 'markdown',
      content: `# Direktori Dokumentasi Proyek (/docs)

Direktori ini memuat 10 dokumen arsitektur komprehensif sistem ${proj}:
- 01_PRD.md: Spesifikasi kebutuhan produk formal.
- 02_ARCHITECTURE.md: Topologi arsitektur sistem dan ADR.
- 03_DATABASE_DESIGN.md: Desain skema basis data relasional.
- 04_API_SPECIFICATION.md: Kontrak REST API dan skema Zod.
- 05_WORKFLOWS.md: Alur logika transaksi bisnis.
- 06_UI_UX_SPECIFICATION.md: Spesifikasi antarmuka presisi dan mobile 2-grid.
- 07_SECURITY_RBAC.md: Matriks izin dan isolasi multi-tenant.
- 08_ENV_DEPLOYMENT.md: Konfigurasi env dan panduan deploy.
- 09_QA_TEST_PLAN.md: Strategi pengujian dan checklist rilis.
- 10_RELEASE_ROADMAP.md: Rencana tahapan rilis fitur.`,
    },
    {
      path: 'docs/01_PRD.md',
      title: 'Spesifikasi Kebutuhan Produk (PRD)',
      role: 'Product',
      language: 'markdown',
      content: `# Dokumen Spesifikasi Kebutuhan Produk (PRD)
## Proyek: ${proj} | Domain: ${domain}

### 1. Latar Belakang & Visi Produk
Platform dirancang untuk menyelesaikan inefisiensi alur kerja pada industri ${domain} dengan otomatisasi terpusat.

### 2. Sasaran Pengguna & Persona
- **Administrator Utama**: Mengelola seluruh konfigurasi, audit trail, dan data tenant.
- **Operator Lapangan**: Menjalankan input data operasional harian secara cepat dan responsif.
- **Klien / Pelanggan**: Mengakses dasbor mandiri untuk melihat status transaksi.

### 3. Matriks Hak Akses (RBAC)
| Peran | Baca | Tulis | Ubah | Hapus |
|---|---|---|---|---|
| Superadmin | Ya | Ya | Ya | Ya |
| Manajer | Ya | Ya | Ya | Tidak |
| Operator | Ya | Ya | Terbatas | Tidak |
| Klien | Ya | Tidak | Tidak | Tidak |`,
    },
    {
      path: 'docs/02_ARCHITECTURE.md',
      title: 'Arsitektur Sistem & ADR',
      role: 'Architecture',
      language: 'markdown',
      content: `# Arsitektur Sistem & Catatan Keputusan (ADR)

## 1. Topologi Sistem
Sistem mengadopsi pola Clean Architecture dengan Serverless Backend terpadu:
- Klien Web / PWA ➔ Reverse Proxy / CDN ➔ Edge Route Handlers ➔ Pooler Neon PostgreSQL.

## 2. ADR 001: Satu Root Monorepo
- Memusatkan backend dan frontend dalam 1 package.json untuk mencegah duplikasi dependensi node_modules.

## 3. ADR 002: Neon Serverless PostgreSQL
- Menggunakan database serverless dengan pgvector dan connection pooling bawaan.`,
    },
    {
      path: 'docs/03_DATABASE_DESIGN.md',
      title: 'Desain Skema Basis Data',
      role: 'Database',
      language: 'markdown',
      content: `# Desain Skema Basis Data Relasional

## 1. Prinsip Normalisasi
Seluruh skema database mengikuti standar normalisasi 3NF dengan primary key, foreign key eksplisit, dan indeks unik.

## 2. Relasi Skema
Rincian skema relasional terdefinisi lengkap di database/schema.dbml dan dieksekusi melalui database/schema.sql.`,
    },
    {
      path: 'docs/04_API_SPECIFICATION.md',
      title: 'Spesifikasi Kontrak REST API',
      role: 'Backend API',
      language: 'markdown',
      content: `# Spesifikasi Kontrak REST API

## 1. Format Respons Seragam
- Sukses: { "success": true, "data": T }
- Gagal: { "success": false, "error": string, "code": string }

## 2. Validasi Permintaan
Seluruh body permintaan divalidasi ketat menggunakan skema Zod sebelum diproses oleh service layer.`,
    },
    {
      path: 'docs/05_WORKFLOWS.md',
      title: 'Alur Logika Transaksi Bisnis',
      role: 'Workflows',
      language: 'markdown',
      content: `# Alur Logika Transaksi Bisnis

## 1. Alur Transaksi Utama
1. Klien mengirim permintaan mutasi data.
2. Validasi autentikasi sesi dan peran RBAC.
3. Transaksi database dimulai (BEGIN TRANSACTION).
4. Mutasi data dieksekusi dan log audit dicatat.
5. Transaksi berhasil dikomit (COMMIT) dan respons dikembalikan.`,
    },
    {
      path: 'docs/06_UI_UX_SPECIFICATION.md',
      title: 'Spesifikasi Antarmuka UI/UX',
      role: 'UI/UX',
      language: 'markdown',
      content: `# Spesifikasi Antarmuka UI/UX Khusus

## 1. Form Pembuatan Data (Slide-Up Bottom Sheet Card)
- Dilarang modal tengah standar. Wajib kartu beranimasi slide-up dari bawah layar.
- Dilengkapi drag handle, blur backdrop, dan sticky action bar di bagian bawah.

## 2. Tampilan Grid Mobile (Aturan Wajib 2-Grid)
- Pada viewport mobile (< 640px), grid katalog wajib 2 kolom (grid-cols-2), dilarang 1 kolom.

## 3. Navigasi Terkunci (Sticky Header & Sidebar)
- Header dan Sidebar wajib terkunci (fixed) dan dilarang bergerak saat konten di-scroll.`,
    },
    {
      path: 'docs/07_SECURITY_RBAC.md',
      title: 'Keamanan & Matriks Akses RBAC',
      role: 'Security',
      language: 'markdown',
      content: `# Tata Kelola Keamanan & RBAC

## 1. Isolasi Data Multi-Tenant
Setiap query SELECT/UPDATE/DELETE wajib menyertakan filter tenant_id = current_tenant_id.

## 2. Perlindungan Kredensial
Dilarang hardcode secret token di codebase (/env-secrets-management). Seluruh rahasia dibaca dari process.env.`,
    },
    {
      path: 'docs/08_ENV_DEPLOYMENT.md',
      title: 'Panduan Deployment & Environtment',
      role: 'DevOps',
      language: 'markdown',
      content: `# Panduan Environtment & Deployment

## 1. Variabel Environtment (.env)
- DATABASE_URL: URL koneksi pooling Neon PostgreSQL
- JWT_SECRET: Kunci penandatangan token sesi
- APP_ENV: production / development / staging

## 2. Deployment Serverless
Deploy otomatis ke Vercel atau Cloudflare Pages dengan build command: npm run build.`,
    },
    {
      path: 'docs/09_QA_TEST_PLAN.md',
      title: 'Rencana Pengujian & QA',
      role: 'QA',
      language: 'markdown',
      content: `# Rencana Pengujian Kualitas & QA

## 1. Matriks Pengujian
- Pengujian Unit (Vitest): Menjamin logika bisnis dan service layer bebas cacat.
- Pengujian Kompilasi (tsc): npx tsc --noEmit wajib selesai dengan 0 error.
- Pengujian Build: npm run build wajib berhasil sebelum rilis ke staging.`,
    },
    {
      path: 'docs/10_RELEASE_ROADMAP.md',
      title: 'Roadmap & Tahapan Rilis',
      role: 'Product',
      language: 'markdown',
      content: `# Rencana Tahapan Rilis Produk

## Fase 1: Fondasi Backend & Database (Minggu 1)
- DDL PostgreSQL, migrasi Prisma, dan service repository.

## Fase 2: UI Presisi & Integrasi API (Minggu 2)
- Bottom-sheet input card, mobile 2-grid catalog, dan dasbor analitik.

## Fase 3: Hardening Keamanan & Verifikasi QA (Minggu 3)
- Audit RBAC, validasi zero-leak kredensial, dan rilis produksi.`,
    },
    {
      path: 'database/README.md',
      title: 'Panduan Direktori Database',
      role: 'Database',
      language: 'markdown',
      content: `# Direktori Basis Data (/database)

Direktori ini berisi aset skema relasional sistem ${proj}:
- schema.dbml: Skema visual relasional lengkap dengan foreign keys.
- schema.sql: Skrip DDL PostgreSQL untuk membuat tabel, indeks, dan trigger.
- seed.sql: Data master awal untuk pengujian lokal dan inisialisasi sistem.`,
    },
    {
      path: 'database/schema.dbml',
      title: 'Skema DBML',
      role: 'Database',
      language: 'dbml',
      content: dbml,
    },
    {
      path: 'database/schema.sql',
      title: 'DDL PostgreSQL',
      role: 'Database',
      language: 'sql',
      content: `-- Skema DDL PostgreSQL untuk ${proj}
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);`,
    },
    {
      path: 'database/seed.sql',
      title: 'Seed Data PostgreSQL',
      role: 'Database',
      language: 'sql',
      content: `-- Seed Data Master untuk ${proj}
INSERT INTO users (email) VALUES ('admin@enterprise.local') ON CONFLICT DO NOTHING;`,
    },
    {
      path: '.agents/README.md',
      title: 'Panduan Direktori Tim Agen AI',
      role: 'AI Team',
      language: 'markdown',
      content: `# Direktori Tim Agen AI (/.agents)

Direktori ini memuat berkas panduan operasional 5 Agen AI:
- 01_TECH_LEAD.md: Tata kelola arsitektur.
- 02_DATABASE_BACKEND.md: Rekayasa basis data & backend.
- 03_FRONTEND_UI.md: Rekayasa antarmuka & UX presisi.
- 04_SECURITY_AUTH.md: Kepatuhan keamanan & RBAC.
- 05_QA_TESTER.md: Strategi pengujian & verifikasi build.
- AGENTS_PROTOCOL.md: Protokol komunikasi tim.`,
    },
    {
      path: '.agents/01_TECH_LEAD.md',
      title: 'Agent 1: Tech Lead & Architect',
      role: 'Tech Lead',
      language: 'markdown',
      content: `# Agent 1: Tech Lead & System Architect
Tanggung Jawab: Memimpin arsitektur sistem, membagi tugas ke agen spesialis, dan menegakkan Clean Architecture.`,
    },
    {
      path: '.agents/02_DATABASE_BACKEND.md',
      title: 'Agent 2: Database & Backend',
      role: 'Backend',
      language: 'markdown',
      content: `# Agent 2: Database & Backend Engineer
Tanggung Jawab: Mengelola skema relasional PostgreSQL, koneksi serverless Neon, dan service layer transaksional.`,
    },
    {
      path: '.agents/03_FRONTEND_UI.md',
      title: 'Agent 3: Frontend & UI/UX',
      role: 'Frontend',
      language: 'markdown',
      content: `# Agent 3: Frontend & UI/UX Specialist
Tanggung Jawab: Membangun komponen UI presisi, slide-up bottom sheet card, mobile 2-grid, dan sticky header.`,
    },
    {
      path: '.agents/04_SECURITY_AUTH.md',
      title: 'Agent 4: Security & RBAC',
      role: 'Security',
      language: 'markdown',
      content: `# Agent 4: Security & Compliance Specialist
Tanggung Jawab: Menegakkan sesi autentikasi, isolasi data multi-tenant, dan perlindungan kredensial .env.`,
    },
    {
      path: '.agents/05_QA_TESTER.md',
      title: 'Agent 5: QA & Verification',
      role: 'QA',
      language: 'markdown',
      content: `# Agent 5: QA & Verification Engineer
Tanggung Jawab: Melakukan pengujian otomatis, memvalidasi build tsc, dan menguji skenario edge-case.`,
    },
    {
      path: '.agents/AGENTS_PROTOCOL.md',
      title: 'Protokol Koordinasi Tim Agen',
      role: 'Coordination',
      language: 'markdown',
      content: `# Protokol Koordinasi Tim Multi-Agent
Aturan sinkronisasi antar agen AI dalam mengeksekusi backlog pengembangan fitur secara terkoordinasi.`,
    },
    {
      path: 'src/README.md',
      title: 'Panduan Direktori Kode Sumber (/src)',
      role: 'Source Code',
      language: 'markdown',
      content: `# Direktori Kode Sumber (/src)

## Aturan Manajemen Folder Wajib:
1. **Maksimal 10 Berkas per Folder**: Dilarang meletakkan lebih dari 10 berkas kode dalam 1 direktori. Wajib pecah ke sub-folder domain.
2. **Maksimal 1.000 Baris per Berkas**: Dilarang membuat berkas kode lebih dari 1.000 baris. Dianjurkan refaktor pada 300–400 baris.
3. **Nol Komentar (/nokomen)**: Seluruh berkas kode dilarang memuat komentar inline. Keterbacaan dicapai melalui penamaan modul yang jelas.`,
    },
  ];
}
