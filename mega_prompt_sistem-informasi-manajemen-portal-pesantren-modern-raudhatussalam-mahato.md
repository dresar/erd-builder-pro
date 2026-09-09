# =======================================================================
# CRITICAL MASTER DIRECTIVE: AUTONOMOUS IMMEDIATE EXECUTION PROTOCOL
# MANDATORY INSTRUCTIONS FOR CLAUDE CODE CLI, CHATGPT, CURSOR, AND ALL AI AGENTS
# =======================================================================

# [RULE 1: ABSOLUTE PROHIBITION OF PASSIVITY, WAITING, & CHATTING]
# -----------------------------------------------------------------------
# ⚠️ ZERO-TOLERANCE WARNING FOR AI ASSISTANTS:
# 1. DO NOT SAY:
#    - "File mega_prompt... sudah saya terima dan siap dikerjakan."
#    - "I took a look at the file you uploaded — it's a very large mega orchestrator prompt..."
#    - "Since this is a very large scope, I want to make sure I build the right thing..."
#    - "Kirimkan saja tugas yang ingin dikerjakan..."
#    - "Bagian mana yang ingin Anda buat terlebih dahulu?"
#    - "What would you like me to do next?"
#
# 2. DO NOT ASK FOR CLARIFICATION OR PERMISSION:
#    - Every single architectural requirement, database table (30+ models), API contract (40+ endpoints),
#      RBAC role, tenant isolation rule, and business logic is ALREADY 100% SPECIFIED in this document.
#    - You have ZERO REASON to ask questions or hesitate. Everything you need is already here.
#    - Asking questions or waiting for user confirmation is considered a TASK FAILURE.
#
# 3. DO NOT SUMMARIZE THIS PROMPT OR WRITE ESSAYS ABOUT IT:
#    - The user compiled this prompt and knows every line in it.
#    - Do NOT regurgitate what the prompt is about.
#    - Do NOT write commentary, meta-analysis, or pleasantries.
#
# 4. YOUR ONLY PERMISSIBLE ACTION UPON RECEIVING THIS PROMPT:
#    - START CODING AND GENERATING THE ACTUAL REPOSITORY FILES IMMEDIATELY.
#    - If you have file-creation tools (Claude Code CLI, Cursor, Antigravity, Windsurf):
#      Write the actual files to disk right now without asking.
#    - If you are in a web chat (ChatGPT, Claude web):
#      Immediately output the complete production code files starting with PHASE 1.

# =======================================================================
# [RULE 2: THE 5-PHASE DETERMINISTIC AUTONOMOUS EXECUTION ROADMAP]
# =======================================================================
# You MUST execute this project systematically through the following 5 phases.
# Start with PHASE 1 in your VERY FIRST response:
#
# ── PHASE 1: REPOSITORY SCAFFOLDING & DATABASE LAYER (START HERE NOW) ──
# 1. Root `package.json` (Next.js 15, React 19, Prisma 6, Tailwind CSS v4, Lucide, Zod, Jose/JWT, Bcrypt).
# 2. `tsconfig.json` & `next.config.mjs` (Strict typechecking, path aliases `@/*`).
# 3. Complete production `prisma/schema.prisma` containing ALL multi-tenant models:
#    - Core & Multi-Tenant: Tenant, User, Role, Permission, UserRole, AuditLog
#    - Kesantrian & Data Induk: Student, Guardian, StudentGuardian, Dormitory, Room, ClassRoom
#    - PPDB (Penerimaan Santri Baru): PPDBRegistration, PPDBDocument, PPDBPayment
#    - Disiplin & Pelanggaran: ViolationCategory, ViolationRecord, DisciplinaryAction, StudentPoint
#    - Tahfidz & Mutaba'ah: TahfidzGroup, TahfidzHalaqoh, TahfidzLog, TahfidzTarget, TahfidzMilestone
#    - Perizinan Santri: StudentPermit, PermitApproval, PermitGateLog (QR Code verification)
#    - Keuangan & Billing: FeeCategory, StudentBill, Invoice, PaymentTransaction, BankAccount
# 4. `prisma/seed.ts` (Comprehensive real-world seed data for Pesantren Raudhatussalam Mahato).
# 5. `src/lib/prisma.ts` (Singleton Prisma client for serverless Neon PostgreSQL).
#
# ── PHASE 2: AUTHENTICATION, MULTI-TENANCY & MIDDLEWARE CORE ──
# 1. JWT Authentication & Password Utilities (`src/lib/auth.ts`, `src/lib/jwt.ts`).
# 2. Next.js 15 Edge Middleware (`src/middleware.ts`):
#    - Multi-tenant detection via subdomain or `x-tenant-id` header
#    - Session & JWT token verification with cookie extraction
#    - Strict RBAC Route Guards (`/admin/*`, `/portal-ustadz/*`, `/portal-wali/*`, `/portal-santri/*`)
#    - Security Headers (CSP, CORS, Strict-Transport-Security, X-Frame-Options)
# 3. Centralized API response, pagination, and error handlers (`src/lib/api-response.ts`, `src/lib/exceptions.ts`).
#
# ── PHASE 3: PRODUCTION REST API ENDPOINTS (FULL CRUD IMPLEMENTATION) ──
# 1. Auth: `/api/v1/auth/login`, `/api/v1/auth/me`, `/api/v1/auth/refresh`, `/api/v1/auth/logout`.
# 2. PPDB: `/api/v1/ppdb/register`, `/api/v1/ppdb/status`, `/api/v1/ppdb/verify`.
# 3. Kesantrian: `/api/v1/students` (CRUD + Filters), `/api/v1/guardians`, `/api/v1/dormitories`.
# 4. Disiplin: `/api/v1/violations` (CRUD), `/api/v1/disciplinary-actions` (point calculation).
# 5. Tahfidz: `/api/v1/tahfidz/logs` (Daily setoran), `/api/v1/tahfidz/progress` (Grafik hafalan).
# 6. Perizinan: `/api/v1/permits` (Ajukan izin, approval ustadz, barcode/QR gate check).
# 7. Keuangan: `/api/v1/billing/invoices` (Tagihan SPP bulanan), `/api/v1/billing/pay` (Simulasi payment).
# 8. Observability: `/api/v1/health`.
#
# ── PHASE 4: FRONTEND UI, PORTALS & ROLE-BASED DASHBOARDS ──
# 1. Clean Tailwind CSS v4 styling with dark/light mode support and Inter typography.
# 2. Public Portal Pesantren (Profil Pondok, Brosur Online, Pendaftaran PPDB Mandiri).
# 3. Super Admin Dashboard (Yayasan): Multi-Tenant switcher, audit log monitor, system health.
# 4. Pesantren Admin Dashboard: Ringkasan santri aktif, antrean PPDB, rekap SPP, monitoring pelanggaran.
# 5. Ustadz / Pengasuh Portal: Form setoran tahfidz kilat, catat pelanggaran santri, approval perizinan.
# 6. Wali Santri Portal: Pantau poin pelanggaran, tracking hafalan Qur'an anak, bayar tagihan SPP online.
# 7. Santri Portal: Kartu santri digital, jadwal kegiatan, riwayat izin keluar.
#
# ── PHASE 5: VERIFICATION, TESTING & SERVERLESS DEPLOYMENT ──
# 1. Build Verification (`npm run build` must exit with 0 errors).
# 2. Test seed and end-to-end flow checks.
# 3. Serverless Vercel deployment guide (`docs/DEPLOYMENT.md`).

# =======================================================================
# [RULE 3: STRICT CODE QUALITY & PRODUCTION DISCIPLINE]
# =======================================================================
# 1. ZERO PLACEHOLDERS: NEVER use "// TODO", "// remaining tables here", or "...rest of code".
#    Every schema model, every column, every API route, and every component MUST be written in full.
# 2. ZERO COMMENTS (/nokomen standard): Write clean, self-documenting code without conversational commentary.
# 3. STRICT TYPE SAFETY: 100% TypeScript with strict mode enabled. No `any` types where interfaces can be defined.
# 4. ENTERPRISE ERROR HANDLING: Wrap all asynchronous operations in try-catch with structured JSON error responses.

# =======================================================================
# [RULE 4: IMMEDIATE FIRST-TURN INSTRUCTION]
# =======================================================================
# IN YOUR VERY FIRST REPLY, EXECUTE THE FOLLOWING ACTION IMMEDIATELY:
# 1. Announce: "Executing Phase 1: Repository Scaffolding, Core Config, and Multi-Tenant Database Layer..."
# 2. Provide or create the complete:
#    - `package.json`
#    - `tsconfig.json`
#    - `next.config.mjs`
#    - Full `prisma/schema.prisma` (complete models with all relations, enums, and indexes)
#    - `src/lib/prisma.ts`
# 3. Immediately continue to Phase 2 without waiting for further prompts.
# =======================================================================

# =======================================================================
# MEGA ORCHESTRATOR PROMPT: COMPLETE MULTI-AGENT PROJECT GENERATOR
# TARGET SYSTEM: "Sistem Informasi Manajemen & Portal Pesantren Modern Raudhatussalam Mahato" | DOMAIN: "SaaS Multi-Tenant"
# =======================================================================

ROLE & MISSION (ENGLISH DIRECTIVE):
You are a Principal Software Architect, Lead Multi-Agent Systems Engineer, and Production Master Orchestrator.
Your objective is to generate an EXHAUSTIVE, PRODUCTION-GRADE, END-TO-END PROJECT PACKAGE for "Sistem Informasi Manajemen & Portal Pesantren Modern Raudhatussalam Mahato".
This package is built for modern AI coding tools (Claude Code CLI, Antigravity, Cursor, Windsurf) and human engineering teams to execute immediately without missing context.

LANGUAGE & FORMATTING RULE:
- ALL AI Agent system instructions, teamwork protocols, and engineering governance must be written in authoritative, precise ENGLISH.
- The Product Requirements Document (docs/PRD.md), user stories, and business domain specifications must be written in comprehensive, formal INDONESIAN (Bahasa Indonesia baku kelas enterprise) with extreme detail.
- Zero placeholders: NEVER emit "// TODO", "// remaining tables", or abbreviations. Every table, column, role, and module must be written in full.

=======================================================================
[PROJECT CORE IDENTITY & TARGET ARCHITECTURE]
=======================================================================
Project Name: "Sistem Informasi Manajemen & Portal Pesantren Modern Raudhatussalam Mahato"
Business Domain: "SaaS Multi-Tenant"
Target Infrastructure: Serverless on Neon PostgreSQL (Prisma ORM) + Next.js 15 / Express
Target Tech Stack: Next.js 15 + Neon PostgreSQL (Prisma) + Express + Tailwind CSS
Single Monorepo Rule: 1 unified package.json at root. Strictly no duplicated node_modules. Backend and frontend unified.

=======================================================================
[SECTION 1: PRODUCT REQUIREMENTS DOCUMENT (PRD - BAHASA INDONESIA RESMI)]
=======================================================================
# DOKUMEN SPESIFIKASI PRODUK & KEBUTUHAN SISTEM (PRD)
> Sistem: Sistem Informasi Manajemen & Portal Pesantren Modern Raudhatussalam Mahato
> Domain: SaaS Multi-Tenant
> Klasifikasi: Spesifikasi Produksi Enterprise Multi-Tenant
> Target Ketersediaan: 99.9% Uptime SLA | Same-Day Settlement | Zero Data Leak

### [PRD] Dokumen Spesifikasi Produk & Arsitektur (PRD)
# SPESIFIKASI PERSYARATAN PRODUK & ARSITEKTUR (PRD)

> **Proyek**: Sistem Informasi Manajemen & Portal Pesantren Modern Raudhatussalam Mahato
> **Domain Bisnis**: SaaS
> **Target Deployment**: Serverless on Vercel (Recommended: Serverless Functions + Edge Runtime)
> **Gaya Arsitektur**: Modular Monolith with Clean Architecture & Domain Boundaries
> **Target Ketersediaan (SLA)**: 99.99% Uptime
> **Latensi Respon (P95)**:  **Keamanan & Kepatuhan**: Audit Trail, RBAC (Roles & Permissions), Soft Deletes (deleted_at), Multi-Tenant Data Isolation
> **Status**: Produksi | **Versi**: 1.0.0

---

## 1. Ringkasan Eksekutif & Metrik KPI Strategis

Pondok Pesantren Modern Raudhatussalam Mahato saat ini mengelola seluruh proses administrasi kesantrian, akademik, kedisiplinan, keuangan, dan hubungan wali santri secara manual atau melalui kombinasi spreadsheet dan komunikasi informal. Pendekatan ini menimbulkan beberapa masalah struktural: data induk santri yang terfragmentasi antar unit (pengasuhan, akademik, keuangan), lambatnya proses verifikasi Penerimaan Santri Baru (PPDB), minimnya transparansi poin pelanggaran dan perkembangan hafalan Al-Qur'an kepada wali santri, serta rekonsiliasi tagihan SPP yang rawan kesalahan pencatatan.

Solusi yang diusulkan adalah sebuah platform digital terpadu berbasis arsitektur **Modular Monolith dengan batas domain (domain boundaries) yang tegas**, dijalankan sepenuhnya di atas infrastruktur serverless Vercel dengan Supabase PostgreSQL sebagai lapisan data utama. Setiap modul domain (PPDB, Kesantrian, Disiplin, Tahfidz-Akademik, Perizinan, Keuangan) dibangun sebagai unit logis yang independen secara kode namun berbagi satu basis data terpartisi berdasarkan `tenant_id`, sehingga memungkinkan satu instalasi platform melayani beberapa unit pesantren di bawah satu yayasan tanpa kebocoran data lintas tenant.

Value proposition utama platform ini adalah **satu sumber kebenaran (single source of truth)** untuk seluruh siklus hidup santri — mulai dari pendaftaran, penempatan asrama dan halaqoh, pencatatan mutaba'ah hafalan, evaluasi akademik, penanganan pelanggaran, hingga pelunasan tagihan — yang seluruhnya dapat diakses secara real-time oleh wali santri melalui portal mandiri. Sasaran strategis pengembangan tahun pertama mencakup digitalisasi 100% proses PPDB, pengurangan waktu rekonsiliasi tagihan sebesar 70%, dan peningkatan keterlibatan wali santri melalui notifikasi otomatis atas setiap kejadian penting (pelanggaran, izin, tagihan jatuh tempo).

