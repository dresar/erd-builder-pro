import React from 'react';
import { LucideIcon, Trash2 } from 'lucide-react';

interface TrashEmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
}

export function TrashEmptyState({
  icon: Icon = Trash2,
  title = 'Tempat sampah kosong',
  description = 'Tidak ada item yang berada di tempat sampah.',
}: TrashEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border/60 rounded-xl bg-card/20">
      <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3 text-muted-foreground/70">
        <Icon size={22} />
      </div>
      <h4 className="text-sm font-semibold text-foreground tracking-tight mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">{description}</p>
    </div>
  );
}
