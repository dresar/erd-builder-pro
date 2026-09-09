import React from 'react';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileText, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { parsePrdMetadata } from './prdTemplate';

interface PRDTableRowsProps {
  cols: any[];
  isLoading: boolean;
  filteredPrds: any[];
  projects: any[];
  searchQuery: string;
  onSelectPrd: (uid: string) => void;
  onCreatePrd: () => void;
  onWorkspaceClick: (uid: string | null) => void;
  onOpenEditDocument: (uid: string) => void;
  onDeletePrd: (uid: string) => void;
  getProjectName: (doc: any) => string;
  getProjectUid: (doc: any) => string | null;
  formatDate: (dateStr?: string) => string;
}

export function PRDTableRows({
  cols,
  isLoading,
  filteredPrds,
  projects,
  searchQuery,
  onSelectPrd,
  onCreatePrd,
  onWorkspaceClick,
  onOpenEditDocument,
  onDeletePrd,
  getProjectName,
  getProjectUid,
  formatDate,
}: PRDTableRowsProps) {
  if (isLoading && filteredPrds.length === 0 && projects.length > 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={cols.length} className="h-40 text-center text-muted-foreground">
            <span className="inline-flex items-center gap-2 text-xs">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              Memuat...
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (filteredPrds.length === 0) {
    return (
      <TableBody>
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
      </TableBody>
    );
  }

  return (
    <TableBody>
      {filteredPrds.map((doc: any) => {
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
            {cols.map((col: any) => {
              if (col.id === 'name') {
                return (
                  <TableCell key="name" className="font-medium">
                    <span className="truncate block max-w-56" title={cleanTitle}>{cleanTitle}</span>
                  </TableCell>
                );
              }
              if (col.id === 'workspace') {
                return (
                  <TableCell key="workspace">
                    <span
                      className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full cursor-pointer hover:bg-accent transition-colors truncate max-w-44 block"
                      title={getProjectName(doc)}
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
                      <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem onClick={() => onOpenEditDocument(uid)} className="gap-2 text-xs">
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Ubah</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onDeletePrd(uid)}
                          className="gap-2 text-xs text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Hapus</span>
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
}