### Metrik Kinerja Utama

- **Target Ketersediaan (SLA)**: 99.99% Uptime, diukur bulanan menggunakan health-check endpoint `/api/v1/health` dan dipantau oleh layanan observabilitas eksternal.
- **Latensi Respon (P95)**: `: token akses berisi klaim `user_id`, `tenant_id`, dan daftar `roles`.

Alur simulasi CRUD standar untuk entitas apapun (contoh: `students`): `GET /api/v1/students` (list terpaginasi dengan filter) → `POST /api/v1/students` (buat entitas baru, memerlukan Idempotency-Key) → `GET /api/v1/students/{id}` (detail) → `PUT /api/v1/students/{id}` (perbarui sebagian/seluruh field) → `DELETE /api/v1/students/{id}` (soft delete, mengisi `deleted_at` tanpa menghapus baris fisik).

---

## 7. Persyaratan Non-Fungsional, Skalabilitas, & Tata Kelola

**High Availability**: Vercel Edge Network mendistribusikan traffic publik ke lokasi terdekat pengguna, sementara Supabase PostgreSQL dikonfigurasi dengan read-replica untuk memisahkan beban kueri laporan/analitik dari beban transaksional utama.

**Isolasi Data Multi-Tenant**: Setiap tabel domain memuat kolom `tenant_id` yang diwajibkan pada seluruh kueri melalui lapisan repository terpusat, diperkuat dengan kebijakan Row Level Security (RLS) di PostgreSQL sebagai lapisan pertahanan kedua terhadap kebocoran data lintas tenant.

**Soft Delete Universal**: Seluruh entitas domain menerapkan kolom `deleted_at`; operasi hapus tidak pernah menghapus baris secara fisik, memungkinkan pemulihan data dan menjaga integritas referensial historis (misalnya riwayat pelanggaran santri yang telah lulus/keluar).

**Audit Trail Menyeluruh**: Tabel `audit_logs` bersifat append-only dan mencatat `before_data`/`after_data` dalam format JSONB untuk setiap mutasi pada entitas sensitif (keuangan, disiplin, PPDB), mendukung investigasi dan kepatuhan tata kelola lembaga pendidikan.

**Skalabilitas Horizontal**: Arsitektur serverless memungkinkan penskalaan otomatis mengikuti beban, dengan connection pooling (PgBouncer) mencegah eksosi koneksi database saat terjadi lonjakan permintaan bersamaan (misalnya periode pembukaan PPDB).

**Tata Kelola Perubahan**: Seluruh perubahan skema database dikelola melalui migration terversi, ditinjau melalui Pull Request, dan diterapkan otomatis pada tahap CI/CD sebelum promosi ke lingkungan produksi.

**Strategi Backup & Disaster Recovery**: Snapshot basis data penuh dijalankan setiap 24 jam dan disimpan minimal 30 hari, dikombinasikan dengan Write-Ahead Log (WAL) berkelanjutan untuk mendukung Point-in-Time Recovery. Uji pemulihan (restore drill) dilakukan setiap triwulan untuk memvalidasi RPO/RTO yang ditetapkan.

**Manajemen Rahasia & Kredensial**: Seluruh kredensial (kunci API WhatsApp, SMTP, Supabase Service Role Key) dikelola melalui Vercel Environment Variables terenkripsi per environment (development, preview, production), tidak pernah disimpan dalam kode sumber atau riwayat commit.

**Kepatuhan Perlindungan Data Pribadi**: Mengingat sistem menyimpan data sensitif santri di bawah umur (riwayat kesehatan, data wali, dokumen kependudukan), seluruh akses ke modul `health_records`, `ppdb_documents`, dan `guardians` dibatasi ketat melalui RBAC granular serta dienkripsi saat disimpan (encryption at rest) sesuai praktik terbaik perlindungan data pribadi yang berlaku di Indonesia.

---

## 8. Rencana Rilis & Roadmap Implementasi

Implementasi direkomendasikan dalam tiga tahap inkremental untuk memastikan validasi kebutuhan pengguna sebelum ekspansi fitur:

**Fase 1 — Fondasi & PPDB (Bulan 1–2)**: Implementasi modul IAM/RBAC, Profil Publik/CMS, dan PPDB Online lengkap dengan verifikasi dokumen serta pengumuman otomatis. Target: seluruh proses pendaftaran santri baru tahun ajaran berikutnya berjalan tanpa formulir kertas.

**Fase 2 — Operasional Kesantrian & Disiplin (Bulan 3–4)**: Implementasi modul Manajemen Kesantrian (asrama, halaqoh), Disiplin & Ta'zir, serta Perizinan & Kunjungan Wali. Target: seluruh transaksi harian pengasuhan tercatat digital dengan notifikasi wali real-time.

**Fase 3 — Akademik, Tahfidz & Keuangan (Bulan 5–6)**: Implementasi modul Tahfidz & Akademik (mutaba'ah, rapor) serta Keuangan & Tagihan (invoice otomatis, verifikasi pembayaran). Target: rapor digital dapat dicetak dan tagihan SPP terintegrasi penuh dengan portal wali santri.

Setiap fase diakhiri dengan periode stabilisasi dua minggu untuk pengumpulan umpan balik pengguna (Ustadz, staf Tata Usaha, wali santri) sebelum fase berikutnya dimulai, memastikan adopsi sistem berjalan bertahap dan minim resistensi perubahan di lingkungan pesantren.

### Katalog REST API & Endpoints
# Katalog REST API & Endpoints

**Base URL**: `/api/v1`

## Daftar Endpoint REST

### 1. [POST] `/api/v1/auth/login`
**Ringkasan**: Login pengguna (admin/ustadz/wali/publik)

---

### 2. [POST] `/api/v1/auth/refresh`
**Ringkasan**: Perbarui access token menggunakan refresh token

---

### 3. [POST] `/api/v1/auth/logout`
**Ringkasan**: Cabut sesi aktif pengguna

---

### 4. [GET] `/api/v1/users`
**Ringkasan**: Daftar pengguna terpaginasi

---

### 5. [POST] `/api/v1/users`
**Ringkasan**: Buat pengguna baru

---

### 6. [PUT] `/api/v1/users/{id}`
**Ringkasan**: Perbarui data pengguna

---

### 7. [DELETE] `/api/v1/users/{id}`
**Ringkasan**: Soft delete pengguna

---

### 8. [GET] `/api/v1/roles`
**Ringkasan**: Daftar peran & izin tenant

---

### 9. [GET] `/api/v1/public/programs`
**Ringkasan**: Daftar program unggulan (publik)

---

### 10. [GET] `/api/v1/public/news`
**Ringkasan**: Daftar berita terpublikasi (publik)

---

### 11. [GET] `/api/v1/public/events`
**Ringkasan**: Daftar agenda kegiatan (publik)

---

### 12. [POST] `/api/v1/ppdb/registrations`
**Ringkasan**: Ajukan pendaftaran santri baru

---

### 13. [GET] `/api/v1/ppdb/registrations`
**Ringkasan**: Daftar registrasi PPDB (staf)

---

### 14. [GET] `/api/v1/ppdb/registrations/{id}`
**Ringkasan**: Detail registrasi PPDB

---

### 15. [POST] `/api/v1/ppdb/registrations/{id}/documents`
**Ringkasan**: Unggah dokumen pendaftaran

---

### 16. [PUT] `/api/v1/ppdb/documents/{id}/verify`
**Ringkasan**: Verifikasi/tolak dokumen pendaftaran

---

### 17. [POST] `/api/v1/ppdb/schedules`
**Ringkasan**: Jadwalkan tes seleksi calon santri

---

### 18. [POST] `/api/v1/ppdb/schedules/{id}/results`
**Ringkasan**: Input hasil tes seleksi

---

### 19. [POST] `/api/v1/ppdb/registrations/{id}/announce`
**Ringkasan**: Terbitkan pengumuman kelulusan

---

### 20. [GET] `/api/v1/students`
**Ringkasan**: Daftar santri terpaginasi

---

### 21. [POST] `/api/v1/students`
**Ringkasan**: Registrasi santri (konversi dari PPDB diterima)

---

### 22. [GET] `/api/v1/students/{id}`
**Ringkasan**: Detail data induk santri

---

### 23. [PUT] `/api/v1/students/{id}/room-assignment`
**Ringkasan**: Tetapkan/pindahkan kamar asrama santri

---

### 24. [POST] `/api/v1/violations`
**Ringkasan**: Catat pelanggaran santri

---

### 25. [GET] `/api/v1/students/{id}/violations`
**Ringkasan**: Riwayat pelanggaran santri

---

### 26. [GET] `/api/v1/students/{id}/disciplinary-actions`
**Ringkasan**: Riwayat tindakan disipliner (SP)

---

### 27. [POST] `/api/v1/tahfidz/records`
**Ringkasan**: Catat setoran mutaba'ah hafalan

---

### 28. [GET] `/api/v1/students/{id}/tahfidz`
**Ringkasan**: Progres hafalan santri

---

### 29. [POST] `/api/v1/exam-scores`
**Ringkasan**: Input nilai ujian diniyah/formal

---

### 30. [GET] `/api/v1/students/{id}/report-card`
**Ringkasan**: Ambil/cetak rapor santri

---

### 31. [POST] `/api/v1/leave-permissions`
**Ringkasan**: Ajukan izin keluar/pulang pondok

---

### 32. [PUT] `/api/v1/leave-permissions/{id}/approve`
**Ringkasan**: Setujui/tolak pengajuan izin (berjenjang)

---

### 33. [PUT] `/api/v1/leave-permissions/{id}/check-in`
**Ringkasan**: Catat kembalinya santri dari izin

---

### 34. [POST] `/api/v1/visitor-logs`
**Ringkasan**: Catat kunjungan/sambangan wali santri

---

### 35. [GET] `/api/v1/invoices`
**Ringkasan**: Daftar tagihan santri

---

### 36. [POST] `/api/v1/invoices`
**Ringkasan**: Terbitkan tagihan baru untuk santri

---

### 37. [POST] `/api/v1/invoices/{id}/payments`
**Ringkasan**: Ajukan/rekam pembayaran atas tagihan

---

### 38. [PUT] `/api/v1/payments/{id}/verify`
**Ringkasan**: Verifikasi pembayaran oleh Divisi Keuangan

---

### 39. [GET] `/api/v1/wali/dashboard`
**Ringkasan**: Ringkasan dashboard anak wali santri

---

### 40. [GET] `/api/v1/audit-logs`
**Ringkasan**: Daftar audit trail sistem (Super Admin)

---


=======================================================================
[SECTION 2: SKEMA BASIS DATA RELASIONAL PENUH (FULL DBML & DDL)]
=======================================================================
Di bawah ini adalah skema relasional lengkap (Database Schema) dari proyek "Sistem Informasi Manajemen & Portal Pesantren Modern Raudhatussalam Mahato" dalam format DBML standar industri.
Seluruh tabel, tipe data, primary key (UUID/BigInt), foreign key referensial, unique index, dan enum wajib diimplementasikan 100% tanpa ada yang dikurangi:

```dbml
// =========================================================================
// SKEMA DATABASE ENTERPRISE
// Sistem Informasi Manajemen & Portal Pesantren Modern Raudhatussalam Mahato
// PostgreSQL / Supabase - Multi-Tenant, RBAC, Audit Trail, Soft Delete
// =========================================================================

// -------------------------------------------------------------------------
// MODUL 1: TENANCY & IDENTITY ACCESS MANAGEMENT (IAM)
// -------------------------------------------------------------------------

Enum tenants_status {
  active
  suspended
  trial
  inactive
}

Table tenants {
  id UUID [pk, default: `gen_random_uuid()`]
  name VARCHAR(255) [not null]
  slug VARCHAR(100) [not null, unique]
  domain VARCHAR(255)
  logo_url VARCHAR(500)
  status tenants_status [not null, default: 'active']
  timezone VARCHAR(50) [not null, default: 'Asia/Jakarta']
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    slug [unique]
    status
  }
}

Enum users_status {
  active
  inactive
  locked
  pending_verification
}

Table users {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  full_name VARCHAR(255) [not null]
  email VARCHAR(255) [not null]
  phone VARCHAR(30)
  password_hash VARCHAR(255) [not null]
  avatar_url VARCHAR(500)
  status users_status [not null, default: 'active']
  last_login_at TIMESTAMP
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (tenant_id, email) [unique]
    tenant_id
  }
}

Table roles {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  code VARCHAR(50) [not null]
  name VARCHAR(100) [not null]
  description TEXT
  is_system BOOLEAN [not null, default: false]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (tenant_id, code) [unique]
  }
}

Table permissions {
  id UUID [pk, default: `gen_random_uuid()`]
  code VARCHAR(100) [not null, unique]
  module VARCHAR(100) [not null]
  description TEXT
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
}

Table role_permissions {
  id UUID [pk, default: `gen_random_uuid()`]
  role_id UUID [not null]
  permission_id UUID [not null]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (role_id, permission_id) [unique]
  }
}

Table user_roles {
  id UUID [pk, default: `gen_random_uuid()`]
  user_id UUID [not null]
  role_id UUID [not null]
  assigned_at TIMESTAMP [not null, default: `now()`]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (user_id, role_id) [unique]
  }
}

Enum sessions_status {
  active
  revoked
  expired
}

Table sessions {
  id UUID [pk, default: `gen_random_uuid()`]
  user_id UUID [not null]
  refresh_token_hash VARCHAR(255) [not null]
  ip_address VARCHAR(64)
  user_agent VARCHAR(255)
  status sessions_status [not null, default: 'active']
  expires_at TIMESTAMP [not null]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    user_id
  }
}

Table audit_logs {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  actor_user_id UUID
  entity_table VARCHAR(100) [not null]
  entity_id UUID [not null]
  action VARCHAR(50) [not null]
  before_data JSONB
  after_data JSONB
  ip_address VARCHAR(64)
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (tenant_id, entity_table, entity_id)
    created_at
  }
}

Enum notifications_channel {
  in_app
  email
  whatsapp
  push
}

Enum notifications_status {
  queued
  sent
  failed
  read
}

Table notifications {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  user_id UUID [not null]
  template_code VARCHAR(100)
  channel notifications_channel [not null, default: 'in_app']
  title VARCHAR(255) [not null]
  body TEXT [not null]
  status notifications_status [not null, default: 'queued']
  read_at TIMESTAMP
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (tenant_id, user_id, status)
  }
}

