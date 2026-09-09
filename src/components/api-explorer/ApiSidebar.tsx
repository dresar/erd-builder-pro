import React from 'react';
import { Search, Database, Layers, CheckCircle2 } from 'lucide-react';
import { ApiEndpoint, HttpMethod } from '@/lib/api-engine/types';

interface ApiSidebarProps {
  endpoints: ApiEndpoint[];
  selectedEndpointId: string;
  onSelectEndpoint: (id: string) => void;
  activeMode: 'crud' | 'workflow';
  onChangeMode: (mode: 'crud' | 'workflow') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  POST: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  PUT: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  DELETE: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  PATCH: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
};

export function ApiSidebar({
  endpoints,
  selectedEndpointId,
  onSelectEndpoint,
  activeMode,
  onChangeMode,
  searchQuery,
  onSearchChange,
}: ApiSidebarProps) {
  const grouped = React.useMemo(() => {
    const map: Record<string, ApiEndpoint[]> = {};
    for (const ep of endpoints) {
      const tag = ep.tableTitle || ep.tableName;
      if (!map[tag]) map[tag] = [];
      map[tag].push(ep);
    }
    return map;
  }, [endpoints]);

  const filteredGroups = React.useMemo(() => {
    if (!searchQuery.trim()) return grouped;
    const q = searchQuery.toLowerCase();
    const res: Record<string, ApiEndpoint[]> = {};
    for (const [tag, list] of Object.entries(grouped)) {
      const matching = list.filter(
        ep =>
          ep.path.toLowerCase().includes(q) ||
          ep.summary.toLowerCase().includes(q) ||
          ep.method.toLowerCase().includes(q) ||
          tag.toLowerCase().includes(q)
      );
      if (matching.length > 0) res[tag] = matching;
    }
    return res;
  }, [grouped, searchQuery]);

  return (
    <div className="w-full md:w-80 border-r border-border/70 flex flex-col bg-card/40 shrink-0 h-full overflow-hidden">
      <div className="p-3 border-b border-border/60 space-y-2.5 shrink-0">
        <div className="flex rounded-lg border border-border/70 p-0.5 bg-background/80">
          <button
            type="button"
            onClick={() => onChangeMode('crud')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeMode === 'crud' ? 'bg-indigo-600 text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Database className="size-3" />
            <span>CRUD</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeMode('workflow')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeMode === 'workflow' ? 'bg-indigo-600 text-white shadow-xs' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layers className="size-3" />
            <span>Alur</span>
          </button>
        </div>

        <div className="relative">
          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Cari"
            className="w-full text-xs h-8 pl-8 pr-2.5 rounded-md border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-3">
        {Object.keys(filteredGroups).length === 0 ? (
          <div className="p-4 text-center text-xs text-muted-foreground">
            Tidak ada endpoint.
          </div>
        ) : (
          Object.entries(filteredGroups).map(([tableTitle, list]) => (
            <div key={tableTitle} className="space-y-1">
              <div className="px-2 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Database className="size-3 text-indigo-400" />
                <span className="truncate">{tableTitle}</span>
                <span className="text-[10px] text-muted-foreground/70 ml-auto">{list.length}</span>
              </div>

              <div className="space-y-0.5">
                {list.map(ep => {
                  const isSelected = ep.id === selectedEndpointId && activeMode === 'crud';
                  const methodColor = METHOD_COLORS[ep.method] || 'bg-muted text-foreground';

                  return (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() => {
                        onChangeMode('crud');
                        onSelectEndpoint(ep.id);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-2 cursor-pointer border ${
                        isSelected
                          ? 'bg-indigo-500/10 border-indigo-500/40 text-foreground'
                          : 'border-transparent hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${methodColor}`}>
                        {ep.method}
                      </span>
                      <span className="font-mono text-[11px] truncate flex-1">{ep.path}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
