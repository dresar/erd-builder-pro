import React, { useState, useMemo } from 'react';
import { 
  Bot, 
  Copy, 
  Check, 
  Sparkles, 
  Database, 
  FileText, 
  Network, 
  FolderPlus, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Download
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import { useWorkspace } from '@/providers/WorkspaceContext';
import { 
  generateExternalAIPrompt, 
  DOMAIN_PRESETS, 
  SCALE_PRESETS, 
  PromptConfig 
} from './externalPromptTemplates';

interface ExternalAIGeneratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ParsedExternalBundle {
  project?: {
    name?: string;
    description?: string;
  };
  prd?: {
    title?: string;
    content_markdown?: string;
  };
  erd?: {
    title?: string;
    dbml?: string;
  };
  flowchart?: {
    title?: string;
    nodes?: any[];
    edges?: any[];
  };
}

export function ExternalAIGeneratorDialog({ isOpen, onClose }: ExternalAIGeneratorDialogProps) {
  const { 
    projects, 
    handleSidebarProjectCreate, 
    handleSidebarDiagramCreate, 
    handleSidebarNoteCreate, 
    handleSidebarFlowchartCreate,
    handleViewChange,
    selectedWorkspaceUid
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<'prompt' | 'import'>('prompt');
  const [copied, setCopied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  // Form states for prompt builder
  const [projectName, setProjectName] = useState('Sistem Enterprise Terpadu');
  const [selectedDomain, setSelectedDomain] = useState('saas');
  const [customDomain, setCustomDomain] = useState('');
  const [selectedScale, setSelectedScale] = useState<'large' | 'enterprise' | 'ecosystem'>('enterprise');
  const [deploymentMethod, setDeploymentMethod] = useState<'vercel' | 'ai_choice' | 'local' | 'vps' | 'cloudflare' | 'aws' | 'other'>('vercel');
  const [customDeployment, setCustomDeployment] = useState('');
  const [architectureStyle, setArchitectureStyle] = useState<'modular' | 'ai_choice' | 'microservices' | 'serverless_edge'>('modular');
  const [techStack, setTechStack] = useState('Serverless on Vercel + Supabase PostgreSQL + Edge Functions');
  const [complianceItems, setComplianceItems] = useState<string[]>([
    'Audit Trail',
    'RBAC (Roles & Permissions)',
    'Soft Deletes (deleted_at)',
    'Multi-Tenant Data Isolation'
  ]);
  const [notesReq, setNotesReq] = useState('');

  // Import states
  const [rawJson, setRawJson] = useState('');
  const [targetMode, setTargetMode] = useState<'new_project' | 'current_project'>('new_project');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(selectedWorkspaceUid || '');

  // Computed generated prompt
  const generatedPrompt = useMemo(() => {
    const domainLabel = selectedDomain === 'custom' 
      ? (customDomain.trim() || 'Sistem Bisnis Khusus') 
      : (DOMAIN_PRESETS.find(d => d.id === selectedDomain)?.label || 'SaaS');

    const config: PromptConfig = {
      projectName: projectName.trim() || 'Sistem Enterprise',
      domain: domainLabel,
      scale: selectedScale,
      deploymentMethod,
      customDeployment: customDeployment.trim(),
      architectureStyle,
      compliance: complianceItems,
      techStack: techStack.trim(),
      notesRequirement: notesReq.trim()
    };
    return generateExternalAIPrompt(config);
  }, [projectName, selectedDomain, customDomain, selectedScale, deploymentMethod, customDeployment, architectureStyle, techStack, complianceItems, notesReq]);

  // Handle prompt copy
  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      toast.success('✓ Disalin!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Gagal menyalin prompt.');
    }
  };

  // Parse pasted JSON
  const parsedData = useMemo<ParsedExternalBundle | null>(() => {
    if (!rawJson.trim()) return null;
    try {
      let cleaned = rawJson.trim();
      // Strip markdown ```json ... ``` code fence if user pasted with fences
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
      }
      const parsed = JSON.parse(cleaned);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as ParsedExternalBundle;
      }
      return null;
    } catch {
      return null;
    }
  }, [rawJson]);

  // Detected tables count from DBML
  const detectedTableCount = useMemo(() => {
    if (!parsedData?.erd?.dbml) return 0;
    const matches = parsedData.erd.dbml.match(/Table\s+["']?[\w.]+["']?\s*\{/gi);
    return matches ? matches.length : 0;
  }, [parsedData]);

  // Toggle compliance item
  const toggleCompliance = (item: string) => {
    setComplianceItems(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  // Handle applying the imported JSON bundle
  const handleApplyBundle = async () => {
    if (!parsedData) {
      toast.error('Format JSON tidak valid.');
      return;
    }

    setIsApplying(true);
    try {
      let projectId: string | null = null;
      const effectiveName = parsedData.project?.name?.trim() || projectName.trim() || 'Proyek Enterprise';

      if (targetMode === 'new_project') {
        toast.info('Membuat proyek...');
        await handleSidebarProjectCreate(effectiveName);
        // Find latest created project
        const latestProj = projects.find(p => p.name === effectiveName);
        projectId = latestProj ? String(latestProj.uid ?? latestProj.id) : null;
      } else {
        projectId = selectedProjectId || null;
      }

      // 1. Create PRD Note
      if (parsedData.prd?.content_markdown) {
        toast.info('Membuat Catatan PRD...');
        localStorage.setItem('pending_note_content', parsedData.prd.content_markdown);
        localStorage.setItem('pending_note_strategy', 'replace');
        const prdTitle = parsedData.prd.title || 'PRD Arsitektur';
        await handleSidebarNoteCreate(prdTitle, projectId);
      }

      // 2. Create Flowchart
      if (parsedData.flowchart?.nodes && parsedData.flowchart.nodes.length > 0) {
        toast.info('Membuat Flowchart...');
        localStorage.setItem('pending_create_flowchart_json', JSON.stringify(parsedData.flowchart));
        const fcTitle = parsedData.flowchart.title || `Alur - ${effectiveName}`;
        await handleSidebarFlowchartCreate(fcTitle, projectId, { silent: true });
      }

      // 3. Create ERD Diagram (non-silent so it selects and opens on canvas)
      if (parsedData.erd?.dbml) {
        toast.info('Membuat ERD Enterprise...');
        localStorage.setItem('pending_create_erd_schema', parsedData.erd.dbml);
        const erdBundlename = parsedData.erd.title || `ERD - ${effectiveName}`;
        await handleSidebarDiagramCreate(erdBundlename, projectId, { silent: false });
      } else {
        await handleViewChange('notes', true, projectId);
      }

      toast.success('✓ Berhasil!');
      onClose();
    } catch {
      toast.error('Gagal menerapkan data.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-225 max-h-[90vh] p-0 overflow-hidden flex flex-col border-border/50 shadow-2xl">
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-border/40 bg-muted/10 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Bot className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <DialogTitle className="text-base font-bold">AI Eksternal</DialogTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button type="button" className="text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Penjelasan">
                          <AlertCircle className="size-3.5 text-indigo-400" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="text-xs max-w-xs leading-relaxed">
                        Hasilkan mega-prompt enterprise untuk Claude atau ChatGPT, lalu tempelkan JSON hasilnya ke tab Impor untuk membuat Catatan (PRD), ERD (25+ tabel), dan Flowchart sekaligus.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <DialogDescription className="text-xs text-muted-foreground">
                  Generator prompt enterprise &amp; importer multi-aset.
                </DialogDescription>
              </div>
            </div>

            {/* Tab switch buttons */}
            <div className="flex gap-1 bg-muted border border-border/40 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setActiveTab('prompt')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeTab === 'prompt' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Buat Prompt
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('import')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'import' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Impor JSON
                {parsedData && <span className="size-1.5 rounded-full bg-emerald-500" />}
              </button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {activeTab === 'prompt' ? (
            <div className="space-y-6">
              {/* Question configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
                    Nama Proyek
                  </FieldLabel>
                  <Input 
                    placeholder="Proyek"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
                    Skala Tabel
                  </FieldLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {SCALE_PRESETS.map((scale) => (
                      <button
                        key={scale.id}
                        type="button"
                        onClick={() => setSelectedScale(scale.id as any)}
                        className={`p-2 rounded-lg border text-left transition-all ${
                          selectedScale === scale.id
                            ? 'bg-indigo-500/10 border-indigo-500/40 text-foreground font-semibold ring-1 ring-indigo-500/20'
                            : 'bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20'
                        }`}
                      >
                        <p className="text-xs">{scale.label}</p>
                      </button>
                    ))}
                  </div>
                </Field>
              </div>

              {/* Domain selection */}
              <div>
                <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1 mb-2 block">
                  Domain Bisnis
                </FieldLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {DOMAIN_PRESETS.map((domain) => (
                    <button
                      key={domain.id}
                      type="button"
                      onClick={() => setSelectedDomain(domain.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        selectedDomain === domain.id
                          ? 'bg-indigo-500/10 border-indigo-500/40 text-foreground font-semibold ring-1 ring-indigo-500/20'
                          : 'bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20'
                      }`}
                    >
                      <p className="text-xs font-semibold">{domain.label}</p>
                      <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{domain.description}</p>
                    </button>
                  ))}
                </div>
                {selectedDomain === 'custom' && (
                  <div className="mt-3">
                    <Input 
                      placeholder="Domain"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Deployment method questionnaire (matching screenshot) */}
              <div className="rounded-xl border border-border/60 bg-muted/15 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <FieldLabel className="text-xs font-bold text-foreground">
                      Metode deployment apa yang harus digunakan?
                    </FieldLabel>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" className="text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Penjelasan">
                            <AlertCircle className="size-3.5 text-amber-500/80" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="text-xs max-w-xs">
                          Pilih Vercel (Serverless) untuk arsitektur serverless website production modern.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {[
                    { id: 'vercel', label: 'Vercel (Serverless)', isRecommended: true },
                    { id: 'ai_choice', label: 'Biarkan AI yang pilih (Serverless Vercel)', isAi: true },
                    { id: 'local', label: 'Pengembangan lokal' },
                    { id: 'vps', label: 'Docker / VPS Linux' },
                    { id: 'cloudflare', label: 'Cloudflare Pages & Workers' },
                    { id: 'aws', label: 'AWS Cloud Enterprise' },
                    { id: 'other', label: 'Jawaban lain' },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDeploymentMethod(opt.id as any)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs transition-all ${
                        deploymentMethod === opt.id
                          ? 'bg-primary/10 border border-primary/40 font-medium text-foreground ring-1 ring-primary/20'
                          : 'border border-transparent hover:bg-muted/30 text-muted-foreground'
                      }`}
                    >
                      <span className={`flex size-4 items-center justify-center rounded-full border ${
                        deploymentMethod === opt.id ? 'border-primary bg-primary' : 'border-muted-foreground/40'
                      }`}>
                        {deploymentMethod === opt.id && <span className="size-1.5 rounded-full bg-primary-foreground" />}
                      </span>
                      {opt.isRecommended && (
                        <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary uppercase">
                          Rekomendasi
                        </span>
                      )}
                      <span className="flex-1">{opt.label}</span>
                    </button>
                  ))}
                  {deploymentMethod === 'other' && (
                    <div className="pt-1.5">
                      <Input
                        placeholder="Jawaban lain"
                        value={customDeployment}
                        onChange={(e) => setCustomDeployment(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Compliance & Security */}
              <div>
                <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1 mb-2 block">
                  Standar Keamanan &amp; Kepatuhan
                </FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Audit Trail',
                    'RBAC (Roles & Permissions)',
                    'Soft Deletes (deleted_at)',
                    'Multi-Tenant Data Isolation',
                    'Two-Factor Authentication (2FA)',
                    'GDPR Data Masking'
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleCompliance(item)}
                      className={`px-3 py-1.5 rounded-lg border text-xs transition-all ${
                        complianceItems.includes(item)
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium'
                          : 'bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20'
                      }`}
                    >
                      {complianceItems.includes(item) ? '✓ ' : '+ '}{item}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Output Area */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
                      Prompt Siap Pakai
                    </FieldLabel>
                    <Badge variant="secondary" className="text-[10px] font-mono">Claude / ChatGPT</Badge>
                  </div>
                  <Button 
                    onClick={handleCopyPrompt} 
                    size="sm" 
                    className="h-8 gap-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    {copied ? '✓ Disalin' : 'Salin'}
                  </Button>
                </div>

                <div className="relative">
                  <textarea 
                    readOnly
                    value={generatedPrompt}
                    rows={8}
                    className="w-full p-3 font-mono text-xs rounded-lg bg-muted/20 border border-border/40 resize-none text-muted-foreground outline-none focus:ring-1 focus:ring-indigo-500/30 leading-relaxed"
                  />
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Salin dan kirimkan prompt ini ke Claude 3.7 Sonnet atau ChatGPT. Lalu tempelkan JSON hasilnya ke tab &quot;Impor JSON&quot;.
                </p>
              </div>
            </div>
          ) : (
            /* Tab 2: Impor JSON */
            <div className="space-y-5">
              <div>
                <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1 mb-1.5 block">
                  Tempelkan JSON dari Claude / ChatGPT
                </FieldLabel>
                <textarea 
                  placeholder="JSON"
                  value={rawJson}
                  onChange={(e) => setRawJson(e.target.value)}
                  rows={10}
                  className="w-full p-3 font-mono text-xs rounded-lg bg-muted/20 border border-border/40 resize-y text-foreground outline-none focus:border-indigo-500/50 leading-relaxed"
                />
              </div>

              {/* Validation Status Cards */}
              {rawJson.trim() && (
                <div className="p-4 rounded-xl border border-border/40 bg-muted/10 space-y-3">
                  <p className="text-xs font-semibold text-foreground">Hasil Analisis JSON:</p>
                  
                  {parsedData ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* PRD Status */}
                      <div className="p-3 rounded-lg border border-border/30 bg-background flex items-center gap-2.5">
                        <FileText className={`size-4 ${parsedData.prd ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                        <div>
                          <p className="text-xs font-bold">Catatan PRD</p>
                          <p className="text-[10px] text-muted-foreground">
                            {parsedData.prd?.content_markdown 
                              ? `✓ ${parsedData.prd.content_markdown.length} karakter` 
                              : 'Tidak ditemukan'}
                          </p>
                        </div>
                      </div>

                      {/* ERD Status */}
                      <div className="p-3 rounded-lg border border-border/30 bg-background flex items-center gap-2.5">
                        <Database className={`size-4 ${detectedTableCount > 0 ? 'text-indigo-400' : 'text-muted-foreground'}`} />
                        <div>
                          <p className="text-xs font-bold">ERD Database</p>
                          <p className="text-[10px] text-muted-foreground">
                            {detectedTableCount > 0 
                              ? `✓ ${detectedTableCount} tabel terdeteksi` 
                              : 'Tidak ditemukan'}
                          </p>
                        </div>
                      </div>

                      {/* Flowchart Status */}
                      <div className="p-3 rounded-lg border border-border/30 bg-background flex items-center gap-2.5">
                        <Network className={`size-4 ${parsedData.flowchart?.nodes?.length ? 'text-amber-500' : 'text-muted-foreground'}`} />
                        <div>
                          <p className="text-xs font-bold">Flowchart</p>
                          <p className="text-[10px] text-muted-foreground">
                            {parsedData.flowchart?.nodes?.length 
                              ? `✓ ${parsedData.flowchart.nodes.length} node logika` 
                              : 'Tidak ditemukan'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-destructive font-mono">Format JSON belum lengkap atau ada sintaks yang salah.</p>
                  )}
                </div>
              )}

              {/* Target Project Selection */}
              <div className="p-4 rounded-xl border border-border/40 bg-muted/5 space-y-3">
                <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 block">
                  Target Proyek
                </FieldLabel>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetMode('new_project')}
                    className={`p-3 rounded-lg border text-left transition-all flex items-center gap-2.5 ${
                      targetMode === 'new_project'
                        ? 'bg-indigo-500/10 border-indigo-500/40 text-foreground font-semibold ring-1 ring-indigo-500/20'
                        : 'bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20'
                    }`}
                  >
                    <FolderPlus className="size-4 text-indigo-400" />
                    <div>
                      <p className="text-xs font-semibold">Buat Proyek Baru</p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {parsedData?.project?.name || projectName || 'Proyek Baru'}
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetMode('current_project')}
                    className={`p-3 rounded-lg border text-left transition-all flex items-center gap-2.5 ${
                      targetMode === 'current_project'
                        ? 'bg-indigo-500/10 border-indigo-500/40 text-foreground font-semibold ring-1 ring-indigo-500/20'
                        : 'bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20'
                    }`}
                  >
                    <Database className="size-4 text-amber-400" />
                    <div>
                      <p className="text-xs font-semibold">Gunakan Proyek Aktif</p>
                      <p className="text-[10px] text-muted-foreground">Gabungkan ke ruang kerja saat ini</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border/40 bg-muted/5 flex items-center justify-between gap-3 shrink-0">
          <Button variant="ghost" onClick={onClose} className="h-9 px-4 text-xs font-medium">
            Batal
          </Button>

          {activeTab === 'prompt' ? (
            <Button 
              onClick={() => setActiveTab('import')} 
              variant="outline" 
              size="sm" 
              className="h-9 gap-1.5 px-4 text-xs"
            >
              Lanjut ke Impor
            </Button>
          ) : (
            <Button 
              disabled={!parsedData || isApplying} 
              onClick={handleApplyBundle}
              size="sm" 
              className="h-9 gap-1.5 px-5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isApplying ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
              Terapkan
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
