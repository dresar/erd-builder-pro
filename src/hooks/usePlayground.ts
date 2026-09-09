import { useState, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export interface PlaygroundResult {
  output: string;
  model: string;
  provider?: string;
  latencyMs: number;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  finishReason: string;
  providerCode?: string;
  error?: string;
}

export interface PlaygroundSession {
  id: number;
  uid: string;
  name: string;
  models_json: string;
  temperature: number;
  max_tokens: number;
  response_format: string;
  created_at: string;
  updated_at: string;
}

export function usePlayground() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<PlaygroundResult[]>([]);
  const [sessions, setSessions] = useState<PlaygroundSession[]>([]);
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);

  const run = useCallback(async (params: {
    systemPrompt?: string;
    userPrompt: string;
    providerCode?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    responseFormat?: string;
  }): Promise<PlaygroundResult | null> => {
    setIsRunning(true);
    try {
      const res = await apiFetch('/api/playground/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: params.systemPrompt,
          userPrompt: params.userPrompt,
          providerCode: params.providerCode,
          model: params.model,
          temperature: params.temperature,
          maxTokens: params.maxTokens,
          responseFormat: params.responseFormat,
        }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Run failed'); return null; }
      const result: PlaygroundResult = { ...data, providerCode: params.providerCode };
      setResults(prev => [result, ...prev.slice(0, 19)]);
      return result;
    } catch (err: any) {
      toast.error('Network error: ' + err.message);
      return null;
    } finally {
      setIsRunning(false);
    }
  }, []);

  const runMultiple = useCallback(async (params: {
    systemPrompt?: string;
    userPrompt: string;
    providerCodes: string[];
    temperature?: number;
    maxTokens?: number;
  }): Promise<PlaygroundResult[]> => {
    setIsRunning(true);
    const multiResults: PlaygroundResult[] = [];
    try {
      for (const providerCode of params.providerCodes) {
        try {
          const res = await apiFetch('/api/playground/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...params, providerCode }),
          });
          const data = await res.json();
          if (res.ok) {
            multiResults.push({ ...data, providerCode });
          } else {
            multiResults.push({ output: '', model: '', provider: providerCode, providerCode, latencyMs: 0, promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCostUsd: 0, finishReason: 'error', error: data.error || 'Failed' });
          }
        } catch (err: any) {
          multiResults.push({ output: '', model: '', provider: providerCode, providerCode, latencyMs: 0, promptTokens: 0, completionTokens: 0, totalTokens: 0, estimatedCostUsd: 0, finishReason: 'error', error: err.message });
        }
      }
      setResults(prev => [...multiResults, ...prev.slice(0, 19 - multiResults.length)]);
      return multiResults;
    } finally {
      setIsRunning(false);
    }
  }, []);

  const saveSession = useCallback(async (params: {
    name?: string;
    systemPrompt?: string;
    userPrompt: string;
    modelsJson?: string[];
    temperature?: number;
    maxTokens?: number;
    responseFormat?: string;
    resultsJson?: PlaygroundResult[];
    projectId?: number;
  }) => {
    setIsSavingSession(true);
    try {
      const res = await apiFetch('/api/playground/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (!res.ok) { toast.error('Failed to save session'); return null; }
      const data = await res.json();
      toast.success('Session saved');
      return data;
    } catch {
      toast.error('Failed to save session');
      return null;
    } finally {
      setIsSavingSession(false);
    }
  }, []);

  const fetchSessions = useCallback(async (projectId?: number) => {
    setIsLoadingSessions(true);
    try {
      const url = projectId ? `/api/playground/sessions?project_id=${projectId}` : '/api/playground/sessions';
      const res = await apiFetch(url);
      if (!res.ok) return;
      const data = await res.json();
      setSessions(data);
    } catch { /* ignore */ } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  const deleteSession = useCallback(async (uid: string) => {
    try {
      await apiFetch(`/api/playground/sessions/${uid}`, { method: 'DELETE' });
      setSessions(prev => prev.filter(s => s.uid !== uid));
    } catch { toast.error('Failed to delete session'); }
  }, []);

  const clearResults = useCallback(() => setResults([]), []);

  return { isRunning, results, sessions, isSavingSession, isLoadingSessions, run, runMultiple, saveSession, fetchSessions, deleteSession, clearResults };
}