import { useState } from 'react';
import { Sparkles, RefreshCw, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePromptEval, type EvalResult, type EvalDimensions } from '@/hooks/usePromptEval';
import { useAIProviders } from '@/hooks/useAIProviders';

const DIMENSION_LABELS: Record<keyof EvalDimensions, string> = {
  clarity: 'Clarity', completeness: 'Completeness', specificity: 'Specificity',
  constraint_quality: 'Constraint Quality', output_control: 'Output Control',
  reasoning_quality: 'Reasoning Quality', consistency: 'Consistency',
  ambiguity: 'Ambiguity (inv.)', safety: 'Safety', model_compatibility: 'Model Compat.',
};

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">{score}</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: score + '%' }} />
      </div>
    </div>
  );
}

function OverallScore({ score }: { score: number }) {
  const ring = score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500';
  return (
    <div className="flex flex-col items-center justify-center py-4">
      <div className={`text-5xl font-bold ${ring}`}>{score}</div>
      <div className="text-xs text-muted-foreground mt-1">Overall Score / 100</div>
      <Badge className="mt-2" variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'}>
        {score >= 80 ? 'Production Ready' : score >= 60 ? 'Needs Improvement' : 'Critical Issues'}
      </Badge>
    </div>
  );
}

export function PromptEvalRoute() {
  const { isEvaluating, result, evaluate, clearResult } = usePromptEval();
  const { providers, configs } = useAIProviders();
  const [promptText, setPromptText] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [providerCode, setProviderCode] = useState('');

  const enabledProviders = providers.filter(p => configs[p.code]?.is_enabled);

  const handleEvaluate = async () => {
    if (!promptText.trim()) { return; }
    await evaluate({ promptText, systemPrompt: systemPrompt || undefined, providerCode: providerCode || undefined });
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="border-b px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-base font-semibold">Prompt Evaluation</h1>
          <p className="text-xs text-muted-foreground">Score your prompt across 10 quality dimensions</p>
        </div>
        <div className="flex items-center gap-2">
          {result && <Button size="sm" variant="outline" onClick={clearResult} className="text-xs h-7">Clear</Button>}
          <Button size="sm" onClick={handleEvaluate} disabled={isEvaluating || !promptText.trim()} className="gap-1 text-xs h-7">
            {isEvaluating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {isEvaluating ? 'Evaluating…' : 'Evaluate'}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col p-4 gap-3 overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">System Instruction (optional)</label>
            <textarea value={systemPrompt} onChange={e => setSystemPrompt(e.target.value)}
              placeholder="System instruction context..." rows={2}
              className="w-full text-sm rounded-md border bg-muted/20 px-3 py-2 font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="flex-1 space-y-1 flex flex-col min-h-48">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Prompt to Evaluate</label>
            <textarea value={promptText} onChange={e => setPromptText(e.target.value)}
              placeholder="Paste your prompt here..."
              className="flex-1 w-full text-sm rounded-md border bg-muted/20 px-3 py-2 font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">AI Provider</label>
            <select value={providerCode} onChange={e => setProviderCode(e.target.value)}
              className="w-full text-sm rounded-md border bg-background px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary">
              <option value="">Auto-select</option>
              {enabledProviders.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="w-80 border-l overflow-y-auto p-4 space-y-4">
          {!result && !isEvaluating && (
            <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
              <Sparkles className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm text-center">Enter a prompt and click Evaluate to see scores</p>
            </div>
          )}
          {isEvaluating && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center py-8">
              <RefreshCw className="w-4 h-4 animate-spin" />Evaluating…
            </div>
          )}
          {result && !isEvaluating && (
            <>
              <OverallScore score={result.overall_score} />
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Dimension Scores</p>
                {(Object.keys(result.dimensions) as (keyof EvalDimensions)[]).map(k => (
                  <ScoreBar key={k} label={DIMENSION_LABELS[k]} score={result.dimensions[k]} />
                ))}
              </div>
              {result.critical_issues.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-destructive flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Critical Issues</p>
                  {result.critical_issues.map((issue, i) => <p key={i} className="text-xs text-destructive/80 bg-destructive/5 rounded px-2 py-1">{issue}</p>)}
                </div>
              )}
              {result.warnings.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-yellow-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Warnings</p>
                  {result.warnings.map((w, i) => <p key={i} className="text-xs text-yellow-700/80 bg-yellow-50 dark:bg-yellow-950/20 rounded px-2 py-1">{w}</p>)}
                </div>
              )}
              {result.recommendations.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-blue-600 flex items-center gap-1"><Info className="w-3 h-3" />Recommendations</p>
                  {result.recommendations.map((r, i) => <p key={i} className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1">{r}</p>)}
                </div>
              )}
              {result.summary && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Summary</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{result.summary}</p>
                </div>
              )}
              {result.meta && (
                <div className="text-xs text-muted-foreground border-t pt-2 space-y-0.5">
                  <p>Model: {result.meta.model}</p>
                  <p>Latency: {result.meta.latencyMs}ms</p>
                  <p>Tokens: {result.meta.totalTokens}</p>
                  <p>Cost: ${result.meta.estimatedCostUsd.toFixed(5)}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}