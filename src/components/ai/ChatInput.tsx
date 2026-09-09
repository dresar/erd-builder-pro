import { memo, useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Sparkles,
  Send,
  StopCircle,
  SquareTerminal,
  CircleHelp,
  Database,
  Lightbulb,
  StickyNote,
  LayoutPanelLeft,
  Wand2,
  FileText,
  Code,
  GitBranch,
  FileDown,
  File,
  AtSign,
  ChevronDown,
  SlidersHorizontal,
  Zap,
  FileSearch,
  AlertTriangle,
  Check,
  X,
} from 'lucide-react';
import { AIAction, ViewType } from '@/components/ai/AIActions';
import { Button } from '@/components/ui/button';

interface MentionFile {
  name: string;
  type: 'note' | 'diagram' | 'flowchart' | 'drawing';
  uid: string;
}

function getActionIcon(actionId: string) {
  switch (actionId) {
    case 'notes-summarize':
      return <StickyNote className="size-3.5 text-blue-500" />;
    case 'notes-improve-grammar':
      return <Lightbulb className="size-3.5 text-amber-500" />;
    case 'notes-generate-docs':
      return <LayoutPanelLeft className="size-3.5 text-indigo-500" />;
    case 'erd-generate-sql':
      return <Database className="size-3.5 text-emerald-500" />;
    case 'erd-edit-column':
      return <SquareTerminal className="size-3.5 text-emerald-600" />;
    case 'erd-explain-table':
      return <CircleHelp className="size-3.5 text-cyan-500" />;
    case 'erd-suggest-indexes':
      return <Zap className="size-3.5 text-yellow-500" />;
    case 'flowchart-generate':
      return <Wand2 className="size-3.5 text-violet-500" />;
    case 'flowchart-explain':
      return <FileText className="size-3.5 text-purple-500" />;
    case 'flowchart-pseudocode':
      return <Code className="size-3.5 text-fuchsia-500" />;
    case 'flowchart-insert':
      return <GitBranch className="size-3.5 text-pink-500" />;
    case 'flowchart-import':
      return <FileDown className="size-3.5 text-violet-600" />;
    case 'db-client-explain-table':
      return <CircleHelp className="size-3.5 text-sky-500" />;
    case 'db-client-analyze-query':
      return <FileSearch className="size-3.5 text-orange-500" />;
    case 'db-client-generate-query':
      return <Code className="size-3.5 text-teal-500" />;
    case 'db-client-suggest-indexes':
      return <Zap className="size-3.5 text-amber-500" />;
    case 'db-client-schema-issues':
      return <AlertTriangle className="size-3.5 text-rose-500" />;
    case 'grill-me':
      return <Sparkles className="size-3.5 text-amber-500" />;
    default:
      return <Sparkles className="size-3.5 text-primary" />;
  }
}

function getPlaceholder(actionId: string | null | undefined, hasProject: boolean): string {
  switch (actionId) {
    case 'notes-summarize':       return 'Ringkas catatan...';
    case 'notes-improve-grammar': return 'Perbaiki tata bahasa...';
    case 'notes-generate-docs':   return 'Buat format dokumentasi teknis...';
    case 'erd-generate-sql':      return 'Deskripsikan tabel/skema ERD yang ingin dibuat...';
    case 'erd-edit-column':       return 'Tentukan kolom yang ingin ditambah atau diubah...';
    case 'erd-explain-table':     return 'Tanyakan penjelasan tabel atau relasi...';
    case 'erd-suggest-indexes':   return 'Minta rekomendasi index tabel...';
    case 'erd-seed-data':         return 'Minta contoh data dummy...';
    case 'flowchart-generate':    return 'Deskripsikan alur flowchart yang ingin dibuat...';
    case 'flowchart-explain':     return 'Minta penjelasan langkah-langkah alur flowchart...';
    case 'flowchart-pseudocode':  return 'Minta pseudocode dari flowchart ini...';
    case 'flowchart-insert':      return 'Tentukan simbol baru yang ingin disisipkan...';
    case 'flowchart-import':      return 'Masukkan proses alur untuk diubah ke diagram...';
    case 'db-client-explain-table': return 'Jelaskan struktur tabel live ini...';
    case 'db-client-analyze-query': return 'Analisis performa & validitas kueri SQL ini...';
    case 'db-client-generate-query': return 'Deskripsikan kueri SQL yang ingin dibuat...';
    case 'db-client-suggest-indexes': return 'Minta rekomendasi index untuk kueri SQL ini...';
    case 'db-client-schema-issues': return 'Analisis risiko dan inkonsistensi skema DB...';
    case 'grill-me':               return 'Jelaskan apa yang ingin Anda rencanakan...';
    default:                      return hasProject ? 'Tanya apa saja... Ketik @ untuk menyebut file' : 'Tanya apa saja ke AI...';
  }
}

const MENTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  note: FileText,
  diagram: Database,
  flowchart: GitBranch,
  drawing: File,
};

export interface ChatInputProps {
  hasActiveSession: boolean;
  isStreaming: boolean;
  entityType?: string | null;
  viewType?: ViewType | null;
  actions: AIAction[];
  activeActionId?: string | null;
  inputRef: React.RefObject<HTMLTextAreaElement | null>;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onSelectAction: (action: AIAction) => void;
  onClearAction: () => void;
  onAbort: () => void;
  hasProject?: boolean;
  mentionFiles?: MentionFile[];
}

export const ChatInput = memo(function ChatInput({
  hasActiveSession,
  isStreaming,
  entityType,
  viewType,
  actions,
  activeActionId,
  inputRef,
  onSend,
  onKeyDown,
  onSelectAction,
  onClearAction,
  onAbort,
  hasProject = false,
  mentionFiles = [],
}: ChatInputProps) {
  // ── Hooks must be before any early return (Rules of Hooks) ──
  const [mentionOpen, setMentionOpen] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionIndex, setMentionIndex] = useState(0);
  const [mentionStart, setMentionStart] = useState(-1);
  const [toolsOpen, setToolsOpen] = useState(false);
  const mentionRef = useRef<HTMLDivElement>(null);
  const mentionTriggerRef = useRef<HTMLButtonElement>(null);
  const toolsRef = useRef<HTMLDetailsElement>(null);
  const [, forceUpdate] = useState(0);

  const filtered = useMemo(() => {
    if (!mentionQuery.trim()) return mentionFiles;
    const q = mentionQuery.toLowerCase();
    return mentionFiles.filter(f => f.name.toLowerCase().includes(q));
  }, [mentionFiles, mentionQuery]);

  useEffect(() => {
    setMentionIndex(0);
  }, [mentionQuery]);

  const handleInput = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const pos = textarea.selectionStart;
    const text = textarea.value;

    let atPos = -1;
    for (let i = pos - 1; i >= 0; i--) {
      const ch = text[i];
      if (ch === '@') { atPos = i; break; }
      if (ch === ' ' || ch === '\n') break;
    }

    if (atPos >= 0) {
      const query = text.slice(atPos + 1, pos);
      setMentionQuery(query);
      setMentionStart(atPos);
      setMentionOpen(true);
    } else {
      setMentionOpen(false);
    }
  }, []);

  const insertMention = useCallback((file: MentionFile) => {
    const ta = inputRef.current;
    if (!ta) return;
    const start = mentionStart;
    if (start < 0) return;
    const end = ta.selectionStart;
    const before = ta.value.slice(0, start);
    const after = ta.value.slice(end);
    const mention = `[@${file.name}] `;
    ta.value = before + mention + after;
    const newPos = start + mention.length;
    ta.setSelectionRange(newPos, newPos);
    ta.focus();
    setMentionOpen(false);
    forceUpdate(n => n + 1);
  }, [mentionStart, inputRef, forceUpdate]);

  const openMentionPicker = useCallback(() => {
    if (mentionOpen) {
      setMentionOpen(false);
      return;
    }
    const ta = inputRef.current;
    if (!ta) return;
    setMentionStart(ta.selectionStart);
    setMentionQuery('');
    setMentionOpen(true);
    ta.focus();
  }, [inputRef, mentionOpen]);

  const handleMentionKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (mentionOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionIndex(i => Math.min(i + 1, filtered.length - 1));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionIndex(i => Math.max(i - 1, 0));
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        if (filtered[mentionIndex]) {
          e.preventDefault();
          insertMention(filtered[mentionIndex]);
          return;
        }
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setMentionOpen(false);
        return;
      }
    }
    onKeyDown(e);
  }, [mentionOpen, filtered, mentionIndex, insertMention, onKeyDown]);

  useEffect(() => {
    if (!mentionOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!mentionRef.current?.contains(target) && !mentionTriggerRef.current?.contains(target)) {
        setMentionOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown, true);
    return () => document.removeEventListener('pointerdown', handlePointerDown, true);
  }, [mentionOpen]);

  useEffect(() => {
    if (!toolsOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) setToolsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [toolsOpen]);

  const planAction = actions.find(action => action.id === 'grill-me');
  const erdAction = actions.find(action => action.id === 'erd-generate-sql');
  const flowchartAction = actions.find(action => action.id === 'flowchart-generate');
  const notesAction = actions.find(action => action.id === 'notes-summarize');

  // Categorize all tools for the comprehensive dropdown
  const categories = useMemo(() => {
    const list = [
      {
        id: 'plan',
        title: 'Perencanaan',
        icon: Sparkles,
        actions: actions.filter(a => a.id === 'grill-me'),
      },
      {
        id: 'erd',
        title: 'ERD & Database',
        icon: Database,
        actions: actions.filter(a => a.id.startsWith('erd-')),
      },
      {
        id: 'flowchart',
        title: 'Flowchart & Alur',
        icon: Wand2,
        actions: actions.filter(a => a.id.startsWith('flowchart-')),
      },
      {
        id: 'notes',
        title: 'Catatan & Dokumen',
        icon: StickyNote,
        actions: actions.filter(a => a.id.startsWith('notes-')),
      },
      {
        id: 'db-client',
        title: 'Database Client',
        icon: SquareTerminal,
        actions: actions.filter(a => a.id.startsWith('db-client-')),
      },
    ];
    return list.filter(cat => cat.actions.length > 0);
  }, [actions]);

  const activeAction = actions.find(action => action.id === activeActionId);
  const showActions = !isStreaming && actions.length > 0;

  return (
    <div className="shrink-0 border-t bg-background p-3">
      <div className="relative rounded-2xl border border-input bg-card p-2 shadow-sm transition-shadow focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
        <textarea
          ref={inputRef}
          defaultValue=""
          onInput={handleInput}
          onKeyDown={handleMentionKeyDown}
          placeholder={isStreaming ? 'AI is responding...' : getPlaceholder(activeActionId, hasProject)}
          className="block w-full min-h-18 max-h-44 resize-none bg-transparent px-2 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
          rows={3}
          disabled={isStreaming}
        />

        {/* Mention dropdown */}
        {mentionOpen && filtered.length > 0 && (
          <div
            ref={mentionRef}
            className="absolute z-100 w-60 rounded-lg border border-border bg-popover shadow-xl overflow-hidden"
            style={{
              bottom: '48px',
              left: '8px',
            }}
          >
            <div className="max-h-45 overflow-y-auto py-1">
              {filtered.map((file, idx) => {
                const Icon = MENTION_ICONS[file.type] || FileText;
                const isActive = idx === mentionIndex;
                return (
                  <button
                    key={`${file.type}-${file.uid}`}
                    onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); insertMention(file); }}
                    onMouseEnter={() => setMentionIndex(idx)}
                    className={`flex items-center gap-2 w-full px-3 py-1.5 text-xs text-left transition-colors ${
                      isActive ? 'bg-accent text-accent-foreground' : 'text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Icon className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="flex-1 truncate">{file.name}</span>
                    <span className="text-[9px] uppercase text-muted-foreground/50 font-medium shrink-0">{file.type}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
          {mentionFiles.length > 0 && (
            <Button
              ref={mentionTriggerRef}
              variant="outline"
              size="icon-xs"
              className="h-7.5 w-7.5 rounded-md border-border/70 text-muted-foreground hover:text-foreground"
              onClick={openMentionPicker}
              title="Sebut file (@)"
            >
              <AtSign className="size-3.5" />
            </Button>
          )}

          {planAction && (
            <Button
              variant={activeActionId === planAction.id ? 'default' : 'outline'}
              size="sm"
              className={`h-7.5 rounded-md px-2.5 text-xs font-medium transition-all ${
                activeActionId === planAction.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border-border/70 bg-background/50 hover:bg-muted text-foreground'
              }`}
              onClick={() => onSelectAction(planAction)}
              title="Mode rencana & wawancara"
            >
              <Sparkles className="size-3.5 mr-1 text-amber-500" />
              Rencana
            </Button>
          )}

          {erdAction && (
            <Button
              variant={activeActionId === erdAction.id ? 'default' : 'outline'}
              size="sm"
              className={`h-7.5 rounded-md px-2.5 text-xs font-medium transition-all ${
                activeActionId === erdAction.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border-border/70 bg-background/50 hover:bg-muted text-foreground'
              }`}
              onClick={() => onSelectAction(erdAction)}
              title="Buat skema ERD / DBML"
            >
              <Database className="size-3.5 mr-1 text-emerald-500" />
              ERD
            </Button>
          )}

          {flowchartAction && (
            <Button
              variant={activeActionId === flowchartAction.id ? 'default' : 'outline'}
              size="sm"
              className={`h-7.5 rounded-md px-2.5 text-xs font-medium transition-all ${
                activeActionId === flowchartAction.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border-border/70 bg-background/50 hover:bg-muted text-foreground'
              }`}
              onClick={() => onSelectAction(flowchartAction)}
              title="Buat alur flowchart"
            >
              <Wand2 className="size-3.5 mr-1 text-violet-500" />
              Flowchart
            </Button>
          )}

          {notesAction && (
            <Button
              variant={activeActionId === notesAction.id ? 'default' : 'outline'}
              size="sm"
              className={`h-7.5 rounded-md px-2.5 text-xs font-medium transition-all ${
                activeActionId === notesAction.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'border-border/70 bg-background/50 hover:bg-muted text-foreground'
              }`}
              onClick={() => onSelectAction(notesAction)}
              title="Ringkas catatan"
            >
              <StickyNote className="size-3.5 mr-1 text-blue-500" />
              Catatan
            </Button>
          )}

          {showActions && (
            <details
              ref={toolsRef}
              open={toolsOpen}
              onToggle={(event) => setToolsOpen(event.currentTarget.open)}
              className="group relative"
            >
              <summary
                className={`inline-flex list-none items-center gap-1.5 h-7.5 rounded-md border px-2.5 text-xs font-medium cursor-pointer transition-all [&::-webkit-details-marker]:hidden ${
                  activeAction && activeAction.id !== 'grill-me' && activeAction.id !== 'erd-generate-sql' && activeAction.id !== 'flowchart-generate' && activeAction.id !== 'notes-summarize'
                    ? 'border-primary/50 bg-primary/10 text-primary font-semibold'
                    : 'border-border/70 bg-background/50 text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                <span className="max-w-32 truncate">
                  {activeAction && activeAction.id !== 'grill-me' && activeAction.id !== 'erd-generate-sql' && activeAction.id !== 'flowchart-generate' && activeAction.id !== 'notes-summarize'
                    ? activeAction.label
                    : `Semua Alat (${actions.length})`}
                </span>
                <ChevronDown className="size-3 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>

              <div className="absolute bottom-9 left-0 z-50 w-72 sm:w-80 max-h-96 overflow-y-auto rounded-xl border border-border bg-popover p-2 shadow-2xl space-y-2">
                <div className="flex items-center justify-between px-2 py-1 border-b border-border/50">
                  <div className="flex items-center gap-1.5">
                    <SlidersHorizontal className="size-3.5 text-primary" />
                    <span className="text-xs font-semibold text-foreground">Koleksi Alat AI ({actions.length})</span>
                  </div>
                  {activeAction && (
                    <button
                      onClick={() => {
                        onClearAction();
                        setToolsOpen(false);
                      }}
                      className="text-[10px] font-medium text-destructive hover:underline flex items-center gap-1"
                    >
                      <X className="size-3" />
                      Reset
                    </button>
                  )}
                </div>

                {/* Option to clear active tool */}
                <button
                  onClick={() => {
                    onClearAction();
                    setToolsOpen(false);
                  }}
                  className={`flex w-full items-start gap-2 rounded-lg px-2.5 py-1.5 text-left cursor-pointer transition-colors hover:bg-accent ${
                    !activeAction ? 'bg-accent/80 font-medium' : ''
                  }`}
                >
                  <SlidersHorizontal className="mt-0.5 size-3.5 text-muted-foreground" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-medium text-foreground">Percakapan Bebas (Tanpa Alat)</span>
                    <span className="block text-[10px] text-muted-foreground">Tanya jawab umum dengan konteks penuh</span>
                  </span>
                  {!activeAction && <Check className="size-3.5 text-primary shrink-0 mt-0.5" />}
                </button>

                {/* Categorized Tool Sections */}
                {categories.map((category) => {
                  const CatIcon = category.icon;
                  return (
                    <div key={category.id} className="pt-1">
                      <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 bg-muted/40 rounded-md mb-1">
                        <CatIcon className="size-3 text-muted-foreground" />
                        <span>{category.title}</span>
                      </div>
                      <div className="space-y-0.5">
                        {category.actions.map((action) => {
                          const isSelected = activeActionId === action.id;
                          return (
                            <button
                              key={action.id}
                              onClick={() => {
                                onSelectAction(action);
                                setToolsOpen(false);
                              }}
                              className={`flex w-full items-start gap-2.5 rounded-lg px-2.5 py-1.5 text-left cursor-pointer transition-colors hover:bg-accent ${
                                isSelected ? 'bg-primary/10 text-primary border border-primary/20' : ''
                              }`}
                            >
                              <span className="mt-0.5 shrink-0">{getActionIcon(action.id)}</span>
                              <span className="min-w-0 flex-1">
                                <span className={`block text-xs font-medium ${isSelected ? 'text-primary font-semibold' : 'text-foreground'}`}>
                                  {action.label}
                                </span>
                                <span className="block text-[10px] leading-relaxed text-muted-foreground line-clamp-1">
                                  {action.description}
                                </span>
                              </span>
                              {isSelected && <Check className="size-3.5 text-primary shrink-0 mt-0.5" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          )}

          {/* Active Tool Badge if a tool outside quick pills is active */}
          {activeAction && activeAction.id !== 'grill-me' && activeAction.id !== 'erd-generate-sql' && activeAction.id !== 'flowchart-generate' && activeAction.id !== 'notes-summarize' && (
            <div className="inline-flex items-center gap-1 h-7.5 rounded-md border border-primary/30 bg-primary/10 px-2 text-xs font-medium text-primary">
              <span>{getActionIcon(activeAction.id)}</span>
              <span className="max-w-28 truncate">{activeAction.label}</span>
              <button
                onClick={onClearAction}
                className="ml-0.5 rounded hover:bg-primary/20 p-0.5 cursor-pointer"
                title="Hapus mode alat"
              >
                <X className="size-3" />
              </button>
            </div>
          )}

          <span className="ml-auto text-[10px] text-muted-foreground/60 hidden sm:inline">
            {isStreaming ? 'Menulis...' : 'Enter untuk kirim'}
          </span>
          <Button
            variant={isStreaming ? 'outline' : 'default'}
            size="icon"
            className="size-7.5 rounded-md shrink-0 ml-auto sm:ml-0"
            onClick={isStreaming ? onAbort : onSend}
            title={isStreaming ? 'Hentikan' : 'Kirim'}
          >
            {isStreaming ? <StopCircle className="size-3.5 text-destructive" /> : <Send className="size-3.5" />}
          </Button>
        </div>
      </div>
    </div>
  );
});
