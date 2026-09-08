import React from 'react';
import { AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function InfoTip({ text }: { text: string }) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center size-4 rounded-full text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/15 cursor-pointer shrink-0 transition-colors"
            aria-label="Info"
          >
            <AlertCircle className="size-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-xs max-w-xs leading-relaxed px-2.5 py-1.5 bg-popover text-popover-foreground border shadow-md">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
