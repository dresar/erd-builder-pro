export function getControlPlaneGovernanceSection(projectName: string, domain: string): string {
  const proj = projectName.trim() || 'Sistem Enterprise';
  const dom = domain.trim() || 'SaaS Multi-Tenant';

  return `=======================================================================
[AI ENGINEERING CONTROL PLANE — PART 1: GOVERNANCE & PROTOCOLS]
TARGET SYSTEM: "${proj}" | DOMAIN: "${dom}"
=======================================================================

-----------------------------------------------------------------------
1. MASTER PRIORITY HIERARCHY (CONFLICT RESOLUTION ORDER)
-----------------------------------------------------------------------
When specifications, requirements, or agent instructions conflict, resolve them in this EXACT order:
1. Security & Data Privacy (Tenant isolation, credential protection, encryption)
2. Data Integrity & Financial Integrity (3NF, foreign keys, atomic transactions, no double-spending)
3. Explicit Business Rules (Core domain logic defined in PRD)
4. API Contract (Standard REST envelope, Zod schemas, HTTP status codes)
5. Database Schema (DBML/DDL relations, column types, audit fields)
6. Architecture Rules (Single root monorepo, max 10 files/dir, max 1,000 lines/file, /nokomen)
7. UX/UI Rules (Mobile 2-grid, slide-up bottom sheet, compact buttons, /ui-ux-text)
8. Performance Optimization (Caching, query indexes, lazy loading)
9. Developer Convenience (Quick shortcuts, mock data)

MANDATE:
- NEVER silently choose between conflicting requirements.
- The agent MUST identify the conflict, apply the hierarchy above, document the resolution in docs/02_ARCHITECTURE.md (ADR), and continue execution without stalling.

-----------------------------------------------------------------------
2. SINGLE SOURCE OF TRUTH REGISTRY
-----------------------------------------------------------------------
To eliminate drift between specifications and implementation, adhere to these canonical sources:
- Business Rules & Domain Requirements: docs/01_PRD.md
- Relational Database Contract: database/schema.dbml
- API Contract & Payload Specifications: docs/04_API_SPECIFICATION.md
- Business Workflows & State Transitions: docs/05_WORKFLOWS.md
- Security, Auth & RBAC Matrix: docs/07_SECURITY_RBAC.md
- UI/UX & Component Behaviors: docs/06_UI_UX_SPECIFICATION.md
- Architecture Decisions & Resolutions: docs/02_ARCHITECTURE.md

When source documents conflict, apply the MASTER PRIORITY HIERARCHY, update the affected documentation, and execute.

-----------------------------------------------------------------------
3. CONFLICT RESOLUTION PROTOCOL
-----------------------------------------------------------------------
Every requirement collision must follow this deterministic 5-step resolution:
1. Detection: Identify the colliding requirements across PRD, schema, API, or agent roles.
2. Evaluation: Map the conflicting rules to the 9-level Master Priority Hierarchy.
3. Decision: The higher-priority rule strictly prevails; the lower-priority rule must be adapted.
4. Documentation: Record an Architecture Decision Record (ADR) in docs/02_ARCHITECTURE.md detailing:
   - Conflict description
   - Evaluated options
   - Hierarchy rationale
   - Affected files and components
5. Alignment: Update dependent schemas or contracts before continuing code generation.

-----------------------------------------------------------------------
4. CHANGE CONTROL PROTOCOL
-----------------------------------------------------------------------
No agent may silently modify:
- Database schema and column definitions
- API request/response structures
- Authentication strategies and token mechanisms
- RBAC roles, permissions, and route guards
- Multi-tenant isolation filters
- Business workflow status states

Any breaking change MUST follow the 6-step change procedure:
1. Identify all impacted modules and consumers.
2. Update the source-of-truth document.
3. Update dependent API and schema contracts.
4. Update affected unit and integration tests.
5. Execute regression checks (npx tsc --noEmit and test suite).
6. Record an ADR entry in docs/02_ARCHITECTURE.md.

-----------------------------------------------------------------------
5. PHASE DEPENDENCY GRAPH
-----------------------------------------------------------------------
Never implement a dependent layer against an unstable contract. Adhere to this strict sequence:
- PHASE 1 (Scaffolding & DB): Foundation. Must pass Phase 1 Acceptance Gate before Phase 2 begins.
- PHASE 2 (Auth & Middleware): Depends on Phase 1. Starts ONLY IF schema is validated, migrations apply cleanly, and tenant resolution functions.
- PHASE 3 (REST API Endpoints): Depends on Phase 2. Starts ONLY IF API contracts are frozen, auth is verified, and RBAC guards are tested.
- PHASE 4 (Frontend & Dashboards): Depends on Phase 3. Starts ONLY IF all API endpoints are verified with real JSON responses.
- PHASE 5 (Verification & Deployment): Depends on Phase 4. Starts ONLY IF all features are implemented and critical workflows operate end-to-end.

-----------------------------------------------------------------------
6. STATE MACHINE ENFORCEMENT
-----------------------------------------------------------------------
Every workflow entity with a status column MUST define:
1. Initial State: The default state assigned on entity creation.
2. Allowed Transitions: An explicit whitelist of permitted next states.
3. Forbidden Transitions: Explicitly prohibited state jumps (e.g. accepted -> submitted).
4. Authorized Roles: The specific RBAC roles permitted to trigger each transition.
5. Required Fields & Guards: Data fields required before the transition is allowed.
6. Side Effects: Triggered actions (invoices generated, notifications dispatched, room allocated).
7. Audit Log: Mandatory record of actor_id, previous_state, new_state, timestamp.
8. Rollback Behavior: Automatic compensation if any side effect fails.

Domain Workflow State Machines for "${proj}":
- PPDB / Pendaftaran:
  * Transitions: submitted -> document_review -> scheduled_test -> test_passed / test_failed -> accepted -> enrolled
  * Forbidden: accepted -> submitted, rejected -> accepted, enrolled -> submitted
- Perizinan Santri / Leave:
  * Transitions: pending -> approved_by_guardian -> approved_by_admin -> ongoing -> returned
  * Forbidden: returned -> pending, rejected -> ongoing
- Transaksi Pembayaran:
  * Transitions: pending -> processing -> paid / expired / failed
  * Forbidden: paid -> pending, expired -> paid (without new invoice)
- Disiplin & Pelanggaran:
  * Transitions: reported -> investigation -> hearing -> action_applied -> resolved
  * Forbidden: resolved -> reported

-----------------------------------------------------------------------
7. DEFINITION OF DONE (DoD)
-----------------------------------------------------------------------
A module, API route, or UI component is NOT done merely because code has been written.
Definition of Done requires:
- Code is 100% written with zero placeholders (// TODO, // remaining).
- All types strictly checked with zero any annotations.
- Zero inline comments (/nokomen standard).
- Unit and integration tests written and passing.
- Error handling with structured JSON responses implemented.
- README.md documentation updated in the folder.
- Acceptance Gate verified.

-----------------------------------------------------------------------
8. MANDATORY ACCEPTANCE GATES
-----------------------------------------------------------------------
A feature is NOT considered complete until ALL 15 conditions pass:
1. TypeScript compilation = PASS (npx tsc --noEmit exits with code 0)
2. Unit tests = PASS (Vitest suite passes 100%)
3. Integration tests = PASS (API routes respond with valid schema)
4. API contract validation = PASS (Matches docs/04_API_SPECIFICATION.md)
5. RBAC authorization test = PASS (Unauthorized access returns 403 Forbidden)
6. Tenant isolation test = PASS (Cross-tenant query returns empty or 404)
7. Database migration validation = PASS (Idempotent DDL, foreign keys intact)
8. Audit log verification = PASS (Mutations generate immutable audit entries)
9. UI responsive validation = PASS (Mobile 2-grid verified on viewport < 640px)
10. Accessibility validation = PASS (Labels, aria attributes, keyboard navigation)
11. No secrets detected = PASS (Zero hardcoded credentials in codebase)
12. No TODO / placeholder detected = PASS (Zero abbreviated code blocks)
13. No broken imports = PASS (All @/* path aliases resolve properly)
14. No orphan database relations = PASS (All foreign keys have referential targets)
15. Production build = PASS (npm run build exits with code 0)

If ONE gate fails, the feature status MUST remain INCOMPLETE.

-----------------------------------------------------------------------
9. SELF-CORRECTION PROTOCOL
-----------------------------------------------------------------------
After generating each implementation unit, the AI agent MUST execute:
1. Inspect generated files for syntax, completeness, and formatting.
2. Run static type checking (npx tsc --noEmit).
3. Run relevant unit and integration tests.
4. Inspect runtime errors or compilation warnings.
5. Compare implementation against docs/01_PRD.md.
6. Compare implementation against database/schema.dbml.
7. Compare implementation against docs/04_API_SPECIFICATION.md.
8. Fix all detected inconsistencies immediately.
9. Re-run verification until 100% green.
10. ONLY THEN mark the task as COMPLETE.
NEVER proceed to the next dependent task while the current task is RED.

-----------------------------------------------------------------------
10. REGRESSION PROTECTION
-----------------------------------------------------------------------
- Every bug fix or contract adjustment must include an automated regression test asserting the fix.
- Before concluding any milestone, execute the full regression test suite.
- If existing tests fail after a new modification, the new modification MUST be repaired before proceeding.`;
}
