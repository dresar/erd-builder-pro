import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Code2,
  Search,
  FolderKanban,
  Database,
  Layers,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ApiProjectListProps {
  projects: any[];
  diagrams: any[];
  flowcharts: any[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function ApiProjectList({
  projects,
  diagrams,
  flowcharts,
  searchQuery,
  onSearchChange,
}: ApiProjectListProps) {
  const navigate = useNavigate();

  const rawList = !searchQuery.trim()
    ? projects
    : projects.filter(p => (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()));

  const seenIds = new Set<string>();
  const filteredProjects = rawList.filter(p => {
    const key = String(p.uid || p.id);
    if (seenIds.has(key)) return false;
    seenIds.add(key);
    return true;
  });

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 sm:p-6 overflow-y-auto custom-scrollbar max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Code2 className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground">API Explorer</h1>
            <p className="text-xs text-muted-foreground">Pilih proyek untuk menguji CRUD dan alur kerja API</p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Cari"
            className="w-full text-xs h-8 pl-8 pr-3 rounded-lg border border-border/70 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/40 p-8 sm:p-14 text-center mt-3 space-y-3">
          <div className="size-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <FolderKanban className="size-6" />
          </div>
          <div className="space-y-1 max-w-md">
            <h3 className="text-sm font-semibold text-foreground">
              {searchQuery.trim() ? 'Proyek Tidak Ditemukan' : 'Belum Ada Ruang Kerja'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {searchQuery.trim()
                ? `Tidak ada proyek yang sesuai dengan kata kunci "${searchQuery}".`
                : 'API Explorer membutuhkan ruang kerja proyek untuk menghasilkan skema endpoints CRUD dan simulasi alur kerja otomatis.'}
            </p>
          </div>
          {!searchQuery.trim() && (
            <div className="flex items-center gap-2 pt-2">
              <Button
                size="sm"
                onClick={() => navigate('/agent-generator')}
                className="h-8 gap-1.5 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer font-medium"
              >
                <Sparkles className="size-3.5" />
                <span>Generator Agen</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/table/prd')}
                className="h-8 gap-1.5 px-3 text-xs cursor-pointer border-border/70"
              >
                <span>Dokumen PRD</span>
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {filteredProjects.map(proj => {
            const pId = String(proj.id ?? '');
            const pUid = proj.uid ? String(proj.uid) : '';
            const pSlug = proj.slug || proj.uid || pId;

            const matchProj = (item: any) => {
              if (!item) return false;
              const fPid = String(item.project_id ?? item.projectId ?? item.project?.id ?? item.project?.uid ?? item.workspace?.id ?? '');
              return (pId && fPid === pId) || (pUid && fPid === pUid);
            };

            const tableCount = proj.diagrams_count ?? (proj.diagrams?.length || diagrams.filter(matchProj).length);
            const fcCount = proj.flowcharts_count ?? (proj.flowcharts?.length || flowcharts.filter(matchProj).length);

            return (
              <div
                key={pId}
                onClick={() => navigate(`/api-explorer/${pSlug}`)}
                className="group rounded-xl border border-border/70 bg-card p-4 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-7 rounded-md bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                      <FolderKanban className="size-3.5" />
                    </div>
                    <span className="text-sm font-semibold text-foreground truncate group-hover:text-indigo-400 transition-colors">
                      {proj.name}
                    </span>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {proj.description || 'Proyek tanpa deskripsi khusus.'}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-muted-foreground border-t border-border/50 pt-2.5">
                  <span className="flex items-center gap-1">
                    <Database className="size-3 text-emerald-400" />
                    {tableCount} Diagram
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="size-3 text-violet-400" />
                    {fcCount} Alur
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-7.5 text-xs font-medium cursor-pointer group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all"
                >
                  Buka
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
