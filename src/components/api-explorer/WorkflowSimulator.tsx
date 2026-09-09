import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, Circle, Loader2, ChevronDown, ChevronRight, Layers, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WorkflowStep, SimulationResult } from '@/lib/api-engine/types';
import { executeWorkflowStep } from '@/lib/api-engine/apiSimulator';

interface WorkflowSimulatorProps {
  initialSteps: WorkflowStep[];
}

export function WorkflowSimulator({ initialSteps }: WorkflowSimulatorProps) {
  const [steps, setSteps] = useState<WorkflowStep[]>(initialSteps);
  const [expandedStepId, setExpandedStepId] = useState<string>(initialSteps[0]?.id || '');
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);

  React.useEffect(() => {
    setSteps(initialSteps);
    if (initialSteps[0]) setExpandedStepId(initialSteps[0].id);
  }, [initialSteps]);

  const handleRunSingleStep = async (stepId: string) => {
    const idx = steps.findIndex(s => s.id === stepId);
    if (idx === -1) return;

    setSteps(prev => prev.map((s, i) => (i === idx ? { ...s, status: 'running' } : s)));
    const prevResult = idx > 0 ? steps[idx - 1].result : undefined;

    try {
      const result = await executeWorkflowStep(steps[idx], prevResult);
      setSteps(prev => prev.map((s, i) => (i === idx ? { ...s, status: 'success', result } : s)));
      setExpandedStepId(stepId);
    } catch {
      setSteps(prev => prev.map((s, i) => (i === idx ? { ...s, status: 'failed' } : s)));
    }
  };

  const handleRunAll = async () => {
    setIsRunningAll(true);
    let lastResult: SimulationResult | undefined = undefined;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setSteps(prev => prev.map((s, idx) => (idx === i ? { ...s, status: 'running' } : s)));
      setExpandedStepId(step.id);

      try {
        const res = await executeWorkflowStep(step, lastResult);
        lastResult = res;
        setSteps(prev => prev.map((s, idx) => (idx === i ? { ...s, status: 'success', result: res } : s)));
      } catch {
        setSteps(prev => prev.map((s, idx) => (idx === i ? { ...s, status: 'failed' } : s)));
        break;
      }
    }
    setIsRunningAll(false);
  };

  const handleReset = () => {
    setSteps(initialSteps.map(s => ({ ...s, status: 'idle', result: undefined })));
    if (initialSteps[0]) setExpandedStepId(initialSteps[0].id);
  };

  const successCount = steps.filter(s => s.status === 'success').length;

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar p-4 lg:p-6 min-h-0">
      <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Layers className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Simulasi Alur Kerja Sistem (Workflow Engine)</h2>
              <p className="text-xs text-muted-foreground">
                Menguji eksekusi transaksi multi-tahap secara berurutan sesuai alur bisnis flowchart
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={handleReset}
              disabled={isRunningAll}
              size="sm"
              variant="outline"
              className="h-8 text-xs gap-1.5 px-3 cursor-pointer border-border/70"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </Button>

            <Button
              onClick={handleRunAll}
              disabled={isRunningAll || steps.length === 0}
              size="sm"
              className="h-8 text-xs gap-1.5 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer font-medium"
            >
              {isRunningAll ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5 fill-current" />}
              <span>{isRunningAll ? 'Simulasi Berjalan...' : 'Jalankan Semua'}</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground border-t border-border/60 pt-3">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-foreground">{successCount}</span> dari{' '}
            <span className="font-semibold text-foreground">{steps.length}</span> langkah selesai
          </div>
          <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${steps.length > 0 ? (successCount / steps.length) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {steps.map((step) => {
          const isExpanded = step.id === expandedStepId;

          return (
            <div
              key={step.id}
              className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs transition-all"
            >
              <div
                onClick={() => setExpandedStepId(isExpanded ? '' : step.id)}
                className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0">
                    {step.status === 'idle' && <Circle className="size-4 text-muted-foreground" />}
                    {step.status === 'running' && <Loader2 className="size-4 text-indigo-400 animate-spin" />}
                    {step.status === 'success' && <CheckCircle2 className="size-4 text-emerald-400" />}
                    {step.status === 'failed' && <Circle className="size-4 text-rose-400" />}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="text-xs font-bold text-muted-foreground">Langkah {step.order}:</span>
                    <span className="text-xs font-semibold text-foreground truncate">{step.title}</span>
                    <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 h-4 border-border/70">
                      {step.method} {step.endpoint}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {step.result && (
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                      {step.result.status} OK ({step.result.latencyMs}ms)
                    </span>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={step.status === 'running' || isRunningAll}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunSingleStep(step.id);
                    }}
                    className="h-7 text-[11px] px-2.5 cursor-pointer border-border/70"
                  >
                    Uji
                  </Button>

                  {isExpanded ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronRight className="size-4 text-muted-foreground" />}
                </div>
              </div>

              {isExpanded && (
                <div className="p-3.5 border-t border-border/60 bg-background/50 space-y-3">
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Payload Masuk
                      </span>
                      <pre className="p-2.5 rounded-lg border border-border/60 bg-card font-mono text-[11px] leading-relaxed overflow-x-auto custom-scrollbar select-text max-h-48">
                        {JSON.stringify(step.requestPayload, null, 2)}
                      </pre>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                        Respon Simulasi
                      </span>
                      {step.result ? (
                        <pre className="p-2.5 rounded-lg border border-border/60 bg-card font-mono text-[11px] leading-relaxed overflow-x-auto custom-scrollbar select-text max-h-48 text-emerald-300">
                          {JSON.stringify(step.result.data, null, 2)}
                        </pre>
                      ) : (
                        <div className="p-4 rounded-lg border border-border/60 bg-card/40 text-center text-xs text-muted-foreground">
                          Belum dieksekusi. Klik "Uji" untuk mensimulasikan langkah ini.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
