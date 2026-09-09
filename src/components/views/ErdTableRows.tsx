import React from 'react';
import { Diagram } from '@/types';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Pencil, Trash2, Database } from 'lucide-react';

export interface ErdColumnDef {
  id: string;
  label: string;
  defaultVisible: boolean;
  hideable: boolean;
  width: string;
}

export const DEFAULT_COLUMNS: ErdColumnDef[] = [
  { id: 'name', label: 'Nama', defaultVisible: true, hideable: false, width: 'w-[22%]' },
  { id: 'workspace', label: 'Ruang Kerja', defaultVisible: true, hideable: false, width: 'w-[15%]' },
  { id: 'source', label: 'Sumber', defaultVisible: true, hideable: true, width: 'w-[12%]' },
  { id: 'updated', label: 'Diperbarui', defaultVisible: false, hideable: true, width: 'w-[12%]' },
  { id: 'status', label: 'Status', defaultVisible: true, hideable: true, width: 'w-[8%]' },
  { id: 'created', label: 'Dibuat', defaultVisible: true, hideable: true, width: 'w-[11%]' },
  { id: 'expires', label: 'Kedaluwarsa', defaultVisible: false, hideable: true, width: 'w-[12%]' },
  { id: 'actions', label: 'Aksi', defaultVisible: true, hideable: false, width: 'w-[8%]' },
];

export const loadColumnVisibility = (storageKey: string): Record<string, boolean> => {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...parsed };
    }
  } catch {}
  return Object.fromEntries(DEFAULT_COLUMNS.map(c => [c.id, c.defaultVisible]));
};

export const formatSourceType = (st?: string): string => {
  if (!st) return '—';
  if (st === 'production_db') return 'DB Connect';
  return st.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
};

interface ErdTableRowsProps {
  visibleCols: ErdColumnDef[];
  isLoading: boolean;
  visibleDiagrams: Diagram[];
  totalDiagrams: number;
  isDbClient: boolean;
  onSelectDiagram: (uid: string) => void;
  onOpenEditDocument: (uid: string) => void;
  onDeleteDiagram: (uid: string) => void;
  onWorkspaceClick: (projectUid: string | null) => void;
  getProjectName: (d: Diagram) => string;
  getProjectUid: (d: Diagram) => string | null;
  formatDate: (dateStr?: string) => string;
  formatDateOnly: (dateStr?: string) => string;
  isExpired: (dateStr?: string) => boolean;
  formatSourceType: (st?: string) => string;
}

export const ErdTableRows = React.memo(function ErdTableRows({
  visibleCols,
  isLoading,
  visibleDiagrams,
  totalDiagrams,
  isDbClient,
  onSelectDiagram,
  onOpenEditDocument,
  onDeleteDiagram,
  onWorkspaceClick,
  getProjectName,
  getProjectUid,
  formatDate,
  formatDateOnly,
  isExpired,
  formatSourceType,
}: ErdTableRowsProps) {
  if (isLoading && visibleDiagrams.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={visibleCols.length} className="h-32 text-center text-muted-foreground">
            <span className="inline-flex items-center gap-2 text-xs">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              Memuat...
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (visibleDiagrams.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={visibleCols.length} className="h-32 text-center text-muted-foreground">
            {totalDiagrams === 0
              ? (isDbClient ? 'Belum ada koneksi.' : 'Belum ada diagram.')
              : (isDbClient ? 'Tidak ada koneksi.' : 'Tidak ada diagram.')}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {visibleDiagrams.map(d => {
        const uid = d.uid ?? String(d.id);
        const currentProjectUid = getProjectUid(d);
        return (
          <TableRow
            key={uid}
            className="cursor-pointer group"
            onClick={() => onSelectDiagram(uid)}
          >
            {visibleCols.map(col => {
              if (col.id === 'name') {
                return (
                  <TableCell key="name" className="font-medium">
                    <span className="truncate block max-w-70">
                      {d.name || '(Tanpa Nama)'}
                    </span>
                  </TableCell>
                );
              }
              if (col.id === 'workspace') {
                return (
                  <TableCell key="workspace">
                    <span
                      className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full cursor-pointer hover:bg-accent transition-colors truncate max-w-44"
                      onClick={e => {
                        e.stopPropagation();
                        onWorkspaceClick(currentProjectUid);
                      }}
                      title={getProjectName(d)}
                    >
                      <span className="truncate">{getProjectName(d)}</span>
                    </span>
                  </TableCell>
                );
              }
              if (col.id === 'source') {
                return (
                  <TableCell key="source" className="text-muted-foreground text-xs">
                    {isDbClient ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-500">
                        <Database className="size-3" />
                        {(d as any).catalog?.account?.type || (d as any).catalog?.database_name || 'Database'}
                      </span>
                    ) : (d.source_type && d.source_type !== 'scratch') ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">
                        <Database className="w-3 h-3" />
                        {formatSourceType(d.source_type)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50">Scratch</span>
                    )}
                  </TableCell>
                );
              }
              if (col.id === 'updated') {
                return (
                  <TableCell key="updated" className="text-muted-foreground text-xs">
                    {formatDate(d.updated_at)}
                  </TableCell>
                );
              }
              if (col.id === 'status') {
                return (
                  <TableCell key="status">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${d.is_public ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                      {d.is_public ? 'Publik' : 'Privat'}
                    </span>
                  </TableCell>
                );
              }
              if (col.id === 'created') {
                return (
                  <TableCell key="created" className="text-muted-foreground text-xs">
                    {formatDate(d.created_at)}
                  </TableCell>
                );
              }
              if (col.id === 'expires') {
                return (
                  <TableCell key="expires" className={`text-muted-foreground text-xs ${isExpired(d.expiry_date) ? 'text-red-500 font-medium' : ''}`}>
                    {formatDateOnly(d.expiry_date)}
                  </TableCell>
                );
              }
              if (col.id === 'actions') {
                return (
                  <TableCell key="actions" className="text-right" onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      } />
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => onOpenEditDocument(uid)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Dokumen
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDeleteDiagram(uid)} className="text-destructive focus:text-destructive">
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
      })}
    </TableBody>
  );
});
