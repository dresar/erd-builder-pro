export function getEnterprisePrdSection(projectName: string, domain: string, existingNotes: string): string {
  const antiSlopPrdDirective = `
### STANDAR DOKUMENTASI PRODUK & ANTI-SLOP PRD (/anti-slop-writing)
Seluruh bab spesifikasi produk, user stories, dan dokumentasi teknis WAJIB mematuhi standar /anti-slop-writing:
1. Larangan Kosakata & Klise AI (EN & ID):
   - Dilarang keras menggunakan kata klise AI: "delve", "tapestry", "robust", "streamline", "seamless", "game-changer", "elevate", "cutting-edge", "unleash", "testament", "beacon", "Di era digital yang serba cepat ini...", "Menyelami lebih dalam...", "Sebuah bukti nyata...", "Tidak hanya X, tetapi juga Y...".
2. Gaya Bahasa Praktisi Autentik (Human Practitioner Voice):
   - Gunakan fakta teknis terukur, nama tabel/kolom nyata, dan bahasa lugas tanpa pembuka klise korporat.
   - Variasi ritme kalimat (Burstiness): Kombinasikan kalimat pendek 3-5 kata dengan kalimat majemuk terstruktur 15-25 kata. Hindari pola panjang kalimat yang monoton.
   - Hindari 'Rule of Three' mekanis (kebiasaan AI mengelompokkan 3 kata sifat berulang). Gunakan 1, 2, 4, atau 5 poin sesuai kebutuhan teknis riil.
3. Disiplin Tanda Baca & Tipografi:
   - Em dash (—) maksimal 1 per 500 kata.
   - Tanda seru (!) maksimal 1 per 1.000 kata. Biarkan substansi kalimat yang menyampaikan urgensi.
4. Spesifikasi Faktual & Zero Hallucination:
   - Dilarang membuat angka metrik fiktif. Seluruh alur state machine, batasan domain, dan skema payload wajib definitif.`;

  if (existingNotes && existingNotes.trim().length > 100) {
    return `=======================================================================
[SECTION 1: PRODUCT REQUIREMENTS DOCUMENT (PRD - BAHASA INDONESIA RESMI)]
=======================================================================
# DOKUMEN SPESIFIKASI PRODUK & KEBUTUHAN SISTEM (PRD)
> Sistem: ${projectName}
> Domain: ${domain}
> Klasifikasi: Spesifikasi Produksi Enterprise Multi-Tenant
> Target Ketersediaan: 99.9% Uptime SLA | Same-Day Settlement | Zero Data Leak
${antiSlopPrdDirective}

${existingNotes.trim()}
`;
  }

  return `=======================================================================
[SECTION 1: PRODUCT REQUIREMENTS DOCUMENT (PRD - BAHASA INDONESIA RESMI)]
=======================================================================
# DOKUMEN SPESIFIKASI PRODUK & ARSITEKTUR (PRD) — ${projectName.toUpperCase()}

> Proyek: ${projectName}
> Domain Bisnis: ${domain}
> Status: Spesifikasi Produksi Enterprise
> Versi: 1.0.0
> Target Arsitektur: Modular Monolith / Cloud-Native Multi-Tenant
${antiSlopPrdDirective}

## 1. Latar Belakang & Sasaran Strategis
Sistem ini dirancang untuk menjawab tantangan operasional berskala enterprise pada domain ${domain}.
Sistem yang ada sebelumnya terfragmentasi, mengandalkan proses manual yang rentan terhadap human error, rekonsiliasi data yang lambat, serta visibilitas pelaporan yang minim.
${projectName} hadir sebagai single source of truth yang mengintegrasikan seluruh siklus proses bisnis dari hulu ke hilir.

Sasaran Strategis:
1. Memangkas waktu pemrosesan operasional utama hingga 75% melalui otomatisasi alur kerja digital.
2. Mencapai rekonsiliasi finansial dan transaksional same-day dengan audit trail tak terhapus.
3. Menjamin isolasi data antar-entitas / tenant secara absolut (Zero Data Leakage).
4. Menyediakan antarmuka responsif kelas dunia dengan latensi interaksi di bawah 100ms.

## 2. Arsitektur Solusi & Topologi Sistem
Arsitektur menerapkan pola Modular Monolith dengan batas domain (bounded context) yang tegas.
- Frontend: Next.js 15 (App Router) + React 19 + Tailwind CSS v4 + Lucide Icons.
- Backend: RESTful API Layer (Express / Next Serverless Routes) dengan arsitektur controller-service-repository.
- Basis Data: Neon Serverless PostgreSQL (Prisma ORM) dengan pooling koneksi bawaan dan skema relasional 3NF.
- Penyimpanan Berkas: Object Storage S3-Compatible (Cloudflare R2) dengan presigned URL berbatas waktu.
- Keamanan: Isolasi data multi-tenant berbasis tenant_id/campus_id terindeks, JWT dengan refresh token rotasi berkala.

## 3. Dekomposisi Modul Fungsional (Domain-Driven Design)
1. Modul Manajemen Identitas, Autentikasi & RBAC:
   - Manajemen pengguna, peran (roles), izin modular (permissions), dan sesi aman.
2. Modul Operasional Inti (Core Engine):
   - Manajemen master data, siklus hidup entitas utama, validasi status berjenjang.
3. Modul Transaksi & Keuangan Digital:
   - Invoice generator, integrasi payment gateway (Virtual Account / QRIS), pembukuan otomatis.
4. Modul Pelaporan & Dasbor Analitik:
   - Agregasi metrik performa real-time, ekspor laporan berkala, filter data multi-dimensi.
5. Modul Audit Trail & Notifikasi:
   - Pencatatan log perubahan data sensitif, webhook pesan WhatsApp / Email terotomasi.

## 4. Matriks Peran & Hak Akses (RBAC)
- Superadmin: Akses penuh (Full Access) lintas seluruh tenant dan modul konfigurasi global.
- Tenant Admin / Manajer: Akses administratif penuh terbatas pada lingkup tenant terkait.
- Staf Operasional: Akses tulis/edit pada modul operasional harian sesuai penugasan.
- Verifikator / Auditor: Hak baca (Read-only) dan verifikasi dokumen/transaksi khusus.
- Pengguna Akhir / Klien: Hak kelola profil pribadi, melihat tagihan, dan mengajukan permohonan.

## 5. Standar Kontrak API & Komunikasi
- Pola RESTful standar dengan awalan /api/v1.
- Format respon JSON konsisten: { success: boolean, data?: any, error?: { code: string, message: string } }.
- Pagination seragam: query params page=1, limit=20, sort_by=created_at, order=desc.
- Wajib header otorisasi Bearer Token dan tenant identifier pada seluruh endpoint privat.

## 6. Kebijakan Keamanan & Kepatuhan Basis Data
- Enkripsi at-rest untuk kolom sensitif (AES-256) dan in-transit (TLS 1.3).
- Larangan Physical Delete: Penghapusan entitas domain dilarang keras secara fisik. Wajib soft-delete (deleted_at) dengan ON DELETE RESTRICT.
- ON DELETE CASCADE hanya diizinkan untuk data teknis turunan sementara (misal: token verifikasi sementara).
- Rate limiting ketat per IP dan per sesi pengguna untuk mencegah brute-force dan DoS.

## 7. Service Level Agreement (SLA) & Target Performa
- Ketersediaan Sistem: 99.9% uptime SLA per bulan kalender.
- Response Time: API p95 < 200ms, Server-side rendered pages < 500ms.
- Target RTO (Recovery Time Objective) < 1 jam, RPO (Recovery Point Objective) < 15 menit.
`;
}
