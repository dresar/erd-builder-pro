import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const TablePagination = React.memo(function TablePagination({
  page,
  totalPages,
  onPageChange,
}: TablePaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
    .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('ellipsis');
      acc.push(p);
      return acc;
    }, []);

  return (
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
        {pages.map((item, idx) =>
          item === 'ellipsis' ? (
            <span key={`e-${idx}`} className="px-1 text-xs text-muted-foreground">...</span>
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
  );
});