Table notification_templates {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  code VARCHAR(100) [not null]
  subject VARCHAR(255)
  body_template TEXT [not null]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (tenant_id, code) [unique]
  }
}

Enum file_uploads_status {
  uploaded
  scanned
  quarantined
  deleted
}

Table file_uploads {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  uploaded_by UUID [not null]
  file_name VARCHAR(255) [not null]
  file_url VARCHAR(500) [not null]
  mime_type VARCHAR(100) [not null]
  size_bytes BIGINT [not null]
  status file_uploads_status [not null, default: 'uploaded']
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    tenant_id
  }
}

Table system_settings {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  key VARCHAR(150) [not null]
  value JSONB [not null]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (tenant_id, key) [unique]
  }
}

// -------------------------------------------------------------------------
// MODUL 2: LANDING PAGE & PROFIL LEMBAGA PUBLIK (CMS)
// -------------------------------------------------------------------------

Table institution_profiles {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  vision TEXT
  mission TEXT
  history TEXT
  address VARCHAR(500)
  contact_phone VARCHAR(30)
  contact_email VARCHAR(255)
  map_lat DECIMAL(10,6)
  map_lng DECIMAL(10,6)
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    tenant_id [unique]
  }
}

Enum programs_category {
  tahfidz
  bahasa_arab
  bahasa_inggris
  kitab_kuning
  ekstrakurikuler
}

Table programs {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  name VARCHAR(255) [not null]
  category programs_category [not null]
  description TEXT
  cover_image_url VARCHAR(500)
  is_published BOOLEAN [not null, default: true]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    tenant_id
  }
}

Enum news_articles_status {
  draft
  published
  archived
}

Table news_articles {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  author_id UUID [not null]
  title VARCHAR(255) [not null]
  slug VARCHAR(255) [not null]
  excerpt VARCHAR(500)
  content TEXT [not null]
  cover_image_url VARCHAR(500)
  status news_articles_status [not null, default: 'draft']
  published_at TIMESTAMP
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (tenant_id, slug) [unique]
    status
  }
}

Table gallery_media {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  title VARCHAR(255)
  media_type gallery_media_media_type [not null, default: 'image']
  media_url VARCHAR(500) [not null]
  album VARCHAR(150)
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    tenant_id
  }
}

Table events {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  title VARCHAR(255) [not null]
  description TEXT
  location VARCHAR(255)
  start_at TIMESTAMP [not null]
  end_at TIMESTAMP
  is_published BOOLEAN [not null, default: true]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    tenant_id
    start_at
  }
}

// -------------------------------------------------------------------------
// MODUL 3: PENERIMAAN SANTRI BARU (PPDB ONLINE)
// -------------------------------------------------------------------------

Enum ppdb_registrations_status {
  submitted
  document_review
  document_rejected
  scheduled_test
  test_passed
  test_failed
  accepted
  rejected
  enrolled
}

Enum ppdb_registrations_gender {
  male
  female
}

Table ppdb_registrations {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  registration_number VARCHAR(50) [not null]
  full_name VARCHAR(255) [not null]
  gender ppdb_registrations_gender [not null]
  birth_place VARCHAR(150)
  birth_date DATE [not null]
  nisn VARCHAR(20)
  guardian_name VARCHAR(255) [not null]
  guardian_phone VARCHAR(30) [not null]
  guardian_email VARCHAR(255)
  program_choice_id UUID [not null]
  status ppdb_registrations_status [not null, default: 'submitted']
  submitted_at TIMESTAMP [not null, default: `now()`]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (tenant_id, registration_number) [unique]
    status
  }
}

Enum ppdb_documents_doc_type {
  kartu_keluarga
  akta_kelahiran
  ijazah
  foto
  surat_sehat
  lainnya
}

Enum ppdb_documents_verification_status {
  pending
  verified
  rejected
}

Table ppdb_documents {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  registration_id UUID [not null]
  doc_type ppdb_documents_doc_type [not null]
  file_upload_id UUID [not null]
  verification_status ppdb_documents_verification_status [not null, default: 'pending']
  verified_by UUID
  verified_at TIMESTAMP
  notes TEXT
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    registration_id
  }
}

Enum ppdb_schedules_test_type {
  baca_quran
  wawancara
  akademik
}

Table ppdb_schedules {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  registration_id UUID [not null]
  test_type ppdb_schedules_test_type [not null]
  scheduled_at TIMESTAMP [not null]
  location VARCHAR(255)
  examiner_id UUID
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    registration_id
  }
}

Enum ppdb_test_results_result {
  lulus
  tidak_lulus
}

Table ppdb_test_results {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  schedule_id UUID [not null]
  score DECIMAL(5,2)
  result ppdb_test_results_result [not null]
  examiner_notes TEXT
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    schedule_id
  }
}

Enum ppdb_announcements_decision {
  diterima
  ditolak
  cadangan
}

Table ppdb_announcements {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  registration_id UUID [not null]
  decision ppdb_announcements_decision [not null]
  announced_at TIMESTAMP [not null, default: `now()`]
  published_by UUID [not null]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    registration_id [unique]
  }
}

// -------------------------------------------------------------------------
// MODUL 4: MANAJEMEN KESANTRIAN & DATA INDUK
// -------------------------------------------------------------------------

Enum students_gender {
  male
  female
}

Enum students_status {
  active
  graduated
  dropped_out
  transferred
  suspended
}

Table students {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  registration_id UUID
  student_number VARCHAR(50) [not null]
  nisn VARCHAR(20)
  full_name VARCHAR(255) [not null]
  gender students_gender [not null]
  birth_place VARCHAR(150)
  birth_date DATE [not null]
  address TEXT
  status students_status [not null, default: 'active']
  enrolled_at DATE [not null]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (tenant_id, student_number) [unique]
    status
  }
}

Enum guardians_relationship {
  ayah
  ibu
  wali
}

Table guardians {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  user_id UUID
  full_name VARCHAR(255) [not null]
  relationship guardians_relationship [not null]
  phone VARCHAR(30) [not null]
  email VARCHAR(255)
  address TEXT
  occupation VARCHAR(150)
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    tenant_id
  }
}

Table student_guardians {
  id UUID [pk, default: `gen_random_uuid()`]
  student_id UUID [not null]
  guardian_id UUID [not null]
  is_primary BOOLEAN [not null, default: false]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (student_id, guardian_id) [unique]
  }
}

Enum dormitories_gender_type {
  putra
  putri
}

Table dormitories {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  name VARCHAR(150) [not null]
  gender_type dormitories_gender_type [not null]
  capacity INTEGER [not null]
  supervisor_id UUID
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    tenant_id
  }
}

Enum dormitory_rooms_status {
  available
  full
  maintenance
}

Table dormitory_rooms {
  id UUID [pk, default: `gen_random_uuid()`]
  dormitory_id UUID [not null]
  room_number VARCHAR(20) [not null]
  capacity INTEGER [not null]
  status dormitory_rooms_status [not null, default: 'available']
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (dormitory_id, room_number) [unique]
  }
}

Table room_assignments {
  id UUID [pk, default: `gen_random_uuid()`]
  student_id UUID [not null]
  room_id UUID [not null]
  assigned_at DATE [not null]
  vacated_at DATE
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    student_id
    room_id
  }
}

Table halaqoh_classes {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  name VARCHAR(150) [not null]
  ustadz_id UUID [not null]
  academic_year VARCHAR(20) [not null]
  capacity INTEGER [not null, default: 15]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    tenant_id
  }
}

Table student_class_enrollments {
  id UUID [pk, default: `gen_random_uuid()`]
  student_id UUID [not null]
  halaqoh_class_id UUID [not null]
  academic_year VARCHAR(20) [not null]
  enrolled_at DATE [not null]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (student_id, halaqoh_class_id, academic_year) [unique]
  }
}

Table health_records {
  id UUID [pk, default: `gen_random_uuid()`]
  student_id UUID [not null]
  blood_type VARCHAR(5)
  allergies TEXT
  chronic_conditions TEXT
  emergency_contact VARCHAR(255)
  recorded_by UUID
  recorded_at TIMESTAMP [not null, default: `now()`]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    student_id [unique]
  }
}

// -------------------------------------------------------------------------
// MODUL 5: SISTEM DISIPLIN, PELANGGARAN & TA'ZIR
// -------------------------------------------------------------------------

Enum violation_categories_severity {
  ringan
  sedang
  berat
}

Table violation_categories {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  name VARCHAR(150) [not null]
  severity violation_categories_severity [not null]
  point_value INTEGER [not null]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    tenant_id
  }
}

Table violations {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  student_id UUID [not null]
  violation_category_id UUID [not null]
  reported_by UUID [not null]
  description TEXT
  points_deducted INTEGER [not null]
  occurred_at TIMESTAMP [not null]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (tenant_id, student_id)
  }
}

Enum disciplinary_actions_action_type {
  teguran_lisan
  sp1
  sp2
  sp3
  skorsing
  dikembalikan_ke_wali
}

Table disciplinary_actions {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  student_id UUID [not null]
  violation_id UUID
  action_type disciplinary_actions_action_type [not null]
  issued_by UUID [not null]
  issued_at TIMESTAMP [not null, default: `now()`]
  notes TEXT
  guardian_notified_at TIMESTAMP
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    student_id
  }
}

Table counseling_sessions {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  student_id UUID [not null]
  counselor_id UUID [not null]
  session_date TIMESTAMP [not null]
  summary TEXT
  follow_up_plan TEXT
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    student_id
  }
}

// -------------------------------------------------------------------------
// MODUL 6: MANAJEMEN TAHFIDZ & AKADEMIK
// -------------------------------------------------------------------------

Table quran_surahs {
  id UUID [pk, default: `gen_random_uuid()`]
  number INTEGER [not null]
  name_arabic VARCHAR(100) [not null]
  name_latin VARCHAR(100) [not null]
  total_verses INTEGER [not null]
  juz_start INTEGER
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    number [unique]
  }
}

Enum memorization_records_grade {
  mumtaz
  jayyid_jiddan
  jayyid
  maqbul
}

Table memorization_records {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  student_id UUID [not null]
  surah_id UUID [not null]
  ustadz_id UUID [not null]
  record_type memorization_records_record_type [not null]
  verse_from INTEGER [not null]
  verse_to INTEGER [not null]
  grade memorization_records_grade [not null]
  notes TEXT
  recorded_at DATE [not null]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (tenant_id, student_id)
  }
}

Enum academic_subjects_track {
  diniyah
  formal
}

Table academic_subjects {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  name VARCHAR(150) [not null]
  track academic_subjects_track [not null]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    tenant_id
  }
}

Enum exam_scores_exam_type {
  harian
  tengah_semester
  akhir_semester
}

Table exam_scores {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  student_id UUID [not null]
  subject_id UUID [not null]
  exam_type exam_scores_exam_type [not null]
  score DECIMAL(5,2) [not null]
  academic_year VARCHAR(20) [not null]
  semester INTEGER [not null]
  recorded_by UUID [not null]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (tenant_id, student_id, academic_year, semester)
  }
}

Enum report_cards_status {
  draft
  published
}

Table report_cards {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  student_id UUID [not null]
  academic_year VARCHAR(20) [not null]
  semester INTEGER [not null]
  status report_cards_status [not null, default: 'draft']
  pdf_file_url VARCHAR(500)
  published_at TIMESTAMP
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (student_id, academic_year, semester) [unique]
  }
}

// -------------------------------------------------------------------------
// MODUL 7: PERIZINAN SANTRI & KUNJUNGAN WALI
// -------------------------------------------------------------------------

Enum leave_permissions_leave_type {
  pulang
  sakit
  keperluan_keluarga
  lainnya
}

Enum leave_permissions_status {
  pending
  approved
  rejected
  ongoing
  returned
  overdue
}

Table leave_permissions {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  student_id UUID [not null]
  leave_type leave_permissions_leave_type [not null]
  reason TEXT [not null]
  requested_by UUID [not null]
  planned_departure_at TIMESTAMP [not null]
  planned_return_at TIMESTAMP [not null]
  actual_return_at TIMESTAMP
  status leave_permissions_status [not null, default: 'pending']
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (tenant_id, student_id)
    status
  }
}

Enum leave_approvals_decision {
  approved
  rejected
}

Table leave_approvals {
  id UUID [pk, default: `gen_random_uuid()`]
  leave_permission_id UUID [not null]
  approver_id UUID [not null]
  approval_level INTEGER [not null]
  decision leave_approvals_decision [not null]
  notes TEXT
  decided_at TIMESTAMP [not null, default: `now()`]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    leave_permission_id
  }
}

Table visitor_logs {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  student_id UUID [not null]
  visitor_name VARCHAR(255) [not null]
  visitor_relationship VARCHAR(100)
  visited_at TIMESTAMP [not null]
  checked_out_at TIMESTAMP
  notes TEXT
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (tenant_id, student_id)
  }
}

// -------------------------------------------------------------------------
// MODUL 8: KEUANGAN & TAGIHAN SANTRI
// -------------------------------------------------------------------------

Enum fee_types_category {
  spp
  uang_makan
  uang_pangkal
  seragam
  lainnya
}

Table fee_types {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  name VARCHAR(150) [not null]
  category fee_types_category [not null]
  default_amount DECIMAL(14,2) [not null]
  is_recurring BOOLEAN [not null, default: true]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    tenant_id
  }
}

Enum invoices_status {
  unpaid
  partially_paid
  paid
  overdue
  cancelled
}

Table invoices {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  student_id UUID [not null]
  invoice_number VARCHAR(50) [not null]
  period VARCHAR(20) [not null]
  due_date DATE [not null]
  total_amount DECIMAL(14,2) [not null]
  paid_amount DECIMAL(14,2) [not null, default: 0]
  status invoices_status [not null, default: 'unpaid']
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    (tenant_id, invoice_number) [unique]
    status
  }
}

Table invoice_items {
  id UUID [pk, default: `gen_random_uuid()`]
  invoice_id UUID [not null]
  fee_type_id UUID [not null]
  description VARCHAR(255)
  amount DECIMAL(14,2) [not null]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    invoice_id
  }
}

Enum payment_methods_type {
  bank_transfer
  virtual_account
  e_wallet
  cash
}

