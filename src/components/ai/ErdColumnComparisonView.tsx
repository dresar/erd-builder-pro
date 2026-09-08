import React from 'react';

interface ErdColumnComparisonViewProps {
  erdDiff: {
    deletedTables: string[];
    diffLines: any[];
  };
}

export function ErdColumnComparisonView({ erdDiff }: ErdColumnComparisonViewProps) {
  const deletedTables = erdDiff.deletedTables;
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-muted-foreground">
        Column Comparison
        {deletedTables.length > 0 && (
          <span className="ml-2 text-red-400/70 text-[10px]">
            ({deletedTables.length} table{deletedTables.length > 1 ? 's' : ''} removed)
          </span>
        )}
      </label>
      <div className="rounded-lg border border-border/40 overflow-hidden max-h-75 overflow-y-auto custom-scrollbar text-[10px] font-mono leading-relaxed bg-muted/30">
        <div className="divide-y divide-border/10">
          {erdDiff.diffLines.map((line: any, li: number) => {
            if (line.type === 'header') {
              return (
                <div key={li} className="flex items-center gap-2 px-3 py-1.5 bg-muted border-b border-border/30">
                  {line.isNew && (
                    <span className="text-[8px] font-semibold px-1 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">NEW</span>
                  )}
                  <span className="text-[11px] font-semibold text-foreground">{line.tableName}</span>
                </div>
              );
            }
            const isAdd = line.type === 'add';
            const isRemove = line.type === 'remove';
            const bg = isAdd ? 'bg-emerald-500/5 dark:bg-emerald-900/20' : isRemove ? 'bg-red-500/5 dark:bg-red-900/20' : '';
            const prefixColor = isAdd ? 'text-emerald-600 dark:text-emerald-400' : isRemove ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground/40';
            const colNameColor = isAdd ? 'text-emerald-700 dark:text-emerald-300' : isRemove ? 'text-red-700 dark:text-red-400' : 'text-foreground';
            const typeColor = isAdd ? 'text-emerald-600/60 dark:text-emerald-400/60' : isRemove ? 'text-red-600/60 dark:text-red-400/60' : 'text-muted-foreground';
            const pkColor = isAdd ? 'text-emerald-600 dark:text-emerald-400' : isRemove ? 'text-red-600/70 dark:text-red-400/70' : 'text-amber-600 dark:text-amber-400';
            const nulColor = isAdd ? 'text-emerald-600/50 dark:text-emerald-400/50' : isRemove ? 'text-red-600/50 dark:text-red-400/50' : 'text-muted-foreground/50';
            return (
              <div key={li} className={`flex items-center gap-1 px-3 py-0.5 ${bg}`}>
                <span className={`w-4 shrink-0 select-none ${prefixColor}`}>{line.prefix}</span>
                {line.col.is_pk && <span className={pkColor}>PK</span>}
                <span className={colNameColor}>{line.col.name}</span>
                <span className={typeColor}>{line.col.type}</span>
                {line.col.is_nullable && <span className={nulColor}>?</span>}
              </div>
            );
          })}
        </div>
      </div>
      {deletedTables.length > 0 && (
        <p className="text-[9px] text-red-400/50 leading-relaxed">Tables not in the new schema will be kept as-is in the existing ERD.</p>
      )}
    </div>
  );
}
