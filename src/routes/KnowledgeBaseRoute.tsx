import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Pin, Search, BookOpen, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useKnowledgeBase, KNOWLEDGE_CATEGORIES, type KnowledgeEntry } from '@/hooks/useKnowledgeBase';
import { useWorkspace } from '@/providers/WorkspaceProvider';
import { useParams } from 'react-router-dom';

function EntryCard({ entry, onEdit, onDelete, onTogglePin }: { entry: KnowledgeEntry; onEdit: (e: KnowledgeEntry) => void; onDelete: (id: number) => void; onTogglePin: (id: number, pin: boolean) => void }) {
  return (
    <div className={`rounded-lg border p-4 space-y-2 bg-card ${entry.is_pinned ? 'border-primary/40' : 'border-border'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">{entry.category}</Badge>
          {entry.is_pinned === 1 && <Badge className="text-xs bg-primary/10 text-primary border-primary/30">Pinned</Badge>}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => onTogglePin(entry.id, entry.is_pinned !== 1)} className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground">
            <Pin className={`w-3 h-3 ${entry.is_pinned ? 'fill-current text-primary' : ''}`} />
          </button>
          <button onClick={() => onEdit(entry)} className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground"><Edit2 className="w-3 h-3" /></button>
          <button onClick={() => onDelete(entry.id)} className="p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
        </div>
      </div>
      <h3 className="text-sm font-medium">{entry.title}</h3>
      {entry.content && <p className="text-xs text-muted-foreground line-clamp-3 whitespace-pre-wrap">{entry.content}</p>}
      <p className="text-xs text-muted-foreground/60">{new Date(entry.created_at).toLocaleDateString()}</p>
    </div>
  );
}

function EditModal({ entry, onSave, onClose }: { entry: Partial<KnowledgeEntry>; onSave: (e: Partial<KnowledgeEntry>) => void; onClose: () => void }) {
  const [form, setForm] = useState({ title: entry.title || '', content: entry.content || '', category: entry.category || 'general', isPinned: entry.is_pinned === 1 });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-popover border rounded-xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{entry.id ? 'Edit Entry' : 'New Entry'}</h2>
          <button onClick={onClose}><X className="w-4 h-4" /></button>
        </div>
        <div className="space-y-3">
          <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Title" className="w-full text-sm rounded-md border bg-muted/20 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary" />
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="w-full text-sm rounded-md border bg-background px-3 py-1.5">
            {KNOWLEDGE_CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g,' ')}</option>)}
          </select>
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            placeholder="Content..." rows={6}
            className="w-full text-sm rounded-md border bg-muted/20 px-3 py-2 font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={form.isPinned} onChange={e => setForm(f => ({ ...f, isPinned: e.target.checked }))} className="accent-primary" />
            Pin this entry
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button size="sm" onClick={() => onSave({ ...entry, ...form })} disabled={!form.title.trim()}>
            <Check className="w-3 h-3 mr-1" />Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export function KnowledgeBaseRoute() {
  const { projectSlug } = useParams<{ projectSlug?: string }>();
  const { projects = [] } = useWorkspace();
  const { entries, isLoading, isSaving, fetchEntries, createEntry, updateEntry, deleteEntry, togglePin } = useKnowledgeBase();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [editEntry, setEditEntry] = useState<Partial<KnowledgeEntry> | null>(null);

  const currentProject = projects.find(p => String(p.slug) === projectSlug || String(p.uid) === projectSlug);

  useEffect(() => {
    fetchEntries({ projectId: currentProject?.id, q: q || undefined, category: category || undefined });
  }, [currentProject?.id, q, category]);

  const handleSave = async (form: Partial<KnowledgeEntry> & { title?: string; content?: string; category?: string; isPinned?: boolean }) => {
    if (editEntry?.id) {
      await updateEntry(editEntry.id, { title: form.title!, content: form.content, category: form.category, is_pinned: (form as any).isPinned ? 1 : 0 });
    } else {
      await createEntry({ title: form.title!, content: form.content, category: form.category, projectId: currentProject?.id, isPinned: (form as any).isPinned });
    }
    setEditEntry(null);
    fetchEntries({ projectId: currentProject?.id });
  };

  const filteredEntries = entries.filter(e => {
    if (q && !e.title.toLowerCase().includes(q.toLowerCase()) && !e.content.toLowerCase().includes(q.toLowerCase())) return false;
    if (category && e.category !== category) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      {editEntry !== null && <EditModal entry={editEntry} onSave={handleSave} onClose={() => setEditEntry(null)} />}
      <div className="border-b px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-base font-semibold flex items-center gap-2"><BookOpen className="w-4 h-4" />Knowledge Base</h1>
          <p className="text-xs text-muted-foreground">{currentProject ? currentProject.name : 'Global'} — {entries.length} entries</p>
        </div>
        <Button size="sm" onClick={() => setEditEntry({})} className="gap-1 text-xs h-7"><Plus className="w-3 h-3" />Add Entry</Button>
      </div>

      <div className="border-b px-6 py-2 flex items-center gap-3 flex-shrink-0">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search..."
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-md border bg-muted/20 focus:outline-none focus:ring-1 focus:ring-primary" />
        </div>
        <select value={category} onChange={e => setCategory(e.target.value)}
          className="text-xs rounded-md border bg-background px-2 py-1.5">
          <option value="">All categories</option>
          {KNOWLEDGE_CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g,' ')}</option>)}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && filteredEntries.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
            <BookOpen className="w-8 h-8 mb-2 opacity-30" />
            <p className="text-sm">No entries yet. Add knowledge entries to reuse context across prompts.</p>
            <Button size="sm" variant="outline" className="mt-3 text-xs" onClick={() => setEditEntry({})}>Add First Entry</Button>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredEntries.map(e => (
            <EntryCard key={e.id} entry={e} onEdit={setEditEntry} onDelete={id => { deleteEntry(id); }}
              onTogglePin={(id, pin) => togglePin(id, pin)} />
          ))}
        </div>
      </div>
    </div>
  );
}