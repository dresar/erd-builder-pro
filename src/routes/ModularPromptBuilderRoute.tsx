import { useState, useCallback, useEffect } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Copy, Eye, EyeOff, Lock, Unlock, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const BLOCK_TYPES = [
  'ROLE','CONTEXT','OBJECTIVE','REQUIREMENTS','BUSINESS_RULES','TECH_STACK',
  'DATABASE','API','UI_UX','SECURITY','CONSTRAINTS','TOOLS','WORKFLOW',
  'OUTPUT_FORMAT','VALIDATION','EXAMPLES','FAILURE_HANDLING',
];

const BLOCK_COLORS: Record<string, string> = {
  ROLE: 'bg-purple-500/10 border-purple-500/30', CONTEXT: 'bg-blue-500/10 border-blue-500/30',
  OBJECTIVE: 'bg-green-500/10 border-green-500/30', REQUIREMENTS: 'bg-orange-500/10 border-orange-500/30',
  BUSINESS_RULES: 'bg-red-500/10 border-red-500/30', TECH_STACK: 'bg-cyan-500/10 border-cyan-500/30',
  DATABASE: 'bg-yellow-500/10 border-yellow-500/30', API: 'bg-pink-500/10 border-pink-500/30',
  UI_UX: 'bg-indigo-500/10 border-indigo-500/30', SECURITY: 'bg-rose-500/10 border-rose-500/30',
  CONSTRAINTS: 'bg-amber-500/10 border-amber-500/30', TOOLS: 'bg-teal-500/10 border-teal-500/30',
  WORKFLOW: 'bg-lime-500/10 border-lime-500/30', OUTPUT_FORMAT: 'bg-sky-500/10 border-sky-500/30',
  VALIDATION: 'bg-violet-500/10 border-violet-500/30', EXAMPLES: 'bg-emerald-500/10 border-emerald-500/30',
  FAILURE_HANDLING: 'bg-slate-500/10 border-slate-500/30',
};

interface Block { id: string; type: string; label: string; content: string; isEnabled: boolean; isLocked: boolean; }
interface Variable { id: string; key: string; type: string; defaultValue: string; description: string; isRequired: boolean; value: string; }

function interpolate(text: string, vars: Variable[]): string {
  return vars.reduce((t, v) => t.replace(new RegExp('\\{\\{' + v.key + '\\}\\}', 'g'), v.value || v.defaultValue || '{{' + v.key + '}}'), text);
}

function compilePrompt(blocks: Block[], vars: Variable[]): string {
  return blocks.filter(b => b.isEnabled).map(b => {
    const sep = `## ${b.label || b.type.replace(/_/g, ' ')}\n`;
    return sep + interpolate(b.content, vars);
  }).join('\n\n');
}

let nextId = 1;
function uid() { return 'b' + (nextId++); }

