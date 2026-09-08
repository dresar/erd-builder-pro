import React from 'react';
import { Copy, Check, AlertCircle, FileText, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  PromptStrategy,
  STRATEGY_PRESETS,
  DOMAIN_PRESETS,
  SCALE_PRESETS,
} from './externalPromptTemplates';
import { ExternalAIDeploymentSection, DeploymentMethod } from './ExternalAIDeploymentSection';

interface ExternalAIPromptTabProps {
  projectName: string;
  setProjectName: (v: string) => void;
  selectedStrategy: PromptStrategy;
  setSelectedStrategy: (s: PromptStrategy) => void;
  selectedDomain: string;
  setSelectedDomain: (v: string) => void;
  customDomain: string;
  setCustomDomain: (v: string) => void;
  selectedScale: 'large' | 'enterprise' | 'ecosystem';
  setSelectedScale: (s: 'large' | 'enterprise' | 'ecosystem') => void;
  deploymentMethod: DeploymentMethod;
  setDeploymentMethod: (v: DeploymentMethod) => void;
  customDeployment: string;
  setCustomDeployment: (v: string) => void;
  complianceItems: string[];
  toggleCompliance: (item: string) => void;
  customNoteContext: string;
  setCustomNoteContext: (v: string) => void;
  customErdContext: string;
  setCustomErdContext: (v: string) => void;
  generatedPrompt: string;
  copied: boolean;
  onCopyPrompt: () => void;
  notes: any[];
  diagrams: any[];
}

export function ExternalAIPromptTab({
  projectName,
  setProjectName,
  selectedStrategy,
  setSelectedStrategy,
  selectedDomain,
  setSelectedDomain,
  customDomain,
  setCustomDomain,
  selectedScale,
  setSelectedScale,
  deploymentMethod,
  setDeploymentMethod,
  customDeployment,
  setCustomDeployment,
  complianceItems,
  toggleCompliance,
  customNoteContext,
  setCustomNoteContext,
  customErdContext,
  setCustomErdContext,
  generatedPrompt,
  copied,
  onCopyPrompt,
  notes,
  diagrams,
}: ExternalAIPromptTabProps) {
  const isChainingStrategy = selectedStrategy === 'notes_to_erd' || selectedStrategy === 'notes_to_flowchart';

  const handleSelectExistingNote = (uid: string) => {
    const target = notes.find((n) => String(n.uid ?? n.id) === String(uid));
    if (target?.content) {
      const clean = target.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      setCustomNoteContext(clean);
    }
  };

  const handleSelectExistingDiagram = (id: string) => {
    const target = diagrams.find((d) => String(d.id) === String(id) || String(d.uid) === String(id));
    if (target?.entities && target.entities.length > 0) {
      const summary = target.entities
        .map((e: any) => `- Table ${e.name}: [${e.columns?.map((c: any) => c.name).join(', ')}]`)
        .join('\n');
      setCustomErdContext(summary);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Strategi Prompting */}
      <div>
        <div className="flex items-center gap-1.5 mb-2.5">
          <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
            Strategi Generasi
          </FieldLabel>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Penjelasan">
                  <AlertCircle className="size-3.5 text-indigo-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-xs max-w-xs leading-relaxed">
                Pilih paket lengkap untuk hasil instan, atau gunakan strategi bertahap untuk merantai Catatan PRD ke ERD dan Flowchart.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STRATEGY_PRESETS.map((strat) => {
            const isSelected = selectedStrategy === strat.id;
            return (
              <button
                key={strat.id}
                type="button"
                onClick={() => setSelectedStrategy(strat.id)}
                className={`p-3 rounded-lg border text-left transition-all relative ${
                  isSelected
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-foreground ring-1 ring-indigo-500/20'
                    : 'bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="text-xs font-semibold text-foreground">
                    {strat.label}
                  </p>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    strat.badge === 'Rekomendasi'
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {strat.badge}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {strat.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Context Chaining Box (for Notes -> ERD or Notes -> Flowchart) */}
      {isChainingStrategy && (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-indigo-400" />
              <p className="text-xs font-bold text-foreground">Konteks PRD &amp; Catatan</p>
            </div>
            {notes.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground">Pilih Catatan:</span>
                <select
                  aria-label="Pilih Catatan"
                  onChange={(e) => handleSelectExistingNote(e.target.value)}
                  className="h-7 text-xs rounded-md bg-background border border-border/60 px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  defaultValue=""
                >
                  <option value="" disabled>Pilih</option>
                  {notes.map((n) => (
                    <option key={n.uid || n.id} value={n.uid || n.id}>
                      {n.title || 'Catatan'}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <textarea
            placeholder="Catatan"
            value={customNoteContext}
            onChange={(e) => setCustomNoteContext(e.target.value)}
            rows={4}
            className="w-full p-2.5 font-mono text-xs rounded-lg bg-background border border-border/50 text-foreground resize-y outline-none focus:border-indigo-500/50 leading-relaxed"
          />

          {selectedStrategy === 'notes_to_flowchart' && (
            <div className="pt-2 border-t border-indigo-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="size-4 text-indigo-400" />
                  <p className="text-xs font-bold text-foreground">Konteks Tabel ERD (Opsional)</p>
                </div>
                {diagrams.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">Pilih ERD:</span>
                    <select
                      aria-label="Pilih ERD"
                      onChange={(e) => handleSelectExistingDiagram(e.target.value)}
                      className="h-7 text-xs rounded-md bg-background border border-border/60 px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      defaultValue=""
                    >
                      <option value="" disabled>Pilih</option>
                      {diagrams.map((d) => (
                        <option key={d.uid || d.id} value={d.uid || d.id}>
                          {d.name || 'Diagram'}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <textarea
                placeholder="Tabel"
                value={customErdContext}
                onChange={(e) => setCustomErdContext(e.target.value)}
                rows={3}
                className="w-full p-2.5 font-mono text-xs rounded-lg bg-background border border-border/50 text-foreground resize-y outline-none focus:border-indigo-500/50 leading-relaxed"
              />
            </div>
          )}
        </div>
      )}

      {/* 3. Parameter Sistem (Nama Proyek & Skala) */}
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

      {/* 4. Domain Bisnis */}
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

      {/* 5. Metode Deployment Sub-Component */}
      <ExternalAIDeploymentSection
        deploymentMethod={deploymentMethod}
        setDeploymentMethod={setDeploymentMethod}
        customDeployment={customDeployment}
        setCustomDeployment={setCustomDeployment}
      />

      {/* 6. Kepatuhan & Keamanan */}
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
            'GDPR Data Masking',
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

      {/* 7. Output Prompt */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
              Prompt Siap Pakai
            </FieldLabel>
            <Badge variant="secondary" className="text-[10px] font-mono">Claude / ChatGPT</Badge>
          </div>
          <Button 
            onClick={onCopyPrompt} 
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
          Salin dan kirimkan prompt ini ke Claude 3.7 Sonnet atau ChatGPT. Lalu tempelkan hasilnya ke tab &quot;Impor&quot;.
        </p>
      </div>
    </div>
  );
}
