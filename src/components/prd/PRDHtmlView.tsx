import React, { useMemo } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { 
  ShieldCheck, 
  Clock, 
  Zap, 
  Activity, 
  Layers, 
  Bookmark, 
  ExternalLink 
} from 'lucide-react';
import { PrdMetadata, extractHeadings } from './prdTemplate';

interface PRDHtmlViewProps {
  content: string;
  metadata: PrdMetadata;
  showToc?: boolean;
}

export function PRDHtmlView({ content, metadata, showToc = true }: PRDHtmlViewProps) {
  const headings = useMemo(() => extractHeadings(content), [content]);

  const sanitizedHtml = useMemo(() => {
    try {
      const raw = marked.parse(content, { gfm: true, breaks: true }) as string;
      const htmlWithIds = raw.replace(/<h([1-3])>([^<]+)<\/h\1>/gi, (match, level, text) => {
        const id = text.trim().toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        return `<h${level} id="${id}">${text}</h${level}>`;
      });
      return DOMPurify.sanitize(htmlWithIds);
    } catch {
      return '<p class="text-destructive">Gagal memproses konten PRD.</p>';
    }
  }, [content]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-background text-foreground">
      {/* Sticky Table of Contents Sidebar */}
      {showToc && headings.length > 0 && (
        <aside className="w-56 border-r border-border/40 bg-muted/5 p-4 overflow-y-auto custom-scrollbar hidden md:block shrink-0">
          <div className="flex items-center gap-1.5 mb-3 text-muted-foreground">
            <Bookmark className="size-3.5 text-indigo-400" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Daftar Isi</span>
          </div>

          <nav className="space-y-1">
            {headings.map((h, idx) => (
              <button
                key={`${h.id}-${idx}`}
                type="button"
                onClick={() => scrollToSection(h.id)}
                className={`block w-full text-left truncate rounded px-2 py-1 text-xs transition-colors hover:bg-muted/40 cursor-pointer ${
                  h.level === 1 
                    ? 'font-bold text-foreground' 
                    : h.level === 2 
                      ? 'pl-3.5 text-muted-foreground hover:text-foreground' 
                      : 'pl-6 text-muted-foreground/70 text-[11px]'
                }`}
              >
                {h.title}
              </button>
            ))}
          </nav>
        </aside>
      )}

      {/* Main Document Body */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 lg:p-10">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Executive Cover Card */}
          <div className="rounded-xl border border-border/60 bg-gradient-to-b from-muted/20 to-muted/5 p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {metadata.status}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-muted text-muted-foreground">
                  v{metadata.version}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted/60 text-foreground">
                  {metadata.domain}
                </span>
              </div>
              <span className="text-xs text-muted-foreground font-mono">
                {metadata.targetDeployment}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {metadata.title}
            </h1>

            {/* Metric Callout Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              <div className="p-2.5 rounded-lg border border-border/40 bg-background/60">
                <div className="flex items-center gap-1.5 text-emerald-400 mb-1">
                  <Activity className="size-3.5" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Target SLA</span>
                </div>
                <p className="text-sm font-bold text-foreground">{metadata.sla}</p>
              </div>

              <div className="p-2.5 rounded-lg border border-border/40 bg-background/60">
                <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
                  <Zap className="size-3.5" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Latensi P95</span>
                </div>
                <p className="text-sm font-bold text-foreground">{metadata.latency}</p>
              </div>

              <div className="p-2.5 rounded-lg border border-border/40 bg-background/60">
                <div className="flex items-center gap-1.5 text-amber-400 mb-1">
                  <ShieldCheck className="size-3.5" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Keamanan</span>
                </div>
                <p className="text-sm font-bold text-foreground">RBAC &amp; RLS</p>
              </div>

              <div className="p-2.5 rounded-lg border border-border/40 bg-background/60">
                <div className="flex items-center gap-1.5 text-violet-400 mb-1">
                  <Layers className="size-3.5" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Arsitektur</span>
                </div>
                <p className="text-sm font-bold text-foreground">Serverless</p>
              </div>
            </div>
          </div>

          {/* Rendered HTML Content */}
          <article 
            className="prose prose-sm dark:prose-invert max-w-none 
              prose-headings:font-bold prose-headings:tracking-tight 
              prose-h2:border-b prose-h2:border-border/40 prose-h2:pb-2 prose-h2:mt-8 
              prose-table:border prose-table:border-border/60 prose-th:bg-muted/30 prose-th:p-2.5 prose-td:p-2.5 
              prose-code:bg-muted/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs 
              prose-pre:bg-muted/20 prose-pre:border prose-pre:border-border/40 prose-pre:p-3.5 prose-pre:rounded-lg 
              leading-relaxed"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        </div>
      </main>
    </div>
  );
}