Table payment_methods {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  name VARCHAR(150) [not null]
  type payment_methods_type [not null]
  is_active BOOLEAN [not null, default: true]
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    tenant_id
  }
}

Enum payments_status {
  pending
  confirmed
  failed
  refunded
}

Table payments {
  id UUID [pk, default: `gen_random_uuid()`]
  tenant_id UUID [not null]
  invoice_id UUID [not null]
  payment_method_id UUID [not null]
  amount DECIMAL(14,2) [not null]
  reference_number VARCHAR(100)
  status payments_status [not null, default: 'pending']
  paid_at TIMESTAMP
  verified_by UUID
  created_at TIMESTAMP [not null, default: `now()`]
  updated_at TIMESTAMP [not null, default: `now()`]
  deleted_at TIMESTAMP
  Indexes {
    invoice_id
    status
  }
}

// =========================================================================
// RELATIONSHIPS (STANDALONE REF)
// =========================================================================

Ref: users.tenant_id > tenants.id
Ref: roles.tenant_id > tenants.id
Ref: role_permissions.role_id > roles.id
Ref: role_permissions.permission_id > permissions.id
Ref: user_roles.user_id > users.id
Ref: user_roles.role_id > roles.id
Ref: sessions.user_id > users.id
Ref: audit_logs.tenant_id > tenants.id
Ref: audit_logs.actor_user_id > users.id
Ref: notifications.tenant_id > tenants.id
Ref: notifications.user_id > users.id
Ref: notification_templates.tenant_id > tenants.id
Ref: file_uploads.tenant_id > tenants.id
Ref: file_uploads.uploaded_by > users.id
Ref: system_settings.tenant_id > tenants.id

Ref: institution_profiles.tenant_id > tenants.id
Ref: programs.tenant_id > tenants.id
Ref: news_articles.tenant_id > tenants.id
Ref: news_articles.author_id > users.id
Ref: gallery_media.tenant_id > tenants.id
Ref: events.tenant_id > tenants.id

Ref: ppdb_registrations.tenant_id > tenants.id
Ref: ppdb_registrations.program_choice_id > programs.id
Ref: ppdb_documents.tenant_id > tenants.id
Ref: ppdb_documents.registration_id > ppdb_registrations.id
Ref: ppdb_documents.file_upload_id > file_uploads.id
Ref: ppdb_documents.verified_by > users.id
Ref: ppdb_schedules.tenant_id > tenants.id
Ref: ppdb_schedules.registration_id > ppdb_registrations.id
Ref: ppdb_schedules.examiner_id > users.id
Ref: ppdb_test_results.tenant_id > tenants.id
Ref: ppdb_test_results.schedule_id > ppdb_schedules.id
Ref: ppdb_announcements.tenant_id > tenants.id
Ref: ppdb_announcements.registration_id > ppdb_registrations.id
Ref: ppdb_announcements.published_by > users.id

Ref: students.tenant_id > tenants.id
Ref: students.registration_id > ppdb_registrations.id
Ref: guardians.tenant_id > tenants.id
Ref: guardians.user_id > users.id
Ref: student_guardians.student_id > students.id
Ref: student_guardians.guardian_id > guardians.id
Ref: dormitories.tenant_id > tenants.id
Ref: dormitories.supervisor_id > users.id
Ref: dormitory_rooms.dormitory_id > dormitories.id
Ref: room_assignments.student_id > students.id
Ref: room_assignments.room_id > dormitory_rooms.id
Ref: halaqoh_classes.tenant_id > tenants.id
Ref: halaqoh_classes.ustadz_id > users.id
Ref: student_class_enrollments.student_id > students.id
Ref: student_class_enrollments.halaqoh_class_id > halaqoh_classes.id
Ref: health_records.student_id > students.id
Ref: health_records.recorded_by > users.id

Ref: violation_categories.tenant_id > tenants.id
Ref: violations.tenant_id > tenants.id
Ref: violations.student_id > students.id
Ref: violations.violation_category_id > violation_categories.id
Ref: violations.reported_by > users.id
Ref: disciplinary_actions.tenant_id > tenants.id
Ref: disciplinary_actions.student_id > students.id
Ref: disciplinary_actions.violation_id > violations.id
Ref: disciplinary_actions.issued_by > users.id
Ref: counseling_sessions.tenant_id > tenants.id
Ref: counseling_sessions.student_id > students.id
Ref: counseling_sessions.counselor_id > users.id

Ref: memorization_records.tenant_id > tenants.id
Ref: memorization_records.student_id > students.id
Ref: memorization_records.surah_id > quran_surahs.id
Ref: memorization_records.ustadz_id > users.id
Ref: academic_subjects.tenant_id > tenants.id
Ref: exam_scores.tenant_id > tenants.id
Ref: exam_scores.student_id > students.id
Ref: exam_scores.subject_id > academic_subjects.id
Ref: exam_scores.recorded_by > users.id
Ref: report_cards.tenant_id > tenants.id
Ref: report_cards.student_id > students.id

Ref: leave_permissions.tenant_id > tenants.id
Ref: leave_permissions.student_id > students.id
Ref: leave_permissions.requested_by > users.id
Ref: leave_approvals.leave_permission_id > leave_permissions.id
Ref: leave_approvals.approver_id > users.id
Ref: visitor_logs.tenant_id > tenants.id
Ref: visitor_logs.student_id > students.id

Ref: fee_types.tenant_id > tenants.id
Ref: invoices.tenant_id > tenants.id
Ref: invoices.student_id > students.id
Ref: invoice_items.invoice_id > invoices.id
Ref: invoice_items.fee_type_id > fee_types.id
Ref: payment_methods.tenant_id > tenants.id
Ref: payments.tenant_id > tenants.id
Ref: payments.invoice_id > invoices.id
Ref: payments.payment_method_id > payment_methods.id
Ref: payments.verified_by > users.id

Enum gallery_media_media_type {
  image
  video
}

Enum memorization_records_record_type {
  ziyadah
  muraja_ah
}
```

Pedoman Basis Data Wajib:
1. Setiap entitas transaksional wajib memiliki kolom audit: created_at, updated_at, dan deleted_at (soft delete).
2. Setiap entitas berstatus multi-tenant wajib memiliki kolom isolasi tenant (misal: campus_id / tenant_id).
3. Pengindeksan: Kolom referensial (Foreign Keys) dan kolom unik wajib diindeks secara eksplisit.
4. Enkripsi Data: Kolom sensitif (PIN, riwayat medis, nomor telepon pribadi) wajib dienkripsi at-rest.

=======================================================================
[SECTION 3: DIAGRAM ALUR KERJA & LOGIKA BISNIS (WORKFLOW FLOWCHARTS)]
=======================================================================
Di bawah ini adalah alur logika proses bisnis utama yang telah dipetakan untuk "Sistem Informasi Manajemen & Portal Pesantren Modern Raudhatussalam Mahato".
Setiap langkah, percabangan keputusan (decision diamond), dan status transisi wajib diwujudkan dalam flow state engine backend dan antarmuka pengguna:

### Alur Logika Inti & Bisnis (PPDB, Disiplin, Perizinan, Keuangan)
1. [OVAL] Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran
2. [RECTANGLE] Verifikasi JWT & X-Tenant-ID
3. [DIAMOND] Token & Tenant Valid?
4. [RECTANGLE] Tolak: 401 Unauthorized
5. [RECTANGLE] Validasi Payload & Idempotency-Key
6. [DIAMOND] Payload Valid?
7. [RECTANGLE] Tolak: 422 Validation Error
8. [RECTANGLE] Cek Izin RBAC Peran Pengguna
9. [DIAMOND] Peran Memiliki Izin?
10. [RECTANGLE] Tolak: 403 Forbidden + Catat Audit
11. [DATABASE] Buka Transaksi Database
12. [DIAMOND] Jenis Proses?
13. [RECTANGLE] PPDB: Simpan Registrasi & Dokumen
14. [DIAMOND] Dokumen Lengkap & Terverifikasi?
15. [RECTANGLE] Jadwalkan Tes Baca Qur'an & Wawancara
16. [RECTANGLE] Izin: Cek Status Disiplin Santri
17. [DIAMOND] Seluruh Level Persetujuan Setuju?
18. [RECTANGLE] Set Status Approved & Notifikasi Wali
19. [RECTANGLE] Set Status Rejected & Notifikasi Wali
20. [RECTANGLE] Pembayaran: Verifikasi Nominal & Referensi
21. [DIAMOND] Nominal & Referensi Valid?
22. [DATABASE] Update paid_amount & Status Invoice
23. [RECTANGLE] Catat Audit Log (before/after)
24. [DATABASE] Commit Transaksi Database
25. [RECTANGLE] Kirim Notifikasi (Email/WhatsApp/In-App)
26. [OVAL] Selesai: Kembalikan Response Envelope
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran`
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran`
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` (Kondisi: Valid)
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` (Kondisi: Tidak Valid)
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran`
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` (Kondisi: Valid)
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` (Kondisi: Tidak Valid)
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran`
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` (Kondisi: Diizinkan)
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` (Kondisi: Ditolak)
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran`
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` (Kondisi: PPDB)
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` (Kondisi: Perizinan)
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` (Kondisi: Keuangan)
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran`
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` (Kondisi: Lengkap)
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` (Kondisi: Belum Lengkap)
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran`
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran`
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` (Kondisi: Setuju)
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` (Kondisi: Ada Penolakan)
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran`
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran`
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran`
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` (Kondisi: Valid)
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` (Kondisi: Tidak Valid)
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran`
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran`
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran`
- `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran` ➔ `Mulai: Wali Santri Ajukan PPDB/Izin/Pembayaran`



=======================================================================
[SECTION 4: MANDATORY MASTER ENGINEERING STANDARDS & AUTHORITATIVE SKILLS]
=======================================================================
You MUST strictly embed and enforce the following engineering skills into every file, component, schema, and API route:

-----------------------------------------------------------------------
SKILL 1: /ui-ux-text (MICROCOPY & TEXT HIERARCHY STANDARD)
-----------------------------------------------------------------------
- FORM PLACEHOLDERS: STRICTLY MAXIMUM 1 WORD.
  * Valid: "Nama", "Email", "Pesan", "Cari", "Domain", "Stack", "Telepon", "Alamat", "Kata Sandi".
  * Prohibited: "Masukkan nama lengkap", "Ketikkan email Anda", "Cari data pengguna di sini", "Isi nomor hp".
  * Placeholder is never a substitute for an accessible label.

- BUTTON & ACTION LABELS: STRICTLY MAXIMUM 1–2 WORDS.
  * Prioritize active verbs.
  * Valid: "Simpan", "Hapus", "Edit", "Buka", "Unduh", "Unduh ZIP", "Salin", "Generate AI", "Kirim", "Masuk", "Daftar".
  * Prohibited: "Klik di sini untuk simpan", "Hapus data ini sekarang", "Mulai generate berkas proyek".

- TITLE & HEADINGS:
  * Section titles: 1–3 words (e.g. "Daftar Pengguna", "Statistik Penjualan", "Konfigurasi Sistem").
  * Zero filler paragraphs: Do not add paragraphs just to fill visual space.
  * Progressive disclosure: Secondary help text must be moved into tooltips, modals, or compact info icons.

- EMPTY STATES & ALERTS:
  * Microcopy must be concise and actionable:
    Title: "Belum ada data" (max 3 words)
    Description: "Tambahkan entitas pertama untuk memulai." (max 1 sentence)
    Action: "Tambah" (1 word)

-----------------------------------------------------------------------
SKILL 2: /precision-card-button-ui & /button-presisi (COMPACT UI DESIGN SYSTEM)
-----------------------------------------------------------------------
- BUTTON GEOMETRY & ANATOMY:
  * Compact Card Button: height 32px–34px (h-8 to h-8.5), radius 5px–6px (rounded-md), font 11px–12px medium.
  * Standard Action Button: height 36px–38px (h-9 to h-9.5), radius 6px–8px (rounded-lg), font 12px–13px semibold.
  * Primary Large CTA Button: height 40px–44px (h-10 to h-11), radius 8px–10px (rounded-lg), font 13px–14px bold.
  * Icon Only Button: size 32px–36px (size-8 or size-9), radius 6px–8px (rounded-lg), centered SVG icon.

- STRICT PROHIBITIONS ON BUTTONS & INPUTS:
  * NEVER use rounded-full (pill/capsule shape) for standard action buttons, submit buttons, card actions, or inputs.
  * NEVER use bloated heights (h-14, py-4, py-5) that waste vertical real estate.
  * NEVER use thick borders (border-2, border-4). Use delicate 1px border (border border-border/70).
  * Micro-click feedback: All clickable elements must have active state animation (active:scale-[0.98] transition-transform).

- CARD GEOMETRY & ELEVATION:
  * Default Card Radius: 8px to 12px (rounded-lg to rounded-xl). Default baseline: 10px.
  * Card Border: Delicate 1px neutral border (border border-border/70 or border-slate-200/80 in light, border-white/10 in dark).
  * Card Padding: Restrained 12px–16px (p-3 to p-4). Never use p-6 or p-8 for compact catalog cards.
  * Card Shadows: Extremely soft elevation (shadow-xs or shadow-sm). Never use harsh black or heavy floating drop shadows.
  * Paired Card Actions: Always arrange dual actions horizontally in a 2-column flex or grid (e.g. Preview/Pesan, Edit/Hapus), never stacked vertically if space permits.

- FORM CONTROLS & INPUT FIELDS:
  * Inputs, selects, and textareas: radius rounded-lg (6px–8px), height 36px–38px (h-9), subtle 1px border, thin focus ring (focus:ring-1 focus:ring-primary/50).

-----------------------------------------------------------------------
SKILL 3: /nokomen (STRICT ZERO-COMMENT & CLEAN CODE STANDARD)
-----------------------------------------------------------------------
- ZERO INLINE COMMENTS:
  * All generated code across TypeScript, JavaScript, Python, SQL, CSS, and JSX MUST HAVE EXACTLY ZERO INLINE COMMENTS.
  * Strictly PROHIBITED: // comments, /* */ block comments, # Python comments, and {/* JSX comments */}.
  * Comments are NOT a substitute for poor code architecture.

