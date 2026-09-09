import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  FileCheck,
  FolderKanban,
  Plus,
  Clock,
  PenTool,
  Network,
  Database,
  DatabaseZap,
  Sparkles,
  Search,
  ArrowUpRight,
} from 'lucide-react';
import { useWorkspace } from '../providers/WorkspaceProvider';
import { apiFetch, isInstalledApp } from '../lib/api';

const typeConfig = [
  {
    key: 'notes',
    label: 'Catatan',
    createLabel: 'Catatan',
    icon: FileText,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    route: '/table/notes',
    createFn: 'handleSidebarNoteCreate',
    totalKey: 'notesTotal' as const,
  },
  {
    key: 'prd',
    label: 'PRD',
    createLabel: 'PRD',
    icon: FileCheck,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    route: '/table/prd',
    createFn: 'handleSidebarPrdCreate',
    totalKey: 'notesTotal' as const,
  },
  {
    key: 'diagrams',
    label: 'ERD',
    createLabel: 'ERD',
    icon: Database,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/20',
    route: '/table/erd',
    createFn: 'handleSidebarDiagramCreate',
    totalKey: 'diagramsTotal' as const,
  },
  {
    key: 'drawings',
    label: 'Gambar',
    createLabel: 'Gambar',
    icon: PenTool,
    color: 'text-violet-500',
    bg: 'bg-violet-500/10',
    route: '/table/drawings',
    createFn: 'handleSidebarDrawingCreate',
    totalKey: 'drawingsTotal' as const,
  },
  {
    key: 'flowcharts',
    label: 'Flowchart',
    createLabel: 'Flowchart',
    icon: Network,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    route: '/table/flowchart',
    createFn: 'handleSidebarFlowchartCreate',
    totalKey: 'flowchartsTotal' as const,
  },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Selamat pagi';
  if (hour < 17) return 'Selamat siang';
  return 'Selamat malam';
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins}m lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}j lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}h lalu`;
  return new Date(dateStr).toLocaleDateString('id-ID');
}

function getDocIcon(type: string) {
  switch (type) {
    case 'diagrams':
      return <Database className="h-4 w-4 text-blue-500" />;
    case 'notes':
      return <FileText className="h-4 w-4 text-amber-500" />;
    case 'prd':
      return <FileCheck className="h-4 w-4 text-indigo-400" />;
    case 'drawings':
      return <PenTool className="h-4 w-4 text-violet-500" />;
    case 'flowcharts':
      return <Network className="h-4 w-4 text-emerald-500" />;
    case 'db-client':
      return <DatabaseZap className="h-4 w-4 text-cyan-400" />;
    default:
      return null;
  }
}

function isDbClientDiagram(doc: any): boolean {
  return (doc.source_type ?? doc.sourceType) === 'production_db';
}

function isDbClientFile(doc: any): boolean {
  return doc?._group === 'db-client' || doc?._type === 'db-client' || isDbClientDiagram(doc);
}

function getDocLabel(doc: any): string {
  switch (doc._type) {
    case 'diagrams': return isDbClientFile(doc) ? 'Koneksi DB' : 'ERD';
    case 'notes': return 'Catatan';
    case 'prd': return 'PRD';
    case 'drawings': return 'Gambar';
    case 'flowcharts': return 'Flowchart';
    case 'db-client': return 'Koneksi DB';
    default: return '';
  }
}

function getDocRoute(type: string, item: any) {
  const id = item.uid || item.id;
  if (isDbClientFile(item)) return `/db-client/${id}`;

  switch (type) {
    case 'diagrams':
      return `/diagrams/${id}`;
    case 'notes':
      return item.title?.startsWith('[PRD] ') ? `/prd/${id}` : `/notes/${id}`;
    case 'prd':
      return `/prd/${id}`;
    case 'drawings':
      return `/drawings/${id}`;
    case 'flowcharts':
      return `/flowcharts/${id}`;
    case 'db-client':
      return `/db-client/${id}`;
    default:
      return '/';
  }
}

export function DashboardRoute() {
  const navigate = useNavigate();
  const ctx = useWorkspace();
  const showDbClient = isInstalledApp();

  const user = ctx.user;
  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || '';
  const selectedWorkspace = ctx.selectedWorkspaceUid;
  const activeWorkspace = useMemo(() => {
    if (!selectedWorkspace) return null;
    return (ctx.projects || []).find((p: any) => 
      String(p.uid) === String(selectedWorkspace) || String(p.id) === String(selectedWorkspace)
    ) || null;
  }, [ctx.projects, selectedWorkspace]);

  const recentDocs = useMemo(() => {
    const projectMap = new Map((ctx.projects || []).map((p: any) => [String(p.id), p.name]));
    const getWorkspace = (doc: any) => {
      const pid = doc.project_id ?? doc.projectId;
      return doc.projects?.name || doc.project?.name || (pid ? projectMap.get(String(pid)) : null) || '—';
    };
    const all = [
      ...(ctx.diagrams || []).filter((d: any) => !isDbClientDiagram(d)).map((d: any) => ({
        ...d,
        _type: 'diagrams' as const,
        _group: 'diagrams',
        _workspace: getWorkspace(d),
        updated_at: d.updated_at ?? d.updatedAt,
      })),
      ...(ctx.notes || []).map((n: any) => ({
        ...n,
        _type: n.title?.startsWith('[PRD] ') ? ('prd' as const) : ('notes' as const),
        _group: n.title?.startsWith('[PRD] ') ? 'prd' : 'notes',
        _workspace: getWorkspace(n),
        updated_at: n.updated_at ?? n.updatedAt,
      })),
      ...(ctx.drawings || []).map((d: any) => ({
        ...d,
        _type: 'drawings' as const,
        _group: 'drawings',
        _workspace: getWorkspace(d),
        updated_at: d.updated_at ?? d.updatedAt,
      })),
      ...(ctx.flowcharts || []).map((f: any) => ({
        ...f,
        _type: 'flowcharts' as const,
        _group: 'flowcharts',
        _workspace: getWorkspace(f),
        updated_at: f.updated_at ?? f.updatedAt,
      })),
    ];
    let list = all.filter((d) => !d.is_deleted);
    if (activeWorkspace) {
      list = list.filter((d: any) => {
        const pid = d.project_id ?? d.projectId ?? d.project?.id ?? d.project?.uid;
        return String(pid) === String(activeWorkspace.id) || String(pid) === String(activeWorkspace.uid);
      });
    }
    return list
      .sort((a, b) => new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime())
      .slice(0, 10);
  }, [ctx.diagrams, ctx.notes, ctx.drawings, ctx.flowcharts, ctx.projects, activeWorkspace]);

  const [recentQuery, setRecentQuery] = useState('');
  const [recentFilter, setRecentFilter] = useState('all');
  const filteredRecentDocs = useMemo(() => {
    const query = recentQuery.trim().toLowerCase();
    return recentDocs.filter((doc: any) => {
      const matchesType = recentFilter === 'all' || doc._group === recentFilter;
      const name = doc.name || doc.title || '';
      return matchesType && (!query || `${name} ${doc._workspace}`.toLowerCase().includes(query));
    });
  }, [recentDocs, recentFilter, recentQuery]);

  const totalDocs = useMemo(() => {
    return (ctx.diagrams || []).filter((d: any) => !d.is_deleted && !isDbClientDiagram(d)).length +
      (ctx.notes || []).filter((n: any) => !n.is_deleted).length +
      (ctx.drawings || []).filter((d: any) => !d.is_deleted).length +
      (ctx.flowcharts || []).filter((f: any) => !f.is_deleted).length;
  }, [ctx.diagrams, ctx.notes, ctx.drawings, ctx.flowcharts]);

  const projectsWithCounts = useMemo(() => {
    const matchPid = (item: any, p: any) => {
      const pid = String(item.project_id ?? item.projectId ?? item.workspace?.id ?? '');
      return pid === String(p.id) || (p.uid && pid === String(p.uid));
    };
    return (ctx.projects || [])
      .filter((p: any) => !p.is_deleted)
      .map((p: any) => {
        const notesCount = (ctx.notes || []).filter(n => !n.is_deleted && matchPid(n, p)).length;
        const diagramsCount = (ctx.diagrams || []).filter(d => !d.is_deleted && !isDbClientDiagram(d) && matchPid(d, p)).length;
        const drawingsCount = (ctx.drawings || []).filter(d => !d.is_deleted && matchPid(d, p)).length;
        const flowchartsCount = (ctx.flowcharts || []).filter(f => !f.is_deleted && matchPid(f, p)).length;
        const total = notesCount + diagramsCount + drawingsCount + flowchartsCount;
        return {
          ...p,
          notesCount,
          diagramsCount,
          drawingsCount,
          flowchartsCount,
          dbClientsCount: 0,
          totalDocs: total,
        };
      })
      .sort((a: any, b: any) => b.totalDocs - a.totalDocs)
      .slice(0, 4);
  }, [ctx.projects, ctx.notes, ctx.diagrams, ctx.drawings, ctx.flowcharts]);

  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const isLoading = ctx.isLoading || ctx.isProjectsLoading;

  useEffect(() => {
    if (!isLoading || (ctx.projects && ctx.projects.length > 0) || recentDocs.length > 0) {
      setInitialLoadDone(true);
    }
  }, [isLoading, ctx.projects, recentDocs.length]);

  const hasData = (ctx.projects || []).filter((p: any) => !p.is_deleted).length > 0 || totalDocs > 0 || recentDocs.length > 0;
  const isEmpty = !isLoading && !hasData;
  const showSkeleton = !initialLoadDone && !hasData;
  const showContent = hasData || (!isLoading && !isEmpty);

  const createDocument = (cfg: typeof typeConfig[number]) => {
    const fn = (ctx as Record<string, any>)[cfg.createFn];
    if (fn) fn(`${cfg.createLabel} Baru`);
  };

  const lastDocument = recentDocs[0];

  if (showSkeleton) {
    return (
      <div className="flex h-full w-full flex-col overflow-y-auto animate-pulse">
        <div className="border-b border-border/60 px-5 py-5">
          <div className="h-4 w-24 rounded bg-muted/60" />
          <div className="mt-2 h-6 w-48 rounded bg-muted/80" />
          <div className="mt-1 h-3 w-36 rounded bg-muted/50" />
        </div>
        <main className="flex w-full flex-col gap-5 px-5 py-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(250px,0.65fr)]">
            <div className="h-40 rounded-xl border border-border/60 bg-muted/20 p-4" />
            <div className="h-40 rounded-xl border border-border/60 bg-muted/20 p-4" />
          </div>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(250px,0.65fr)]">
            <div className="space-y-3">
              <div className="h-5 w-32 rounded bg-muted/60" />
              <div className="h-16 rounded-xl border border-border/60 bg-muted/20" />
              <div className="h-16 rounded-xl border border-border/60 bg-muted/20" />
              <div className="h-16 rounded-xl border border-border/60 bg-muted/20" />
            </div>
            <div className="space-y-3">
              <div className="h-5 w-28 rounded bg-muted/60" />
              <div className="h-32 rounded-xl border border-border/60 bg-muted/20" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-y-auto">
      {/* ── Greeting ── */}
      {userName && <div className="border-b border-border/60 px-5 py-5">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{getGreeting()},</p>
            <h1 className="mt-0.5 text-xl font-semibold tracking-tight">{userName}</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {activeWorkspace ? `Ruang Kerja: ${activeWorkspace.name}` : 'Lanjutkan pekerjaan Anda.'}
            </p>
          </div>
          {!isEmpty && (
            <button
              onClick={() => createDocument(typeConfig[1])}
              className="hidden h-8 shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 sm:inline-flex"
            >
              <Plus className="size-3.5" />
              ERD Baru
            </button>
          )}
        </div>
      </div>}

      {/* ── Empty state ── */}
      {isEmpty && (
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-20 text-center">
          <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
            <Sparkles className="size-7 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Mulai</h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-md">
            Pilih dokumen untuk memulai.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {typeConfig.map((cfg) => (
              <button
                key={cfg.key}
                onClick={() => createDocument(cfg)}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all hover:shadow-sm ${cfg.key === 'diagrams' ? 'border-cyan-400/50' : 'border-border/60'} ${cfg.bg} hover:scale-[1.02]`}
              >
                <cfg.icon className={`h-4 w-4 ${cfg.color}`} />
                {cfg.createLabel}
              </button>
            ))}
          </div>
        </div>
      )}

      {showContent && (
        <main className="flex w-full flex-col gap-5 px-5 py-5">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.35fr)_minmax(250px,0.65fr)]">
            <section className="relative overflow-hidden rounded-xl border border-primary/25 bg-linear-to-br from-primary/10 via-card to-card p-4">
              <div className="relative z-10 flex h-full min-h-32 flex-col justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">Lanjutkan</p>
                  {lastDocument ? (
                    <div className="mt-3 flex items-start gap-2.5">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background/80 shadow-sm">
                        {getDocIcon(lastDocument._type)}
                      </div>
                      <div className="min-w-0">
                        <h2 className="truncate text-lg font-semibold">{lastDocument.name || lastDocument.title || '(Tanpa Nama)'}</h2>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {getDocLabel(lastDocument)} · {lastDocument._workspace} · {formatTimeAgo(lastDocument.updated_at)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <h2 className="mt-4 text-base font-semibold text-muted-foreground">Belum ada dokumen</h2>
                  )}
                </div>
                <button
                  onClick={() => lastDocument ? navigate(getDocRoute(lastDocument._type, lastDocument)) : createDocument(typeConfig[1])}
                  className="inline-flex h-8 w-fit items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  {lastDocument ? 'Buka' : 'Buat'}
                  <ArrowUpRight className="size-3.5" />
                </button>
              </div>
              <Sparkles className="absolute -bottom-8 -right-5 size-36 text-primary/10" />
            </section>

            <section className="rounded-xl border border-border/60 bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold">Buat Baru</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Pilih format yang dibutuhkan.</p>
                </div>
                <Plus className="size-4 text-muted-foreground" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {typeConfig.map((cfg) => (
                  <button
                    key={cfg.key}
                    onClick={() => createDocument(cfg)}
                    className="group flex min-h-14 flex-col items-start justify-between rounded-lg border border-border/60 bg-background px-2.5 py-2 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
                  >
                    <cfg.icon className={`size-4 ${cfg.color}`} />
                    <span className="text-xs font-medium">{cfg.createLabel} Baru</span>
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(250px,0.65fr)]">
            <section className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2.5">
                <div>
                  <h2 className="flex items-center gap-2 text-sm font-semibold">
                    <Clock className="size-4 text-muted-foreground" />
                    File Terbaru
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">Lanjutkan pekerjaan terakhir.</p>
                </div>
                <div className="relative w-full sm:w-52">
                  <Search className="pointer-events-none absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
                  <input
                    value={recentQuery}
                    onChange={(event) => setRecentQuery(event.target.value)}
                    placeholder="Cari"
                    aria-label="Cari file terbaru"
                    className="h-8 w-full rounded-lg border border-border/60 bg-card pl-8 pr-3 text-xs outline-none placeholder:text-muted-foreground/60 focus:border-primary/50"
                  />
                </div>
              </div>
              <div className="mb-2 flex items-center gap-1 overflow-x-auto pb-0.5">
                <button
                  onClick={() => setRecentFilter('all')}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ${recentFilter === 'all' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}
                >Semua</button>
                {typeConfig.map((cfg) => (
                  <button
                    key={cfg.key}
                    onClick={() => setRecentFilter(cfg.key)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium ${recentFilter === cfg.key ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}
                  >{cfg.label}</button>
                ))}
                {showDbClient && (
                  <button
                    onClick={() => setRecentFilter('db-client')}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium ${recentFilter === 'db-client' ? 'bg-accent text-foreground' : 'text-muted-foreground hover:bg-accent/50'}`}
                  >Koneksi DB</button>
                )}
              </div>
              <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
                {filteredRecentDocs.length === 0 ? (
                  <p className="px-4 py-10 text-center text-sm text-muted-foreground">Tidak ada file yang cocok.</p>
                ) : (
                  <>
                    <div className="hidden grid-cols-[minmax(0,1fr)_minmax(7rem,0.7fr)_auto_auto] gap-2.5 border-b border-border/50 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid">
                      <span>File</span>
                      <span>Ruang Kerja</span>
                      <span>Diperbarui</span>
                      <span aria-hidden="true" />
                    </div>
                    {filteredRecentDocs.map((doc: any) => (
                      <button
                        key={`${doc._type}-${doc.id}`}
                        onClick={() => navigate(getDocRoute(doc._type, doc))}
                        className="group grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2.5 border-b border-border/50 px-3 py-2.5 text-left last:border-0 hover:bg-accent/30 sm:grid-cols-[minmax(0,1fr)_minmax(7rem,0.7fr)_auto_auto]"
                      >
                        <div className="flex min-w-0 items-center gap-2.5">
                          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background">
                            {getDocIcon(doc._type)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">{doc.name || doc.title || '(Tanpa Nama)'}</p>
                            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{getDocLabel(doc)}</p>
                          </div>
                        </div>
                        <span className="hidden min-w-0 truncate text-xs text-muted-foreground sm:block">{doc._workspace}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">{formatTimeAgo(doc.updated_at)}</span>
                        <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-primary" />
                      </button>
                    ))}
                  </>
                )}
              </div>
            </section>

            {projectsWithCounts.length > 0 && (
              <section>
                <div className="mb-2">
                  <h2 className="flex items-center gap-2 text-sm font-semibold">
                    <FolderKanban className="size-4 text-muted-foreground" />
                    Ruang Kerja
                  </h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">Ringkasan proyek Anda.</p>
                </div>
                <div className="space-y-2">
                  {projectsWithCounts.map((p: any) => (
                    <button
                      key={p.id}
                      onClick={() => (ctx as any).onViewChange?.('erd', true, p.uid ?? p.id)}
                    className="group flex w-full items-center gap-2.5 rounded-lg border border-border/60 bg-card p-2.5 text-left transition-colors hover:border-primary/40 hover:bg-accent/30"
                    >
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                        <FolderKanban className="size-3.5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{p.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{p.totalDocs} file</p>
                      </div>
                      <ArrowUpRight className="size-4 text-muted-foreground/30 transition-colors group-hover:text-primary" />
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </main>
      )}
    </div>
  );
}
