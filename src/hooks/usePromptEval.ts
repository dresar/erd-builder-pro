import { useState, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export interface EvalDimensions {
  clarity: number; completeness: number; specificity: number;
  constraint_quality: number; output_control: number; reasoning_quality: number;
  consistency: number; ambiguity: number; safety: number; model_compatibility: number;
}
export interface EvalResult {
  overall_score: number;
  dimensions: EvalDimensions;
  critical_issues: string[];
  warnings: string[];
  recommendations: string[];
  summary: string;
  meta?: { model: string; latencyMs: number; totalTokens: number; estimatedCostUsd: number };
}

export function usePromptEval() {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<EvalResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const evaluate = useCallback(async (params: { promptText: string; systemPrompt?: string; providerCode?: string; model?: string }): Promise<EvalResult | null> => {
    setIsEvaluating(true);
    try {
      const res = await apiFetch('/api/eval/run', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Evaluation failed'); return null; }
      setResult(data);
      return data;
    } catch (err: any) { toast.error('Network error: ' + err.message); return null; }
    finally { setIsEvaluating(false); }
  }, []);

  const benchmark = useCallback(async (params: { promptText: string; systemPrompt?: string; providerCodes: string[] }) => {
    setIsEvaluating(true);
    try {
      const res = await apiFetch('/api/eval/benchmark', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Benchmark failed'); return null; }
      return data;
    } catch (err: any) { toast.error('Network error: ' + err.message); return null; }
    finally { setIsEvaluating(false); }
  }, []);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await apiFetch('/api/eval/history');
      if (res.ok) setHistory(await res.json());
    } catch { }
  }, []);

  const clearResult = useCallback(() => setResult(null), []);
  return { isEvaluating, result, history, evaluate, benchmark, fetchHistory, clearResult };
}