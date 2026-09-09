export function getClaudeZipExecutionSection(projectName: string): string {
  const safeSlug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'project';

  return `=======================================================================
[SECTION 5: MANDATORY BUNDLE FILE TREE & DIRECT ZIP GENERATION IN CLAUDE]
=======================================================================
You MUST generate the entire project package matching this exact directory tree:

project-bundle/
├── docs/
│   ├── PRD.md                     <-- Exhaustive enterprise PRD in formal Indonesian (min. 2,500+ words)
│   ├── ARCHITECTURE.md            <-- System topology, C4 model, ADRs, caching, queues
│   └── WORKFLOWS.md               <-- Business logic flows with Mermaid sequence/flowchart diagrams
├── database/
│   ├── schema.dbml                <-- Complete relational DBML schema with all foreign keys & enums
│   ├── schema.sql                 <-- PostgreSQL executable DDL with constraints, triggers & indexes
│   └── seed.sql                   <-- Realistic enterprise seed data for master & lookup tables
├── .agents/                       <-- 5-AGENT SYNCHRONIZED TEAMWORK (English):
│   ├── 01_TECH_LEAD.md            <-- Tech Lead governance & architectural boundaries
│   ├── 02_DATABASE_BACKEND.md     <-- Database modeling, Prisma schema & service layer rules
│   ├── 03_FRONTEND_UI.md          <-- Frontend UI components, slide-up card & mobile 2-grid rules
│   ├── 04_SECURITY_AUTH.md        <-- Security, RBAC matrix & tenant isolation protocols
│   └── 05_QA_TESTER.md            <-- QA test strategies & automated verification checklists
├── AGENTS.md                      <-- Root Team Coordination Protocol & handoff workflows
├── .env.example                   <-- Sanitized environment template for Neon Postgres & auth
└── README.md                      <-- Quickstart guide, architecture summary, and setup commands

-----------------------------------------------------------------------
CLAUDE DIRECT ZIP CREATION INSTRUCTION (SANDBOX EXECUTION):
-----------------------------------------------------------------------
When running inside Claude (Claude 3.7 Sonnet / Claude Artifacts):
You MUST bundle all the generated files above into a downloadable ZIP archive using Python in your execution sandbox.

Execute this exact Python script to construct the archive:
\`\`\`python
import os
import zipfile

bundle_dir = "/mnt/data/${safeSlug}_bundle"
os.makedirs(os.path.join(bundle_dir, "docs"), exist_ok=True)
os.makedirs(os.path.join(bundle_dir, "database"), exist_ok=True)
os.makedirs(os.path.join(bundle_dir, ".agents"), exist_ok=True)

# Write all generated files into bundle_dir with full production content
# (Ensure every file contains complete, non-abbreviated content)

zip_path = "/mnt/data/${safeSlug}_bundle.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(bundle_dir):
        for file in files:
            full_path = os.path.join(root, file)
            arcname = os.path.relpath(full_path, bundle_dir)
            zipf.write(full_path, arcname)

print(f"ZIP package successfully created at: {zip_path}")
\`\`\`

Provide the user with the direct link to download \`${safeSlug}_bundle.zip\`.

-----------------------------------------------------------------------
STRICT ANTI-ABBREVIATION & ZERO-OMISSION DIRECTIVE:
-----------------------------------------------------------------------
- STRICT PROHIBITION ON CODE TRUNCATION:
  * NEVER output "// ... remaining tables", "// TODO: implement", "// ... rest of code", or placeholders.
  * Every table in the schema MUST have all columns, types, nullabilities, and foreign key relations written out in full.
  * The PRD in docs/PRD.md MUST be comprehensive, structured into 10 detailed sections in formal Indonesian, exceeding 2,500 words.
  * Every agent guideline in .agents/ MUST contain complete responsibilities, checklists, and execution protocols.

Execute now with maximum precision, rigor, and technical excellence!`;
}
