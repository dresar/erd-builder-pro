import React from 'react';
import { FileText, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PRDCardProps {
  doc: any;
  projectName: string;
  projectUid: string | null;
  statusLabel: string;
  statusColor: string;
  formattedDate: string;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onWorkspaceClick: (uid: string | null) => void;
}

export function PRDCard({
  doc,
  projectName,
  projectUid,
  statusLabel,
  statusColor,
  formattedDate,
  onSelect,
  onEdit,
  onDelete,
  onWorkspaceClick,
}: PRDCardProps) {
  const cleanTitle = doc.title?.replace(/^\[PRD\]\s*/, '') || 'Spesifikasi PRD';

  return (
    <div
      onClick={onSelect}
      className="group relative rounded-xl border border-border/70 bg-card p-3.5 hover:border-indigo-500/50 hover:bg-indigo-500/[0.03] transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-xs"
    >
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="size-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <FileText className="size-4" />
            </div>
            <div className="min-w-0">
              <h3
                className="text-xs font-semibold text-foreground truncate group-hover:text-indigo-400 transition-colors"
                title={cleanTitle}
              >
                {cleanTitle}
              </h3>
              {projectName && projectName !== '—' && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onWorkspaceClick(projectUid);
                  }}
                  className="text-[11px] text-muted-foreground hover:text-foreground truncate max-w-[160px] block transition-colors text-left"
                  title={projectName}
                >
                  {projectName}
                </button>
              )}
            </div>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" size="icon-xs" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="size-4" />
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-36">
                <DropdownMenuItem onClick={onEdit} className="gap-2 text-xs cursor-pointer">
                  <Pencil className="size-3.5" />
                  <span>Ubah</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onDelete} className="gap-2 text-xs text-destructive focus:text-destructive cursor-pointer">
                  <Trash2 className="size-3.5" />
                  <span>Hapus</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border/50 pt-2.5 text-[11px] text-muted-foreground">
        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${statusColor}`}>
          {statusLabel}
        </span>
        <span className="text-[10px] text-muted-foreground truncate">{formattedDate}</span>
      </div>

      <Button
        size="sm"
        variant="outline"
        className="w-full h-7 text-xs font-medium cursor-pointer group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all"
      >
        Buka
      </Button>
    </div>
  );
}
