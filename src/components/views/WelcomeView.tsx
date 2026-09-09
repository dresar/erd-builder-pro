import React from 'react';
import { Database, ArrowLeft } from 'lucide-react';

export function WelcomeView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/50 rounded-xl border border-dashed border-border/50 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-110" />
          <div className="relative size-16 rounded-2xl bg-card border border-border flex items-center justify-center shadow-2xl">
            <Database className="size-8 text-primary" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-foreground mb-2 tracking-tight">
          Selamat Datang di PRD PRO
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
