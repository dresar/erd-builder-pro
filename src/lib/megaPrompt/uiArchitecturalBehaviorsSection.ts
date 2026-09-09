export function getUiArchitecturalBehaviorsSection(): string {
  return `=======================================================================
[SECTION 3: MANDATORY UI/UX & ARCHITECTURAL BEHAVIORAL SPECIFICATIONS]
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
  * High contrast readability, dark mode default support, and elegant glassmorphism accents.`;
}
