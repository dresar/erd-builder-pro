import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Check, Sparkles, Clock, Globe, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApiEndpoint, HttpMethod, SimulationResult } from '@/lib/api-engine/types';
import { simulateApiCall } from '@/lib/api-engine/apiSimulator';
import { CodeSnippetViewer } from './CodeSnippetViewer';

interface EndpointTesterProps {
  endpoint: ApiEndpoint;
}

const METHOD_BADGES: Record<HttpMethod, string> = {
  GET: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  POST: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  PUT: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  DELETE: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  PATCH: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
};

export function EndpointTester({ endpoint }: EndpointTesterProps) {
  const [activeReqTab, setActiveReqTab] = useState<'params' | 'headers' | 'body'>('body');
  const [activeResTab, setActiveResTab] = useState<'body' | 'headers'>('body');
  const [headers, setHeaders] = useState<Record<string, string>>({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer pes_live_9824f19b02a8',
    'X-Campus-Id': '550e8400-e29b-41d4-a716-446655440000',
  });
  const [queryParams, setQueryParams] = useState<Record<string, string>>({
    page: '1',
    limit: '10',
    sort_by: 'created_at',
    order: 'desc',
    q: '',
  });
  const [pathParam, setPathParam] = useState<string>('550e8400-e29b-41d4-a716-446655440000');
  const [requestBodyText, setRequestBodyText] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    if (endpoint.requestBodyExample) {
      setRequestBodyText(JSON.stringify(endpoint.requestBodyExample, null, 2));
    } else {
      setRequestBodyText('');
    }
    setResult(null);
    if (['POST', 'PUT', 'PATCH'].includes(endpoint.method)) {
      setActiveReqTab('body');
    } else {
      setActiveReqTab('params');
    }
  }, [endpoint]);

  const handleExecute = async () => {
    setIsExecuting(true);
    let parsedBody: any = undefined;
    if (['POST', 'PUT', 'PATCH'].includes(endpoint.method) && requestBodyText.trim()) {
      try {
        parsedBody = JSON.parse(requestBodyText);
      } catch {
        parsedBody = { raw: requestBodyText };
      }
    }

    try {
      const res = await simulateApiCall(endpoint, {
        headers,
        queryParams,
        body: parsedBody,
        pathParam,
      });
      setResult(res);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleResetBody = () => {
    if (endpoint.requestBodyExample) {
      setRequestBodyText(JSON.stringify(endpoint.requestBodyExample, null, 2));
    }
  };

  const methodColor = METHOD_BADGES[endpoint.method] || 'bg-muted text-foreground';

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar p-4 lg:p-6 min-h-0">
      <div className="rounded-xl border border-border/70 bg-card p-4 space-y-2 shadow-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${methodColor}`}>
            {endpoint.method}
          </span>
          <span className="font-mono text-sm font-semibold text-foreground">{endpoint.path}</span>
          <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 border-border/70 text-muted-foreground">
            {endpoint.tableTitle}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{endpoint.description}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs space-y-0">
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-border/60 bg-muted/20">
            <div className="flex items-center gap-1">
              {['POST', 'PUT', 'PATCH'].includes(endpoint.method) && (
                <button
                  type="button"
                  onClick={() => setActiveReqTab('body')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-all ${
                    activeReqTab === 'body' ? 'bg-background text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Body JSON
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveReqTab('params')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-all ${
                  activeReqTab === 'params' ? 'bg-background text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Params
              </button>
              <button
                type="button"
                onClick={() => setActiveReqTab('headers')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-all ${
                  activeReqTab === 'headers' ? 'bg-background text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Headers
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              {activeReqTab === 'body' && (
                <Button
                  onClick={handleResetBody}
                  size="sm"
                  variant="outline"
                  className="h-7 text-[11px] gap-1 px-2 cursor-pointer border-border/70"
                  title="Reset ke mock data awal"
                >
                  <RotateCcw className="size-3" />
                  <span>Reset</span>
                </Button>
              )}

              <Button
                onClick={handleExecute}
                disabled={isExecuting}
                size="sm"
                className="h-7.5 px-3 text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer font-medium"
              >
                <Play className="size-3 fill-current" />
                <span>{isExecuting ? 'Mengirim...' : 'Kirim'}</span>
              </Button>
            </div>
          </div>

          <div className="p-3 bg-background/40">
            {activeReqTab === 'body' && (
              <textarea
                value={requestBodyText}
                onChange={e => setRequestBodyText(e.target.value)}
                rows={12}
                placeholder="{}"
                className="w-full font-mono text-xs p-3 rounded-lg border border-border/70 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed custom-scrollbar"
              />
            )}

            {activeReqTab === 'params' && (
              <div className="space-y-3">
                {endpoint.path.includes(':') && (
                  <div>
                    <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                      Path Parameter (ID / UUID)
                    </label>
                    <input
                      type="text"
                      value={pathParam}
                      onChange={e => setPathParam(e.target.value)}
                      className="w-full text-xs h-8 px-2.5 font-mono rounded-md border border-border/70 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Query Parameters
                  </span>
                  {endpoint.params.filter(p => p.in === 'query').map(p => (
                    <div key={p.name} className="flex items-center gap-2">
                      <span className="w-24 text-xs font-mono text-foreground shrink-0">{p.name}</span>
                      <input
                        type="text"
                        value={queryParams[p.name] ?? ''}
                        onChange={e => setQueryParams({ ...queryParams, [p.name]: e.target.value })}
                        placeholder={p.default || 'nilai'}
                        className="flex-1 text-xs h-7.5 px-2 font-mono rounded border border-border/70 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeReqTab === 'headers' && (
              <div className="space-y-2">
                {Object.entries(headers).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2">
                    <span className="w-36 text-xs font-mono text-muted-foreground shrink-0 truncate">{k}</span>
                    <input
                      type="text"
                      value={v}
                      onChange={e => setHeaders({ ...headers, [k]: e.target.value })}
                      className="flex-1 text-xs h-7.5 px-2 font-mono rounded border border-border/70 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs space-y-0">
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-border/60 bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">Respon Simulasi</span>
              {result && (
                <Badge
                  variant="outline"
                  className={`text-[10px] px-1.5 py-0 h-4.5 font-bold ${
                    result.status >= 200 && result.status < 300
                      ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                      : 'border-rose-500/40 text-rose-400 bg-rose-500/10'
                  }`}
                >
                  {result.status} {result.statusText}
                </Badge>
              )}
            </div>

            {result && (
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="size-3 text-indigo-400" />
                  {result.latencyMs}ms
                </span>
              </div>
            )}
          </div>

          <div className="p-3 bg-background/40 min-h-[280px]">
            {result ? (
              <div className="space-y-2">
                <div className="flex rounded-md border border-border/60 p-0.5 w-fit bg-card">
                  <button
                    type="button"
                    onClick={() => setActiveResTab('body')}
                    className={`px-2 py-0.5 text-[11px] rounded transition-all cursor-pointer ${
                      activeResTab === 'body' ? 'bg-background font-semibold text-foreground shadow-xs' : 'text-muted-foreground'
                    }`}
                  >
                    Payload JSON
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveResTab('headers')}
                    className={`px-2 py-0.5 text-[11px] rounded transition-all cursor-pointer ${
                      activeResTab === 'headers' ? 'bg-background font-semibold text-foreground shadow-xs' : 'text-muted-foreground'
                    }`}
                  >
                    Headers
                  </button>
                </div>

                {activeResTab === 'body' ? (
                  <pre className="p-3 rounded-lg border border-border/60 bg-card font-mono text-xs leading-relaxed overflow-x-auto custom-scrollbar select-text max-h-80">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                ) : (
                  <div className="p-3 rounded-lg border border-border/60 bg-card font-mono text-xs space-y-1.5">
                    {Object.entries(result.headers).map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="text-muted-foreground font-semibold">{k}:</span>
                        <span className="text-foreground">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground p-4 space-y-2">
                <Globe className="size-8 text-muted-foreground/40 stroke-1" />
                <p className="text-xs">Klik tombol "Kirim" untuk menjalankan simulasi panggilan API.</p>
                <p className="text-[11px] text-muted-foreground/70">
                  Data yang dikirim akan tersimpan pada state simulasi sesi ini.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-indigo-400" />
          <span>Contoh Kode Klien</span>
        </h3>
        <CodeSnippetViewer endpoint={endpoint} headers={headers} body={requestBodyText} />
      </div>
    </div>
  );
}
