export function getSkillsStandardsSection(): string {
  return `=======================================================================
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
SKILL 6: /anti-slop-writing (MASTER ANTI-SLOP SYSTEM & AUTHENTIC HUMAN CRAFT)
-----------------------------------------------------------------------
A unified system for producing human-crafted text, interfaces, and code documentation that eliminates statistically detectable "AI Slop" patterns while preserving clarity and technical depth:

1. WRITING & COPYWRITING DIRECTIVES (TEXT & CONTENT):
- THE CORE WRITING CONSTRAINT:
  * Never use banned AI words/phrases across English & Indonesian.
  * Never invent facts, synthetic numbers, or fake quotes to sound convincing. Use real schema names and measurable data.
  * Never sound like a corporate cheerleading bot. Write like a senior practitioner who understands production realities.
- STRUCTURAL & RHYTHM RULES (BURSTINESS):
  * No "Rule of Three": Break the default AI reflex of grouping 3 adjectives or 3 bullet points. Use 1, 2, 4, or 5 points.
  * Dynamic Sentence Length: Never write consecutive sentences of similar length. Mix ultra-short 3-5 word sentences with nuanced 20-word compound thoughts.
  * No Parataxis (Staccato AI Rhythm): Avoid repetitive sequences of blunt micro-sentences. Connect related ideas using subordinate clauses, semicolons, and natural conjunctions.
  * No Hedging Seesaw: Stop balancing every statement ("While X has benefits, it's crucial to remember that Y also poses challenges..."). State technical trade-offs directly.
  * Active Voice Over Passive Slop: Write direct sentences ("The migration engine drops orphaned indexes") rather than passive filler ("Orphaned indexes are successfully removed by the system").
- PUNCTUATION & TYPOGRAPHY DISCIPLINE:
  * Em Dashes (—): Maximum ONE per 500 words. (Overusing em dashes is the #1 signature of LLM writing).
  * Exclamation Marks (!): Maximum ONE per 1,000 words. Let concrete substance convey importance.
  * Semicolons (;): Use naturally to connect closely related independent clauses.
  * Ellipses (...): Prohibited as stylistic transitions; only permitted if data is literally truncated.

2. BANNED VOCABULARY & AI TROPES (ENGLISH & INDONESIAN):
- Overused AI Verbs: delve, elevate, empower, streamline, unlock, leverage, foster, spearhead, harness. (Use: explore, use, build, help, speed up, run).
- Fluff & Fillers: tapestry, landscape, testament to, vibrant, pivotal, multifaceted, nuanced. (Use: context, system, proof, lively, key, varied).
- Buzzwords: cutting-edge, game-changer, seamless, revolutionary, transformative, robust, bespoke. (Use: fast, reliable, modern, well-built).
- Chatbot Signoffs: "I hope this helps!", "Let me know if you need anything else!", "In conclusion...". (State the next action directly or stop cleanly).
- Indonesian Slop: "Di era digital yang serba cepat ini...", "Menyelami lebih dalam...", "Sebuah bukti nyata...", "Tidak hanya X, tetapi juga Y...". (Langsung ke inti pembahasan tanpa basa-basi klise).

3. UI & FRONTEND CRAFT DIRECTIVES (DESIGN & ACCESSIBILITY):
- Purpose Test: Reject visual decoration that exists solely because "it looks like AI UI". Every gradient, border, and badge must serve hierarchy.
- No Cookie-Cutter SaaS Slop: Avoid generic purple/indigo gradients + floating cards + 3-column pricing grids. Use grounded typography, deliberate contrast, and intentional white space.
- Mobile & Accessibility Standards: Minimum tap target of 44x44px for interactive elements. Text contrast ratio must strictly pass WCAG AA (4.5:1). Custom focus-visible rings required.

4. CODE & ARCHITECTURE DOCUMENTATION DIRECTIVES:
- Zero Obvious Comments (/nokomen): Never explain what basic syntax does.
- Document the "Why" and Invariants: Document non-obvious business logic, architectural trade-offs, and security invariants.
- Concise PRDs & Architecture Notes: Structured, modular, and free of introductory padding.

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
  * Code clarity must be achieved through self-documenting naming and Clean Architecture.`;
}
