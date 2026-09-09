export function getAgentTeamworkSection(): string {
  return `=======================================================================
[SECTION 4: 5-AGENT SYNCHRONIZED TEAMWORK PROTOCOL (.agents/ FOLDER)]
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
- Check that error states display concise, actionable microcopy per /ui-ux-text.`;
}
