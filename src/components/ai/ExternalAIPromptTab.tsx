import React from 'react';
import { Copy, Check, FileText, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FieldLabel } from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
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
    <div className="space-y-4">
      <div className="space-y-1.5">
        <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
          Strategi
        </FieldLabel>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STRATEGY_PRESETS.map((strat) => {
            const isSelected = selectedStrategy === strat.id;
            return (
              <button
                key={strat.id}
                type="button"
                onClick={() => setSelectedStrategy(strat.id)}
                className={`p-2 rounded-lg border text-xs font-medium truncate text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-foreground font-semibold ring-1 ring-indigo-500/20'
                    : 'bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20'
                }`}
              >
                {strat.label}
              </button>
            );
          })}
        </div>
      </div>

      {isChainingStrategy && (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <FileText className="size-3.5 text-indigo-400" />
              <span className="text-xs font-semibold text-foreground">Konteks PRD</span>
            </div>
            {notes.length > 0 && (
              <select
                aria-label="Pilih Catatan"
                onChange={(e) => handleSelectExistingNote(e.target.value)}
                className="h-6 text-[11px] rounded bg-background border border-border/60 px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                defaultValue=""
              >
                <option value="" disabled>Pilih Catatan</option>
                {notes.map((n) => (
                  <option key={n.uid || n.id} value={n.uid || n.id}>
                    {n.title || 'Catatan'}
                  </option>
                ))}
              </select>
            )}
          </div>

          <textarea
            placeholder="Catatan"
            value={customNoteContext}
            onChange={(e) => setCustomNoteContext(e.target.value)}
            rows={3}
            className="w-full p-2 font-mono text-xs rounded-lg bg-background border border-border/50 text-foreground resize-y outline-none focus:border-indigo-500/50 leading-relaxed"
          />

          {selectedStrategy === 'notes_to_flowchart' && (
            <div className="pt-2 border-t border-indigo-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Database className="size-3.5 text-indigo-400" />
                  <span className="text-xs font-semibold text-foreground">Konteks ERD</span>
                </div>
                {diagrams.length > 0 && (
                  <select
                    aria-label="Pilih ERD"
                    onChange={(e) => handleSelectExistingDiagram(e.target.value)}
                    className="h-6 text-[11px] rounded bg-background border border-border/60 px-2 text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    defaultValue=""
                  >
                    <option value="" disabled>Pilih ERD</option>
                    {diagrams.map((d) => (
                      <option key={d.uid || d.id} value={d.uid || d.id}>
                        {d.name || 'Diagram'}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <textarea
                placeholder="Tabel"
                value={customErdContext}
                onChange={(e) => setCustomErdContext(e.target.value)}
                rows={2}
                className="w-full p-2 font-mono text-xs rounded-lg bg-background border border-border/50 text-foreground resize-y outline-none focus:border-indigo-500/50 leading-relaxed"
              />
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1 mb-1 block">
            Nama Proyek
          </FieldLabel>
          <input
            type="text"
            placeholder="Nama"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="flex h-8 w-full rounded-lg border border-border/60 bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1 mb-1 block">
            Skala Tabel
          </FieldLabel>
          <div className="grid grid-cols-3 gap-1.5">
            {SCALE_PRESETS.map((scale) => {
              const isSelected = selectedScale === scale.id;
              return (
                <button
                  key={scale.id}
                  type="button"
                  onClick={() => setSelectedScale(scale.id as any)}
                  className={`p-1.5 rounded-lg border text-xs font-medium truncate text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-500/10 border-indigo-500/40 text-foreground font-semibold ring-1 ring-indigo-500/20'
                      : 'bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20'
                  }`}
                >
                  {scale.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
          Domain Bisnis
        </FieldLabel>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {DOMAIN_PRESETS.map((domain) => {
            const isSelected = selectedDomain === domain.id;
            return (
              <button
                key={domain.id}
                type="button"
                onClick={() => setSelectedDomain(domain.id)}
                className={`p-1.5 rounded-lg border text-xs font-medium truncate text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-foreground font-semibold ring-1 ring-indigo-500/20'
                    : 'bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20'
                }`}
              >
                {domain.label}
              </button>
            );
          })}
        </div>
        {selectedDomain === 'custom' && (
          <div className="pt-1">
            <input
              type="text"
              placeholder="Domain"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              className="flex h-8 w-full rounded-lg border border-border/60 bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}
      </div>

      <ExternalAIDeploymentSection
        deploymentMethod={deploymentMethod}
        setDeploymentMethod={setDeploymentMethod}
        customDeployment={customDeployment}
        setCustomDeployment={setCustomDeployment}
      />

      <div className="space-y-1.5">
        <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
          Keamanan
        </FieldLabel>
        <div className="flex flex-wrap gap-1.5">
          {[
            'Audit Trail',
            'RBAC',
            'Soft Delete',
            'Multi-Tenant',
            '2FA',
            'GDPR',
          ].map((item) => {
            const isSelected = complianceItems.some(c => c.toLowerCase().includes(item.toLowerCase()));
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleCompliance(item)}
                className={`px-2.5 py-1 rounded-md border text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 font-semibold'
                    : 'bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}{item}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-1.5 pt-1">
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
            className="h-7 gap-1 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? '✓ Disalin' : 'Salin'}
          </Button>
        </div>

        <textarea 
          readOnly
          value={generatedPrompt}
          rows={6}
          className="w-full p-2.5 font-mono text-xs rounded-lg bg-muted/20 border border-border/40 resize-none text-muted-foreground outline-none focus:ring-1 focus:ring-indigo-500/30 leading-relaxed"
        />
      </div>
    </div>
  );
}
