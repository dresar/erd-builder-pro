import { 
  Eye, 
  Edit3, 
  Columns, 
  Database, 
  Network, 
  ExternalLink,
  PanelLeftClose,
  PanelLeft,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export type PrdViewMode = 'html' | 'editor' | 'split';
export type PrdStatus = 'draft' | 'in_review' | 'approved' | 'production';

interface PRDToolbarProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  status: PrdStatus;
  onStatusChange: (newStatus: PrdStatus) => void;
  viewMode: PrdViewMode;
  onViewModeChange: (mode: PrdViewMode) => void;
  onSynthesizeErd: () => void;
  onSynthesizeFlowchart: () => void;
  onExportHtml?: () => void;
  onExportMarkdown?: () => void;
  onPrint?: () => void;
  onOpenNewTab?: () => void;
  onBack?: () => void;
  showMenu?: boolean;
  onToggleMenu?: () => void;
  isSaving?: boolean;
}

const STATUS_CONFIG: Record<PrdStatus, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-muted text-muted-foreground' },
  in_review: { label: 'Review', color: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
  approved: { label: 'Disetujui', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  production: { label: 'Produksi', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
};

export function PRDToolbar({
  title,
  onTitleChange,
  status,
  onStatusChange,
  viewMode,
  onViewModeChange,
  onSynthesizeErd,
  onSynthesizeFlowchart,
  onExportHtml,
  onExportMarkdown,
  onPrint,
  onOpenNewTab,
  onBack,
  showMenu = true,
  onToggleMenu,
  isSaving,
}: PRDToolbarProps) {
  return (
    <div className="h-11 border-b border-border/40 bg-background/95 backdrop-blur px-3 sm:px-4 flex items-center justify-between gap-2.5 shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        {onBack && (
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs gap-1 cursor-pointer border-border/70 shrink-0"
            title="Kembali ke daftar PRD"
          >
            <ArrowLeft className="size-3.5" />
            <span className="hidden sm:inline">Kembali</span>
          </Button>
        )}

        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Judul"
          className="h-7 text-xs font-semibold bg-transparent border-transparent hover:border-border/60 focus:border-border rounded px-1.5 text-foreground focus:bg-background outline-none transition-all truncate max-w-44 sm:max-w-xs"
        />

        <select
          aria-label="Status Dokumen"
          value={status}
          onChange={(e) => onStatusChange(e.target.value as PrdStatus)}
          className="h-6 text-[10px] font-bold rounded-md bg-muted/40 border border-border/50 px-1.5 text-foreground uppercase tracking-wider focus:outline-none cursor-pointer"
        >
          <option value="draft">Draft</option>
          <option value="in_review">Review</option>
          <option value="approved">Disetujui</option>
          <option value="production">Produksi</option>
        </select>

        {isSaving && (
          <span className="text-[10px] text-muted-foreground animate-pulse">Menyimpan...</span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <div className="flex bg-muted/50 border border-border/40 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange('html')}
            title="Tampilan Cantik"
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all cursor-pointer ${
              viewMode === 'html'
                ? 'bg-background text-foreground shadow-sm font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Eye className="size-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Cantik</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('split')}
            title="Tampilan Split"
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all cursor-pointer ${
              viewMode === 'split'
                ? 'bg-background text-foreground shadow-sm font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Columns className="size-3.5 text-amber-400" />
            <span className="hidden sm:inline">Split</span>
          </button>

          <button
            type="button"
            onClick={() => onViewModeChange('editor')}
            title="Editor Markdown"
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all cursor-pointer ${
              viewMode === 'editor'
                ? 'bg-background text-foreground shadow-sm font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Edit3 className="size-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Editor</span>
          </button>
        </div>

        <div className="h-4 w-px bg-border/40 mx-1 hidden sm:block" />

        <div className="flex items-center gap-1">
          <Button
            onClick={onSynthesizeErd}
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs gap-1 cursor-pointer"
            title="Sintesis PRD ke ERD"
          >
            <Database className="size-3 text-indigo-400" />
            <span className="hidden md:inline">Ke ERD</span>
          </Button>

          <Button
            onClick={onSynthesizeFlowchart}
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs gap-1 cursor-pointer"
            title="Sintesis PRD ke Flowchart"
          >
            <Network className="size-3 text-amber-400" />
            <span className="hidden md:inline">Ke Alur</span>
          </Button>
        </div>

        <div className="h-4 w-px bg-border/40 mx-1 hidden sm:block" />

        <div className="flex items-center gap-1">
          {onOpenNewTab && (
            <Button
              onClick={onOpenNewTab}
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs gap-1 cursor-pointer border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10"
              title="Buka PRD di tab baru"
            >
              <ExternalLink className="size-3" />
              <span className="hidden sm:inline">Tab Baru</span>
            </Button>
          )}

          {onToggleMenu && (
            <Button
              onClick={onToggleMenu}
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1 cursor-pointer text-muted-foreground hover:text-foreground"
              title={showMenu ? "Tutup Daftar Isi" : "Buka Daftar Isi"}
            >
              {showMenu ? <PanelLeftClose className="size-3.5" /> : <PanelLeft className="size-3.5 text-indigo-400" />}
              <span className="hidden xl:inline">{showMenu ? "Tutup" : "Menu"}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
