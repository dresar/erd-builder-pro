import { useState, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export interface PromptTest {
  id: number; uid: string; name: string; prompt_text: string; system_prompt?: string;
  expected_behavior: string; forbidden_behavior: string; rules_json: string;
  threshold: number; last_status: string; last_run_at?: string; created_at: string;
}
export interface TestRunResult {
  passed: boolean; score: number; isRegression: boolean; actualOutput: string; model: string; reason: string;
}

export function usePromptTests() {
  const [tests, setTests] = useState<PromptTest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [runningIds, setRunningIds] = useState<Set<number>>(new Set());

  const fetchTests = useCallback(async (projectId?: number) => {
    setIsLoading(true);
    try {
      const url = projectId ? `/api/prompt-tests?project_id=${projectId}` : '/api/prompt-tests';
      const res = await apiFetch(url);
      if (res.ok) setTests(await res.json());
    } catch { } finally { setIsLoading(false); }
  }, []);

  const createTest = useCallback(async (params: Partial<PromptTest> & { name: string; promptText: string }) => {
    try {
      const res = await apiFetch('/api/prompt-tests', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed to create test'); return null; }
      setTests(prev => [data, ...prev]);
      toast.success('Test created');
      return data;
    } catch { toast.error('Failed to create test'); return null; }
  }, []);

  const runTest = useCallback(async (id: number): Promise<TestRunResult | null> => {
    setRunningIds(prev => new Set(prev).add(id));
    try {
      const res = await apiFetch(`/api/prompt-tests/${id}/run`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Test failed'); return null; }
      if (data.isRegression) toast.warning('REGRESSION detected! Previously passing test now fails.');
      else if (data.passed) toast.success('Test passed');
      else toast.error('Test failed');
      setTests(prev => prev.map(t => t.id === id ? { ...t, last_status: data.isRegression ? 'regression' : (data.passed ? 'pass' : 'fail'), last_run_at: new Date().toISOString() } : t));
      return data;
    } catch (err: any) { toast.error('Run error: ' + err.message); return null; }
    finally { setRunningIds(prev => { const s = new Set(prev); s.delete(id); return s; }); }
  }, []);

  const deleteTest = useCallback(async (id: number) => {
    try {
      await apiFetch(`/api/prompt-tests/${id}`, { method: 'DELETE' });
      setTests(prev => prev.filter(t => t.id !== id));
    } catch { toast.error('Failed to delete test'); }
  }, []);

  return { tests, isLoading, runningIds, fetchTests, createTest, runTest, deleteTest };
}