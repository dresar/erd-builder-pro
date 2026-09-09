import { useState, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { toast } from 'sonner';

export interface KnowledgeEntry {
  id: number; uid: string; category: string; title: string; content: string;
  is_pinned: number; created_at: string; updated_at: string;
}

export const KNOWLEDGE_CATEGORIES = ['general','requirements','architecture','database','api','security','design','business_rules','decisions'];

export function useKnowledgeBase() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchEntries = useCallback(async (params?: { projectId?: number; category?: string; q?: string }) => {
    setIsLoading(true);
    try {
      const sp = new URLSearchParams();
      if (params?.projectId) sp.set('project_id', String(params.projectId));
      if (params?.category) sp.set('category', params.category);
      if (params?.q) sp.set('q', params.q);
      const res = await apiFetch('/api/knowledge' + (sp.toString() ? '?' + sp.toString() : ''));
      if (res.ok) setEntries(await res.json());
    } catch { } finally { setIsLoading(false); }
  }, []);

  const createEntry = useCallback(async (params: { title: string; content?: string; category?: string; projectId?: number; isPinned?: boolean }) => {
    setIsSaving(true);
    try {
      const res = await apiFetch('/api/knowledge', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'Failed'); return null; }
      setEntries(prev => [data, ...prev]);
      toast.success('Entry added');
      return data;
    } catch { toast.error('Failed to add entry'); return null; }
    finally { setIsSaving(false); }
  }, []);

  const updateEntry = useCallback(async (id: number, params: Partial<KnowledgeEntry>) => {
    try {
      await apiFetch(`/api/knowledge/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      setEntries(prev => prev.map(e => e.id === id ? { ...e, ...params } : e));
    } catch { toast.error('Failed to update entry'); }
  }, []);

  const deleteEntry = useCallback(async (id: number) => {
    try {
      await apiFetch(`/api/knowledge/${id}`, { method: 'DELETE' });
      setEntries(prev => prev.filter(e => e.id !== id));
    } catch { toast.error('Failed to delete entry'); }
  }, []);

  const togglePin = useCallback(async (id: number, isPinned: boolean) => {
    try {
      await apiFetch(`/api/knowledge/${id}/pin`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned }),
      });
      setEntries(prev => prev.map(e => e.id === id ? { ...e, is_pinned: isPinned ? 1 : 0 } : e));
    } catch { toast.error('Failed to update pin'); }
  }, []);

  return { entries, isLoading, isSaving, fetchEntries, createEntry, updateEntry, deleteEntry, togglePin };
}