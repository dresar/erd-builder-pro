import { useState, useRef, useCallback, useEffect } from 'react';
import { Copy, Check, Play, Square, RefreshCw, Save, Plus, Trash2, ChevronDown, Zap, Clock, Coins, GitCompare } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { usePlayground, type PlaygroundResult } from '@/hooks/usePlayground';
import { useAIProviders } from '@/hooks/useAIProviders';

const RESPONSE_FORMATS = ['text', 'json', 'markdown'] as const;
const TEMPERATURE_PRESETS = [{ label: 'Precise', value: 0.2 }, { label: 'Balanced', value: 0.7 }, { label: 'Creative', value: 1.2 }];

function ResultCard({ result, index }: { result: PlaygroundResult; index: number }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(result.output); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const isError = !!result.error;
  return (
    <div className={`rounded-lg border p-4 space-y-3 ${isError ? 'border-destructive/50 bg-destructive/5' : 'border-border bg-card'}`}>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono">{result.model || result.provider || 'unknown'}</Badge>
          {result.provider && <Badge variant="secondary" className="text-xs">{result.provider}</Badge>}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{result.latencyMs}ms</span>
          <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{result.totalTokens} tok</span>
          <span className="flex items-center gap-1"><Coins className="w-3 h-3" />${result.estimatedCostUsd.toFixed(5)}</span>
          <Badge variant={result.finishReason === 'stop' || result.finishReason === 'STOP' ? 'outline' : 'destructive'} className="text-xs">{result.finishReason}</Badge>
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={copy}>{copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}</Button>
        </div>
      </div>
      {isError
        ? <p className="text-sm text-destructive">{result.error}</p>
        : <pre className="text-sm whitespace-pre-wrap font-mono bg-muted/30 rounded p-3 max-h-64 overflow-y-auto">{result.output}</pre>
      }
    </div>
  );
}

export function PromptPlaygroundRoute() {
  const { isRunning, results, isSavingSession, run, runMultiple, saveSession, clearResults } = usePlayground();
  const { providers, configs } = useAIProviders();

  const [systemPrompt, setSystemPrompt] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [responseFormat, setResponseFormat] = useState<string>('text');
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const abortRef = useRef(false);

  const enabledProviders = providers.filter(p => configs[p.code]?.is_enabled);

  useEffect(() => {
    if (enabledProviders.length > 0 && selectedProviders.length === 0) {
      setSelectedProviders([enabledProviders[0].code]);
    }
  }, [enabledProviders.length]);

  const handleRun = useCallback(async () => {
    if (!userPrompt.trim()) { toast.error('User prompt is required'); return; }
    abortRef.current = false;
    if (compareMode && selectedProviders.length > 1) {
      await runMultiple({ systemPrompt, userPrompt, providerCodes: selectedProviders, temperature, maxTokens });
    } else {
      await run({ systemPrompt, userPrompt, providerCode: selectedProviders[0], temperature, maxTokens, responseFormat });
    }
  }, [systemPrompt, userPrompt, temperature, maxTokens, responseFormat, selectedProviders, compareMode, run, runMultiple]);

  const handleSave = async () => {
    if (!userPrompt.trim()) { toast.error('Enter a prompt before saving'); return; }
    await saveSession({ name: sessionName || 'Untitled Session', systemPrompt, userPrompt, modelsJson: selectedProviders, temperature, maxTokens, responseFormat, resultsJson: results.slice(0, 5) });
  };

  const toggleProvider = (code: string) => {
    setSelectedProviders(prev => prev.includes(code) ? prev.filter(p => p !== code) : [...prev, code]);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="border-b px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-base font-semibold">Prompt Playground</h1>
          <p className="text-xs text-muted-foreground">Test & compare prompts across AI models</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant={compareMode ? 'default' : 'outline'} onClick={() => setCompareMode(!compareMode)} className="gap-1 text-xs h-7">
            <GitCompare className="w-3 h-3" />Compare
          </Button>
          <Button size="sm" variant="outline" onClick={handleSave} disabled={isSavingSession} className="gap-1 text-xs h-7">
            <Save className="w-3 h-3" />Save
          </Button>
          <Button size="sm" onClick={handleRun} disabled={isRunning} className="gap-1 text-xs h-7">
            {isRunning ? <><Square className="w-3 h-3" />Running…</> : <><Play className="w-3 h-3" />Run</>}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 border-r flex flex-col gap-0 overflow-y-auto">
          <div className="p-3 border-b space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Providers</p>
            <div className="space-y-1">
              {enabledProviders.length === 0 && <p className="text-xs text-muted-foreground">No providers configured. Go to Settings → AI.</p>}
              {enabledProviders.map(p => (
                <label key={p.code} className="flex items-center gap-2 p-1.5 rounded hover:bg-muted/50 cursor-pointer">
                  <input type={compareMode ? 'checkbox' : 'radio'} name="provider" checked={selectedProviders.includes(p.code)}
                    onChange={() => compareMode ? toggleProvider(p.code) : setSelectedProviders([p.code])}
                    className="accent-primary" />
                  <span className="text-xs">{p.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="p-3 border-b space-y-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Parameters</p>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs">Temperature</label>
                <span className="text-xs font-mono text-muted-foreground">{temperature}</span>
              </div>
              <input type="range" min="0" max="2" step="0.1" value={temperature} onChange={e => setTemperature(Number(e.target.value))} className="w-full accent-primary" />
              <div className="flex gap-1">
                {TEMPERATURE_PRESETS.map(p => <button key={p.label} onClick={() => setTemperature(p.value)} className="text-xs px-2 py-0.5 rounded border hover:bg-muted/50">{p.label}</button>)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs">Max Tokens</label>
                <span className="text-xs font-mono text-muted-foreground">{maxTokens}</span>
              </div>
              <input type="range" min="256" max="16384" step="256" value={maxTokens} onChange={e => setMaxTokens(Number(e.target.value))} className="w-full accent-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-xs">Response Format</label>
              <div className="flex gap-1">
                {RESPONSE_FORMATS.map(f => (
                  <button key={f} onClick={() => setResponseFormat(f)} className={`text-xs px-2 py-0.5 rounded border ${responseFormat === f ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-muted/50'}`}>{f}</button>
                ))}
              </div>
            </div>
          </div>

          {results.length > 0 && (
            <div className="p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">History</p>
                <Button size="icon" variant="ghost" className="h-5 w-5" onClick={clearResults}><Trash2 className="w-3 h-3" /></Button>
              </div>
              <p className="text-xs text-muted-foreground">{results.length} result(s) this session</p>
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden p-4 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">System Instruction</label>
              <textarea
                value={systemPrompt}
                onChange={e => setSystemPrompt(e.target.value)}
                placeholder="You are a helpful assistant..."
                rows={3}
                className="w-full text-sm rounded-md border bg-muted/20 px-3 py-2 font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex-1 space-y-1 flex flex-col">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">User Prompt</label>
              <textarea
                value={userPrompt}
                onChange={e => setUserPrompt(e.target.value)}
                placeholder="Enter your prompt here..."
                className="flex-1 w-full text-sm rounded-md border bg-muted/20 px-3 py-2 font-mono resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex-1 border-t overflow-y-auto p-4 space-y-3">
            {results.length === 0 && !isRunning && (
              <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                <Play className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">Click Run to see results</p>
              </div>
            )}
            {isRunning && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-4">
                <RefreshCw className="w-4 h-4 animate-spin" />Running…
              </div>
            )}
            {results.map((r, i) => <ResultCard key={i} result={r} index={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
}