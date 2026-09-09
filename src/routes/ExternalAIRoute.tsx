import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Check, Copy, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useWorkspace } from '@/providers/WorkspaceProvider';
import { generateExternalAIPrompt, DOMAIN_PRESETS, PromptConfig, PromptStrategy } from '@/components/ai/externalPromptTemplates';
import { ExternalAIPromptTab } from '@/components/ai/ExternalAIPromptTab';
import { ExternalAIImportTab } from '@/components/ai/ExternalAIImportTab';
import { CodeEditorPromptTab } from '@/components/ai/CodeEditorPromptTab';
import { applyExternalBundle } from '@/components/ai/applyExternalBundle';
import type { ParsedExternalBundle } from '@/components/ai/externalBundleTypes';

export function ExternalAIRoute() {
  const navigate = useNavigate();
  const { 
    projects, 
    notes,
    diagrams,
    flowcharts,
    handleSidebarProjectCreate, 
    handleSidebarDiagramCreate, 
    handleSidebarNoteCreate, 
    handleSidebarPrdCreate,
    handleSidebarFlowchartCreate,
    handleDiagramSelect,
    handleViewChange,
    selectedWorkspaceUid
  } = useWorkspace();

  const [activeTab, setActiveTab] = useState<'prompt' | 'editor' | 'import'>('editor');
  const [copied, setCopied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

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

  const [rawJson, setRawJson] = useState('');
  const [targetMode, setTargetMode] = useState<'new_project' | 'current_project'>('new_project');

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

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      toast.success('Disalin');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Gagal menyalin');
    }
  };

  const parsedData = useMemo<ParsedExternalBundle | null>(() => {
    if (!rawJson.trim()) return null;
    let cleaned = rawJson.trim();
    
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json|dbml|markdown|md)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    try {
      const parsed = JSON.parse(cleaned);
      if (typeof parsed === 'object' && parsed !== null) {
        let projName = typeof parsed.project === 'string' ? parsed.project : (parsed.project?.name || projectName || '');
        const rawPrd = parsed.prd ?? parsed.notes ?? parsed.doc ?? parsed.markdown;
        const rawErd = parsed.erd ?? parsed.schema ?? parsed.database ?? parsed.dbml;
        const rawFc = parsed.flowchart ?? parsed.alur ?? (Array.isArray(parsed.nodes) ? parsed : null);

        let prdObj: ParsedExternalBundle['prd'] | undefined;
        if (typeof rawPrd === 'string' && rawPrd.trim()) {
          const titleMatch = rawPrd.match(/^#\s+([^\n]+)$/m);
          const projMatch = rawPrd.match(/(?:[>“"*\s]*Proyek\*{0,2}[:\s]+|Project(?:\s+Name)?[:\s]+["']?)([^"'\n|”]+)/i);
          if (projMatch && !projName) projName = projMatch[1].trim();
          prdObj = {
            title: titleMatch ? titleMatch[1].trim() : `PRD - ${projName || 'Sistem'}`,
            content_markdown: rawPrd.trim(),
          };
        } else if (rawPrd && typeof rawPrd === 'object') {
          prdObj = {
            title: rawPrd.title || `PRD - ${projName || 'Sistem'}`,
            content_markdown: rawPrd.content_markdown || rawPrd.content || rawPrd.markdown || '',
          };
        }

        let erdObj: ParsedExternalBundle['erd'] | undefined;
        if (typeof rawErd === 'string' && rawErd.trim()) {
          erdObj = { title: `ERD - ${projName || 'Sistem'}`, dbml: rawErd.trim() };
        } else if (rawErd && typeof rawErd === 'object') {
          erdObj = {
            title: rawErd.title || `ERD - ${projName || 'Sistem'}`,
            dbml: rawErd.dbml || rawErd.schema || rawErd.content || '',
          };
        }

        let fcObj: ParsedExternalBundle['flowchart'] | undefined;
        if (rawFc && typeof rawFc === 'object') {
          const nodes = Array.isArray(rawFc.nodes) ? rawFc.nodes : [];
          const edges = Array.isArray(rawFc.edges) ? rawFc.edges : [];
          if (nodes.length > 0) {
            fcObj = { title: rawFc.title || `Alur - ${projName || 'Sistem'}`, nodes, edges };
          }
        }

        if (prdObj || erdObj || fcObj) {
          return {
            project: { name: projName || 'Proyek Enterprise' },
            prd: prdObj,
            erd: erdObj,
            flowchart: fcObj,
          };
        }
      }
    } catch {}

    if (/Table\s+["']?[\w.]+["']?\s*\{/i.test(cleaned)) {
      return {
        erd: {
          title: `ERD - ${projectName || 'Sistem'}`,
          dbml: cleaned
        }
      };
    }

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

  const detectedTableCount = useMemo(() => {
    if (!parsedData?.erd?.dbml) return 0;
    const matches = parsedData.erd.dbml.match(/Table\s+["']?[\w.]+["']?\s*\{/gi);
    return matches ? matches.length : 0;
  }, [parsedData]);

  const toggleCompliance = (item: string) => {
    setComplianceItems(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleApplyBundle = async () => {
    if (!parsedData) {
      toast.error('Format belum sesuai');
      return;
    }

    setIsApplying(true);
    try {
      await applyExternalBundle({
        parsedData,
        targetMode,
        selectedWorkspaceUid,
        projectName,
        handleSidebarProjectCreate,
        handleSidebarPrdCreate,
        handleSidebarFlowchartCreate,
        handleSidebarDiagramCreate,
        handleDiagramSelect,
        handleViewChange,
        onClose: () => {
          if (parsedData.erd) {
            navigate('/table/erd');
          } else if (parsedData.prd) {
            navigate('/table/prd');
          } else if (parsedData.flowchart) {
            navigate('/table/flowchart');
          } else {
            navigate('/');
          }
        },
      });
    } catch {
      toast.error('Gagal menerapkan');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden">
      <div className="flex flex-col gap-3 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold">AI Eksternal</h2>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-muted border border-border/40 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'editor' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Editor AI (Claude/Cursor)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('prompt')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'prompt' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Prompt Arsitektur
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('import')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'import' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Impor
                {parsedData && <span className="size-1.5 rounded-full bg-emerald-500" />}
              </button>
            </div>

            {activeTab === 'prompt' && (
              <Button
                onClick={handleCopyPrompt}
                size="sm"
                className="h-8 gap-1 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
              >
                {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                <span>{copied ? 'Disalin' : 'Salin'}</span>
              </Button>
            )}

            {activeTab === 'import' && (
              <Button
                onClick={handleApplyBundle}
                disabled={!parsedData || isApplying}
                size="sm"
                className="h-8 gap-1 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer disabled:opacity-50"
              >
                {isApplying ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                <span>{isApplying ? 'Menerapkan...' : 'Terapkan ke Proyek'}</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar rounded-xl border bg-background p-4 sm:p-5">
        {activeTab === 'editor' ? (
          <CodeEditorPromptTab
            projects={projects}
            diagrams={diagrams}
            flowcharts={flowcharts}
            notes={notes}
            selectedWorkspaceUid={selectedWorkspaceUid}
          />
        ) : activeTab === 'prompt' ? (
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
    </div>
  );
}
