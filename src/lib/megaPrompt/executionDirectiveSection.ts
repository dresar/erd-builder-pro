export function getExecutionDirectiveSection(projectName: string, domain: string, techStack: string): string {
  const proj = projectName.trim() || 'Sistem Enterprise';
  const dom = domain.trim() || 'SaaS Multi-Tenant';
  const stack = techStack.trim() || 'Next.js 15 + Neon PostgreSQL (Prisma) + Express + Tailwind CSS';

  return `# =======================================================================
# CRITICAL MASTER DIRECTIVE: AUTONOMOUS IMMEDIATE EXECUTION PROTOCOL
# MANDATORY INSTRUCTIONS FOR CLAUDE CODE CLI, CHATGPT, CURSOR, AND ALL AI AGENTS
# TARGET SYSTEM: "${proj}" | DOMAIN: "${dom}"
# =======================================================================

# [SECTION A: ABSOLUTE PROHIBITION OF PASSIVITY, WAITING, & CHATTING]
# -----------------------------------------------------------------------
# ⚠️ ZERO-TOLERANCE WARNING FOR AI ASSISTANTS:
# 1. BANNED CONVERSATIONAL PHRASES (STRICTLY PROHIBITED):
#    - "File mega_prompt... sudah saya terima dan siap dikerjakan."
#    - "I took a look at the file you uploaded — it's a very large mega orchestrator prompt..."
#    - "Since this is a very large scope, I want to make sure I build the right thing..."
#    - "Kirimkan saja tugas yang ingin dikerjakan..."
#    - "Bagian mana yang ingin Anda buat terlebih dahulu?"
#    - "What would you like me to do next?"
#    - "Let me know when you're ready to proceed."
#
# 2. STRICT PROHIBITION ON CLARIFYING QUESTIONS & PERMISSION SEEKING:
#    - Every single architectural requirement, database table (all relational models), API contract,
#      RBAC role, tenant isolation rule, and business workflow is ALREADY 100% SPECIFIED in this document.
#    - You have ZERO REASON to ask questions, pause for feedback, or hesitate. Everything you need is here.
#    - Asking clarifying questions or waiting for user confirmation is treated as a CRITICAL TASK FAILURE.
#
# 3. STRICT PROHIBITION ON SUMMARIZING OR CHATTING ABOUT THIS PROMPT:
#    - The user compiled this prompt and knows every line. Do NOT summarize or regurgitate what it contains.
#    - Do NOT write meta-analysis, conversational pleasantries, or architectural essays.
#
# 4. YOUR ONLY PERMISSIBLE ACTION UPON RECEIVING THIS PROMPT:
#    - START CODING AND GENERATING THE ACTUAL REPOSITORY FILES IMMEDIATELY.
#    - If you have file-creation tools (Claude Code CLI, Cursor, Antigravity, Windsurf):
#      Write the actual files to disk right now without asking.
#    - If you are in a web chat (ChatGPT, Claude web):
#      Immediately output the complete production code files starting with PHASE 1,
#      OR output a single self-contained Python generator script (e.g. generate_project_bundle.py)
#      that writes all files and compiles the downloadable ZIP locally.

# =======================================================================
# [SECTION B: 5-PHASE DETERMINISTIC AUTONOMOUS ROADMAP]
# =======================================================================
# Execute this project systematically through the following 5 phases.
# Start with PHASE 1 in your VERY FIRST response:
#
# ── PHASE 1: REPOSITORY SCAFFOLDING & DATABASE LAYER (START HERE NOW) ──
# 1. Root package.json (${stack}, React 19, Prisma 6, Tailwind CSS v4, Lucide, Zod, Jose/JWT, Bcrypt).
# 2. tsconfig.json & next.config.mjs (Strict typechecking, path aliases @/*).
# 3. Complete production prisma/schema.prisma containing ALL multi-tenant models:
#    - Core & Multi-Tenant: Tenant, User, Role, Permission, UserRole, AuditLog
#    - Data Induk / Entities: All domain master data, relations, and referential integrity
#    - Relational mapping, UUID/BigInt keys, soft deletes (deleted_at), indexes, and enums
# 4. prisma/seed.ts (Comprehensive real-world seed data for "${proj}").
# 5. src/lib/prisma.ts (Singleton Prisma client for serverless Neon PostgreSQL).
#
# ── PHASE 2: AUTHENTICATION, MULTI-TENANCY & MIDDLEWARE CORE ──
# 1. JWT Authentication & Password Utilities (src/lib/auth.ts, src/lib/jwt.ts).
# 2. Next.js 15 Edge Middleware (src/middleware.ts):
#    - Multi-tenant detection via subdomain or x-tenant-id header
#    - Session & JWT token verification with cookie extraction
#    - Strict RBAC Route Guards for all user roles
#    - Security Headers (CSP, CORS, Strict-Transport-Security, X-Frame-Options)
# 3. Centralized API response, pagination, and error handlers (src/lib/api-response.ts, src/lib/exceptions.ts).
#
# ── PHASE 3: PRODUCTION REST API ENDPOINTS (FULL CRUD IMPLEMENTATION) ──
# 1. Auth: /api/v1/auth/login, /api/v1/auth/me, /api/v1/auth/refresh, /api/v1/auth/logout.
# 2. Domain Entities: Complete CRUD endpoints with pagination, filtering, search, and sorting.
# 3. Business Logic: State transitions, workflow actions, validation schemas (Zod).
# 4. Observability: /api/v1/health.
#
# ── PHASE 4: FRONTEND UI, PORTALS & ROLE-BASED DASHBOARDS ──
# 1. Clean Tailwind CSS v4 styling with dark/light mode support and Inter typography.
# 2. Public Portal / Landing page with responsive layout.
# 3. Super Admin Dashboard: Multi-Tenant switcher, audit log monitor, system health.
# 4. Tenant Admin Dashboard: Statistical summaries, queue processing, monitoring.
# 5. User / Role Portals: Fast input forms, tracking, approval workflows.
#
# ── PHASE 5: VERIFICATION, TESTING & SERVERLESS DEPLOYMENT ──
# 1. Build Verification (npm run build must exit with 0 errors).
# 2. Automated Vitest unit and integration test suite.
# 3. Serverless Vercel deployment guide (docs/DEPLOYMENT.md).

# =======================================================================
# [SECTION C: HUNDREDS OF PERMANENT ENGINEERING RULES & INVARIANTS]
# =======================================================================
# [SUBSECTION C.1: ARCHITECTURE & MONOREPO GOVERNANCE]
# - Rule 1: Single Root package.json Monorepo: 1 unified package.json at root. Strictly no nested subfolder package.json.
# - Rule 2: Clean Architecture: Strict layer separation: Domain Entities -> Repositories -> Services -> API Controllers -> UI.
# - Rule 3: Database Engine: Neon Serverless PostgreSQL with pooled connection string and Prisma ORM.
# - Rule 4: Maximum 10 Code Files Per Directory: Split into domain subfolders upon reaching 11 files.
# - Rule 5: Maximum 1,000 Lines Per Code File: Decompose into modular helper utilities upon reaching 300–400 lines.
# - Rule 6: Mandatory Directory README.md: Every folder must have a README.md documenting purpose, file inventory, and rules.
# - Rule 7: Zero Inline Comments (/nokomen): EXACTLY ZERO comments (//, /* */, {# #}, <!-- -->) in all code.
# - Rule 8: 100% Strict TypeScript: strict: true, noImplicitAny: true, strictNullChecks: true. Zero any types.
# - Rule 9: Path Aliases: Strictly use @/* mapping to ./src/* for all internal module imports.
# - Rule 10: Zero Hardcoded Secrets (/env-secrets-management): All secrets must be validated via process.env at startup.

# [SUBSECTION C.2: DATABASE & DATA INTEGRITY INVARIANTS]
# - Rule 11: Third Normal Form (3NF): All tables normalized with clear primary and foreign key definitions.
# - Rule 12: Primary Key Standards: Primary keys must be UUIDv7 or BigInt auto-increment. (gen_random_uuid() generates UUIDv4; use UUIDv7 or BigInt).
# - Rule 13: Referential Integrity & Soft Delete: Physical DELETE is PROHIBITED for domain entities. Domain records MUST use soft-delete (deleted_at) with ON DELETE RESTRICT. ON DELETE CASCADE is restricted strictly to ephemeral technical child records.
# - Rule 14: Mandatory Audit Timestamps: created_at TIMESTAMPTZ, updated_at TIMESTAMPTZ, deleted_at TIMESTAMPTZ (soft delete).
# - Rule 15: Multi-Tenant Isolation: Every tenant-scoped entity must have tenant_id / campus_id with mandatory indexed filtering.
# - Rule 16: Indexing Strategy: Explicit B-tree indexes on foreign keys, tenant IDs, status enums, and unique constraints.
# - Rule 17: Database Enums: All finite states (status, role, category) must be defined as explicit PostgreSQL enums.
# - Rule 18: Password & PII Security: Passwords hashed with Argon2 or Bcrypt (salt rounds 12). PII encrypted at rest.
# - Rule 19: Comprehensive Seed Script: prisma/seed.ts must populate realistic master data, roles, users, and transactions.
# - Rule 20: Idempotent Migrations: DDL scripts and seed routines must be safely rerunnable without crashing.

# [SUBSECTION C.3: BACKEND API & SECURITY STANDARDS]
# - Rule 21: Uniform Response Envelope: Success { success: true, data: T }, Error { success: false, error: string, code: string }.
# - Rule 22: Strict Zod Request Validation: Validate query, params, and body schemas before reaching controller logic.
# - Rule 23: Standard HTTP Status Codes: 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable, 500 Server Error.
# - Rule 24: REST Mutation Semantics: PUT = Full Replacement (all fields required); PATCH = Partial Update (only changed fields).
# - Rule 25: Standard Universal Pagination: page (default 1), limit (default 20), sort_by (created_at), order (desc/asc), q (search query).
# - Rule 26: Safe Error Masking: Never leak raw database error messages or internal stack traces to API clients.
# - Rule 27: Rate Limiting & Security Headers: Global 200/min, auth 10/min. Helmet with CSP, HSTS, X-Frame-Options: DENY.
# - Rule 28: JWT Token Lifecycle: Access token (15m expiration) + Refresh token (7d expiration, HTTP-only, secure, SameSite).
# - Rule 29: Complete Audit Logging: Log actor_id, action, entity_type, entity_id, ip_address, and timestamp on all mutations.
# - Rule 30: Health & Observability: /api/v1/health endpoint returning database status, latency, and uptime.

# [SUBSECTION C.4: FRONTEND UI/UX & MICROCOPY STANDARDS]
# - Rule 31: Mobile 2-Grid Mandate: Grid catalogs on mobile (< 640px) MUST be 2 columns (grid-cols-2). Strictly NEVER 1 column.
# - Rule 32: Slide-Up Bottom Sheet Cards: Entity creation/edit forms MUST use slide-up cards with drag handle and sticky bottom action bar. NEVER center modals.
# - Rule 33: Custom Delete Dialog: Deletions must use custom in-app cards with double-confirmation safeguards. NEVER browser confirm().
# - Rule 34: Fixed Sticky Header & Sidebar: Sticky top-0 z-40 navigation. Zero content jumping or header scrolling.
# - Rule 35: Compact Buttons (/button-presisi): Compact h-8 (32px), standard h-9 (36px), primary h-10 (40px). Rounded-md to rounded-lg.
# - Rule 36: BAN ON PILL BUTTONS: Strictly PROHIBIT rounded-full for action buttons, inputs, and form controls.
# - Rule 37: Micro-Click Interaction: All interactive buttons must have active:scale-[0.98] transition-transform.
# - Rule 38: Precision Cards (/precision-card-button-ui): Delicate 1px border-border/70, rounded-lg/xl, padding p-3 to p-4, shadow-xs.
# - Rule 39: Microcopy Hierarchy (/ui-ux-text): Form placeholders strictly maximum 1 word. Button labels strictly maximum 1–2 words.
# - Rule 40: Zero AI Slop & Authentic Craft (/anti-slop-writing): Banned words: "delve", "tapestry", "robust", "streamline", "seamless", "cutting-edge", "empower", "elevate", "leverage", "foster", "game-changer", "vibrant", "pivotal", "multifaceted", "Di era digital...", "Menyelami...". Enforce dynamic sentence length (burstiness), no Rule of Three, max 1 em-dash per 500 words, and direct practitioner language.

# =======================================================================
# [SECTION D: IMMEDIATE FIRST-TURN INSTRUCTION]
# =======================================================================
# IN YOUR VERY FIRST REPLY, EXECUTE THE FOLLOWING ACTION IMMEDIATELY:
# 1. Announce: "Executing Phase 1: Repository Scaffolding, Core Config, and Database Layer for ${proj}..."
# 2. Provide or create the complete:
#    - package.json
#    - tsconfig.json
#    - next.config.mjs
#    - Full prisma/schema.prisma (complete models with all relations, enums, and indexes)
#    - src/lib/prisma.ts
# 3. Immediately continue to Phase 2 without waiting for further prompts.
# =======================================================================
`;
}
