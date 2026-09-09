import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, FolderKanban, ChevronRight, Database, Layers, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectSelectionViewProps {
  projects: any[];
  diagrams: any[];
  flowcharts: any[];
  notes: any[];
}

export function ProjectSelectionView({
  projects,
  diagrams,
  flowcharts,
  notes,
}: ProjectSelectionViewProps) {
  const navigate = useNavigate();
  const [searchProjectQuery, setSearchProjectQuery] = useState('');

  const filteredProjects = projects.filter((p) => {
    if (!searchProjectQuery.trim()) return true;
    const q = searchProjectQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.slug?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col gap-4 p-4 sm:p-6 overflow-y-auto custom-scrollbar max-w-6xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="size-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Users className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground">Generator Agen</h1>
            <p className="text-xs text-muted-foreground">Pilih proyek untuk membuat Mega Prompt &amp; 5 Agen AI</p>
          </div>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchProjectQuery}
            onChange={(e) => setSearchProjectQuery(e.target.value)}
            placeholder="Cari"
            className="w-full text-xs h-8 pl-8 pr-3 rounded-lg border border-border/70 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        {filteredProjects.map((proj) => {
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
          const noteCount = proj.notes_count ?? (proj.notes?.length || notes.filter(matchProj).length);

          return (
            <div
              key={pId}
              onClick={() => navigate(`/agent-generator/${pSlug}`)}
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
                <span className="flex items-center gap-1">
                  <FileText className="size-3 text-blue-400" />
                  {noteCount} Catatan
                </span>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="w-full h-7.5 text-xs font-medium cursor-pointer group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all"
              >
                Pilih
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
