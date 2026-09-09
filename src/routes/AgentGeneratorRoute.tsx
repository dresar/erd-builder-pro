import { useState, useMemo } from 'react';
import {
  Users,
  Copy,
  Check,
  Download,
  Sparkles,
  Bot,
  FileText,
  Database,
  Layers,
  ShieldCheck,
  Terminal,
  Loader2,
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
  AGENT_TEAM,
  GeneratedBundleFile,
} from '@/lib/multiAgentPromptGenerator';

export function AgentGeneratorRoute() {
  const { projects, diagrams, flowcharts, notes } = useWorkspace();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [projectName, setProjectName] = useState<string>('Sistem Enterprise');
  const [domain, setDomain] = useState<string>('SaaS Multi-Tenant');
  const [techStack, setTechStack] = useState<string>('Next.js 15 + PostgreSQL (Prisma) + Express + Tailwind CSS');
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'prompt' | 'prd' | 'agents' | 'schema'>('prompt');
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPrdContent, setGeneratedPrdContent] = useState<string>('');

  const filteredDiagrams = useMemo(() => {
    if (selectedProjectId === 'all') return diagrams;
    return diagrams.filter(
      (d) => String(d.project_id) === String(selectedProjectId) || String(d.projectId) === String(selectedProjectId)
    );
  }, [diagrams, selectedProjectId]);

  const filteredFlowcharts = useMemo(() => {
    if (selectedProjectId === 'all') return flowcharts;
    return flowcharts.filter(
      (f) => String(f.project_id) === String(selectedProjectId) || String(f.projectId) === String(selectedProjectId)
    );
  }, [flowcharts, selectedProjectId]);

  const filteredNotes = useMemo(() => {
    if (selectedProjectId === 'all') return notes;
    return notes.filter(
      (n) => String(n.project_id) === String(selectedProjectId) || String(n.projectId) === String(selectedProjectId)
    );
  }, [notes, selectedProjectId]);

  const handleProjectSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedProjectId(id);
    if (id !== 'all') {
      const proj = projects.find((p) => String(p.id) === String(id) || String(p.uid) === String(id));
      if (proj) setProjectName(proj.name || 'Proyek');
    }
  };

  const masterPrompt = useMemo(() => {
    return buildClaudeMasterPrompt({
      projectName,
      domain,
      techStack,
      diagrams: filteredDiagrams,
      flowcharts: filteredFlowcharts,
      notes: filteredNotes,
      customInstructions: customInstructions.trim(),
    });
  }, [projectName, domain, techStack, filteredDiagrams, filteredFlowcharts, filteredNotes, customInstructions]);

  const bundleFiles: GeneratedBundleFile[] = useMemo(() => {
    const defaultFiles = buildDefaultBundleFiles({
      projectName,
      domain,
      techStack,
      diagrams: filteredDiagrams,
      flowcharts: filteredFlowcharts,
      notes: filteredNotes,
      customInstructions: customInstructions.trim(),
    });

    if (generatedPrdContent) {
      const prdFile = defaultFiles.find((f) => f.path === 'docs/PRD.md');
      if (prdFile) prdFile.content = generatedPrdContent;
    }

    return defaultFiles;
  }, [projectName, domain, techStack, filteredDiagrams, filteredFlowcharts, filteredNotes, customInstructions, generatedPrdContent]);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(masterPrompt);
      setCopied(true);
      toast.success('Prompt disalin');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Gagal menyalin');
    }
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await downloadAgentBundleZip(bundleFiles, projectName);
      toast.success('ZIP diunduh');
    } catch (err: any) {
      toast.error(err?.message || 'Gagal mengunduh');
    } finally {
      setIsZipping(false);
    }
  };

  const handleGenerateInternal = async () => {
    setIsGenerating(true);
    try {
      const res = await apiFetch('/api/ai/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content:
                'You are a Principal Software Architect. Generate an exhaustive, comprehensive enterprise Product Requirements Document (PRD) in formal Indonesian (Bahasa Indonesia baku kelas enterprise) for the specified project. Minimum 1,500 words with rich detail, DDD modules, and RBAC.',
            },
            {
              role: 'user',
              content: `Project Name: ${projectName}\nDomain: ${domain}\nTech Stack: ${techStack}\nInstructions: ${customInstructions || 'Complete production specification'}`,
            },
          ],
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal memproses permintaan AI');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('Streaming tidak didukung');

      let accumulated = '';
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setGeneratedPrdContent(accumulated);
      }

      setActiveTab('prd');
      toast.success('PRD selesai');
    } catch (err: any) {
      toast.error(err?.message || 'Gagal generate');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentPreviewContent = useMemo(() => {
    if (activeTab === 'prompt') return masterPrompt;
    if (activeTab === 'prd') {
      return bundleFiles.find((f) => f.path === 'docs/PRD.md')?.content || '';
    }
    if (activeTab === 'schema') {
      return bundleFiles.find((f) => f.path === 'database/schema.dbml')?.content || '';
    }
    return bundleFiles
      .filter((f) => f.path.startsWith('.agents/'))
      .map((f) => `### ${f.title} (${f.path})\n\n${f.content}`)
      .join('\n\n---\n\n');
  }, [activeTab, masterPrompt, bundleFiles]);

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden p-4 sm:p-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Users className="size-4" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-foreground">Generator Agen</h1>
            <p className="text-[11px] text-muted-foreground">Orkestrasi 5 Agen AI &amp; Bundel Proyek</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleCopyPrompt}
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 px-3 text-xs cursor-pointer border-border/70"
          >
            {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
            <span>{copied ? 'Disalin' : 'Salin Prompt'}</span>
          </Button>

          <Button
            onClick={handleGenerateInternal}
            disabled={isGenerating}
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 px-3 text-xs cursor-pointer border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/10"
          >
            {isGenerating ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
            <span>{isGenerating ? 'Menulis...' : 'Generate AI'}</span>
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

      {/* ── Team Overview Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 shrink-0">
        {AGENT_TEAM.map((agent, i) => (
          <div
            key={agent.id}
            className="rounded-lg border border-border/70 bg-card/60 p-2.5 space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-indigo-400">Agent {i + 1}</span>
              <span className="size-1.5 rounded-full bg-emerald-500" />
            </div>
            <p className="text-xs font-semibold text-foreground truncate">{agent.name}</p>
            <p className="text-[10px] text-muted-foreground line-clamp-1 leading-tight">{agent.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Project Parameters ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 p-3 rounded-xl border border-border/70 bg-card/40 shrink-0">
        <div>
          <label className="text-[11px] font-medium text-muted-foreground block mb-1">
            Data Proyek
          </label>
          <select
            value={selectedProjectId}
            onChange={handleProjectSelect}
            className="w-full text-xs h-8 px-2 rounded-md border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Semua Entitas</option>
            {projects.map((p) => (
              <option key={p.id || p.uid} value={p.id || p.uid}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-medium text-muted-foreground block mb-1">
            Nama Sistem
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Nama"
            className="w-full text-xs h-8 px-2.5 rounded-md border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-muted-foreground block mb-1">
            Domain Bisnis
          </label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Domain"
            className="w-full text-xs h-8 px-2.5 rounded-md border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-muted-foreground block mb-1">
            Tech Stack
          </label>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="Stack"
            className="w-full text-xs h-8 px-2.5 rounded-md border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* ── View Selector & Code Display ── */}
      <div className="flex-1 flex flex-col rounded-xl border border-border/70 bg-card overflow-hidden min-h-0">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 bg-muted/20 shrink-0">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('prompt')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'prompt'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Terminal className="size-3 text-indigo-400" />
              Prompt Claude (English)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('prd')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'prd'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <FileText className="size-3 text-blue-400" />
              PRD (Indonesia)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('agents')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'agents'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="size-3 text-emerald-400" />
              5 Agen Teamwork
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('schema')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'schema'
                  ? 'bg-background text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Database className="size-3 text-amber-400" />
              Skema DBML
            </button>
          </div>

          <Badge variant="outline" className="text-[10px] px-2 py-0 h-4.5 border-border/70">
            {currentPreviewContent.split('\n').length} baris
          </Badge>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap select-text bg-background/50">
          {currentPreviewContent}
        </div>
      </div>
    </div>
  );
}