export function ModularPromptBuilderRoute() {
  const [blocks, setBlocks] = useState<Block[]>([{ id: uid(), type: 'ROLE', label: 'Role', content: 'You are a {{role}} assistant.', isEnabled: true, isLocked: false }]);
  const [variables, setVariables] = useState<Variable[]>([{ id: 'v1', key: 'role', type: 'string', defaultValue: 'helpful', description: 'AI persona role', isRequired: true, value: '' }]);
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newVarKey, setNewVarKey] = useState('');

  const addBlock = (type: string) => {
    setBlocks(prev => [...prev, { id: uid(), type, label: type.replace(/_/g, ' '), content: '', isEnabled: true, isLocked: false }]);
  };

  const removeBlock = (id: string) => setBlocks(prev => prev.filter(b => b.id !== id));
  const moveUp = (id: string) => setBlocks(prev => { const i = prev.findIndex(b => b.id === id); if (i <= 0) return prev; const a = [...prev]; [a[i-1], a[i]] = [a[i], a[i-1]]; return a; });
  const moveDown = (id: string) => setBlocks(prev => { const i = prev.findIndex(b => b.id === id); if (i >= prev.length-1) return prev; const a = [...prev]; [a[i], a[i+1]] = [a[i+1], a[i]]; return a; });
  const updateBlock = (id: string, field: keyof Block, val: any) => setBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: val } : b));
  const duplicateBlock = (id: string) => setBlocks(prev => { const b = prev.find(b => b.id === id); if (!b) return prev; const nb = { ...b, id: uid() }; const i = prev.indexOf(b); return [...prev.slice(0, i+1), nb, ...prev.slice(i+1)]; });

  const compiled = compilePrompt(blocks, variables);
  const copyPrompt = () => { navigator.clipboard.writeText(compiled); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const addVariable = () => {
    if (!newVarKey.trim()) return;
    setVariables(prev => [...prev, { id: 'v' + Date.now(), key: newVarKey.trim(), type: 'string', defaultValue: '', description: '', isRequired: false, value: '' }]);
    setNewVarKey('');
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="border-b px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-base font-semibold">Modular Prompt Builder</h1>
          <p className="text-xs text-muted-foreground">Build prompts from reusable blocks with variables</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowPreview(!showPreview)} className="gap-1 text-xs h-7">
            {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}{showPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button size="sm" variant="outline" onClick={copyPrompt} className="gap-1 text-xs h-7">
            <Copy className="w-3 h-3" />{copied ? 'Copied!' : 'Copy Prompt'}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-52 border-r overflow-y-auto p-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Add Block</p>
          <div className="space-y-1">
            {BLOCK_TYPES.map(t => (
              <button key={t} onClick={() => addBlock(t)}
                className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-muted/50 flex items-center gap-2">
                <Plus className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span>{t.replace(/_/g, ' ')}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Variables</p>
            {variables.map(v => (
              <div key={v.id} className="space-y-1 p-2 rounded border bg-muted/20">
                <div className="flex items-center justify-between">
                  <code className="text-xs font-mono text-primary">{"{{"}{v.key}{"}}"}</code>
                  <button onClick={() => setVariables(prev => prev.filter(x => x.id !== v.id))} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
                </div>
                <input value={v.value} onChange={e => setVariables(prev => prev.map(x => x.id === v.id ? { ...x, value: e.target.value } : x))}
                  placeholder={v.defaultValue || 'value'} className="w-full text-xs rounded border px-2 py-1 bg-background" />
              </div>
            ))}
            <div className="flex gap-1">
              <input value={newVarKey} onChange={e => setNewVarKey(e.target.value)} onKeyDown={e => e.key === 'Enter' && addVariable()}
                placeholder="var_name" className="flex-1 text-xs rounded border px-2 py-1 bg-background font-mono" />
              <Button size="sm" variant="outline" onClick={addVariable} className="h-6 px-2 text-xs">Add</Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {showPreview ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Compiled Prompt ({compiled.length} chars)</p>
              </div>
              <pre className="text-sm font-mono whitespace-pre-wrap bg-muted/30 rounded-lg p-4 border">{compiled || '(no enabled blocks)'}</pre>
            </div>
          ) : (
            <>
              {blocks.length === 0 && <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">Add blocks from the panel on the left</div>}
              {blocks.map((block, idx) => (
                <div key={block.id} className={`rounded-lg border p-3 space-y-2 ${BLOCK_COLORS[block.type] || 'bg-card border-border'} ${!block.isEnabled ? 'opacity-50' : ''}`}>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono px-1.5">{block.type.replace(/_/g, ' ')}</Badge>
                    <input value={block.label} onChange={e => updateBlock(block.id, 'label', e.target.value)}
                      className="flex-1 text-xs font-medium bg-transparent border-none outline-none" placeholder="Label" />
                    <div className="flex items-center gap-1 ml-auto">
                      <button onClick={() => moveUp(block.id)} disabled={idx === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronUp className="w-3 h-3" /></button>
                      <button onClick={() => moveDown(block.id)} disabled={idx === blocks.length-1} className="text-muted-foreground hover:text-foreground disabled:opacity-30"><ChevronDown className="w-3 h-3" /></button>
                      <button onClick={() => updateBlock(block.id, 'isLocked', !block.isLocked)} className="text-muted-foreground hover:text-foreground">{block.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3 opacity-30" />}</button>
                      <button onClick={() => duplicateBlock(block.id)} className="text-muted-foreground hover:text-foreground"><Copy className="w-3 h-3" /></button>
                      <button onClick={() => updateBlock(block.id, 'isEnabled', !block.isEnabled)} className="text-muted-foreground hover:text-foreground">{block.isEnabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}</button>
                      <button onClick={() => removeBlock(block.id)} disabled={block.isLocked} className="text-muted-foreground hover:text-destructive disabled:opacity-30"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <textarea value={block.content} onChange={e => !block.isLocked && updateBlock(block.id, 'content', e.target.value)}
                    readOnly={block.isLocked}
                    placeholder={"Write " + block.type.toLowerCase().replace(/_/g, ' ') + " content... Use {{variable_name}} for variables"}
                    rows={3} className="w-full text-sm font-mono bg-background/50 rounded border px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}