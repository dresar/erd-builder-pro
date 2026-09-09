import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { Plus, FileText, MoreHorizontal, Pencil, Trash2, ChevronLeft, ChevronRight, Columns3, Search } from 'lucide-react';
import { useColumnVisibility, ColumnDef } from '@/hooks/useColumnVisibility';
import { Input } from '@/components/ui/input';
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

const ITEMS_PER_PAGE = 10;
const STORAGE_KEY = 'prd-table-column-visibility';

const COLUMNS: ColumnDef[] = [
  { id: 'name', label: 'Nama', defaultVisible: true, hideable: false, width: 'w-[30%]' },
  { id: 'workspace', label: 'Ruang Kerja', defaultVisible: true, hideable: false, width: 'w-[20%]' },
  { id: 'updated', label: 'Diperbarui', defaultVisible: true, hideable: true, width: 'w-[14%]' },
  { id: 'status', label: 'Status', defaultVisible: true, hideable: true, width: 'w-[10%]' },
  { id: 'created', label: 'Dibuat', defaultVisible: false, hideable: true, width: 'w-[14%]' },
  { id: 'actions', label: 'Aksi', defaultVisible: true, hideable: false, width: 'w-[8%]' },
];

export const PRDTableView = React.memo(function PRDTableView({
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
  const totalPages = Math.max(1, Math.ceil(totalPrds / ITEMS_PER_PAGE));
  const { toggle, visibleCols } = useColumnVisibility(STORAGE_KEY, COLUMNS);
  const cols = visibleCols();

  const getProjectById = (projectId: number | string | null | undefined) => {
    if (projectId === null || projectId === undefined) return null;
    return projects.find(p => String(p.id) === String(projectId) || String(p.uid) === String(projectId)) || null;
  };

  const getProjectName = (item: any): string => {
    return item.projects?.name || item.project?.name || getProjectById(item.project_id)?.name || '—';
  };

  const getProjectUid = (item: any): string | null => {
    return item.projects?.uid || item.project?.uid || getProjectById(item.project_id)?.uid || null;
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
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      <div className="flex flex-col gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-semibold">PRD</h2>
          <span className="text-xs text-muted-foreground ml-2">
            ({totalPrds} prd)
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
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
          <div className="flex items-center gap-2">
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
            <Button size="sm" onClick={onCreatePrd}>
              <Plus className="w-4 h-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Buat PRD</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-auto rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              {cols.map(col => (
                <TableHead key={col.id} className={col.width}>{col.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && filteredPrds.length === 0 && projects.length > 0 ? (
              <TableRow>
                <TableCell colSpan={cols.length} className="h-40 text-center text-muted-foreground">
                  <span className="inline-flex items-center gap-2 text-xs">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                    Memuat...
                  </span>
                </TableCell>
              </TableRow>
            ) : filteredPrds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={cols.length} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground py-4">
                    <div className="size-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <FileText className="size-5" />
                    </div>
                    <p className="text-xs font-semibold text-foreground mt-1">
                      {searchQuery.trim() ? 'Dokumen Tidak Ditemukan' : 'Belum Ada Dokumen PRD'}
                    </p>
                    <p className="text-[11px] text-muted-foreground max-w-sm leading-relaxed">
                      {searchQuery.trim()
                        ? 'Tidak ada dokumen PRD yang cocok dengan kata kunci pencarian.'
                        : 'Mulai buat dokumen Product Requirement Document untuk mendefinisikan fitur dan alur sistem.'}
                    </p>
                    {!searchQuery.trim() && (
                      <Button
                        size="sm"
                        onClick={onCreatePrd}
                        className="mt-1.5 h-7.5 gap-1.5 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer font-medium"
                      >
                        <Plus className="size-3.5" />
                        <span>Buat PRD</span>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredPrds.map(doc => {
                const uid = doc.uid ?? String(doc.id);
                const currentProjectUid = getProjectUid(doc);
                const cleanTitle = doc.title?.replace(/^\[PRD\]\s*/, '') || 'Spesifikasi PRD';
                const meta = parsePrdMetadata(doc.content || '', cleanTitle);
                const statusLabel = meta.status === 'production' ? 'Produksi' : meta.status === 'approved' ? 'Disetujui' : meta.status === 'in_review' ? 'Review' : 'Draft';
                const statusColor = meta.status === 'production'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : meta.status === 'approved'
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : meta.status === 'in_review'
                      ? 'bg-amber-500/10 text-amber-500'
                      : 'bg-muted text-muted-foreground';

                return (
                  <TableRow
                    key={uid}
                    className="cursor-pointer group"
                    onClick={() => onSelectPrd(uid)}
                  >
                    {cols.map(col => {
                      if (col.id === 'name') {
                        return (
                          <TableCell key="name" className="font-medium">
                            <span className="truncate block max-w-70">{cleanTitle}</span>
                          </TableCell>
                        );
                      }
                      if (col.id === 'workspace') {
                        return (
                          <TableCell key="workspace">
                            <span
                              className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full cursor-pointer hover:bg-accent transition-colors"
                              onClick={e => { e.stopPropagation(); onWorkspaceClick(currentProjectUid); }}
                            >
                              {getProjectName(doc)}
                            </span>
                          </TableCell>
                        );
                      }
                      if (col.id === 'updated') {
                        return (
                          <TableCell key="updated" className="text-muted-foreground text-xs">
                            {formatDate(doc.updated_at || doc.updatedAt)}
                          </TableCell>
                        );
                      }
                      if (col.id === 'status') {
                        return (
                          <TableCell key="status">
                            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${statusColor}`}>
                              {statusLabel}
                            </span>
                          </TableCell>
                        );
                      }
                      if (col.id === 'created') {
                        return (
                          <TableCell key="created" className="text-muted-foreground text-xs">
                            {formatDate(doc.created_at || doc.createdAt)}
                          </TableCell>
                        );
                      }
                      if (col.id === 'actions') {
                        return (
                          <TableCell key="actions" className="text-right" onClick={e => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger render={
                                <Button variant="ghost" size="icon-xs" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              } />
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => onOpenEditDocument(uid)}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Edit Dokumen
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onDeletePrd(uid)} className="text-destructive">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Hapus
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        );
                      }
                      return null;
                    })}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-x border-b bg-background px-4 py-2 shrink-0 rounded-b-xl">
          <span className="text-xs text-muted-foreground">
            Halaman {page} dari {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-xs"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
              .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('ellipsis');
                acc.push(p);
                return acc;
              }, [])
              .map((item) =>
                item === 'ellipsis' ? (
                  <span key={`e-${item}`} className="px-1 text-xs text-muted-foreground">...</span>
                ) : (
                  <Button
                    key={item}
                    variant={item === page ? 'default' : 'outline'}
                    size="icon-xs"
                    onClick={() => onPageChange(item as number)}
                    className={item === page ? '' : 'text-muted-foreground'}
                  >
                    {item}
                  </Button>
                )
              )}
            <Button
              variant="outline"
              size="icon-xs"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});
