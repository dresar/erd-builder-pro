import { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  Download,
  FileCode2,
  Terminal,
  FolderArchive,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  TargetEditor,
  TARGET_EDITORS,
  generateModularPromptFiles,
  generateAllInOnePrompt,
  exportPromptBundleZip,
  PromptFile,
} from './codeEditorPromptGenerator';

interface CodeEditorPromptTabProps {
  projects: any[];
  diagrams: any[];
  flowcharts: any[];
  notes: any[];
  selectedWorkspaceUid?: string | null;
}

export function CodeEditorPromptTab({
  projects = [],
  diagrams = [],
  flowcharts = [],
  notes = [],
  selectedWorkspaceUid,
}: CodeEditorPromptTabProps) {
  const [targetEditor, setTargetEditor] = useState<TargetEditor>('claude_cli');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [projectName, setProjectName] = useState<string>('Sistem Enterprise');
  const [domain, setDomain] = useState<string>('SaaS Multi-Tenant');
  const [techStack, setTechStack] = useState<string>(
    'Next.js / Vite + Express + Prisma PostgreSQL + Tailwind CSS'
  );
  const [customDirectives, setCustomDirectives] = useState<string>('');
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'modular' | 'combined'>('modular');
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  // Filter entities according to selected project if specific project chosen
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
    const pId = e.target.value;
    setSelectedProjectId(pId);
    if (pId !== 'all') {
      const proj = projects.find(
        (p) => String(p.id) === String(pId) || String(p.uid) === String(pId)
      );
      if (proj) {
        setProjectName(proj.name || 'Proyek');
      }
    }
  };

  const files: PromptFile[] = useMemo(() => {
    return generateModularPromptFiles({
      targetEditor,
      projectName,
      domain,
      techStack,
      diagrams: filteredDiagrams,
      flowcharts: filteredFlowcharts,
      notes: filteredNotes,
      customRequirements: customDirectives.trim(),
    });
  }, [
    targetEditor,
    projectName,
    domain,
    techStack,
    filteredDiagrams,
    filteredFlowcharts,
    filteredNotes,
    customDirectives,
  ]);

  const activeFile = files[activeFileIndex] || files[0];
  const combinedPrompt = useMemo(() => {
    return generateAllInOnePrompt(files, projectName);
  }, [files, projectName]);

  const handleCopyCurrentFile = async () => {
    try {
      await navigator.clipboard.writeText(activeFile.content);
      setCopiedFile(true);
      toast.success(`Disalin: ${activeFile.filename}`);
      setTimeout(() => setCopiedFile(false), 2000);
    } catch {
      toast.error('Gagal menyalin');
    }
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(combinedPrompt);
      setCopiedAll(true);
      toast.success('Semua berkas berhasil disalin');
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      toast.error('Gagal menyalin');
    }
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      await exportPromptBundleZip(files, projectName);
      toast.success('Bundel ZIP berhasil diunduh');
    } catch (err: any) {
      toast.error(err?.message || 'Gagal mengunduh ZIP');
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* ── 1. Target Selector Cards ── */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Terminal className="size-3.5 text-indigo-400" />
          Target AI Coding Assistant / Editor
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
          {TARGET_EDITORS.map((target) => {
            const isSelected = targetEditor === target.id;
            return (
              <button
                key={target.id}
                type="button"
                onClick={() => setTargetEditor(target.id)}
                className={`flex flex-col text-left p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-500/10 text-foreground ring-1 ring-indigo-500/40 shadow-sm'
                    : 'border-border/60 bg-card hover:bg-muted/30 text-muted-foreground'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-indigo-400' : 'text-foreground'}`}>
                    {target.label}
                  </span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-indigo-500/30 text-indigo-400">
                    {target.fileLabel}
                  </Badge>
                </div>
                <p className="text-[11px] line-clamp-2 text-muted-foreground leading-relaxed mt-0.5">
                  {target.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2. Project Parameters ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl border border-border/60 bg-card/60">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Sumber Data Proyek
          </label>
          <select
            value={selectedProjectId}
            onChange={handleProjectSelect}
            className="w-full text-xs h-8 px-2.5 rounded-md border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Semua Entitas Workspace</option>
            {projects.map((p) => (
              <option key={p.id || p.uid} value={p.id || p.uid}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Nama Sistem / Aplikasi
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Contoh: Platform Logistik Nasional"
            className="w-full text-xs h-8 px-2.5 rounded-md border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Domain Bisnis
          </label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Contoh: FinTech, SaaS, ERP"
            className="w-full text-xs h-8 px-2.5 rounded-md border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Tech Stack Sasaran
          </label>
          <input
            type="text"
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="Contoh: Next.js + PostgreSQL + Prisma + Tailwind CSS"
            className="w-full text-xs h-8 px-2.5 rounded-md border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1">
            Instruksi / Aturan Kustom
          </label>
          <input
            type="text"
            value={customDirectives}
            onChange={(e) => setCustomDirectives(e.target.value)}
            placeholder="Opsional: Aturan spesifik proyek"
            className="w-full text-xs h-8 px-2.5 rounded-md border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* ── 3. Actions & View Mode ── */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        <div className="flex items-center gap-1.5 bg-muted/60 border border-border/50 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setViewMode('modular')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'modular'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layers className="size-3.5 text-indigo-400" />
            Berkas Modular ({files.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('combined')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'combined'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="size-3.5 text-amber-400" />
            Master Prompt (Gabungan)
          </button>
        </div>

        <div className="flex items-center gap-2">
          {viewMode === 'modular' ? (
            <Button
              onClick={handleCopyCurrentFile}
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 px-3 text-xs border-border/60 hover:bg-muted cursor-pointer"
            >
              {copiedFile ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              <span>{copiedFile ? 'Disalin' : `Salin ${activeFile.filename}`}</span>
            </Button>
          ) : (
            <Button
              onClick={handleCopyAll}
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 px-3 text-xs border-border/60 hover:bg-muted cursor-pointer"
            >
              {copiedAll ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
              <span>{copiedAll ? 'Disalin' : 'Salin Semua'}</span>
            </Button>
          )}

          <Button
            onClick={handleDownloadZip}
            disabled={isZipping}
            size="sm"
            className="h-8 gap-1.5 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
          >
            {isZipping ? (
              <FolderArchive className="size-3.5 animate-pulse" />
            ) : (
              <Download className="size-3.5" />
            )}
            <span>{isZipping ? 'Mengemas...' : 'Unduh Bundel (.ZIP)'}</span>
          </Button>
        </div>
      </div>

      {/* ── 4. File Navigation (Tabs) in Modular Mode ── */}
      {viewMode === 'modular' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {files.map((file, idx) => {
            const isActive = activeFileIndex === idx;
            return (
              <button
                key={file.filename}
                type="button"
                onClick={() => setActiveFileIndex(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 border transition-all cursor-pointer ${
                  isActive
                    ? 'border-indigo-500/70 bg-indigo-500/10 text-foreground shadow-xs'
                    : 'border-border/50 bg-card hover:bg-muted/40 text-muted-foreground'
                }`}
              >
                <FileCode2 className={`size-3.5 ${isActive ? 'text-indigo-400' : 'text-muted-foreground'}`} />
                <span>{file.filename}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── 5. File Preview Container ── */}
      <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/60 bg-muted/20">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-bold text-foreground truncate">
              {viewMode === 'modular' ? activeFile.filename : `MASTER_PROMPT_${projectName.toUpperCase().replace(/\s+/g, '_')}.md`}
            </span>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              — {viewMode === 'modular' ? activeFile.title : 'Seluruh berkas disatukan'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
              {viewMode === 'modular'
                ? `${activeFile.content.split('\n').length} baris • ${activeFile.content.length.toLocaleString()} karakter`
                : `${combinedPrompt.split('\n').length} baris • ${combinedPrompt.length.toLocaleString()} karakter`}
            </Badge>
          </div>
        </div>

        <div className="p-4 max-h-[520px] overflow-y-auto custom-scrollbar font-mono text-xs leading-relaxed whitespace-pre-wrap bg-background/50 select-text">
          {viewMode === 'modular' ? activeFile.content : combinedPrompt}
        </div>
      </div>
    </div>
  );
}
