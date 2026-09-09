import React, { useState } from 'react';
import { Note, Project } from '@/types';
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
import { Plus, FileText, ChevronLeft, ChevronRight, Columns3, Search, LayoutGrid, List } from 'lucide-react';
import { useColumnVisibility, ColumnDef } from '@/hooks/useColumnVisibility';
import { Input } from '@/components/ui/input';
import { DocumentGridCard } from './DocumentGridCard';
import { NotesTableRows } from './NotesTableRows';
import { TablePagination } from './TablePagination';

interface NotesTableViewProps {
  notes: Note[];
  projects: Project[];
  selectedWorkspace: string | null;
  page: number;
  totalNotes: number;
  isLoading: boolean;
  onSelectNote: (uid: string) => void;
  onCreateNote: () => void;
  onPageChange: (p: number) => void;
  onWorkspaceClick: (uid: string | null) => void;
  onOpenEditDocument: (uid: string) => void;
  onDeleteNote: (uid: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchRef?: React.RefObject<HTMLInputElement | null>;
}

const ITEMS_PER_PAGE = 10;
const STORAGE_KEY = 'notes-table-column-visibility';

const COLUMNS: ColumnDef[] = [
  { id: 'name', label: 'Nama', defaultVisible: true, hideable: false, width: 'w-[30%]' },
  { id: 'workspace', label: 'Ruang Kerja', defaultVisible: true, hideable: false, width: 'w-[20%]' },
  { id: 'updated', label: 'Diperbarui', defaultVisible: true, hideable: true, width: 'w-[14%]' },
  { id: 'created', label: 'Dibuat', defaultVisible: true, hideable: true, width: 'w-[12%]' },
  { id: 'expires', label: 'Kedaluwarsa', defaultVisible: false, hideable: true, width: 'w-[14%]' },
  { id: 'actions', label: 'Aksi', defaultVisible: true, hideable: false, width: 'w-[8%]' },
];

export const NotesTableView = React.memo(function NotesTableView({
  notes,
  projects,
  selectedWorkspace: _selectedWorkspace,
  page,
  totalNotes,
  isLoading,
  onSelectNote,
  onCreateNote,
  onPageChange,
  onWorkspaceClick,
  onOpenEditDocument,
  onDeleteNote,
  searchQuery,
  onSearchChange,
  searchRef,
}: NotesTableViewProps) {
  const [layoutMode, setLayoutMode] = useState<'grid' | 'table'>(() => {
    return (localStorage.getItem('notes-view-layout') as 'grid' | 'table') || 'grid';
  });

  const handleLayoutChange = (mode: 'grid' | 'table') => {
    setLayoutMode(mode);
    localStorage.setItem('notes-view-layout', mode);
  };

  const totalPages = Math.max(1, Math.ceil(totalNotes / ITEMS_PER_PAGE));
  const { toggle, visibleCols } = useColumnVisibility(STORAGE_KEY, COLUMNS);
  const cols = visibleCols();

  const getProjectById = (projectId: number | string | null | undefined) => {
    if (projectId === null || projectId === undefined) return null;
    return projects.find(p => String(p.id) === String(projectId) || String(p.uid) === String(projectId)) || null;
  };

  const getProjectName = (note: Note): string => {
    return note.projects?.name || getProjectById(note.project_id)?.name || '—';
  };

  const getProjectUid = (note: Note): string | null => {
    return note.projects?.uid || getProjectById(note.project_id)?.uid || null;
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

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-yellow-400" />
          <h2 className="text-lg font-semibold">Catatan</h2>
          <span className="text-xs text-muted-foreground ml-2">
            ({totalNotes} catatan)
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
                  {COLUMNS.filter(c => c.hideable).map(col => (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      checked={cols.some(v => v.id === col.id)}
                      onCheckedChange={() => toggle(col.id)}
                    >
                      {col.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button size="sm" onClick={onCreateNote} className="h-8 gap-1.5 px-3 text-xs bg-amber-600 hover:bg-amber-700 text-white cursor-pointer font-medium">
              <Plus className="size-3.5" />
              <span>Buat Catatan</span>
            </Button>
          </div>
        </div>
      </div>

      {layoutMode === 'grid' ? (
        isLoading && notes.length === 0 && projects.length > 0 ? (
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
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 bg-card/40 p-8 sm:p-14 text-center mt-1 space-y-3">
            <div className="size-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <FileText className="size-5" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-xs font-semibold text-foreground">
                {searchQuery.trim() ? 'Catatan Tidak Ditemukan' : 'Belum Ada Catatan'}
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {searchQuery.trim()
                  ? 'Tidak ada catatan yang cocok dengan kata kunci pencarian.'
                  : 'Mulai buat catatan baru untuk mendokumentasikan ide, spesifikasi, dan riset.'}
              </p>
            </div>
            {!searchQuery.trim() && (
              <Button
                size="sm"
                onClick={onCreateNote}
                className="mt-1 h-7.5 gap-1.5 px-3 text-xs bg-amber-600 hover:bg-amber-700 text-white cursor-pointer font-medium"
              >
                <Plus className="size-3.5" />
                <span>Buat Catatan</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto custom-scrollbar p-0.5">
            {notes.map(note => {
              const uid = note.uid ?? String(note.id);
              return (
                <DocumentGridCard
                  key={uid}
                  type="notes"
                  title={note.title || '(Tanpa Judul)'}
                  projectName={getProjectName(note)}
                  projectUid={getProjectUid(note)}
                  formattedDate={formatDate(note.updated_at || (note as any).updatedAt)}
                  onSelect={() => onSelectNote(uid)}
                  onEdit={() => onOpenEditDocument(uid)}
                  onDelete={() => onDeleteNote(uid)}
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
                {cols.map(col => (
                  <TableHead key={col.id} className={col.width}>{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <NotesTableRows
              cols={cols}
              isLoading={isLoading}
              notes={notes}
              totalNotes={totalNotes}
              onSelectNote={onSelectNote}
              onOpenEditDocument={onOpenEditDocument}
              onDeleteNote={onDeleteNote}
              onWorkspaceClick={onWorkspaceClick}
              getProjectName={getProjectName}
              getProjectUid={getProjectUid}
              formatDate={formatDate}
              formatDateOnly={formatDateOnly}
              isExpired={isExpired}
            />
          </Table>
        </div>
      )}

      <TablePagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
});
