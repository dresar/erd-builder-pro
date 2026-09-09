import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Copy,
  Check,
  Download,
  Sparkles,
  Database,
  Terminal,
  Loader2,
  ArrowLeft,
  Search,
  FolderKanban,
  FileText,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkspace } from '@/providers/WorkspaceProvider';
import { apiFetch } from '@/lib/api';
import {
  buildClaudeMasterPrompt,
  buildDefaultBundleFiles,
  downloadAgentBundleZip,
  downloadMegaPromptFile,
  GeneratedBundleFile,
} from '@/lib/multiAgentPromptGenerator';

export function AgentGeneratorRoute() {
  const { projectSlug } = useParams<{ projectSlug?: string }>();
  const navigate = useNavigate();
  const { projects = [], diagrams = [], flowcharts = [], notes = [] } = useWorkspace();

  const [searchProjectQuery, setSearchProjectQuery] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<string>('');
  const [customPrdContent, setCustomPrdContent] = useState<string>('');
  const [projectSiblings, setProjectSiblings] = useState<{
    notes?: any[];
    diagrams?: any[];
    flowcharts?: any[];
  } | null>(null);

  const currentProject = useMemo(() => {
    if (!projectSlug) return null;
    const matches = projects.filter(
      (p) =>
        String(p.slug) === String(projectSlug) ||
        String(p.uid) === String(projectSlug) ||
        String(p.id) === String(projectSlug) ||
        p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === projectSlug.toLowerCase()
    );
    if (matches.length === 0) return null;
    if (matches.length === 1) return matches[0];
    return [...matches].sort((a, b) => {
      const countA = (a.diagrams_count || 0) + (a.notes_count || 0) + (a.flowcharts_count || 0);
      const countB = (b.diagrams_count || 0) + (b.notes_count || 0) + (b.flowcharts_count || 0);
      if (countB !== countA) return countB - countA;
      return Number(b.id || 0) - Number(a.id || 0);
    })[0];
  }, [projects, projectSlug]);

  const projectName = useMemo(() => {
    if (currentProject?.name) return currentProject.name;
    if (projectSlug) {
      const decoded = decodeURIComponent(projectSlug).replace(/[-_]/g, ' ');
      return decoded.charAt(0).toUpperCase() + decoded.slice(1);
    }
    return 'Sistem Enterprise';
  }, [currentProject, projectSlug]);

  const domain = useMemo(() => {
    return currentProject?.description || 'SaaS Multi-Tenant';
  }, [currentProject]);

  const techStack = useMemo(() => {
    return 'Next.js 15 + Neon PostgreSQL (Prisma) + Express + Tailwind CSS';
  }, []);

  useEffect(() => {
    if (!currentProject) {
      setProjectSiblings(null);
      return;
    }
    const pId = String(currentProject.id || currentProject.uid);
    let isMounted = true;
    apiFetch(`/api/projects/${pId}/siblings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data) {
          setProjectSiblings(data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [currentProject]);

  const filteredProjects = useMemo(() => {
    if (!searchProjectQuery.trim()) return projects;
    const q = searchProjectQuery.toLowerCase();
    return projects.filter((p) => (p.name || '').toLowerCase().includes(q));
  }, [projects, searchProjectQuery]);

  const filteredDiagrams = useMemo(() => {
    if (projectSiblings?.diagrams && projectSiblings.diagrams.length > 0) {
      return projectSiblings.diagrams;
    }
    if (!currentProject) return diagrams;
    const pId = String(currentProject.id || currentProject.uid);
    return diagrams.filter((d) => String(d.project_id || d.projectId) === pId);
  }, [projectSiblings, diagrams, currentProject]);

  const filteredFlowcharts = useMemo(() => {
    if (projectSiblings?.flowcharts && projectSiblings.flowcharts.length > 0) {
      return projectSiblings.flowcharts;
    }
    if (!currentProject) return flowcharts;
    const pId = String(currentProject.id || currentProject.uid);
    return flowcharts.filter((f) => String(f.project_id || f.projectId) === pId);
  }, [projectSiblings, flowcharts, currentProject]);

  const filteredNotes = useMemo(() => {
    if (projectSiblings?.notes && projectSiblings.notes.length > 0) {
      return projectSiblings.notes;
    }
    if (!currentProject) return notes;
    const pId = String(currentProject.id || currentProject.uid);
    return notes.filter((n) => String(n.project_id || n.projectId) === pId);
  }, [projectSiblings, notes, currentProject]);

  const masterPrompt = useMemo(() => {
    return buildClaudeMasterPrompt({
      projectName,
      domain,
      techStack,
      diagrams: filteredDiagrams,
      flowcharts: filteredFlowcharts,
      notes: filteredNotes,
      customPrd: customPrdContent,
    });
  }, [projectName, domain, techStack, filteredDiagrams, filteredFlowcharts, filteredNotes, customPrdContent]);

  const bundleFiles: GeneratedBundleFile[] = useMemo(() => {
    const defaultFiles = buildDefaultBundleFiles({
      projectName,
      domain,
      techStack,
      diagrams: filteredDiagrams,
      flowcharts: filteredFlowcharts,
      notes: filteredNotes,
    });

    if (customPrdContent) {
      const prdFile = defaultFiles.find((f) => f.path === 'docs/01_PRD.md' || f.path === 'docs/PRD.md');
      if (prdFile) prdFile.content = customPrdContent;
    }

    return defaultFiles;
  }, [projectName, domain, techStack, filteredDiagrams, filteredFlowcharts, filteredNotes, customPrdContent]);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(masterPrompt);
      setCopiedPrompt(true);
      toast.success('Prompt disalin');
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch {
      toast.error('Gagal menyalin');
    }
  };

  const handleDownloadPromptFile = () => {
    try {
      downloadMegaPromptFile(masterPrompt, projectName);
      toast.success('Prompt diunduh');
    } catch {
      toast.error('Gagal mengunduh prompt');
    }
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await downloadAgentBundleZip(bundleFiles, projectName);
      toast.success('ZIP diunduh');
    } catch (err: any) {
      toast.error(err?.message || 'Gagal mengunduh ZIP');
    } finally {
      setIsZipping(false);
    }
  };

  const handleGenerateInternalFileByFile = async () => {
    setIsGenerating(true);
    setGenerationProgress('Membuat PRD...');
    try {
      const res = await apiFetch('/api/ai/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content:
                'You are a Principal Software Architect. Generate an exhaustive, comprehensive enterprise Product Requirements Document (PRD) in formal Indonesian (Bahasa Indonesia baku kelas enterprise) for the specified project. Minimum 1,500 words with rich detail, DDD modules, SLA, and RBAC.',
            },
            {
              role: 'user',
              content: `Project Name: ${projectName}\nDomain: ${domain}\nTech Stack: ${techStack}`,
            },
          ],
        }),
      });

      if (!res.ok) throw new Error('Gagal memproses AI');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Streaming tidak didukung');

      let accumulated = '';
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setCustomPrdContent(accumulated);
      }

      setGenerationProgress('Selesai');
      toast.success('PRD berhasil dibuat');
    } catch (err: any) {
      toast.error(err?.message || 'Gagal generate');
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  if (!projectSlug) {
    return (
      <div className="flex-1 flex flex-col gap-4 p-4 sm:p-6 overflow-y-auto custom-scrollbar max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Users className="size-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">Generator Agen</h1>
              <p className="text-xs text-muted-foreground">Pilih proyek untuk membuat Mega Prompt &amp; 5 Agen AI</p>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchProjectQuery}
              onChange={(e) => setSearchProjectQuery(e.target.value)}
              placeholder="Cari"
              className="w-full text-xs h-8 pl-8 pr-3 rounded-lg border border-border/70 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {filteredProjects.map((proj) => {
            const pId = String(proj.id || proj.uid);
            const pSlug = proj.slug || proj.uid || pId;
            const tableCount = diagrams.filter((d) => String(d.project_id || d.projectId) === pId).length;
            const fcCount = flowcharts.filter((f) => String(f.project_id || f.projectId) === pId).length;
            const noteCount = notes.filter((n) => String(n.project_id || n.projectId) === pId).length;

            return (
              <div
                key={pId}
                onClick={() => navigate(`/agent-generator/${pSlug}`)}
                className="group rounded-xl border border-border/70 bg-card p-4 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-7 rounded-md bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                      <FolderKanban className="size-3.5" />
                    </div>
                    <span className="text-sm font-semibold text-foreground truncate group-hover:text-indigo-400 transition-colors">
                      {proj.name}
                    </span>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {proj.description || 'Proyek tanpa deskripsi khusus.'}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-muted-foreground border-t border-border/50 pt-2.5">
                  <span className="flex items-center gap-1">
                    <Database className="size-3 text-emerald-400" />
                    {tableCount} Diagram
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="size-3 text-violet-400" />
                    {fcCount} Alur
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="size-3 text-blue-400" />
                    {noteCount} Catatan
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-7.5 text-xs font-medium cursor-pointer group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all"
                >
                  Pilih
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-3 overflow-hidden p-3.5 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2.5 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            onClick={() => navigate('/agent-generator')}
            size="sm"
            variant="outline"
            className="h-8 gap-1 px-2.5 text-xs cursor-pointer border-border/70"
            title="Kembali ke daftar proyek"
          >
            <ArrowLeft className="size-3.5" />
            <span>Semua</span>
          </Button>

          <div className="min-w-0">
            <h1 className="text-sm font-bold text-foreground truncate flex items-center gap-2">
              <span>{projectName}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-indigo-500/30 text-indigo-400">
                {domain}
              </Badge>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            onClick={handleCopyPrompt}
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 px-3 text-xs cursor-pointer border-border/70"
          >
            {copiedPrompt ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
            <span>{copiedPrompt ? 'Disalin' : 'Salin Prompt'}</span>
          </Button>

          <Button
            onClick={handleDownloadPromptFile}
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 px-3 text-xs cursor-pointer border-border/70"
          >
            <Download className="size-3.5" />
            <span>Unduh Prompt</span>
          </Button>

          <Button
            onClick={handleGenerateInternalFileByFile}
            disabled={isGenerating}
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 px-3 text-xs cursor-pointer border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10"
          >
            {isGenerating ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
            <span>{isGenerating ? generationProgress || 'Menulis...' : 'Generate AI'}</span>
          </Button>

          <Button
            onClick={handleDownloadZip}
            disabled={isZipping}
            size="sm"
            className="h-8 gap-1.5 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
          >
            {isZipping ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
            <span>{isZipping ? 'Mengemas...' : 'Unduh ZIP'}</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col rounded-xl border border-border/70 bg-card overflow-hidden min-h-0 shadow-xs">
        <div className="flex items-center justify-between px-3.5 py-2 border-b border-border/60 bg-muted/20 shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="size-3.5 text-indigo-400" />
            <span className="text-xs font-semibold text-foreground">Mega Prompt</span>
          </div>

          <Badge variant="outline" className="text-[10px] px-2 py-0 h-4.5 border-border/70">
            {masterPrompt.split('\n').length} baris
          </Badge>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap select-text bg-background/50">
          {masterPrompt}
        </div>
      </div>
    </div>
  );
}
