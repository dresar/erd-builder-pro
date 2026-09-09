export function getBundleAgentsDoc(projectName: string, domain: string, techStack: string): string {
  const proj = projectName.trim() || 'Sistem Enterprise';
  const dom = domain.trim() || 'SaaS Multi-Tenant';
  const stack = techStack.trim() || 'Next.js 15 + Neon PostgreSQL (Prisma) + Express + Tailwind CSS';

  return `# Multi-Agent Synchronization Protocol & Autonomous Execution Directive
# Target System: "${proj}" | Domain: "${dom}" | Stack: ${stack}

## 1. Tim 5 Agen AI & Pembagian Tanggung Jawab
Protokol kerja tim 5 agen AI yang terkoordinasi secara otonom:
1. **Tech Lead** (.agents/01_TECH_LEAD.md): Tata kelola arsitektur, monorepo, dan pemisahan modul.
2. **Database & Backend** (.agents/02_DATABASE_BACKEND.md): Skema relasional PostgreSQL, koneksi Neon, migrasi, dan service API.
3. **Frontend & UI** (.agents/03_FRONTEND_UI.md): Komponen UI presisi, slide-up bottom sheet, mobile 2-grid, dan sticky navigation.
4. **Security & Auth** (.agents/04_SECURITY_AUTH.md): Autentikasi sesi JWT, RBAC matrix, isolasi data multi-tenant, dan perlindungan kredensial.
5. **QA & Tester** (.agents/05_QA_TESTER.md): Verifikasi build (tsc + npm run build) dan pengujian otomatis Vitest.

## 2. Peringatan Keras: Larangan Pasivitas & Basa-Basi untuk AI Assistant
Agen AI (Claude Code CLI, ChatGPT, Cursor, Windsurf, Antigravity) DILARANG KERAS:
- Mengatakan: "File sudah saya terima...", "I took a look at the file...", "Kirimkan tugas yang ingin dikerjakan...", "What would you like me to do next?"
- Meminta konfirmasi atau mengajukan pertanyaan klarifikasi — seluruh spesifikasi arsitektur dan skema telah lengkap 100%.
- Meringkas atau membuat esai tentang proyek ini tanpa menulis kode nyata.
- Menggunakan placeholder seperti "// TODO", "// remaining tables", atau "...rest of code".

## 3. Roadmap Eksekusi Otonom 5 Fase (Mulai Fase 1 Sekarang)
- **Fase 1: Scaffolding & Database**: package.json monorepo, tsconfig.json, next.config.mjs, skema lengkap prisma/schema.prisma, seed data prisma/seed.ts, dan src/lib/prisma.ts.
- **Fase 2: Auth & Middleware**: JWT utilities, Edge Middleware (deteksi subdomain tenant, verifikasi token, RBAC guards), dan error handlers.
- **Fase 3: REST API Endpoints**: Auth routes, CRUD lengkap seluruh entitas domain dengan validasi Zod, pagination, dan observability /api/v1/health.
- **Fase 4: Frontend & Portals**: Desain Tailwind CSS v4, landing portal, dashboard admin multi-tenant, dashboard operator, dan portal pengguna.
- **Fase 5: Verifikasi & Rilis**: Build verification (npm run build exit 0), pengujian otomatis Vitest, dan panduan deployment serverless.

## 4. Ratusan Aturan Permanen Sistem & Tata Kelola
- **Monorepo**: 1 root package.json. Dilarang nested package.json dengan duplikasi node_modules.
- **Batas Direktori**: Maksimal 10 berkas kode per folder. Wajib pecah ke subdirektori jika lebih.
- **Batas Panjang Berkas**: Maksimal 1.000 baris per berkas kode. Dianjurkan refaktor pada 300–400 baris.
- **Nol Komentar (/nokomen)**: Seluruh kode wajib 100% bebas komentar inline (//, /* */, {# #}).
- **TypeScript Ketat**: Strict mode aktif, 0 any types, antarmuka eksplisit.
- **Database 3NF**: Primary key UUIDv7 / BigInt, foreign keys eksplisit, audit timestamp (created_at, updated_at, deleted_at).
- **Isolasi Multi-Tenant**: Filter tenant_id / campus_id wajib pada seluruh query entitas tenant.
- **Mobile 2-Grid**: Tampilan katalog pada layar mobile (< 640px) WAJIB 2 kolom (grid-cols-2). Dilarang 1 kolom.
- **Slide-Up Bottom Sheet**: Form entitas wajib menggunakan slide-up bottom sheet card dari bawah layar, bukan modal tengah.
- **Tombol Presisi**: Tinggi compact 32-38px, font 11-13px, radius 5-8px, micro-click active:scale-[0.98]. DILARANG bentuk pill (rounded-full).
- **Microcopy**: Placeholder form maksimal 1 kata. Label tombol aksi maksimal 1–2 kata. Nol filler text.
`;
}