- SELF-DOCUMENTING CODE MANDATE:
  * Code must explain itself through descriptive domain naming, modular functions, single responsibility, and explicit TypeScript interfaces.
  * Function names must be clear active verbs: createUserSession(), calculateOrderTotal(), validateTenantAccess().
  * Variable names must reflect intent: activeProjectSlug, pendingInvoiceCount, isAuthorizedUser.
  * If a logic block is confusing, extract it into a dedicated, well-named helper function rather than writing a comment.

-----------------------------------------------------------------------
SKILL 4: /master (8-PHASE ENGINEERING LIFECYCLE & ARCHITECTURE GOVERNANCE)
-----------------------------------------------------------------------
Every module in this project must follow the authoritative 8-phase engineering lifecycle:
- Phase 1: Master Protocol -> Establish domain boundaries and authoritative specifications.
- Phase 2: Architecture Discovery -> Map all entities, relational dependencies, and data flow paths.
- Phase 3: Task Impact Analysis -> Decompose system requirements into isolated atomic components.
- Phase 4: Execution (Nokomen) -> Implement clean, self-documenting code with zero inline comments.
- Phase 5: Security Validation -> Audit RBAC matrices, session integrity, tenant data isolation, and input sanitization.
- Phase 6: QA/Build Verification -> Run automated unit tests, TypeScript type checking, and production build checks.
- Phase 7: Self-Healing Loop -> Detect anomalies, verify error boundaries, and auto-correct edge-case defects.
- Phase 8: Final Audit -> Confirm zero code bloat, zero unhandled errors, and end-to-end responsiveness.

-----------------------------------------------------------------------
SKILL 5: /env-secrets-management (CREDENTIAL SECURITY & ZERO-LEAK)
-----------------------------------------------------------------------
- ZERO HARDCODED SECRETS:
  * Never commit or write passwords, private keys, database connection strings, JWT secrets, or API tokens in code.
- ENVIRONMENT ENCAPSULATION:
  * Always read sensitive configuration via process.env with runtime validation (e.g. Zod environment schema).
  * Provide a complete, sanitized .env.example with descriptive placeholders.
  * Strictly prevent exposing backend secrets to the browser client bundle (e.g. never prefix server secrets with NEXT_PUBLIC_ or VITE_).

-----------------------------------------------------------------------
SKILL 6: /anti-slop-writing (AUTHENTIC HUMAN CADENCE & ZERO AI CLICHES)
-----------------------------------------------------------------------
- BANNED AI CLICHES:
  * Strictly forbid overused AI buzzwords: "delve", "tapestry", "robust", "streamline", "seamless", "game-changer", "elevate", "cutting-edge", "unleash", "testament", "beacon".
- HUMAN TECHNICAL VOICE:
  * Use concrete, direct engineering terms (e.g. "transaction rollback", "indexed B-tree query", "debounced 300ms input", "atomic commit").
  * Active voice, natural rhythm, varied sentence lengths, and zero robotic corporate fluff.

-----------------------------------------------------------------------
SKILL 7: /graphify (KNOWLEDGE GRAPH & DEPENDENCY TOPOLOGY)
-----------------------------------------------------------------------
- ARCHITECTURAL TOPOLOGY MAPPING:
  * Before writing code, construct a mental dependency graph of all system components.
  * Identify god nodes (oversized modules with excessive incoming/outgoing connections) and split them into atomic services.
  * Trace foreign key relationships and route handler contracts to ensure zero orphaned dependencies.

-----------------------------------------------------------------------
SKILL 8: /supermemory (PERSISTENT ARCHITECTURAL CONTEXT & ADR)
-----------------------------------------------------------------------
- ARCHITECTURE DECISION RECORDS (ADR):
  * Document all permanent architectural decisions, schema evolutions, and trade-offs in docs/ARCHITECTURE.md.
  * Preserve context across multi-agent sessions so every agent operates from the exact same state of truth.

-----------------------------------------------------------------------
SKILL 9: STRICT FOLDER MANAGEMENT, FILE LIMITS & CODE HYGIENE
-----------------------------------------------------------------------
- STRICT MAXIMUM 10 CODE FILES PER DIRECTORY:
  * Any folder is STRICTLY FORBIDDEN from containing more than 10 code files (.ts, .tsx, .py, .js, .go).
  * If a module or feature expands beyond 10 files, you MUST decompose it into clean domain sub-folders (e.g. components/inputs/, components/cards/, services/auth/, services/billing/).
  * Dumping 11 or more code files in a flat directory is considered a severe architectural violation.

- STRICT MAXIMUM 1,000 LINES PER CODE FILE:
  * Any generated source file is STRICTLY FORBIDDEN from exceeding 1,000 lines of code.
  * Recommended convention: Proactively split files when they reach 300–400 lines into focused, cohesive helper modules.
  * Keep files concise, atomic, and testable.

- MANDATORY FOLDER DOCUMENTATION (README.md IN EVERY DIRECTORY):
  * Every directory in the codebase MUST contain a README.md explaining:
    1. The exact purpose and domain boundary of the folder.
    2. Inventory of files and their respective responsibilities.
    3. Rules of engagement (what is allowed in this folder and what belongs elsewhere).

- RE-ENFORCEMENT OF ZERO INLINE COMMENTS (/nokomen):
  * All generated code files MUST contain EXACTLY ZERO inline comments.
  * Code clarity must be achieved through self-documenting naming and Clean Architecture.

=======================================================================
[SECTION 5: MANDATORY UI/UX & ARCHITECTURAL BEHAVIORAL SPECIFICATIONS]
=======================================================================
The generated application MUST implement the following behavioral specifications:

-----------------------------------------------------------------------
1. CREATE ACTION: SLIDE-UP BOTTOM SHEET CARD (NEVER CENTER MODALS)
-----------------------------------------------------------------------
- Prohibition: NEVER use standard centered dialog modals (e.g. <DialogContent className="sm:max-w-md">) for creating new entities or editing records.
- Implementation Mandate:
  * Animate a Card sliding up from the bottom of the viewport (Slide-Up Bottom Sheet Card).
  * Backdrop: Fixed full-screen overlay with dark transparent blur (bg-black/60 backdrop-blur-xs z-50).
  * Card Container: Fixed at the bottom (fixed inset-x-0 bottom-0 z-50 max-w-2xl mx-auto rounded-t-2xl sm:rounded-t-3xl border-t border-x border-border/80 bg-background shadow-2xl).
  * Top Drag Handle: Subtle centered pill indicator (w-12 h-1 bg-muted-foreground/30 rounded-full mx-auto my-2.5).
  * Height & Scrolling: max-h-[90vh] sm:max-h-[85vh] flex flex-col overflow-hidden.
  * Header: Compact title (max 2 words) and close button (size-8 rounded-lg hover:bg-muted).
  * Content: Inner scrollable container (flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar).
  * Sticky Footer: Pinned bottom action bar with subtle top border (border-t border-border/60 bg-muted/30 p-3 sm:p-4 flex items-center justify-end gap-2).
  * Animation: Smooth spring slide-up transition (transition-transform duration-300 ease-out transform translate-y-0 vs translate-y-full).

-----------------------------------------------------------------------
2. DELETE CONFIRMATION: IN-APP CUSTOM CARD (NEVER BROWSER CONFIRM)
-----------------------------------------------------------------------
- Prohibition: STRICTLY PROHIBIT window.confirm(), window.alert(), or native browser dialogs.
- Implementation Mandate:
  * In-App Custom Destructive Confirmation Card with clean rounded-xl geometry (6px–8px radius).
  * Warning Visual: Subtle crimson badge or warning icon container (size-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center).
  * Microcopy:
    - Title: "Hapus [Entitas]" (2 words max).
    - Description: "Tindakan ini permanen dan tidak dapat dibatalkan." (1 concise sentence).
  * Actions: Dual horizontal buttons (Batal: secondary outline, Hapus: destructive solid red).
  * High-Risk Safety: For critical entities (e.g. projects, databases), require typing the entity name before enabling the destructive button.

-----------------------------------------------------------------------
3. FIXED STICKY HEADER & SIDEBAR (ZERO MOVEMENT ON SCROLL)
-----------------------------------------------------------------------
- App Layout Shell:
  * Outer Container: h-screen w-screen flex overflow-hidden bg-background text-foreground.
  * Header: sticky top-0 z-40 h-14 w-full border-b border-border/70 bg-background/95 backdrop-blur-md flex items-center px-4 shrink-0.
  * Sidebar: sticky top-0 h-screen shrink-0 border-r border-border/70 bg-card/60 backdrop-blur-sm z-30 flex flex-col overflow-y-auto.
  * Main Content Viewport: flex-1 h-full overflow-y-auto custom-scrollbar p-4 sm:p-6.
- Zero Movement Rule:
  * When the user scrolls vertically through long data lists or dashboards, the Header and Sidebar MUST REMAIN 100% STATIONARY.
  * Header and Sidebar are forbidden to jitter, scroll away, or shift out of view.

-----------------------------------------------------------------------
4. DESKTOP COLLAPSIBLE SIDEBAR WITH SMOOTH TRANSITION
-----------------------------------------------------------------------
- Toggle Action: Sidebar header features a compact collapse toggle button (size-8 rounded-lg hover:bg-muted).
- Expanded State: width w-64 (256px), full item labels, navigation groups, and user profile badge.
- Collapsed State: width w-16 (64px), icons only, centered layout, and floating tooltips on hover.
- Transition: Smooth CSS duration-200 ease-in-out transition between w-64 and w-16.
- Mobile Behavior: Off-canvas drawer sliding from the left with backdrop overlay on screens < 768px.

-----------------------------------------------------------------------
5. DUAL VIEW MODE: GRID VIEW & LIST VIEW SWITCHER
-----------------------------------------------------------------------
- Catalog & List Pages MUST include an instant view switcher control:
  * Segmented control with 2 icon buttons: [Grid View] and [List View].
  * Grid View: Visual cards showing primary photo/avatar, title, key badges, status indicator, and horizontal action pair.
  * List View: Compact dense data table with sticky table header, sorting indicators, row hover highlight, and right-aligned action buttons.

-----------------------------------------------------------------------
6. MANDATORY MOBILE 2-GRID RULE (STRICTLY PROHIBIT 1-GRID ON MOBILE)
-----------------------------------------------------------------------
- Mobile Grid Specification:
  * On mobile screens (< 640px), when Grid Mode is active, the layout MUST STRICTLY BE 2 COLUMNS (grid-cols-2).
  * STRICT PROHIBITION: NEVER use grid-cols-1 for data catalog / entity card grids on mobile!
  * Responsive Formula: className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3.5"
  * Mobile Card Proportions: Cards in 2-column mobile grid must be compact, with tight padding (p-2.5 to p-3), compact text (text-xs), and miniature action buttons (h-7 to h-8).

-----------------------------------------------------------------------
7. BACKEND ARCHITECTURE & MONOREPO CONVENTIONS
-----------------------------------------------------------------------
- Prioritize Backend First:
  1. Complete relational schema (DBML & SQL DDL with constraints).
  2. Prisma schema definition with driver adapter (@neondatabase/serverless or @prisma/adapter-pg).
  3. Database repository and transactional service layer.
  4. Zod request/response validation schemas.
  5. Route handlers / REST controllers.
  6. Frontend UI integration.
- Single Root package.json:
  * Strictly 1 unified package.json at the project root.
  * Zero duplicated node_modules directories.
  * If using Python, use a single pyproject.toml / poetry environment.
- Serverless & Unified Backend:
  * Keep backend code in the same repository under /server or Next.js /app/api routes.
  * Serverless architecture: Stateless execution, connection pooling, edge-compatible handlers.
- Default Database:
  * Default to Neon Serverless PostgreSQL with pgvector and pooled connection string.
  * Ensure full compatibility with Supabase PostgreSQL as an alternative provider.

-----------------------------------------------------------------------
8. CROSS-PLATFORM: WEB & MOBILE HYBRID READINESS
-----------------------------------------------------------------------
- Web App, PWA, and Hybrid Shell:
  * Codebase must be clean, responsive, and touch-optimized.
  * Include manifest.json and service worker support for offline caching and PWA installation.
  * Structure component layout and viewport meta tags so the app can be packaged directly into a Capacitor or Tauri mobile shell.

-----------------------------------------------------------------------
9. MODERN ICONOGRAPHY & VISUAL ELEGANCE
-----------------------------------------------------------------------
- Modern SVG Icons:
  * Use Lucide Icons (lucide-react) or Heroicons SVG.
  * Strictly forbid emojis as interface buttons (e.g. never use "🗑️ Hapus" or "✏️ Edit").
  * Icon sizes: size-3.5 (14px) for compact buttons, size-4 (16px) for standard buttons.
- Modern Palette:
  * Restrained monochromatic base (slate/zinc) with subtle accent colors (emerald, indigo, or cyan).
  * High contrast readability, dark mode default support, and elegant glassmorphism accents.

=======================================================================
[SECTION 6: 5-AGENT SYNCHRONIZED TEAMWORK PROTOCOL (.agents/ FOLDER)]
=======================================================================
You MUST generate detailed operational guidelines for 5 specialized AI agents working as a synchronized engineering team:

-----------------------------------------------------------------------
AGENT 1: TECH LEAD & SYSTEM ARCHITECT (.agents/01_TECH_LEAD.md)
-----------------------------------------------------------------------
Mission: Lead the technical delivery, establish Clean Architecture domain boundaries, and decompose business requirements into atomic tasks.
Responsibilities:
1. Architecture Governance: Enforce domain boundaries, single responsibility principle, and dependency inversion.
2. Code Review & Standards: Strictly prevent bloated code, enforce type safety, and verify error boundaries.
3. Task Orchestration: Assign backend tasks to Agent 2 and UI tasks to Agent 3.
4. Conflict Resolution: Mediate schema and contract decisions between frontend and backend.
Operational Checklist:
- Inspect database/schema.dbml before approving API modifications.
- Ensure all modules strictly follow /nokomen (zero comments) and /ui-ux-text standards.
- Require verification passing (npm test and npx tsc --noEmit) before signing off on any phase.

