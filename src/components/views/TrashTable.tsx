import React, { useState } from 'react';
import { LucideIcon, RefreshCcw, Trash2 as TrashIcon, Loader2, FileText } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { TrashEmptyState } from './TrashEmptyState';

interface TrashTableProps {
  items: any[];
  icon: LucideIcon;
  iconColorClass?: string;
  isProjectTable?: boolean;
  isPrdTable?: boolean;
  searchQuery?: string;
  onRestore: (item: any) => Promise<void>;
  onDeletePermanent: (item: any) => void;
  emptyTitle: string;
  emptyDescription: string;
}

export function TrashTable({
  items,
  icon: Icon,
  iconColorClass = 'text-muted-foreground',
  isProjectTable = false,
  isPrdTable = false,
  searchQuery = '',
  onRestore,
  onDeletePermanent,
  emptyTitle,
  emptyDescription,
}: TrashTableProps) {
  const [restoringId, setRestoringId] = useState<string | number | null>(null);

  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const name = (item.name || item.title || '').toLowerCase();
    const projectName = (item.projects?.name || item.project?.name || '').toLowerCase();
    return name.includes(q) || projectName.includes(q);
  });

  if (filteredItems.length === 0) {
    if (items.length > 0 && searchQuery.trim()) {
      return (
        <TrashEmptyState
          icon={Icon}
          title="Tidak ada hasil"
          description={`Tidak ditemukan item yang cocok dengan pencarian "${searchQuery}".`}
        />
      );
    }
    return (
      <TrashEmptyState
        icon={Icon}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  const handleRestoreClick = async (item: any) => {
    const key = item.uid ?? item.id;
    try {
      setRestoringId(key);
      await onRestore(item);
    } finally {
      setRestoringId(null);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '-';
      return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="border border-border/70 rounded-xl overflow-hidden bg-card/40 shadow-xs">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40 text-xs">
            <TableHead className="font-semibold text-foreground/80 pl-4">
              {isProjectTable ? 'Nama Ruang Kerja' : 'Nama Dokumen'}
            </TableHead>
            {!isProjectTable && (
              <TableHead className="font-semibold text-foreground/80">Ruang Kerja</TableHead>
            )}
            <TableHead className="font-semibold text-foreground/80">Dihapus Pada</TableHead>
            <TableHead className="text-right font-semibold text-foreground/80 pr-4">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((item) => {
            const itemKey = item.uid ?? item.id;
            const isRestoring = restoringId === itemKey;
            const rawTitle = item.name || item.title || 'Tanpa Judul';
            const isPrd = isPrdTable || (typeof rawTitle === 'string' && rawTitle.startsWith('[PRD] '));
            const displayTitle = isPrd && typeof rawTitle === 'string' && rawTitle.startsWith('[PRD] ')
              ? rawTitle.replace(/^\[PRD\]\s*/, '')
              : rawTitle;

            const projectName = item.projects?.name || item.project?.name || '-';
            const deletedDate = formatDate(item.deleted_at || item.updated_at || item.created_at);

            return (
              <TableRow
                key={String(itemKey)}
                className="group hover:bg-muted/30 transition-colors text-xs"
              >
                <TableCell className="font-medium text-foreground py-3 pl-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-md bg-muted/60 ${iconColorClass}`}>
                      <Icon size={14} />
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      {isPrd && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          PRD
                        </span>
                      )}
                      <span className="truncate max-w-[280px] sm:max-w-md" title={rawTitle}>
                        {displayTitle}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {!isProjectTable && (
                  <TableCell className="text-muted-foreground py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-muted/40 text-[11px] font-medium border border-border/50">
                      {projectName}
                    </span>
                  </TableCell>
                )}

                <TableCell className="text-muted-foreground/80 py-3 whitespace-nowrap text-[11px]">
                  {deletedDate}
                </TableCell>

                <TableCell className="text-right py-3 pr-4">
                  <div className="flex justify-end items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isRestoring}
                      className="h-7 px-2.5 text-xs font-medium rounded-md hover:bg-primary/10 hover:text-primary transition-all active:scale-95"
                      onClick={() => handleRestoreClick(item)}
                    >
                      {isRestoring ? (
                        <Loader2 size={13} className="mr-1.5 animate-spin text-primary" />
                      ) : (
                        <RefreshCcw size={13} className="mr-1.5 opacity-70" />
                      )}
                      Pulihkan
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isRestoring}
                      className="h-7 px-2.5 text-xs font-medium rounded-md text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all active:scale-95"
                      onClick={() => onDeletePermanent(item)}
                    >
                      <TrashIcon size={13} className="mr-1.5 opacity-70" />
                      Hapus
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
