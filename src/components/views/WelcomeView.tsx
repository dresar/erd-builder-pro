import React from 'react';
import { ArrowLeft } from 'lucide-react';

export function WelcomeView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/30 rounded-xl border border-dashed border-border/40 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/8 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
        <div className="mb-6 relative">
          <div className="absolute inset-0 blur-2xl rounded-full scale-125 opacity-40 bg-gradient-to-r from-blue-500 to-cyan-400" />
          <img src="/logo.png" alt="PRD PRO" className="relative w-16 h-16 object-contain drop-shadow-2xl" />
        </div>

        <h1 className="text-xl font-bold mb-1 tracking-tight bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          PRD PRO
        </h1>

        <p className="text-muted-foreground text-xs leading-relaxed mb-6 px-4">
          Pilih proyek atau dokumen dari bilah sisi untuk mulai merancang.
        </p>

        <div className="flex items-center gap-2 text-primary font-bold text-[11px] uppercase tracking-wider bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/20">
          <ArrowLeft className="size-3" />
          <span>Pilih Bilah Sisi</span>
        </div>
      </div>
    </div>
  );
}
