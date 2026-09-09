export function getControlPlaneArchitectureSection(projectName: string, domain: string): string {
  const proj = projectName.trim() || 'Sistem Enterprise';
  const dom = domain.trim() || 'SaaS Multi-Tenant';

  return `=======================================================================
[AI ENGINEERING CONTROL PLANE — PART 2: ARCHITECTURE & SECURITY]
TARGET SYSTEM: "${proj}" | DOMAIN: "${dom}"
=======================================================================

-----------------------------------------------------------------------
11. CONCURRENCY & TRANSACTION RULES
-----------------------------------------------------------------------
All financially and resource-sensitive operations MUST be atomic.
Critical Operations:
- Invoice payment & settlement verification
- Dormitory room / bed assignment
- Student enrollment & student ID generation
- Leave permit approval & departure logging
- PPDB quota allocation & status transition

The agent and codebase MUST prevent:
- Double payment (idempotency key validation on webhooks and payment calls)
- Double room/bed assignment (unique database constraints e.g. [tenant_id, room_id, bed_number])
- Duplicate enrollment (unique identity constraints on national ID / NISN)
- Duplicate invoice generation for the same billing period
- Race-condition status approvals (optimistic locking with version column or SELECT FOR UPDATE)
- Lost updates during concurrent writes

Mandate:
- Use prisma.$transaction for multi-table atomic operations.
- Enforce unique compound indexes at the database level, not just application code.

-----------------------------------------------------------------------
12. MANDATORY SECURITY THREAT MODEL
-----------------------------------------------------------------------
Before production release, explicitly assess and safeguard against:
1. Cross-Tenant Data Leakage (CRITICAL): Non-bypassable tenant_id / campus_id filter in every query.
2. Insecure Direct Object References / IDOR (CRITICAL): Validate that the authenticated user owns the requested record ID.
3. Webhook Forgery (CRITICAL): Verify HMAC-SHA256 signature headers on all payment gateway callbacks.
4. Broken Access Control: Enforce RBAC route middleware on every private API route.
5. SQL Injection: Use parameterized Prisma ORM queries exclusively. Raw SQL is strictly banned unless parameterized.
6. Cross-Site Scripting (XSS): DOMPurify sanitization on rendered HTML. React JSX default escaping.
7. Cross-Site Request Forgery (CSRF): SameSite=Lax/Strict on cookies and CSRF tokens for state-mutating requests.
8. Server-Side Request Forgery (SSRF): Strict domain allowlisting for outgoing webhook triggers and image URLs.
9. File Upload Abuse: MIME-type validation, random UUID filenames, and upload to S3/R2 with presigned URLs.
10. Path Traversal: Prohibit raw filename usage in file operations.
11. JWT Theft & Token Replay: 15-minute access token lifespan with secure HTTP-only refresh tokens.
12. Brute Force & Rate Limit Bypass: Rate limiting (200 req/min global, 10 req/min for auth endpoints).
13. Mass Assignment: Use explicit Zod schema pick/omit filters before saving to database.
14. Sensitive Data Exposure: Strip passwords, hashes, and tokens from all JSON response serializers.

-----------------------------------------------------------------------
13. DATA LIFECYCLE & PRIVACY POLICY
-----------------------------------------------------------------------
Every sensitive entity MUST define:
- Collection purpose
- Retention period
- Access roles
- Encryption requirement (AES-256 at rest)
- Audit requirement (immutable mutation logging)
- Export policy (JSON/CSV export for authorized administrators)
- Deletion/anonymization policy (soft-delete with PII scrubbing)
- Archival policy

Sensitive Entities for "${proj}":
- Rekam Medis / Riwayat Kesehatan Santri (health_records)
- Data Wali Santri & Kontak Darurat (guardians)
- Berkas Dokumen PPDB (ppdb_documents)
- Data Transaksi Finansial & Buku Tabungan (financial_records)
- Dokumen Identitas Pribadi / NIK / Kartu Keluarga (identity_documents)

UNIVERSAL PROHIBITION:
No sensitive data may appear in:
- Application console logs (stdout/stderr)
- API error responses or stack traces
- Test fixtures or mock seed scripts
- Public unauthenticated API payloads
- Analytics or telemetry events

-----------------------------------------------------------------------
14. OBSERVABILITY & TELEMETRY CONTRACT
-----------------------------------------------------------------------
Every production API route and background worker MUST emit structured telemetry containing:
- request_id: Unique UUIDv7 or crypto UUID propagated across internal service calls
- tenant_id: Tenant or campus identifier
- user_id: Authenticated user ID (or 'anonymous')
- route: HTTP method and normalized path (e.g. "POST /api/v1/payments")
- duration_ms: Execution duration in milliseconds
- status_code: HTTP response status code
- error_code: Application-specific error code when status >= 400

TELEMETRY MASKING MANDATE:
Never log: passwords, access tokens, refresh tokens, payment secrets, identity document contents, or health details.
Critical business events (payments, status transitions, enrollments) MUST be traceable using request_id.

-----------------------------------------------------------------------
15. PERFORMANCE BUDGET
-----------------------------------------------------------------------
Target thresholds that must be met under normal operating conditions:
- API Read Latency P95 <= 500ms
- API Write Latency P95 <= 800ms
- Authentication Endpoint P95 <= 700ms
- Database Query Latency <= 300ms for standard CRUD operations
- Initial Dashboard First Contentful Load <= 2.5s
- Public Landing Page Largest Contentful Paint (LCP) <= 2.5s

Any regression above these thresholds requires immediate indexing inspection, query refactoring, or asset optimization.

-----------------------------------------------------------------------
16. ROLLBACK PROTOCOL
-----------------------------------------------------------------------
- Every database migration must have a tested, non-destructive down migration or safe forward-compatibility strategy.
- Every release must support instant rollback to the previous deployment artifact.
- Failed transactional batches must rollback automatically without leaving orphaned or half-written records.

-----------------------------------------------------------------------
17. FAILURE RECOVERY PROTOCOL
-----------------------------------------------------------------------
- Database connection drops must be handled with retry loops and connection pooling reconnection.
- Third-party webhook delivery failures must use exponential backoff (e.g. 1m, 5m, 15m, 1h) with dead-letter queueing.
- Graceful degradation: If payment gateway status checks are temporarily unavailable, queue verification jobs rather than crashing.

-----------------------------------------------------------------------
18. STRUCTURED AGENT HANDOFF CONTRACT
-----------------------------------------------------------------------
When work transitions between AI agents (or development turns), the sender MUST provide an explicit handoff block:
\`\`\`markdown
### AGENT HANDOFF CONTRACT
- From: [Agent Name / Role]
- To: [Agent Name / Role]
- Completed Scope: [List of files and features implemented]
- Schema & Migration Status: [Verified / Pending]
- API Contract Compliance: [Verified against docs/04_API_SPECIFICATION.md]
- Test Evidence: [tsc exit code 0, test results]
- Known Risks & Edge Cases: [Any non-obvious constraints]
- Next Immediate Action: [Specific instruction for receiver]
\`\`\`
Vague handoffs (e.g. "database selesai" or "frontend sudah dibuat") are STRICTLY FORBIDDEN.

-----------------------------------------------------------------------
19. CONTEXT PRESERVATION & ANTI-DRIFT RULES
-----------------------------------------------------------------------
- Never invent new naming conventions, column names, or status strings that drift from database/schema.dbml and docs/01_PRD.md.
- When creating helper utilities or endpoints, consult the Single Source of Truth Registry first.
- Maintain consistent terminology across backend models, API routes, and frontend UI components.

-----------------------------------------------------------------------
20. FINAL PRODUCTION READINESS GATE
-----------------------------------------------------------------------
Before declaring the system production-ready, verify this 10-point checklist:
1. Full 15-point Acceptance Gate verified and PASS.
2. Zero placeholder code (// TODO, // rest of code) anywhere in the repository.
3. Production build (npm run build) succeeds cleanly with 0 errors.
4. Database seed (prisma/seed.ts) runs idempotently with complete domain data.
5. All RBAC route guards and multi-tenant filters tested against unauthorized access.
6. Threat model mitigations verified (IDOR, CSRF, Webhook verification).
7. Mobile 2-grid layout verified on mobile screen widths.
8. Slide-up bottom sheet forms functioning smoothly with sticky action bars.
9. Environment secrets sanitized and validated via process.env.
10. Structured telemetry and audit logging operational on all mutations.`;
}
