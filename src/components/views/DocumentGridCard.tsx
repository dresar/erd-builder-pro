import React from 'react';
import { FileText, Database, Network, PenTool, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface DocumentGridCardProps {
  type: 'notes' | 'erd' | 'flowchart' | 'drawings';
  title: string;
  projectName: string;
  projectUid: string | null;
  formattedDate: string;
  badge?: string;
  badgeColor?: string;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onWorkspaceClick: (uid: string | null) => void;
}

export function DocumentGridCard({
  type,
  title,
  projectName,
  projectUid,
  formattedDate,
  badge,
  badgeColor,
  onSelect,
  onEdit,
  onDelete,
  onWorkspaceClick,
}: DocumentGridCardProps) {
  const iconConfig = {
    notes: { icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    erd: { icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    flowchart: { icon: Network, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
    drawings: { icon: PenTool, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/20' },
  }[type];

  const Icon = iconConfig.icon;

  return (
    <div
      onClick={onSelect}
      className="group relative rounded-xl border border-border/70 bg-card p-3.5 hover:border-primary/50 hover:bg-primary/[0.03] transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-xs"
    >
      <div className="space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`size-8 rounded-lg border flex items-center justify-center shrink-0 ${iconConfig.bg} ${iconConfig.color}`}>
              <Icon className="size-4" />
            </div>
            <div className="min-w-0">
              <h3
                className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors"
                title={title}
              >
                {title}
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
        {badge ? (
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${badgeColor || 'bg-muted text-foreground'}`}>
            {badge}
          </span>
        ) : (
          <span />
        )}
        <span className="text-[10px] text-muted-foreground truncate">{formattedDate}</span>
      </div>

      <Button
        size="sm"
        variant="outline"
        className="w-full h-7 text-xs font-medium cursor-pointer group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
      >
        Buka
      </Button>
    </div>
  );
}