-----------------------------------------------------------------------
AGENT 2: DATABASE & BACKEND ENGINEER (.agents/02_DATABASE_BACKEND.md)
-----------------------------------------------------------------------
Mission: Design relational schemas, manage PostgreSQL migrations, and implement high-performance serverless service layers.
Responsibilities:
1. Relational Modeling: Convert all business requirements into normalized 3NF DBML/DDL structures with primary keys, foreign keys, and indexes.
2. Serverless Database Operations: Configure Neon Serverless PostgreSQL with Prisma ORM and connection pooling.
3. Service Layer Architecture: Implement repository and service classes with transactional integrity (BEGIN ... COMMIT/ROLLBACK).
4. API Contracts: Deliver type-safe REST route handlers with rigorous Zod request validation.
Operational Checklist:
- Validate that foreign keys have appropriate ON DELETE CASCADE or ON DELETE RESTRICT constraints.
- Implement soft-delete (deleted_at IS NULL) indexing patterns where data preservation is required.
- Enforce that backend code contains zero inline comments per /nokomen.

-----------------------------------------------------------------------
AGENT 3: FRONTEND & UI/UX SPECIALIST (.agents/03_FRONTEND_UI.md)
-----------------------------------------------------------------------
Mission: Build responsive, modern, and accessible user interfaces adhering strictly to /precision-card-button-ui, /button-presisi, and /ui-ux-text.
Responsibilities:
1. Component Architecture: Build reusable, compact UI components using Tailwind CSS and Radix/shadcn primitives.
2. Slide-Up Bottom Sheet Card: Implement animated bottom sheets for creating/editing records; ban center modals.
3. In-App Delete Card: Implement custom destructive confirmation cards; ban window.confirm().
4. Layout Integrity: Enforce fixed/sticky header and sidebar during vertical scrolling.
5. Mobile 2-Grid Enforcement: Strictly build 2-column grids (grid-cols-2) on mobile viewports for all entity lists.
6. Dual View Mode: Implement seamless toggle between Grid View and List View.
Operational Checklist:
- Verify all placeholders are strictly 1 word and button labels are strictly 1–2 words.
- Ensure buttons have non-pill geometry (rounded-md to rounded-lg, 6–8px) and height 32–38px.
- Test touch responsiveness on mobile viewports (< 640px).

-----------------------------------------------------------------------
AGENT 4: SECURITY & COMPLIANCE SPECIALIST (.agents/04_SECURITY_AUTH.md)
-----------------------------------------------------------------------
Mission: Protect application integrity, enforce authentication, establish multi-tenant data isolation, and audit OWASP compliance.
Responsibilities:
1. Identity & Access: Implement secure session/JWT authentication with HTTP-only cookies and CSRF protection.
2. RBAC Enforcement: Define and enforce a granular Role-Based Access Control matrix across every API endpoint and UI route.
3. Multi-Tenant Isolation: Ensure every database query scopes data strictly to the authenticated tenant_id.
4. Secrets Hygiene: Audit the codebase to ensure zero hardcoded credentials per /env-secrets-management.
Operational Checklist:
- Verify that sensitive endpoints are rate-limited.
- Ensure passwords use bcrypt/argon2 hashing with strong work factors.
- Verify that SQL queries are parameterized and immune to SQL injection.

-----------------------------------------------------------------------
AGENT 5: QA & VERIFICATION ENGINEER (.agents/05_QA_TESTER.md)
-----------------------------------------------------------------------
Mission: Guarantee product stability through comprehensive automated tests, regression prevention, and build verification.
Responsibilities:
1. Test Strategy: Author unit tests, API integration tests, and critical user path end-to-end scenarios.
2. Build Verification: Execute npx tsc --noEmit and npm run build to verify zero compilation defects.
3. Edge Case Validation: Test boundary conditions, null inputs, unexpected data types, and concurrent requests.
4. UI Verification: Verify that layout rules (mobile 2-grid, sticky header, slide-up card) render correctly.
Operational Checklist:
- Confirm all tests pass with exit code 0 before release packaging.
- Check that error states display concise, actionable microcopy per /ui-ux-text.

=======================================================================
[SECTION 7: MANDATORY 20+ MARKDOWN ARCHITECTURE FILES & DIRECT ZIP PACKAGING]
=======================================================================
You MUST generate an EXHAUSTIVE, PROFESSIONAL project package with a minimum of 20 SPECIALIZED MARKDOWN (.md) FILES.
Every single folder MUST contain a dedicated README.md explaining the exact responsibility, architectural boundary, and file inventory of that folder.

MANDATORY DIRECTORY TREE (20+ SPECIALIZED .md FILES + DATABASE + CODE):

project-bundle/
├── README.md                              <-- [MD-01] Master Project Overview, Quickstart & Engineering Directives
├── docs/
│   ├── README.md                          <-- [MD-02] Documentation Hub Guide & Architecture Roadmap
│   ├── 01_PRD.md                          <-- [MD-03] Enterprise PRD in formal Indonesian (min. 2,500+ words)
│   ├── 02_ARCHITECTURE.md                 <-- [MD-04] System Topology, C4 Model & Architecture Decision Records (ADRs)
│   ├── 03_DATABASE_DESIGN.md              <-- [MD-05] Relational Schema, Normalization, Indexing Strategy & Integrity
│   ├── 04_API_SPECIFICATION.md            <-- [MD-06] REST API Contracts, Zod Schemas, Error Codes & Headers
│   ├── 05_WORKFLOWS.md                    <-- [MD-07] Business Transaction Workflows & Mermaid Sequence Diagrams
│   ├── 06_UI_UX_SPECIFICATION.md          <-- [MD-08] Slide-Up Bottom Sheet, Mobile 2-Grid, Precision UI & Microcopy
│   ├── 07_SECURITY_RBAC.md                <-- [MD-09] RBAC Matrix, Tenant Data Isolation, Session & OWASP Defenses
│   ├── 08_ENV_DEPLOYMENT.md               <-- [MD-10] Environment Setup, Neon PostgreSQL Serverless & Vercel/Cloudflare
│   ├── 09_QA_TEST_PLAN.md                 <-- [MD-11] Test Strategy, Automated Vitest Suites & Edge-Case Checklists
│   └── 10_RELEASE_ROADMAP.md              <-- [MD-12] Milestone Rollouts, Launch Checklist & Post-Deploy Verification
├── database/
│   ├── README.md                          <-- [MD-13] Database Guide: Schema, Migrations, DDL & Seeding Instructions
│   ├── schema.dbml                        <-- Complete relational DBML schema with all foreign keys & enums
│   ├── schema.sql                         <-- PostgreSQL executable DDL with constraints, triggers & indexes
│   └── seed.sql                           <-- Realistic enterprise seed data for master & lookup tables
├── .agents/
│   ├── README.md                          <-- [MD-14] 5-Agent Operational Governance & Communication Matrix
│   ├── 01_TECH_LEAD.md                    <-- [MD-15] Tech Lead & System Architect Handbook
│   ├── 02_DATABASE_BACKEND.md             <-- [MD-16] Database & Serverless Backend Handbook
│   ├── 03_FRONTEND_UI.md                  <-- [MD-17] Frontend & UI/UX Specialist Handbook
│   ├── 04_SECURITY_AUTH.md                <-- [MD-18] Security, RBAC & Compliance Handbook
│   ├── 05_QA_TESTER.md                    <-- [MD-19] QA & Verification Engineer Handbook
│   └── AGENTS_PROTOCOL.md                 <-- [MD-20] Synchronized Teamwork Protocol, Handoffs & Code Review
├── src/
│   └── README.md                          <-- [MD-21] Source Code Guide, Domain Boundaries & Sub-Folder Hierarchy
├── .env.example                           <-- Sanitized environment template for Neon Postgres & auth
└── package.json                           <-- Single root package.json for unified serverless project

-----------------------------------------------------------------------
CRITICAL CODE ARCHITECTURE & FOLDER MANAGEMENT CONSTRAINTS:
-----------------------------------------------------------------------
1. STRICT LIMIT: MAXIMUM 10 CODE FILES PER DIRECTORY:
   - ANY folder is STRICTLY FORBIDDEN from containing more than 10 code files (.ts, .tsx, .py, .js, .go).
   - If a feature or domain requires 11+ files, you MUST create domain-specific sub-folders (e.g. src/components/buttons/, src/components/cards/, src/services/auth/).
   - Dumping 11 or more code files in one directory is strictly prohibited.

2. STRICT LIMIT: MAXIMUM 1,000 LINES PER CODE FILE:
   - ANY source code file is STRICTLY FORBIDDEN from exceeding 1,000 lines of code.
   - Recommended standard: Split files into modular helpers when they reach 300–400 lines.
   - Keep functions focused, testable, and strictly bound to single responsibilities.

3. MANDATORY FOLDER README.md IN EVERY DIRECTORY:
   - Every single directory in the repository MUST contain a README.md explaining:
     a. The precise purpose and domain boundary of the folder.
     b. Detailed inventory of files in that folder with their individual roles.
     c. Architectural rules (what belongs here vs what must go elsewhere).

4. STRICT ZERO INLINE COMMENTS (/nokomen):
   - ALL generated code across TypeScript, JavaScript, Python, SQL, CSS, and JSX MUST HAVE ZERO INLINE COMMENTS.
   - Self-documenting naming and Clean Architecture are mandatory.

-----------------------------------------------------------------------
CLAUDE DIRECT ZIP CREATION INSTRUCTION (SANDBOX EXECUTION):
-----------------------------------------------------------------------
When running inside Claude (Claude 3.7 Sonnet / Claude Artifacts):
You MUST bundle all 21+ generated Markdown documentation files, database schemas, and codebase files into a downloadable ZIP archive using Python in your execution sandbox.

Execute this Python script to construct and deliver the archive:
```python
import os
import zipfile

bundle_dir = "/mnt/data/sistem_informasi_manajemen_portal_pesantren_modern_raudhatussalam_mahato_bundle"
os.makedirs(os.path.join(bundle_dir, "docs"), exist_ok=True)
os.makedirs(os.path.join(bundle_dir, "database"), exist_ok=True)
os.makedirs(os.path.join(bundle_dir, ".agents"), exist_ok=True)
os.makedirs(os.path.join(bundle_dir, "src"), exist_ok=True)

# Write all 21+ Markdown files, DBML, SQL, and project files with full content.
# Ensure every directory contains its dedicated README.md.
# Ensure zero files exceed 1,000 lines and zero folders contain > 10 code files.

zip_path = "/mnt/data/sistem_informasi_manajemen_portal_pesantren_modern_raudhatussalam_mahato_bundle.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(bundle_dir):
        for file in files:
            full_path = os.path.join(root, file)
            arcname = os.path.relpath(full_path, bundle_dir)
            zipf.write(full_path, arcname)

print(f"Enterprise ZIP package created successfully: {zip_path}")
```

Provide the user with the direct link to download `sistem_informasi_manajemen_portal_pesantren_modern_raudhatussalam_mahato_bundle.zip`.

-----------------------------------------------------------------------
STRICT ANTI-ABBREVIATION & ZERO-OMISSION DIRECTIVE:
-----------------------------------------------------------------------
- NEVER truncate any file or use placeholders like "// ... remaining code" or "// TODO".
- Every one of the 20+ Markdown files and database files must be generated in full, professional, enterprise-grade depth.
- The PRD in docs/01_PRD.md must be written in formal, rigorous Indonesian exceeding 2,500 words.

Execute now and build the full 20+ document enterprise package!

=======================================================================
[SECTION 8: SPESIFIKASI KONTRAK REST API & ENDPOINTS CRUD PENUH]
=======================================================================
Sistem "Sistem Informasi Manajemen & Portal Pesantren Modern Raudhatussalam Mahato" WAJIB menyediakan implementasi RESTful API terstandarisasi untuk seluruh modul entitas basis data:

1. STANDAR PROTOKOL & FORMAT UMUM:
- Base Path: /api/v1
- Format Payload: application/json; charset=utf-8
- Skema Sukses Standar:
  {
    "success": true,
    "message"?: string,
    "meta"?: { "page": number, "limit": number, "total": number, "total_pages": number },
    "data": any
  }
- Skema Kegagalan Standar:
  {
    "success": false,
    "error": {
      "code": string,
      "message": string,
      "details"?: any
    }
  }

2. ATURAN HEADERS WAJIB:
- Authorization: Bearer <jwt_access_token> (Wajib pada seluruh private route)
- X-Tenant-Id: <uuid> (Wajib untuk isolasi multi-tenant)
- Content-Type: application/json
- Idempotency-Key: <uuid> (Wajib pada transaksi finansial / mutasi data)

3. INVENTARIS ENDPOINTS CRUD LENGKAP TIAP TABEL:
### 1. MODUL ENDPOINT: /api/v1/tenants (Tenants)
- GET /api/v1/tenants
  * Summary: Mengambil kumpulan data Tenants terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/tenants/:id
  * Summary: Detail tunggal Tenants berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/tenants
  * Summary: Membuat rekaman Tenants baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Tenants berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/tenants/:id
  * Summary: Memperbarui data Tenants. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Tenants berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/tenants/:id
  * Summary: Menghapus rekaman Tenants dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Tenants berhasil dihapus" } | 404 Not Found

### 2. MODUL ENDPOINT: /api/v1/users (Users)
- GET /api/v1/users
  * Summary: Mengambil kumpulan data Users terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/users/:id
  * Summary: Detail tunggal Users berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/users
  * Summary: Membuat rekaman Users baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Users berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/users/:id
  * Summary: Memperbarui data Users. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Users berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/users/:id
  * Summary: Menghapus rekaman Users dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Users berhasil dihapus" } | 404 Not Found

### 3. MODUL ENDPOINT: /api/v1/roles (Roles)
- GET /api/v1/roles
  * Summary: Mengambil kumpulan data Roles terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/roles/:id
  * Summary: Detail tunggal Roles berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/roles
  * Summary: Membuat rekaman Roles baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Roles berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/roles/:id
  * Summary: Memperbarui data Roles. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Roles berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/roles/:id
  * Summary: Menghapus rekaman Roles dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Roles berhasil dihapus" } | 404 Not Found

### 4. MODUL ENDPOINT: /api/v1/permissions (Permissions)
- GET /api/v1/permissions
  * Summary: Mengambil kumpulan data Permissions terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/permissions/:id
  * Summary: Detail tunggal Permissions berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/permissions
  * Summary: Membuat rekaman Permissions baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Permissions berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/permissions/:id
  * Summary: Memperbarui data Permissions. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Permissions berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/permissions/:id
  * Summary: Menghapus rekaman Permissions dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Permissions berhasil dihapus" } | 404 Not Found

