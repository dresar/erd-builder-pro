import React from 'react';
import { Flowchart } from '@/types';
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
import { ColumnDef } from '@/hooks/useColumnVisibility';

interface FlowchartTableRowsProps {
  cols: ColumnDef[];
  isLoading: boolean;
  flowcharts: Flowchart[];
  totalFlowcharts: number;
  onSelectFlowchart: (uid: string) => void;
  onOpenEditDocument: (uid: string) => void;
  onDeleteFlowchart: (uid: string) => void;
  onWorkspaceClick: (projectUid: string | null) => void;
  getProjectName: (flowchart: Flowchart) => string;
  getProjectUid: (flowchart: Flowchart) => string | null;
  formatDate: (dateStr?: string) => string;
  formatDateOnly: (dateStr?: string) => string;
  isExpired: (dateStr?: string) => boolean;
}

export const FlowchartTableRows = React.memo(function FlowchartTableRows({
  cols,
  isLoading,
  flowcharts,
  totalFlowcharts,
  onSelectFlowchart,
  onOpenEditDocument,
  onDeleteFlowchart,
  onWorkspaceClick,
  getProjectName,
  getProjectUid,
  formatDate,
  formatDateOnly,
  isExpired,
}: FlowchartTableRowsProps) {
  if (isLoading && flowcharts.length === 0) {
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

  if (flowcharts.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={cols.length} className="h-32 text-center text-muted-foreground">
            {totalFlowcharts === 0 ? 'Belum ada alur.' : 'Tidak ada alur.'}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {flowcharts.map(flowchart => {
        const uid = flowchart.uid ?? String(flowchart.id);
        const currentProjectUid = getProjectUid(flowchart);
        return (
          <TableRow
            key={uid}
            className="cursor-pointer group"
            onClick={() => onSelectFlowchart(uid)}
          >
            {cols.map(col => {
              if (col.id === 'name') {
                return (
                  <TableCell key="name" className="font-medium">
                    <span className="truncate block max-w-70">{flowchart.title || '(Tanpa Judul)'}</span>
                  </TableCell>
                );
              }
              if (col.id === 'workspace') {
                return (
                  <TableCell key="workspace">
                    <span
                      className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-0.5 rounded-full cursor-pointer hover:bg-accent transition-colors truncate max-w-44"
                      onClick={e => { e.stopPropagation(); onWorkspaceClick(currentProjectUid); }}
                      title={getProjectName(flowchart)}
                    >
                      <span className="truncate">{getProjectName(flowchart)}</span>
                    </span>
                  </TableCell>
                );
              }
              if (col.id === 'updated') {
                return (
                  <TableCell key="updated" className="text-muted-foreground text-xs">
                    {formatDate(flowchart.updated_at)}
                  </TableCell>
                );
              }
              if (col.id === 'status') {
                return (
                  <TableCell key="status">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${flowchart.is_public ? 'bg-green-500/10 text-green-500' : 'bg-muted text-muted-foreground'}`}>
                      {flowchart.is_public ? 'Publik' : 'Privat'}
                    </span>
                  </TableCell>
                );
              }
              if (col.id === 'created') {
                return (
                  <TableCell key="created" className="text-muted-foreground text-xs">
                    {formatDate(flowchart.created_at)}
                  </TableCell>
                );
              }
              if (col.id === 'expires') {
                return (
                  <TableCell key="expires" className={`text-muted-foreground text-xs ${isExpired(flowchart.expiry_date) ? 'text-red-500 font-medium' : ''}`}>
                    {formatDateOnly(flowchart.expiry_date)}
                  </TableCell>
                );
              }
              if (col.id === 'actions') {
                return (
                  <TableCell key="actions" className="text-right" onClick={e => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger render={
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      } />
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => onOpenEditDocument(uid)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Dokumen
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onDeleteFlowchart(uid)} className="text-destructive">
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
