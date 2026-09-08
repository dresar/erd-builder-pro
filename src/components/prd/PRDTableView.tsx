import React, { useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  Eye, 
  Calendar, 
  FolderKanban, 
  MoreHorizontal,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InfoTip } from '@/components/ai/InfoTip';
import { parsePrdMetadata } from './prdTemplate';

interface PRDTableViewProps {
  prds: any[];
  projects: any[];
  selectedWorkspace: string | null;
  page: number;
  totalPrds: number;
  isLoading?: boolean;
  onSelectPrd: (uid: string) => void;
  onCreatePrd: () => void;
  onPageChange: (p: number) => void;
  onWorkspaceClick: (uid: string | null) => void;
  onOpenEditDocument: (uid: string) => void;
  onDeletePrd: (uid: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchRef?: React.RefObject<HTMLInputElement | null>;
}

export function PRDTableView({
  prds,
  projects,
  selectedWorkspace,
  page,
  totalPrds,
  isLoading = false,
  onSelectPrd,
  onCreatePrd,
  onPageChange,
  onWorkspaceClick,
  onOpenEditDocument,
  onDeletePrd,
  searchQuery,
  onSearchChange,
  searchRef,
}: PRDTableViewProps) {
  const filteredPrds = useMemo(() => {
    let list = prds || [];
    if (selectedWorkspace) {
      list = list.filter((p) => String(p.project_id ?? p.projectId) === String(selectedWorkspace));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => p.title?.toLowerCase().includes(q));
    }
    return list;
  }, [prds, selectedWorkspace, searchQuery]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      <div className="p-4 sm:p-6 border-b border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-foreground">PRD</h1>
            <InfoTip text="Product Requirements Document: spesifikasi arsitektur & persyaratan produk dengan Tampilan Cantik HTML." />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Kelola spesifikasi produk dan arsitektur sistem.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Cari"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-8.5 w-full pl-8 pr-3 rounded-lg border border-border/50 bg-muted/15 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-indigo-500/50"
            />
          </div>

          <Button
            onClick={onCreatePrd}
            size="sm"
            className="h-8.5 px-3.5 text-xs gap-1.5 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shrink-0"
          >
            <Plus className="size-3.5" />
            Buat PRD
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6">
        {filteredPrds.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 rounded-xl border border-dashed border-border/60 bg-muted/5">
            <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 mb-3">
              <FileText className="size-6" />
            </div>
            <p className="text-sm font-semibold text-foreground">Belum ada dokumen PRD</p>
            <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
              Mulai buat dokumen spesifikasi persyaratan produk atau impor hasil AI.
            </p>
            <Button onClick={onCreatePrd} size="sm" className="h-8 px-4 text-xs font-semibold bg-indigo-600 text-white">
              <Plus className="size-3.5 mr-1" />
              Buat PRD
            </Button>
          </div>
        ) : (
          <div className="rounded-xl border border-border/40 overflow-hidden bg-background">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                  <th className="py-2.5 px-4">Nama PRD</th>
                  <th className="py-2.5 px-3 hidden sm:table-cell">Status</th>
                  <th className="py-2.5 px-3 hidden md:table-cell">Ruang Kerja</th>
                  <th className="py-2.5 px-3 hidden lg:table-cell">Diperbarui</th>
                  <th className="py-2.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredPrds.map((doc) => {
                  const uid = doc.uid || doc.id;
                  const cleanTitle = doc.title?.replace(/^\[PRD\]\s*/, '') || 'Spesifikasi PRD';
                  const projectName = doc.projects?.name || doc.project?.name || 'Tanpa Proyek';
                  const updatedStr = doc.updated_at || doc.updatedAt;
                  const meta = parsePrdMetadata(doc.content || '', cleanTitle);
                  const statusLabel = meta.status === 'production' ? 'Produksi' : meta.status === 'approved' ? 'Disetujui' : meta.status === 'in_review' ? 'Review' : 'Draft';
                  const statusColor = meta.status === 'production' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : meta.status === 'approved' 
                      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' 
                      : meta.status === 'in_review' 
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' 
                        : 'bg-muted text-muted-foreground border-border/40';

                  return (
                    <tr
                      key={uid}
                      onClick={() => onSelectPrd(uid)}
                      className="hover:bg-muted/15 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-semibold text-foreground flex items-center gap-2.5">
                        <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                          <FileText className="size-4" />
                        </div>
                        <span className="truncate max-w-xs sm:max-w-md">{cleanTitle}</span>
                      </td>

                      <td className="py-3 px-3 hidden sm:table-cell">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                          {statusLabel}
                        </span>
                      </td>

                      <td className="py-3 px-3 hidden md:table-cell text-muted-foreground truncate max-w-36">
                        {projectName}
                      </td>

                      <td className="py-3 px-3 hidden lg:table-cell text-muted-foreground text-[11px]">
                        {updatedStr ? new Date(updatedStr).toLocaleDateString('id-ID') : '–'}
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onSelectPrd(uid)}
                            title="Buka PRD"
                            className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <Eye className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onOpenEditDocument(uid)}
                            title="Ubah Nama"
                            className="p-1.5 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <Edit3 className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeletePrd(uid)}
                            title="Hapus"
                            className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive cursor-pointer"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
