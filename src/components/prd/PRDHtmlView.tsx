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
      let bodyMarkdown = content.trim();
      bodyMarkdown = bodyMarkdown.replace(/^#\s+[^\n]+\n*/, '').trim();
      bodyMarkdown = bodyMarkdown.replace(/^(?:>\s*[^\n]*\n*)+/, '').trim();
      bodyMarkdown = bodyMarkdown.replace(/^[*_]*[“"][^”"\n]*(?:[\r\n]+[^”"\n]*)*[”"][*_]*\s*\n*/, '').trim();
      bodyMarkdown = bodyMarkdown.replace(/^(?:---|\*\*\*|___)\s*\n*/, '').trim();

      const raw = marked.parse(bodyMarkdown, { gfm: true, breaks: true }) as string;
      const htmlWithIds = raw.replace(/<h([1-3])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, innerText) => {
        if (/id=["'][^"']+["']/i.test(attrs)) return match;
        const textOnly = innerText.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
        const id = textOnly.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        return `<h${level}${attrs} id="${id}">${innerText}</h${level}>`;
      });
      return DOMPurify.sanitize(htmlWithIds, {
        ADD_ATTR: ['id', 'class', 'style', 'target'],
        ADD_TAGS: ['section', 'article', 'aside', 'header', 'nav', 'main', 'span', 'div'],
      });
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
      {showToc && headings.length > 0 && (
        <aside className="w-64 lg:w-72 border-r border-border/40 bg-muted/5 p-4 overflow-y-auto custom-scrollbar hidden md:block shrink-0">
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
                title={h.title}
                className={`block w-full text-left truncate rounded px-2.5 py-1 text-xs transition-colors hover:bg-muted/40 cursor-pointer ${
                  h.level === 1 
                    ? 'font-bold text-foreground' 
                    : h.level === 2 
                      ? 'pl-4 text-muted-foreground hover:text-foreground font-medium' 
                      : 'pl-6 text-muted-foreground/70 text-[11px]'
                }`}
              >
                {h.title}
              </button>
            ))}
          </nav>
        </aside>
      )}

      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 lg:p-10">
        <div className={`mx-auto space-y-6 transition-all duration-300 ${showToc ? 'max-w-4xl' : 'max-w-5xl'}`}>
          <div className="rounded-xl border border-border/60 bg-gradient-to-b from-muted/20 to-muted/5 p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {metadata.status}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-muted text-muted-foreground">
                  v{metadata.version}
                </span>
                {metadata.domain && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted/60 text-foreground">
                    {metadata.domain}
                  </span>
                )}
              </div>
              {metadata.targetDeployment && (
                <span className="text-xs text-muted-foreground font-mono truncate max-w-xs sm:max-w-md">
                  {metadata.targetDeployment}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {metadata.projectName || metadata.title}
              </h1>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Spesifikasi Persyaratan Produk &amp; Arsitektur Sistem
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur hover:border-emerald-500/40 transition-all">
                <div className="flex items-center gap-1.5 text-emerald-400 mb-1.5">
                  <Activity className="size-4" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Target SLA</span>
                </div>
                <p className="text-base font-extrabold text-foreground truncate">{metadata.sla || '99.99%'}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">High Availability</p>
              </div>

              <div className="p-3.5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 backdrop-blur hover:border-indigo-500/40 transition-all">
                <div className="flex items-center gap-1.5 text-indigo-400 mb-1.5">
                  <Zap className="size-4" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Latensi P95</span>
                </div>
                <p className="text-base font-extrabold text-foreground truncate">{metadata.latency || '< 200ms'}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Fast Response</p>
              </div>

              <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 backdrop-blur hover:border-amber-500/40 transition-all">
                <div className="flex items-center gap-1.5 text-amber-400 mb-1.5">
                  <ShieldCheck className="size-4" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Keamanan</span>
                </div>
                <p className="text-base font-extrabold text-foreground truncate">{metadata.security || 'RBAC & Audit'}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Access Control</p>
              </div>

              <div className="p-3.5 rounded-xl border border-violet-500/20 bg-violet-500/5 backdrop-blur hover:border-violet-500/40 transition-all">
                <div className="flex items-center gap-1.5 text-violet-400 mb-1.5">
                  <Layers className="size-4" />
                  <span className="text-[10px] uppercase font-bold tracking-wider">Arsitektur</span>
                </div>
                <p className="text-base font-extrabold text-foreground truncate">{metadata.architecture || 'Clean Arch'}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Domain Driven</p>
              </div>
            </div>
          </div>

          <article 
            className="prose prose-sm dark:prose-invert max-w-none 
              prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-foreground
              prose-h2:border-b prose-h2:border-border/60 prose-h2:pb-2.5 prose-h2:mt-10 prose-h2:text-lg sm:prose-h2:text-xl
              prose-h3:text-indigo-400 prose-h3:mt-6 prose-h3:text-sm sm:prose-h3:text-base
              prose-p:leading-relaxed prose-p:text-muted-foreground
              prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-500/5 prose-blockquote:py-2.5 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
              prose-table:border prose-table:border-border/60 prose-table:rounded-lg prose-table:overflow-hidden prose-table:shadow-xs
              prose-th:bg-muted/40 prose-th:p-3 prose-th:text-xs prose-th:font-bold prose-th:text-foreground
              prose-td:p-3 prose-td:text-xs prose-td:border-t prose-td:border-border/40
              prose-code:bg-muted/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:text-indigo-300
              prose-pre:bg-muted/20 prose-pre:border prose-pre:border-border/40 prose-pre:p-4 prose-pre:rounded-xl prose-pre:shadow-sm"
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
          />
        </div>
      </main>
    </div>
  );
}
