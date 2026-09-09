export function getClaudeZipExecutionSection(projectName: string): string {
  const safeSlug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'project';

  return `=======================================================================
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
ZIP PACKAGING & FALLBACK LOCAL PYTHON GENERATOR SCRIPT:
-----------------------------------------------------------------------
[OPTION A: DIRECT SANDBOX ZIP CREATION (Claude Artifacts / Python Sandbox)]
When running inside an environment with an active Python execution sandbox (Claude Artifacts, ChatGPT Code Interpreter, etc.):
You MUST bundle all 21+ generated Markdown documentation files, database schemas, and codebase files into a downloadable ZIP archive using Python in your execution sandbox.

Execute this Python script to construct and deliver the archive:
\`\`\`python
import os
import zipfile

bundle_dir = "/mnt/data/${safeSlug}_bundle"
os.makedirs(os.path.join(bundle_dir, "docs"), exist_ok=True)
os.makedirs(os.path.join(bundle_dir, "database"), exist_ok=True)
os.makedirs(os.path.join(bundle_dir, ".agents"), exist_ok=True)
os.makedirs(os.path.join(bundle_dir, "src"), exist_ok=True)

# Write all 21+ Markdown files, DBML, SQL, and project files with full content.
# Ensure every directory contains its dedicated README.md.
# Ensure zero files exceed 1,000 lines and zero folders contain > 10 code files.

zip_path = "/mnt/data/${safeSlug}_bundle.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(bundle_dir):
        for file in files:
            full_path = os.path.join(root, file)
            arcname = os.path.relpath(full_path, bundle_dir)
            zipf.write(full_path, arcname)

print(f"Enterprise ZIP package created successfully: {zip_path}")
\`\`\`
Provide the user with the direct link to download \`${safeSlug}_bundle.zip\`.

[OPTION B: FALLBACK SINGLE-FILE PYTHON GENERATOR (FOR NON-SANDBOX / STANDARD CHAT)]
Not all AI chatbots or interfaces have a built-in sandbox capable of emitting direct downloadable ZIP links.
IF you are running in an environment where direct sandbox ZIP generation is NOT supported (e.g. standard ChatGPT web chat, Claude chat without file-creation tool, Cursor chat, Windsurf, local terminal LLMs, or API clients):
You are EXPLICITLY AUTHORIZED and INSTRUCTED to output a SINGLE, SELF-CONTAINED, EXHAUSTIVE PYTHON SCRIPT (e.g. \`generate_${safeSlug}_bundle.py\`).

Requirements for this standalone generator script:
1. Pure Python 3 Standard Library:
   - Strictly use built-in modules only: \`os\`, \`sys\`, \`pathlib\`, \`zipfile\`.
   - Strictly ZERO pip dependencies (\`requests\`, \`colorama\`, etc. are forbidden). The user must be able to run it on vanilla Python without installing anything.
2. Complete Unabbreviated Inlined Content:
   - Embed the FULL, complete text of all 21+ Markdown files (including the 2,500+ word Indonesian PRD in docs/01_PRD.md), schema.dbml, schema.sql, seed.sql, and .agents/ protocols directly inside multi-line raw string dictionaries or variables in the Python file.
   - Strictly NO abbreviations, NO ellipses ("..."), NO "// TODO". Every single file must be 100% complete.
3. Automated Local Extraction & ZIP Generation:
   - When the user runs \`python generate_${safeSlug}_bundle.py\` in their local terminal:
     a. It creates the entire directory structure (\`docs/\`, \`database/\`, \`.agents/\`, \`src/\`).
     b. It writes all 21+ files to disk with UTF-8 encoding.
     c. It automatically compiles the whole bundle directory into \`${safeSlug}_bundle.zip\` right in their local folder.
     d. It prints a clean console report showing the generated tree and the ready-to-use ZIP file path.

-----------------------------------------------------------------------
STRICT ANTI-ABBREVIATION & ZERO-OMISSION DIRECTIVE:
-----------------------------------------------------------------------
- NEVER truncate any file or use placeholders like "// ... remaining code" or "// TODO".
- Every one of the 20+ Markdown files and database files must be generated in full, professional, enterprise-grade depth.
- The PRD in docs/01_PRD.md must be written in formal, rigorous Indonesian exceeding 2,500 words.

Execute now and build the full 20+ document enterprise package!`;
}
