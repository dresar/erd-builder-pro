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
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Note } from '@/types';

interface NotesTableRowsProps {
  cols: any[];
  isLoading: boolean;
  notes: Note[];
  totalNotes: number;
  onSelectNote: (uid: string) => void;
  onOpenEditDocument: (uid: string) => void;
  onDeleteNote: (uid: string) => void;
  onWorkspaceClick: (uid: string | null) => void;
  getProjectName: (note: Note) => string;
  getProjectUid: (note: Note) => string | null;
  formatDate: (dateStr?: string) => string;
  formatDateOnly: (dateStr?: string) => string;
  isExpired: (dateStr?: string) => boolean;
}

export function NotesTableRows({
  cols,
  isLoading,
  notes,
  totalNotes,
  onSelectNote,
  onOpenEditDocument,
  onDeleteNote,
  onWorkspaceClick,
  getProjectName,
  getProjectUid,
  formatDate,
  formatDateOnly,
  isExpired,
}: NotesTableRowsProps) {
  if (isLoading && notes.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={cols.length} className="h-32 text-center text-muted-foreground">
            <span className="inline-flex items-center gap-2 text-xs">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              Memuat...
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (notes.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={cols.length} className="h-32 text-center text-muted-foreground">
            {totalNotes === 0 ? 'Belum ada catatan.' : 'Tidak ada catatan.'}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {notes.map(note => {
        const uid = note.uid ?? String(note.id);
        const currentProjectUid = getProjectUid(note);
        return (
          <TableRow
            key={uid}
            className="cursor-pointer group"
            onClick={() => onSelectNote(uid)}
          >
            {cols.map((col: any) => {
              if (col.id === 'name') {
                return (
                  <TableCell key="name" className="font-medium">
                    <span className="truncate block max-w-64" title={note.title}>{note.title || '(Tanpa Judul)'}</span>
                  </TableCell>
                );
              }
              if (col.id === 'workspace') {
                return (
                  <TableCell key="workspace">
                    <span
                      className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full cursor-pointer hover:bg-accent transition-colors truncate max-w-44 block"
                      title={getProjectName(note)}
                      onClick={e => { e.stopPropagation(); onWorkspaceClick(currentProjectUid); }}
                    >
                      {getProjectName(note)}
                    </span>
                  </TableCell>
                );
              }
              if (col.id === 'updated') {
                return (
                  <TableCell key="updated" className="text-muted-foreground text-xs">
                    {formatDate(note.updated_at)}
                  </TableCell>
                );
              }
              if (col.id === 'created') {
                return (
                  <TableCell key="created" className="text-muted-foreground text-xs">
                    {formatDate(note.created_at)}
                  </TableCell>
                );
              }
              if (col.id === 'expires') {
                const expired = isExpired(note.expiry_date);
                return (
                  <TableCell key="expires" className="text-xs">
                    {note.expiry_date ? (
                      <span className={expired ? 'text-destructive font-medium' : 'text-muted-foreground'}>
                        {formatDateOnly(note.expiry_date)}
                        {expired && ' (Expired)'}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
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
                          onClick={() => onDeleteNote(uid)}
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
