import React, { useState, useMemo } from 'react';
import { 
  Bot, 
  Check, 
  Loader2,
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
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/providers/WorkspaceContext';
import { 
  generateExternalAIPrompt, 
  DOMAIN_PRESETS, 
  PromptConfig,
  PromptStrategy
} from './externalPromptTemplates';
import { ExternalAIPromptTab } from './ExternalAIPromptTab';
import { ExternalAIImportTab } from './ExternalAIImportTab';
import { InfoTip } from './InfoTip';

interface ExternalAIGeneratorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ParsedExternalBundle {
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
    notes,
    diagrams,
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
  const [selectedStrategy, setSelectedStrategy] = useState<PromptStrategy>('all_in_one');
  const [projectName, setProjectName] = useState('Sistem Enterprise');
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
  const [customNoteContext, setCustomNoteContext] = useState('');
  const [customErdContext, setCustomErdContext] = useState('');

  // Import states
  const [rawJson, setRawJson] = useState('');
  const [targetMode, setTargetMode] = useState<'new_project' | 'current_project'>('new_project');

  // Computed generated prompt — instantly updates on projectName keystrokes
  const generatedPrompt = useMemo(() => {
    const domainLabel = selectedDomain === 'custom' 
      ? (customDomain.trim() || 'Bisnis Khusus') 
      : (DOMAIN_PRESETS.find(d => d.id === selectedDomain)?.label || 'SaaS');

    const config: PromptConfig = {
      strategy: selectedStrategy,
      projectName: projectName || 'Proyek',
      domain: domainLabel,
      scale: selectedScale,
      deploymentMethod,
      customDeployment: customDeployment.trim(),
      architectureStyle,
      compliance: complianceItems,
      techStack: techStack.trim(),
      existingNotesContext: customNoteContext.trim(),
      existingErdContext: customErdContext.trim(),
    };
    return generateExternalAIPrompt(config);
  }, [selectedStrategy, projectName, selectedDomain, customDomain, selectedScale, deploymentMethod, customDeployment, architectureStyle, techStack, complianceItems, customNoteContext, customErdContext]);

  // Handle prompt copy
  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      toast.success('✓ Disalin!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Gagal menyalin.');
    }
  };

  // Resilient multi-format parser
  const parsedData = useMemo<ParsedExternalBundle | null>(() => {
    if (!rawJson.trim()) return null;
    let cleaned = rawJson.trim();
    
    // Strip markdown code fences if wrapped
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json|dbml|markdown|md)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    // 1. Try standard JSON parse
    try {
      const parsed = JSON.parse(cleaned);
      if (typeof parsed === 'object' && parsed !== null) {
        if (parsed.prd || parsed.erd || parsed.flowchart || parsed.project) {
          return parsed as ParsedExternalBundle;
        }
        if (Array.isArray(parsed.nodes)) {
          return {
            flowchart: {
              title: `Alur - ${projectName || 'Sistem'}`,
              nodes: parsed.nodes,
              edges: parsed.edges || []
            }
          };
        }
      }
    } catch {
      // Non-JSON fallback
    }

    // 2. Direct DBML schema detection
    if (/Table\s+["']?[\w.]+["']?\s*\{/i.test(cleaned)) {
      return {
        erd: {
          title: `ERD - ${projectName || 'Sistem'}`,
          dbml: cleaned
        }
      };
    }

    // 3. Direct Markdown PRD detection
    if (cleaned.startsWith('#') || cleaned.includes('\n#')) {
      const titleMatch = cleaned.match(/^#\s+(.+)$/m);
      return {
        prd: {
          title: titleMatch ? titleMatch[1].trim() : `PRD - ${projectName || 'Sistem'}`,
          content_markdown: cleaned
        }
      };
    }

    return null;
  }, [rawJson, projectName]);

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

  // Handle applying the imported bundle
  const handleApplyBundle = async () => {
    if (!parsedData) {
      toast.error('Format belum sesuai.');
      return;
    }

    setIsApplying(true);
    try {
      let projectId: string | null = null;
      const effectiveName = parsedData.project?.name?.trim() || projectName.trim() || 'Proyek Enterprise';

      if (targetMode === 'new_project') {
        toast.info('Membuat proyek...');
        await handleSidebarProjectCreate(effectiveName);
        const latestProj = projects.find(p => p.name === effectiveName);
        projectId = latestProj ? String(latestProj.uid ?? latestProj.id) : null;
      } else {
        projectId = selectedWorkspaceUid || null;
      }

      // 1. Create PRD Note
      if (parsedData.prd?.content_markdown) {
        toast.info('Membuat Catatan...');
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
        await handleSidebarFlowchartCreate(fcTitle, projectId, { silent: Boolean(parsedData.erd?.dbml) });
      }

      // 3. Create ERD Diagram
      if (parsedData.erd?.dbml) {
        toast.info('Membuat ERD...');
        localStorage.setItem('pending_create_erd_schema', parsedData.erd.dbml);
        const erdBundlename = parsedData.erd.title || `ERD - ${effectiveName}`;
        await handleSidebarDiagramCreate(erdBundlename, projectId, { silent: false });
      } else if (parsedData.flowchart?.nodes && parsedData.flowchart.nodes.length > 0) {
        await handleViewChange('flowchart', true, projectId);
      } else {
        await handleViewChange('notes', true, projectId);
      }

      toast.success('✓ Berhasil!');
      onClose();
    } catch {
      toast.error('Gagal menerapkan.');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-225 max-h-[90vh] p-0 overflow-hidden flex flex-col border-border/50 shadow-2xl">
        <DialogHeader className="px-5 py-3 border-b border-border/40 bg-muted/10 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400">
                <Bot className="size-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <DialogTitle className="text-sm font-bold">AI Eksternal</DialogTitle>
                <InfoTip text="Generator prompt arsitektur dan pengimpor multi-aset untuk Claude dan ChatGPT." />
              </div>
            </div>
            <DialogDescription className="sr-only">AI Eksternal Generator</DialogDescription>

            {/* Tab switch buttons */}
            <div className="flex gap-1 bg-muted border border-border/40 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('prompt')}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
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
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'import' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Impor
                {parsedData && <span className="size-1.5 rounded-full bg-emerald-500" />}
              </button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
          {activeTab === 'prompt' ? (
            <ExternalAIPromptTab
              projectName={projectName}
              setProjectName={setProjectName}
              selectedStrategy={selectedStrategy}
              setSelectedStrategy={setSelectedStrategy}
              selectedDomain={selectedDomain}
              setSelectedDomain={setSelectedDomain}
              customDomain={customDomain}
              setCustomDomain={setCustomDomain}
              selectedScale={selectedScale}
              setSelectedScale={setSelectedScale}
              deploymentMethod={deploymentMethod}
              setDeploymentMethod={setDeploymentMethod}
              customDeployment={customDeployment}
              setCustomDeployment={setCustomDeployment}
              complianceItems={complianceItems}
              toggleCompliance={toggleCompliance}
              customNoteContext={customNoteContext}
              setCustomNoteContext={setCustomNoteContext}
              customErdContext={customErdContext}
              setCustomErdContext={setCustomErdContext}
              generatedPrompt={generatedPrompt}
              copied={copied}
              onCopyPrompt={handleCopyPrompt}
              notes={notes}
              diagrams={diagrams}
            />
          ) : (
            <ExternalAIImportTab
              rawJson={rawJson}
              setRawJson={setRawJson}
              parsedData={parsedData}
              detectedTableCount={detectedTableCount}
              targetMode={targetMode}
              setTargetMode={setTargetMode}
              projectName={projectName}
            />
          )}
        </div>

        <DialogFooter className="px-5 py-3 border-t border-border/40 bg-muted/5 flex items-center justify-between gap-3 shrink-0">
          <Button variant="ghost" onClick={onClose} className="h-8 px-3 text-xs font-medium cursor-pointer">
            Batal
          </Button>

          {activeTab === 'prompt' ? (
            <Button 
              onClick={() => setActiveTab('import')} 
              variant="outline" 
              size="sm" 
              className="h-8 gap-1.5 px-3.5 text-xs cursor-pointer"
            >
              Lanjut
            </Button>
          ) : (
            <Button 
              disabled={!parsedData || isApplying} 
              onClick={handleApplyBundle}
              size="sm" 
              className="h-8 gap-1.5 px-4 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
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
