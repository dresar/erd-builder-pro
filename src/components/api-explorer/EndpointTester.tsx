import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Sparkles, Clock, Globe, Plus, Trash2, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApiEndpoint, HttpMethod, SimulationResult } from '@/lib/api-engine/types';
import { simulateApiCall, executeRealApiCall } from '@/lib/api-engine/apiSimulator';
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
  const [serverMode, setServerMode] = useState<'live' | 'sandbox'>('live');
  const [baseUrl, setBaseUrl] = useState<string>(() => {
    return localStorage.getItem('prd_pro_api_base_url') || 'http://localhost:3000';
  });

  const [headerList, setHeaderList] = useState<Array<{ key: string; value: string }>>([
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Authorization', value: 'Bearer {{token}}' },
  ]);

  const [queryParams, setQueryParams] = useState<Record<string, string>>({
    page: '1',
    limit: '10',
    sort_by: 'created_at',
    order: 'desc',
    q: '',
  });
  const [pathParam, setPathParam] = useState<string>('1');
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

  const handleBaseUrlChange = (val: string) => {
    setBaseUrl(val);
    localStorage.setItem('prd_pro_api_base_url', val);
  };

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

    const headersMap: Record<string, string> = {};
    for (const h of headerList) {
      if (h.key.trim()) headersMap[h.key.trim()] = h.value;
    }

    try {
      if (serverMode === 'live') {
        const res = await executeRealApiCall(baseUrl, endpoint, {
          headers: headersMap,
          queryParams,
          body: parsedBody,
          pathParam,
        });
        setResult(res);
      } else {
        const res = await simulateApiCall(endpoint, {
          headers: headersMap,
          queryParams,
          body: parsedBody,
          pathParam,
        });
        setResult(res);
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const handleResetBody = () => {
    if (endpoint.requestBodyExample) {
      setRequestBodyText(JSON.stringify(endpoint.requestBodyExample, null, 2));
    }
  };

  const handleAddHeader = () => {
    setHeaderList(prev => [...prev, { key: '', value: '' }]);
  };

  const handleUpdateHeader = (index: number, key: string, value: string) => {
    setHeaderList(prev => {
      const next = [...prev];
      next[index] = { key, value };
      return next;
    });
  };

  const handleRemoveHeader = (index: number) => {
    setHeaderList(prev => prev.filter((_, i) => i !== index));
  };

  const methodColor = METHOD_BADGES[endpoint.method] || 'bg-muted text-foreground';

  const headersObject = headerList.reduce<Record<string, string>>((acc, cur) => {
    if (cur.key.trim()) acc[cur.key.trim()] = cur.value;
    return acc;
  }, {});

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar p-3 sm:p-4 lg:p-6 min-h-0">
      <div className="rounded-xl border border-border/70 bg-card p-3 sm:p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${methodColor}`}>
              {endpoint.method}
            </span>
            <span className="font-mono text-xs sm:text-sm font-semibold text-foreground break-all">{endpoint.path}</span>
            <Badge variant="outline" className="text-[10px] px-2 py-0 h-5 border-border/70 text-muted-foreground">
              {endpoint.tableTitle}
            </Badge>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-muted/30 rounded-lg border border-border/60 self-start sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setServerMode('live')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                serverMode === 'live' ? 'bg-background text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Server className="size-3 text-emerald-400" />
              <span>Live HTTP</span>
            </button>
            <button
              type="button"
              onClick={() => setServerMode('sandbox')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md font-medium transition-all cursor-pointer ${
                serverMode === 'sandbox' ? 'bg-background text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Globe className="size-3 text-indigo-400" />
              <span>Sandbox</span>
            </button>
          </div>
        </div>

        {serverMode === 'live' && (
          <div className="flex items-center gap-2 pt-1 border-t border-border/50 flex-wrap sm:flex-nowrap">
            <span className="text-[11px] font-medium text-muted-foreground shrink-0">Target URL:</span>
            <input
              type="text"
              value={baseUrl}
              onChange={e => handleBaseUrlChange(e.target.value)}
              placeholder="http://localhost:3000"
              className="flex-1 min-w-[200px] text-xs h-7.5 px-2.5 font-mono rounded-md border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}

        <p className="text-xs text-muted-foreground leading-relaxed">{endpoint.description}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs space-y-0 min-w-0">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 bg-muted/20 flex-wrap gap-2">
            <div className="flex items-center gap-1">
              {['POST', 'PUT', 'PATCH'].includes(endpoint.method) && (
                <button
                  type="button"
                  onClick={() => setActiveReqTab('body')}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-all ${
                    activeReqTab === 'body' ? 'bg-background text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Body
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
                      ID
                    </label>
                    <input
                      type="text"
                      value={pathParam}
                      onChange={e => setPathParam(e.target.value)}
                      placeholder="1"
                      className="w-full text-xs h-8 px-2.5 font-mono rounded-md border border-border/70 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                    Query
                  </span>
                  {endpoint.params.filter(p => p.in === 'query').map(p => (
                    <div key={p.name} className="flex items-center gap-2">
                      <span className="w-24 text-xs font-mono text-foreground shrink-0 truncate">{p.name}</span>
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
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Header
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleAddHeader}
                    className="h-6 text-[10px] gap-1 px-2 border-border/70 cursor-pointer"
                  >
                    <Plus className="size-2.5" />
                    <span>Tambah</span>
                  </Button>
                </div>
                {headerList.map((h, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={h.key}
                      onChange={e => handleUpdateHeader(i, e.target.value, h.value)}
                      placeholder="Header"
                      className="w-1/3 min-w-[90px] text-xs h-7 px-2 font-mono rounded border border-border/70 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <input
                      type="text"
                      value={h.value}
                      onChange={e => handleUpdateHeader(i, h.key, e.target.value)}
                      placeholder="Nilai"
                      className="flex-1 min-w-[100px] text-xs h-7 px-2 font-mono rounded border border-border/70 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveHeader(i)}
                      className="p-1 text-muted-foreground hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs space-y-0 min-w-0">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">Respon</span>
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
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="size-3 text-indigo-400" />
                <span>{result.latencyMs}ms</span>
              </div>
            )}
          </div>

          <div className="p-3 bg-background/40 min-h-[260px]">
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
                    Payload
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveResTab('headers')}
                    className={`px-2 py-0.5 text-[11px] rounded transition-all cursor-pointer ${
                      activeResTab === 'headers' ? 'bg-background font-semibold text-foreground shadow-xs' : 'text-muted-foreground'
                    }`}
                  >
                    Header
                  </button>
                </div>

                {activeResTab === 'body' ? (
                  <pre className="p-3 rounded-lg border border-border/60 bg-card font-mono text-xs leading-relaxed overflow-x-auto custom-scrollbar select-text max-h-80">
                    {typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)}
                  </pre>
                ) : (
                  <div className="p-3 rounded-lg border border-border/60 bg-card font-mono text-xs space-y-1.5 max-h-80 overflow-y-auto custom-scrollbar">
                    {Object.entries(result.headers).map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="text-muted-foreground font-semibold shrink-0">{k}:</span>
                        <span className="text-foreground break-all">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-56 text-center text-muted-foreground p-4 space-y-1.5">
                <Globe className="size-7 text-muted-foreground/30 stroke-1" />
                <p className="text-xs text-muted-foreground">Belum ada respon.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-indigo-400" />
          <span>Klien API</span>
        </h3>
        <CodeSnippetViewer endpoint={endpoint} headers={headersObject} body={requestBodyText} />
      </div>
    </div>
  );
}