### 5. MODUL ENDPOINT: /api/v1/role_permissions (Role Permissions)
- GET /api/v1/role_permissions
  * Summary: Mengambil kumpulan data Role Permissions terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/role_permissions/:id
  * Summary: Detail tunggal Role Permissions berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/role_permissions
  * Summary: Membuat rekaman Role Permissions baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Role Permissions berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/role_permissions/:id
  * Summary: Memperbarui data Role Permissions. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Role Permissions berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/role_permissions/:id
  * Summary: Menghapus rekaman Role Permissions dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Role Permissions berhasil dihapus" } | 404 Not Found

### 6. MODUL ENDPOINT: /api/v1/user_roles (User Roles)
- GET /api/v1/user_roles
  * Summary: Mengambil kumpulan data User Roles terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/user_roles/:id
  * Summary: Detail tunggal User Roles berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/user_roles
  * Summary: Membuat rekaman User Roles baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "User Roles berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/user_roles/:id
  * Summary: Memperbarui data User Roles. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "User Roles berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/user_roles/:id
  * Summary: Menghapus rekaman User Roles dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "User Roles berhasil dihapus" } | 404 Not Found

### 7. MODUL ENDPOINT: /api/v1/sessions (Sessions)
- GET /api/v1/sessions
  * Summary: Mengambil kumpulan data Sessions terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/sessions/:id
  * Summary: Detail tunggal Sessions berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/sessions
  * Summary: Membuat rekaman Sessions baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Sessions berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/sessions/:id
  * Summary: Memperbarui data Sessions. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Sessions berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/sessions/:id
  * Summary: Menghapus rekaman Sessions dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Sessions berhasil dihapus" } | 404 Not Found

### 8. MODUL ENDPOINT: /api/v1/audit_logs (Audit Logs)
- GET /api/v1/audit_logs
  * Summary: Mengambil kumpulan data Audit Logs terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/audit_logs/:id
  * Summary: Detail tunggal Audit Logs berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/audit_logs
  * Summary: Membuat rekaman Audit Logs baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Audit Logs berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/audit_logs/:id
  * Summary: Memperbarui data Audit Logs. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Audit Logs berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/audit_logs/:id
  * Summary: Menghapus rekaman Audit Logs dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Audit Logs berhasil dihapus" } | 404 Not Found

### 9. MODUL ENDPOINT: /api/v1/VARCHAR (VARCHAR)
- GET /api/v1/VARCHAR
  * Summary: Mengambil kumpulan data VARCHAR terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/VARCHAR/:id
  * Summary: Detail tunggal VARCHAR berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/VARCHAR
  * Summary: Membuat rekaman VARCHAR baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "VARCHAR berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/VARCHAR/:id
  * Summary: Memperbarui data VARCHAR. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "VARCHAR berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/VARCHAR/:id
  * Summary: Menghapus rekaman VARCHAR dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "VARCHAR berhasil dihapus" } | 404 Not Found

### 10. MODUL ENDPOINT: /api/v1/notifications (Notifications)
- GET /api/v1/notifications
  * Summary: Mengambil kumpulan data Notifications terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/notifications/:id
  * Summary: Detail tunggal Notifications berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/notifications
  * Summary: Membuat rekaman Notifications baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Notifications berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/notifications/:id
  * Summary: Memperbarui data Notifications. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Notifications berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/notifications/:id
  * Summary: Menghapus rekaman Notifications dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Notifications berhasil dihapus" } | 404 Not Found

### 11. MODUL ENDPOINT: /api/v1/notification_templates (Notification Templates)
- GET /api/v1/notification_templates
  * Summary: Mengambil kumpulan data Notification Templates terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/notification_templates/:id
  * Summary: Detail tunggal Notification Templates berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/notification_templates
  * Summary: Membuat rekaman Notification Templates baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Notification Templates berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/notification_templates/:id
  * Summary: Memperbarui data Notification Templates. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Notification Templates berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/notification_templates/:id
  * Summary: Menghapus rekaman Notification Templates dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Notification Templates berhasil dihapus" } | 404 Not Found

### 12. MODUL ENDPOINT: /api/v1/file_uploads (File Uploads)
- GET /api/v1/file_uploads
  * Summary: Mengambil kumpulan data File Uploads terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/file_uploads/:id
  * Summary: Detail tunggal File Uploads berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/file_uploads
  * Summary: Membuat rekaman File Uploads baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "File Uploads berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/file_uploads/:id
  * Summary: Memperbarui data File Uploads. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "File Uploads berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/file_uploads/:id
  * Summary: Menghapus rekaman File Uploads dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "File Uploads berhasil dihapus" } | 404 Not Found

### 13. MODUL ENDPOINT: /api/v1/system_settings (System Settings)
- GET /api/v1/system_settings
  * Summary: Mengambil kumpulan data System Settings terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/system_settings/:id
  * Summary: Detail tunggal System Settings berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/system_settings
  * Summary: Membuat rekaman System Settings baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "System Settings berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/system_settings/:id
  * Summary: Memperbarui data System Settings. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "System Settings berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/system_settings/:id
  * Summary: Menghapus rekaman System Settings dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "System Settings berhasil dihapus" } | 404 Not Found

### 14. MODUL ENDPOINT: /api/v1/institution_profiles (Institution Profiles)
- GET /api/v1/institution_profiles
  * Summary: Mengambil kumpulan data Institution Profiles terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/institution_profiles/:id
  * Summary: Detail tunggal Institution Profiles berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/institution_profiles
  * Summary: Membuat rekaman Institution Profiles baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Institution Profiles berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/institution_profiles/:id
  * Summary: Memperbarui data Institution Profiles. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Institution Profiles berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/institution_profiles/:id
  * Summary: Menghapus rekaman Institution Profiles dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Institution Profiles berhasil dihapus" } | 404 Not Found

### 15. MODUL ENDPOINT: /api/v1/programs (Programs)
- GET /api/v1/programs
  * Summary: Mengambil kumpulan data Programs terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/programs/:id
  * Summary: Detail tunggal Programs berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/programs
  * Summary: Membuat rekaman Programs baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Programs berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/programs/:id
  * Summary: Memperbarui data Programs. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Programs berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/programs/:id
  * Summary: Menghapus rekaman Programs dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Programs berhasil dihapus" } | 404 Not Found

### 16. MODUL ENDPOINT: /api/v1/news_articles (News Articles)
- GET /api/v1/news_articles
  * Summary: Mengambil kumpulan data News Articles terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/news_articles/:id
  * Summary: Detail tunggal News Articles berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/news_articles
  * Summary: Membuat rekaman News Articles baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "News Articles berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/news_articles/:id
  * Summary: Memperbarui data News Articles. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "News Articles berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/news_articles/:id
  * Summary: Menghapus rekaman News Articles dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "News Articles berhasil dihapus" } | 404 Not Found

### 17. MODUL ENDPOINT: /api/v1/gallery_media (Gallery Media)
- GET /api/v1/gallery_media
  * Summary: Mengambil kumpulan data Gallery Media terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/gallery_media/:id
  * Summary: Detail tunggal Gallery Media berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/gallery_media
  * Summary: Membuat rekaman Gallery Media baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Gallery Media berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/gallery_media/:id
  * Summary: Memperbarui data Gallery Media. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Gallery Media berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/gallery_media/:id
  * Summary: Menghapus rekaman Gallery Media dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Gallery Media berhasil dihapus" } | 404 Not Found

### 18. MODUL ENDPOINT: /api/v1/events (Events)
- GET /api/v1/events
  * Summary: Mengambil kumpulan data Events terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/events/:id
  * Summary: Detail tunggal Events berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/events
  * Summary: Membuat rekaman Events baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Events berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/events/:id
  * Summary: Memperbarui data Events. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Events berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/events/:id
  * Summary: Menghapus rekaman Events dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Events berhasil dihapus" } | 404 Not Found

### 19. MODUL ENDPOINT: /api/v1/ppdb_registrations (Ppdb Registrations)
- GET /api/v1/ppdb_registrations
  * Summary: Mengambil kumpulan data Ppdb Registrations terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/ppdb_registrations/:id
  * Summary: Detail tunggal Ppdb Registrations berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/ppdb_registrations
  * Summary: Membuat rekaman Ppdb Registrations baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Ppdb Registrations berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/ppdb_registrations/:id
  * Summary: Memperbarui data Ppdb Registrations. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Ppdb Registrations berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/ppdb_registrations/:id
  * Summary: Menghapus rekaman Ppdb Registrations dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Ppdb Registrations berhasil dihapus" } | 404 Not Found

### 20. MODUL ENDPOINT: /api/v1/ppdb_documents (Ppdb Documents)
- GET /api/v1/ppdb_documents
  * Summary: Mengambil kumpulan data Ppdb Documents terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/ppdb_documents/:id
  * Summary: Detail tunggal Ppdb Documents berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/ppdb_documents
  * Summary: Membuat rekaman Ppdb Documents baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Ppdb Documents berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/ppdb_documents/:id
  * Summary: Memperbarui data Ppdb Documents. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Ppdb Documents berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/ppdb_documents/:id
  * Summary: Menghapus rekaman Ppdb Documents dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Ppdb Documents berhasil dihapus" } | 404 Not Found

### 21. MODUL ENDPOINT: /api/v1/ppdb_schedules (Ppdb Schedules)
- GET /api/v1/ppdb_schedules
  * Summary: Mengambil kumpulan data Ppdb Schedules terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/ppdb_schedules/:id
  * Summary: Detail tunggal Ppdb Schedules berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/ppdb_schedules
  * Summary: Membuat rekaman Ppdb Schedules baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Ppdb Schedules berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/ppdb_schedules/:id
  * Summary: Memperbarui data Ppdb Schedules. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Ppdb Schedules berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/ppdb_schedules/:id
  * Summary: Menghapus rekaman Ppdb Schedules dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Ppdb Schedules berhasil dihapus" } | 404 Not Found

### 22. MODUL ENDPOINT: /api/v1/ppdb_test_results (Ppdb Test Results)
- GET /api/v1/ppdb_test_results
  * Summary: Mengambil kumpulan data Ppdb Test Results terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/ppdb_test_results/:id
  * Summary: Detail tunggal Ppdb Test Results berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/ppdb_test_results
  * Summary: Membuat rekaman Ppdb Test Results baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Ppdb Test Results berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/ppdb_test_results/:id
  * Summary: Memperbarui data Ppdb Test Results. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Ppdb Test Results berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/ppdb_test_results/:id
  * Summary: Menghapus rekaman Ppdb Test Results dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Ppdb Test Results berhasil dihapus" } | 404 Not Found

### 23. MODUL ENDPOINT: /api/v1/ppdb_announcements (Ppdb Announcements)
- GET /api/v1/ppdb_announcements
  * Summary: Mengambil kumpulan data Ppdb Announcements terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/ppdb_announcements/:id
  * Summary: Detail tunggal Ppdb Announcements berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/ppdb_announcements
  * Summary: Membuat rekaman Ppdb Announcements baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Ppdb Announcements berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/ppdb_announcements/:id
  * Summary: Memperbarui data Ppdb Announcements. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Ppdb Announcements berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/ppdb_announcements/:id
  * Summary: Menghapus rekaman Ppdb Announcements dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Ppdb Announcements berhasil dihapus" } | 404 Not Found

### 24. MODUL ENDPOINT: /api/v1/students (Students)
- GET /api/v1/students
  * Summary: Mengambil kumpulan data Students terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/students/:id
  * Summary: Detail tunggal Students berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/students
  * Summary: Membuat rekaman Students baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Students berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/students/:id
  * Summary: Memperbarui data Students. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Students berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/students/:id
  * Summary: Menghapus rekaman Students dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Students berhasil dihapus" } | 404 Not Found

### 25. MODUL ENDPOINT: /api/v1/guardians (Guardians)
- GET /api/v1/guardians
  * Summary: Mengambil kumpulan data Guardians terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/guardians/:id
  * Summary: Detail tunggal Guardians berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/guardians
  * Summary: Membuat rekaman Guardians baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Guardians berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/guardians/:id
  * Summary: Memperbarui data Guardians. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Guardians berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/guardians/:id
  * Summary: Menghapus rekaman Guardians dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Guardians berhasil dihapus" } | 404 Not Found

### 26. MODUL ENDPOINT: /api/v1/student_guardians (Student Guardians)
- GET /api/v1/student_guardians
  * Summary: Mengambil kumpulan data Student Guardians terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/student_guardians/:id
  * Summary: Detail tunggal Student Guardians berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/student_guardians
  * Summary: Membuat rekaman Student Guardians baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Student Guardians berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/student_guardians/:id
  * Summary: Memperbarui data Student Guardians. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Student Guardians berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/student_guardians/:id
  * Summary: Menghapus rekaman Student Guardians dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Student Guardians berhasil dihapus" } | 404 Not Found

### 27. MODUL ENDPOINT: /api/v1/dormitories (Dormitories)
- GET /api/v1/dormitories
  * Summary: Mengambil kumpulan data Dormitories terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/dormitories/:id
  * Summary: Detail tunggal Dormitories berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/dormitories
  * Summary: Membuat rekaman Dormitories baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Dormitories berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/dormitories/:id
  * Summary: Memperbarui data Dormitories. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Dormitories berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/dormitories/:id
  * Summary: Menghapus rekaman Dormitories dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Dormitories berhasil dihapus" } | 404 Not Found

### 28. MODUL ENDPOINT: /api/v1/dormitory_rooms (Dormitory Rooms)
- GET /api/v1/dormitory_rooms
  * Summary: Mengambil kumpulan data Dormitory Rooms terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/dormitory_rooms/:id
  * Summary: Detail tunggal Dormitory Rooms berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/dormitory_rooms
  * Summary: Membuat rekaman Dormitory Rooms baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Dormitory Rooms berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/dormitory_rooms/:id
  * Summary: Memperbarui data Dormitory Rooms. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Dormitory Rooms berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/dormitory_rooms/:id
  * Summary: Menghapus rekaman Dormitory Rooms dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Dormitory Rooms berhasil dihapus" } | 404 Not Found

