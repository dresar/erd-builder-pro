export function getBundleReadmeDoc(projectName: string, domain: string, techStack: string): string {
  const proj = projectName.trim() || 'Sistem Enterprise';
  const dom = domain.trim() || 'SaaS Multi-Tenant';
  const stack = techStack.trim() || 'Next.js 15 + Neon PostgreSQL (Prisma) + Express + Tailwind CSS';

  return `# ${proj} — Dokumentasi Master Proyek
Sistem Enterprise Kelas Dunia untuk Domain: **${dom}**

## 1. Ikhtisar Sistem
${proj} adalah platform kelas enterprise berkinerja tinggi yang dirancang untuk otomasi operasional terpadu, tata kelola data relasional multi-tenant, dan antarmuka presisi responsif.

## 2. Stack Teknologi Utama
- **Backend & Database**: ${stack}
- **Infrastruktur Basis Data**: Neon Serverless PostgreSQL dengan pooling koneksi
- **Frontend & UI**: Next.js 15 / React 19 + Tailwind CSS v4
- **Design System**: /precision-card-button-ui dan /button-presisi
- **Validasi & Skema**: Zod, TypeScript Strict Mode
- **Autentikasi & Keamanan**: JWT, Argon2/Bcrypt, Edge Middleware RBAC

## 3. Tata Kelola Arsitektur & Manajemen Folder
- **Satu Root Monorepo**: 1 file package.json di root. Dilarang nested node_modules.
- **Batas Berkas per Folder**: Maksimal 10 berkas kode (.ts, .tsx, .py) per direktori.
- **Batas Baris Kode**: Maksimal 1.000 baris per berkas. Refaktor disarankan pada 300–400 baris.
- **Standar Nol Komentar (/nokomen)**: 100% bebas komentar inline. Seluruh kode self-documenting.
- **Dokumentasi Folder**: Setiap direktori wajib memiliki README.md penjelas fungsi.

## 4. Roadmap Eksekusi Otonom 5 Fase
1. **Fase 1: Scaffolding & Basis Data**: Konfigurasi root, schema.prisma penuh, seed.ts, lib/prisma.ts.
2. **Fase 2: Auth & Middleware**: JWT utilities, Edge Middleware multi-tenant, RBAC route guards.
3. **Fase 3: REST API Endpoints**: CRUD lengkap seluruh entitas, validasi Zod, observability /health.
4. **Fase 4: Frontend & Portals**: Antarmuka presisi, slide-up bottom sheet, mobile 2-grid, dashboard admin.
5. **Fase 5: Verifikasi & Rilis**: Uji otomatis Vitest, build check tsc, deployment serverless.

## 5. Standar UI/UX Khusus
- **Mobile 2-Grid**: Tampilan katalog pada mobile (< 640px) wajib 2 kolom (grid-cols-2).
- **Slide-Up Bottom Sheet Card**: Form pembuatan/edit data wajib muncul dari bawah layar dengan drag handle.
- **Tombol Presisi**: Tinggi compact 32–38px, radius 5–8px, micro-click active:scale-[0.98]. Dilarang rounded-full (pill).
- **Microcopy Super Singkat**: Placeholder maksimal 1 kata, label tombol maksimal 1–2 kata.
`;
}
