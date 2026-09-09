import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PRDToolbar, PrdViewMode, PrdStatus } from './PRDToolbar';
import { PRDHtmlView } from './PRDHtmlView';
import { parsePrdMetadata, generateStandaloneHtml, getDefaultPrdTemplate } from './prdTemplate';
import { marked } from 'marked';
import { useWorkspace } from '@/providers/WorkspaceContext';

interface PRDViewProps {
  activePrdUid?: string | null;
  activePrd?: any;
  savePrd?: (doc: any) => Promise<boolean | void>;
  handlePrdChange?: (content: string) => void;
  deletePrd?: (uid: string) => Promise<void>;
  isLoading?: boolean;
}

export function PRDView({
  activePrdUid,
  activePrd,
  savePrd,
  handlePrdChange,
  deletePrd,
  isLoading = false,
}: PRDViewProps) {
  const navigate = useNavigate();
  const { handleViewChange, handleSidebarDiagramCreate, handleSidebarFlowchartCreate } = useWorkspace();

  const [title, setTitle] = useState(activePrd?.title?.replace(/^\[PRD\]\s*/, '') || 'Spesifikasi PRD');
  const [content, setContent] = useState(activePrd?.content || getDefaultPrdTemplate('Sistem Enterprise'));
  const [viewMode, setViewMode] = useState<PrdViewMode>('html');
  const [status, setStatus] = useState<PrdStatus>('draft');
  const [showMenu, setShowMenu] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activePrd) {
      const cleanTitle = activePrd.title?.replace(/^\[PRD\]\s*/, '') || 'Spesifikasi PRD';
      setTitle(cleanTitle);
      const pending = localStorage.getItem('pending_prd_content') || localStorage.getItem('pending_note_content');
      let prdBody = activePrd.content;
      if (!prdBody && pending) {
        prdBody = pending;
        localStorage.removeItem('pending_prd_content');
        localStorage.removeItem('pending_note_content');
        if (handlePrdChange) handlePrdChange(prdBody);
      } else if (!prdBody) {
        prdBody = getDefaultPrdTemplate(cleanTitle);
      }
      setContent(prdBody);
      const parsed = parsePrdMetadata(prdBody, cleanTitle);
      setStatus(parsed.status);
    }
  }, [activePrd, handlePrdChange]);

  const handleStatusChange = (newStatus: PrdStatus) => {
    setStatus(newStatus);
    const statusLabels: Record<PrdStatus, string> = {
      draft: 'Draft',
      in_review: 'Review',
      approved: 'Disetujui',
      production: 'Produksi',
    };
    if (/Status[:\s]+[^\n|]+/i.test(content)) {
      const updated = content.replace(/(Status[:\s]+)[^\n|]+/i, `$1${statusLabels[newStatus]} `);
      handleContentUpdate(updated);
    }
  };

  const metadata = useMemo(() => {
    const meta = parsePrdMetadata(content, title);
    meta.status = status;
    return meta;
  }, [content, title, status]);

  const handleContentUpdate = useCallback((newContent: string) => {
    setContent(newContent);
    if (handlePrdChange) {
      handlePrdChange(newContent);
    }
  }, [handlePrdChange]);

  const handleExportHtml = () => {
    try {
      const rendered = marked.parse(content, { gfm: true, breaks: true }) as string;
      const htmlString = generateStandaloneHtml(title, rendered, metadata);
      const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')}_PRD.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('✓ Berkas HTML diunduh!');
    } catch {
      toast.error('Gagal mengekspor HTML.');
    }
  };

  const handleExportMarkdown = () => {
    try {
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '_')}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('✓ Berkas MD diunduh!');
    } catch {
      toast.error('Gagal mengekspor MD.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenInNewTab = () => {
    try {
      const rendered = marked.parse(content, { gfm: true, breaks: true }) as string;
      const htmlString = generateStandaloneHtml(title, rendered, metadata);
      const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch {
      toast.error('Gagal membuka di tab baru.');
    }
  };

  const handleSynthesizeErd = async () => {
    try {
      localStorage.setItem('pending_prd_synthesis_context', content);
      toast.info('Menyiapkan sintesis ERD...');
      await handleViewChange('erd', true);
    } catch {
      toast.error('Gagal membuka ERD.');
    }
  };

  const handleSynthesizeFlowchart = async () => {
    try {
      localStorage.setItem('pending_prd_synthesis_context', content);
      toast.info('Menyiapkan sintesis Flowchart...');
      await handleViewChange('flowchart', true);
    } catch {
      toast.error('Gagal membuka Flowchart.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
        Memuat PRD...
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      <PRDToolbar
        title={title}
        onTitleChange={setTitle}
        status={status}
        onStatusChange={handleStatusChange}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSynthesizeErd={handleSynthesizeErd}
        onSynthesizeFlowchart={handleSynthesizeFlowchart}
        onExportHtml={handleExportHtml}
        onExportMarkdown={handleExportMarkdown}
        onPrint={handlePrint}
        onOpenNewTab={handleOpenInNewTab}
        showMenu={showMenu}
        onToggleMenu={() => setShowMenu((prev) => !prev)}
        isSaving={isSaving}
      />

      <div className="flex-1 flex overflow-hidden">
        {viewMode === 'html' && (
          <PRDHtmlView content={content} metadata={metadata} showToc={showMenu} />
        )}

        {viewMode === 'editor' && (
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar bg-background">
            <textarea
              aria-label="Editor PRD"
              value={content}
              onChange={(e) => handleContentUpdate(e.target.value)}
              className="w-full h-full min-h-[600px] p-4 font-mono text-xs rounded-lg bg-muted/10 border border-border/50 text-foreground resize-none outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
            />
          </div>
        )}

        {viewMode === 'split' && (
          <div className="flex-1 flex overflow-hidden">
            <div className="w-1/2 border-r border-border/40 p-4 overflow-y-auto custom-scrollbar bg-background">
              <textarea
                aria-label="Editor PRD Split"
                value={content}
                onChange={(e) => handleContentUpdate(e.target.value)}
                className="w-full h-full min-h-[600px] p-3 font-mono text-xs rounded-lg bg-muted/10 border border-border/50 text-foreground resize-none outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
              />
            </div>
            <div className="w-1/2 overflow-hidden flex">
              <PRDHtmlView content={content} metadata={metadata} showToc={false} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