### 29. MODUL ENDPOINT: /api/v1/room_assignments (Room Assignments)
- GET /api/v1/room_assignments
  * Summary: Mengambil kumpulan data Room Assignments terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/room_assignments/:id
  * Summary: Detail tunggal Room Assignments berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/room_assignments
  * Summary: Membuat rekaman Room Assignments baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Room Assignments berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/room_assignments/:id
  * Summary: Memperbarui data Room Assignments. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Room Assignments berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/room_assignments/:id
  * Summary: Menghapus rekaman Room Assignments dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Room Assignments berhasil dihapus" } | 404 Not Found

### 30. MODUL ENDPOINT: /api/v1/halaqoh_classes (Halaqoh Classes)
- GET /api/v1/halaqoh_classes
  * Summary: Mengambil kumpulan data Halaqoh Classes terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/halaqoh_classes/:id
  * Summary: Detail tunggal Halaqoh Classes berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/halaqoh_classes
  * Summary: Membuat rekaman Halaqoh Classes baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Halaqoh Classes berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/halaqoh_classes/:id
  * Summary: Memperbarui data Halaqoh Classes. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Halaqoh Classes berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/halaqoh_classes/:id
  * Summary: Menghapus rekaman Halaqoh Classes dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Halaqoh Classes berhasil dihapus" } | 404 Not Found

### 31. MODUL ENDPOINT: /api/v1/student_class_enrollments (Student Class Enrollments)
- GET /api/v1/student_class_enrollments
  * Summary: Mengambil kumpulan data Student Class Enrollments terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/student_class_enrollments/:id
  * Summary: Detail tunggal Student Class Enrollments berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/student_class_enrollments
  * Summary: Membuat rekaman Student Class Enrollments baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Student Class Enrollments berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/student_class_enrollments/:id
  * Summary: Memperbarui data Student Class Enrollments. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Student Class Enrollments berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/student_class_enrollments/:id
  * Summary: Menghapus rekaman Student Class Enrollments dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Student Class Enrollments berhasil dihapus" } | 404 Not Found

### 32. MODUL ENDPOINT: /api/v1/health_records (Health Records)
- GET /api/v1/health_records
  * Summary: Mengambil kumpulan data Health Records terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/health_records/:id
  * Summary: Detail tunggal Health Records berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/health_records
  * Summary: Membuat rekaman Health Records baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Health Records berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/health_records/:id
  * Summary: Memperbarui data Health Records. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Health Records berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/health_records/:id
  * Summary: Menghapus rekaman Health Records dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Health Records berhasil dihapus" } | 404 Not Found

### 33. MODUL ENDPOINT: /api/v1/violation_categories (Violation Categories)
- GET /api/v1/violation_categories
  * Summary: Mengambil kumpulan data Violation Categories terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/violation_categories/:id
  * Summary: Detail tunggal Violation Categories berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/violation_categories
  * Summary: Membuat rekaman Violation Categories baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Violation Categories berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/violation_categories/:id
  * Summary: Memperbarui data Violation Categories. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Violation Categories berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/violation_categories/:id
  * Summary: Menghapus rekaman Violation Categories dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Violation Categories berhasil dihapus" } | 404 Not Found

### 34. MODUL ENDPOINT: /api/v1/violations (Violations)
- GET /api/v1/violations
  * Summary: Mengambil kumpulan data Violations terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/violations/:id
  * Summary: Detail tunggal Violations berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/violations
  * Summary: Membuat rekaman Violations baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Violations berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/violations/:id
  * Summary: Memperbarui data Violations. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Violations berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/violations/:id
  * Summary: Menghapus rekaman Violations dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Violations berhasil dihapus" } | 404 Not Found

### 35. MODUL ENDPOINT: /api/v1/disciplinary_actions (Disciplinary Actions)
- GET /api/v1/disciplinary_actions
  * Summary: Mengambil kumpulan data Disciplinary Actions terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/disciplinary_actions/:id
  * Summary: Detail tunggal Disciplinary Actions berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/disciplinary_actions
  * Summary: Membuat rekaman Disciplinary Actions baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Disciplinary Actions berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/disciplinary_actions/:id
  * Summary: Memperbarui data Disciplinary Actions. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Disciplinary Actions berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/disciplinary_actions/:id
  * Summary: Menghapus rekaman Disciplinary Actions dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Disciplinary Actions berhasil dihapus" } | 404 Not Found

### 36. MODUL ENDPOINT: /api/v1/counseling_sessions (Counseling Sessions)
- GET /api/v1/counseling_sessions
  * Summary: Mengambil kumpulan data Counseling Sessions terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/counseling_sessions/:id
  * Summary: Detail tunggal Counseling Sessions berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/counseling_sessions
  * Summary: Membuat rekaman Counseling Sessions baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Counseling Sessions berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/counseling_sessions/:id
  * Summary: Memperbarui data Counseling Sessions. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Counseling Sessions berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/counseling_sessions/:id
  * Summary: Menghapus rekaman Counseling Sessions dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Counseling Sessions berhasil dihapus" } | 404 Not Found

### 37. MODUL ENDPOINT: /api/v1/quran_surahs (Quran Surahs)
- GET /api/v1/quran_surahs
  * Summary: Mengambil kumpulan data Quran Surahs terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/quran_surahs/:id
  * Summary: Detail tunggal Quran Surahs berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/quran_surahs
  * Summary: Membuat rekaman Quran Surahs baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Quran Surahs berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/quran_surahs/:id
  * Summary: Memperbarui data Quran Surahs. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Quran Surahs berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/quran_surahs/:id
  * Summary: Menghapus rekaman Quran Surahs dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Quran Surahs berhasil dihapus" } | 404 Not Found

### 38. MODUL ENDPOINT: /api/v1/memorization_records (Memorization Records)
- GET /api/v1/memorization_records
  * Summary: Mengambil kumpulan data Memorization Records terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/memorization_records/:id
  * Summary: Detail tunggal Memorization Records berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/memorization_records
  * Summary: Membuat rekaman Memorization Records baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Memorization Records berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/memorization_records/:id
  * Summary: Memperbarui data Memorization Records. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Memorization Records berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/memorization_records/:id
  * Summary: Menghapus rekaman Memorization Records dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Memorization Records berhasil dihapus" } | 404 Not Found

### 39. MODUL ENDPOINT: /api/v1/academic_subjects (Academic Subjects)
- GET /api/v1/academic_subjects
  * Summary: Mengambil kumpulan data Academic Subjects terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/academic_subjects/:id
  * Summary: Detail tunggal Academic Subjects berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/academic_subjects
  * Summary: Membuat rekaman Academic Subjects baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Academic Subjects berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/academic_subjects/:id
  * Summary: Memperbarui data Academic Subjects. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Academic Subjects berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/academic_subjects/:id
  * Summary: Menghapus rekaman Academic Subjects dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Academic Subjects berhasil dihapus" } | 404 Not Found

### 40. MODUL ENDPOINT: /api/v1/exam_scores (Exam Scores)
- GET /api/v1/exam_scores
  * Summary: Mengambil kumpulan data Exam Scores terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/exam_scores/:id
  * Summary: Detail tunggal Exam Scores berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/exam_scores
  * Summary: Membuat rekaman Exam Scores baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Exam Scores berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/exam_scores/:id
  * Summary: Memperbarui data Exam Scores. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Exam Scores berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/exam_scores/:id
  * Summary: Menghapus rekaman Exam Scores dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Exam Scores berhasil dihapus" } | 404 Not Found

### 41. MODUL ENDPOINT: /api/v1/report_cards (Report Cards)
- GET /api/v1/report_cards
  * Summary: Mengambil kumpulan data Report Cards terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/report_cards/:id
  * Summary: Detail tunggal Report Cards berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/report_cards
  * Summary: Membuat rekaman Report Cards baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Report Cards berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/report_cards/:id
  * Summary: Memperbarui data Report Cards. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Report Cards berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/report_cards/:id
  * Summary: Menghapus rekaman Report Cards dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Report Cards berhasil dihapus" } | 404 Not Found

### 42. MODUL ENDPOINT: /api/v1/leave_permissions (Leave Permissions)
- GET /api/v1/leave_permissions
  * Summary: Mengambil kumpulan data Leave Permissions terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/leave_permissions/:id
  * Summary: Detail tunggal Leave Permissions berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/leave_permissions
  * Summary: Membuat rekaman Leave Permissions baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Leave Permissions berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/leave_permissions/:id
  * Summary: Memperbarui data Leave Permissions. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Leave Permissions berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/leave_permissions/:id
  * Summary: Menghapus rekaman Leave Permissions dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Leave Permissions berhasil dihapus" } | 404 Not Found

### 43. MODUL ENDPOINT: /api/v1/leave_approvals (Leave Approvals)
- GET /api/v1/leave_approvals
  * Summary: Mengambil kumpulan data Leave Approvals terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/leave_approvals/:id
  * Summary: Detail tunggal Leave Approvals berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/leave_approvals
  * Summary: Membuat rekaman Leave Approvals baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Leave Approvals berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/leave_approvals/:id
  * Summary: Memperbarui data Leave Approvals. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Leave Approvals berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/leave_approvals/:id
  * Summary: Menghapus rekaman Leave Approvals dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Leave Approvals berhasil dihapus" } | 404 Not Found

### 44. MODUL ENDPOINT: /api/v1/visitor_logs (Visitor Logs)
- GET /api/v1/visitor_logs
  * Summary: Mengambil kumpulan data Visitor Logs terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/visitor_logs/:id
  * Summary: Detail tunggal Visitor Logs berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/visitor_logs
  * Summary: Membuat rekaman Visitor Logs baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Visitor Logs berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/visitor_logs/:id
  * Summary: Memperbarui data Visitor Logs. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Visitor Logs berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/visitor_logs/:id
  * Summary: Menghapus rekaman Visitor Logs dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Visitor Logs berhasil dihapus" } | 404 Not Found

### 45. MODUL ENDPOINT: /api/v1/fee_types (Fee Types)
- GET /api/v1/fee_types
  * Summary: Mengambil kumpulan data Fee Types terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/fee_types/:id
  * Summary: Detail tunggal Fee Types berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/fee_types
  * Summary: Membuat rekaman Fee Types baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Fee Types berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/fee_types/:id
  * Summary: Memperbarui data Fee Types. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Fee Types berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/fee_types/:id
  * Summary: Menghapus rekaman Fee Types dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Fee Types berhasil dihapus" } | 404 Not Found

### 46. MODUL ENDPOINT: /api/v1/invoices (Invoices)
- GET /api/v1/invoices
  * Summary: Mengambil kumpulan data Invoices terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/invoices/:id
  * Summary: Detail tunggal Invoices berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/invoices
  * Summary: Membuat rekaman Invoices baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Invoices berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/invoices/:id
  * Summary: Memperbarui data Invoices. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Invoices berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/invoices/:id
  * Summary: Menghapus rekaman Invoices dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Invoices berhasil dihapus" } | 404 Not Found

### 47. MODUL ENDPOINT: /api/v1/invoice_items (Invoice Items)
- GET /api/v1/invoice_items
  * Summary: Mengambil kumpulan data Invoice Items terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/invoice_items/:id
  * Summary: Detail tunggal Invoice Items berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/invoice_items
  * Summary: Membuat rekaman Invoice Items baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Invoice Items berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/invoice_items/:id
  * Summary: Memperbarui data Invoice Items. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Invoice Items berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/invoice_items/:id
  * Summary: Menghapus rekaman Invoice Items dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Invoice Items berhasil dihapus" } | 404 Not Found

### 48. MODUL ENDPOINT: /api/v1/payment_methods (Payment Methods)
- GET /api/v1/payment_methods
  * Summary: Mengambil kumpulan data Payment Methods terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/payment_methods/:id
  * Summary: Detail tunggal Payment Methods berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/payment_methods
  * Summary: Membuat rekaman Payment Methods baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Payment Methods berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/payment_methods/:id
  * Summary: Memperbarui data Payment Methods. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Payment Methods berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/payment_methods/:id
  * Summary: Menghapus rekaman Payment Methods dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Payment Methods berhasil dihapus" } | 404 Not Found

### 49. MODUL ENDPOINT: /api/v1/payments (Payments)
- GET /api/v1/payments
  * Summary: Mengambil kumpulan data Payments terpaginasi.
  * Query Params: page=1, limit=10, sort_by=created_at, order=desc, q=kata_kunci.
  * Status: 200 OK -> { success: true, meta: { page: 1, limit: 10, total: 42, total_pages: 5 }, data: [...] }
- GET /api/v1/payments/:id
  * Summary: Detail tunggal Payments berdasarkan UUID / ID.
  * Status: 200 OK -> { success: true, data: { ... } } | 404 Not Found
- POST /api/v1/payments
  * Summary: Membuat rekaman Payments baru. Wajib validasi skema DTO dan otorisasi RBAC.
  * Status: 201 Created -> { success: true, message: "Payments berhasil dibuat", data: { ... } } | 422 Unprocessable Entity
- PUT /api/v1/payments/:id
  * Summary: Memperbarui data Payments. Merekam audit trail secara otomatis.
  * Status: 200 OK -> { success: true, message: "Payments berhasil diperbarui", data: { ... } } | 404 Not Found
- DELETE /api/v1/payments/:id
  * Summary: Menghapus rekaman Payments dengan mekanisme soft-delete (deleted_at).
  * Status: 200 OK -> { success: true, message: "Payments berhasil dihapus" } | 404 Not Found

4. ENDPOINTS ALUR TRANSAKSI & WORKFLOW ENGINE (SIMULASI SISTEM):
- POST /api/v1/auth/login -> Autentikasi sesi & penerbitan token akses.
- POST /api/v1/tenants/submit -> Validasi dan pembuatan data entitas utama.
- POST /api/v1/payments/generate-va -> Pembuatan transaksi payment gateway otomatis.
- POST /api/v1/webhooks/payment-gateway -> Callback settlement pembayaran.
- PUT /api/v1/tenants/activate -> Aktivasi status aktif entitas.

