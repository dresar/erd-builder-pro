import React, { useState, useEffect, useCallback } from 'react';
import { Diagram, Project } from '@/types';
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Plus, Columns3, Cable, Search, LayoutGrid, List } from 'lucide-react';
import { DBConnectPanel } from '@/components/db-connect/DBConnectPanel';
import { Input } from '@/components/ui/input';
import { DocumentGridCard } from './DocumentGridCard';
import { ErdTableRows, DEFAULT_COLUMNS, loadColumnVisibility, formatSourceType } from './ErdTableRows';
import { TablePagination } from './TablePagination';

interface ErdTableViewProps {
  mode?: 'erd' | 'db-client';
  diagrams: Diagram[];
  projects: Project[];
  selectedWorkspace: string | null;
  page: number;
  totalDiagrams: number;
  isLoading: boolean;
  onSelectDiagram: (uid: string) => void;
  onCreateDiagram?: () => void;
  onPageChange: (page: number) => void;
  onWorkspaceClick: (projectUid: string | null) => void;
  onOpenEditDocument: (uid: string) => void;
  onDeleteDiagram: (uid: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchRef?: React.RefObject<HTMLInputElement | null>;
}

const ITEMS_PER_PAGE = 10;
const STORAGE_KEY = 'erd-table-column-visibility';

export const ErdTableView = React.memo(function ErdTableView({
  mode = 'erd',
  diagrams,
  projects,
  selectedWorkspace: _selectedWorkspace,
  page,
  totalDiagrams,
  isLoading,
  onSelectDiagram,
  onCreateDiagram,
  onPageChange,
  onWorkspaceClick,
  onOpenEditDocument,
  onDeleteDiagram,
  searchQuery,
  onSearchChange,
  searchRef,
}: ErdTableViewProps) {
  const isDbClient = mode === 'db-client';
  const layoutStorageKey = isDbClient ? 'db-client-view-layout' : 'erd-view-layout';
  const [layoutMode, setLayoutMode] = useState<'grid' | 'table'>(() => {
    return (localStorage.getItem(layoutStorageKey) as 'grid' | 'table') || 'grid';
  });

  const handleLayoutChange = (newLayout: 'grid' | 'table') => {
    setLayoutMode(newLayout);
    localStorage.setItem(layoutStorageKey, newLayout);
  };

  const totalPages = Math.max(1, Math.ceil(totalDiagrams / ITEMS_PER_PAGE));
  const [dbConnectOpen, setDbConnectOpen] = useState(false);
  const showDbConnect = typeof window !== 'undefined' && (
    !!((window as any).__TAURI__ || (window as any).__TAURI_INTERNALS__) ||
    (window as any).ERD_INSTALL_MODE === 'cli'
  );

  const columns = isDbClient
    ? DEFAULT_COLUMNS.filter(column => column.id !== 'status' && column.id !== 'expires')
    : showDbConnect ? DEFAULT_COLUMNS : DEFAULT_COLUMNS.filter(c => c.id !== 'source');

  const storageKey = isDbClient ? 'db-client-table-column-visibility' : STORAGE_KEY;
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(() => loadColumnVisibility(storageKey));

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(visibleColumns));
    } catch {}
  }, [storageKey, visibleColumns]);

  const toggleColumn = useCallback((colId: string) => {
    setVisibleColumns(prev => ({ ...prev, [colId]: !prev[colId] }));
  }, []);

  const isColVisible = useCallback((colId: string): boolean => {
    const col = columns.find(c => c.id === colId);
    if (!col || !col.hideable) return true;
    return visibleColumns[colId] ?? col.defaultVisible;
  }, [columns, visibleColumns]);

  const getProjectById = (projectId: number | string | null | undefined) => {
    if (projectId === null || projectId === undefined) return null;
    return projects.find(p => String(p.id) === String(projectId) || String(p.uid) === String(projectId)) || null;
  };

  const getProjectName = (d: Diagram): string => {
    return d.projects?.name || getProjectById(d.project_id)?.name || '—';
  };

  const getProjectUid = (d: Diagram): string | null => {
    return d.projects?.uid || getProjectById(d.project_id)?.uid || null;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(dateStr));
    } catch {
      return dateStr.slice(0, 10);
    }
  };

  const formatDateOnly = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
      }).format(new Date(dateStr));
    } catch {
      return dateStr.slice(0, 10);
    }
  };

  const isExpired = (dateStr?: string) => {
    if (!dateStr) return false;
    try {
      return new Date(dateStr) < new Date();
    } catch {
      return false;
    }
  };

  const visibleCols = columns.filter(c => c.id === 'name' || c.id === 'workspace' || c.id === 'actions' || isColVisible(c.id));
  const visibleDiagrams = isDbClient ? diagrams : diagrams.filter(d => (d.source_type ?? 'blank') === 'blank');

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Columns3 className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-semibold">{isDbClient ? 'Koneksi DB' : 'ERD'}</h2>
          <span className="text-xs text-muted-foreground ml-2">
            ({totalDiagrams} {isDbClient ? 'koneksi' : 'diagram'})
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="relative flex items-center max-w-64 w-full">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 select-none text-muted-foreground" />
            <Input
              ref={searchRef}
              type="text"
              placeholder="Cari"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center rounded-lg border border-border/70 p-0.5 bg-muted/40">
              <Button
                variant={layoutMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon-xs"
                onClick={() => handleLayoutChange('grid')}
                title="Grid"
                className="h-7 w-7 rounded-md cursor-pointer"
              >
                <LayoutGrid className="size-3.5" />
              </Button>
              <Button
                variant={layoutMode === 'table' ? 'secondary' : 'ghost'}
                size="icon-xs"
                onClick={() => handleLayoutChange('table')}
                title="Tabel"
                className="h-7 w-7 rounded-md cursor-pointer"
              >
                <List className="size-3.5" />
              </Button>
            </div>

            {layoutMode === 'table' && (
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="outline" size="icon-sm" aria-label="Kolom" title="Kolom">
                    <Columns3 className="w-4 h-4" />
                  </Button>
                } />
                <DropdownMenuContent align="end" className="w-44">
                  {columns.filter(c => c.hideable).map(col => (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      checked={isColVisible(col.id)}
                      onCheckedChange={() => toggleColumn(col.id)}
                    >
                      {col.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {!isDbClient && (
              <Button size="sm" onClick={onCreateDiagram} className="h-8 gap-1.5 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer font-medium">
                <Plus className="size-3.5" />
                <span>Buat ERD</span>
              </Button>
            )}
            {showDbConnect && isDbClient && (
              <Button size="sm" variant="outline" onClick={() => setDbConnectOpen(true)} className="h-8 gap-1.5 px-3 text-xs cursor-pointer font-medium">
                <Cable className="size-3.5" />
                <span>Koneksi DB</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {layoutMode === 'grid' ? (
        isLoading && visibleDiagrams.length === 0 && projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-0.5">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="rounded-xl border border-border/60 bg-card/60 p-4 space-y-3 animate-pulse">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-muted" />
                  <div className="space-y-1 flex-1">
                    <div className="h-3 w-24 bg-muted rounded" />
                    <div className="h-2.5 w-16 bg-muted/60 rounded" />
                  </div>
                </div>
                <div className="h-2 bg-muted/40 rounded w-full" />
                <div className="h-7 bg-muted/60 rounded-md" />
              </div>
            ))}
          </div>
        ) : visibleDiagrams.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/40 p-8 sm:p-14 text-center mt-1 space-y-3">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Columns3 className="size-5" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-xs font-semibold text-foreground">
                {searchQuery.trim()
                  ? (isDbClient ? 'Koneksi Tidak Ditemukan' : 'Diagram Tidak Ditemukan')
                  : (isDbClient ? 'Belum Ada Koneksi' : 'Belum Ada Diagram')}
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {searchQuery.trim()
                  ? 'Tidak ada data yang cocok dengan kata kunci pencarian.'
                  : (isDbClient ? 'Sambungkan database lokal atau remote Anda.' : 'Mulai rancang skema relasi basis data visual Anda.')}
              </p>
            </div>
            {!searchQuery.trim() && !isDbClient && (
              <Button
                size="sm"
                onClick={onCreateDiagram}
                className="mt-1 h-7.5 gap-1.5 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer font-medium"
              >
                <Plus className="size-3.5" />
                <span>Buat ERD</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto custom-scrollbar p-0.5">
            {visibleDiagrams.map(d => {
              const uid = d.uid ?? String(d.id);
              return (
                <DocumentGridCard
                  key={uid}
                  type="erd"
                  title={d.name || '(Tanpa Nama)'}
                  projectName={getProjectName(d)}
                  projectUid={getProjectUid(d)}
                  formattedDate={formatDate(d.updated_at || (d as any).updatedAt)}
                  onSelect={() => onSelectDiagram(uid)}
                  onEdit={() => onOpenEditDocument(uid)}
                  onDelete={() => onDeleteDiagram(uid)}
                  onWorkspaceClick={onWorkspaceClick}
                />
              );
            })}
          </div>
        )
      ) : (
        <div className="overflow-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.filter(c => visibleCols.some(v => v.id === c.id)).map(col => (
                  <TableHead key={col.id} className={col.width}>
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <ErdTableRows
              visibleCols={visibleCols}
              isLoading={isLoading}
              visibleDiagrams={visibleDiagrams}
              totalDiagrams={totalDiagrams}
              isDbClient={isDbClient}
              onSelectDiagram={onSelectDiagram}
              onOpenEditDocument={onOpenEditDocument}
              onDeleteDiagram={onDeleteDiagram}
              onWorkspaceClick={onWorkspaceClick}
              getProjectName={getProjectName}
              getProjectUid={getProjectUid}
              formatDate={formatDate}
              formatDateOnly={formatDateOnly}
              isExpired={isExpired}
              formatSourceType={formatSourceType}
            />
          </Table>
        </div>
      )}

      <TablePagination page={page} totalPages={totalPages} onPageChange={onPageChange} />

      {showDbConnect && (
        <DBConnectPanel
          open={dbConnectOpen}
          onOpenChange={setDbConnectOpen}
          projects={projects}
          onImportComplete={(uid) => onSelectDiagram(uid)}
        />
      )}
    </div>
  );
});
