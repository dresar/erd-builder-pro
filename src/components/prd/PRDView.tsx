import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PRDToolbar, PrdViewMode, PrdStatus } from './PRDToolbar';
import { PRDHtmlView } from './PRDHtmlView';
import { parsePrdMetadata, generateStandaloneHtml, getDefaultPrdTemplate } from './prdTemplate';
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
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activePrd) {
      setTitle(activePrd.title?.replace(/^\[PRD\]\s*/, '') || 'Spesifikasi PRD');
      setContent(activePrd.content || getDefaultPrdTemplate(activePrd.title?.replace(/^\[PRD\]\s*/, '')));
    }
  }, [activePrd]);

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
      const htmlString = generateStandaloneHtml(title, content, metadata);
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
        onStatusChange={setStatus}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSynthesizeErd={handleSynthesizeErd}
        onSynthesizeFlowchart={handleSynthesizeFlowchart}
        onExportHtml={handleExportHtml}
        onExportMarkdown={handleExportMarkdown}
        onPrint={handlePrint}
        isSaving={isSaving}
      />

      <div className="flex-1 flex overflow-hidden">
        {viewMode === 'html' && (
          <PRDHtmlView content={content} metadata={metadata} showToc={true} />
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
