import React from 'react';
import { Copy, Check, FileText, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FieldLabel } from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
      {/* ── Form Controls (Dropdowns & Inputs) ── */}
      <div className="rounded-xl border border-border/60 bg-card/20 p-3.5 sm:p-4 space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Nama Proyek */}
          <div>
            <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1 mb-1 block">
              Nama Proyek
            </FieldLabel>
            <input
              type="text"
              placeholder="Nama Proyek"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="flex h-8.5 w-full rounded-lg border border-border/60 bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Strategi */}
          <div>
            <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1 mb-1 block">
              Strategi
            </FieldLabel>
            <Select value={selectedStrategy} onValueChange={(v) => v && setSelectedStrategy(v as PromptStrategy)}>
              <SelectTrigger className="h-8.5 text-xs bg-background border-border/60">
                <SelectValue placeholder="Pilih Strategi">
                  {STRATEGY_PRESETS.find((s) => s.id === selectedStrategy)?.label || 'All-in-One'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {STRATEGY_PRESETS.map((strat) => (
                  <SelectItem key={strat.id} value={strat.id} className="text-xs py-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{strat.label}</span>
                      <span className="text-[10px] text-muted-foreground">({strat.badge})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Skala Tabel */}
          <div>
            <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1 mb-1 block">
              Skala Tabel
            </FieldLabel>
            <Select value={selectedScale} onValueChange={(v) => v && setSelectedScale(v as any)}>
              <SelectTrigger className="h-8.5 text-xs bg-background border-border/60">
                <SelectValue placeholder="Pilih Skala">
                  {SCALE_PRESETS.find((s) => s.id === selectedScale)?.label || '35+ Tabel'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SCALE_PRESETS.map((scale) => (
                  <SelectItem key={scale.id} value={scale.id} className="text-xs py-1.5">
                    <span className="font-medium">{scale.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Domain Bisnis */}
          <div>
            <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1 mb-1 block">
              Domain Bisnis
            </FieldLabel>
            <Select value={selectedDomain} onValueChange={(v) => v && setSelectedDomain(v)}>
              <SelectTrigger className="h-8.5 text-xs bg-background border-border/60">
                <SelectValue placeholder="Pilih Domain">
                  {DOMAIN_PRESETS.find((d) => d.id === selectedDomain)?.label || 'SaaS'}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {DOMAIN_PRESETS.map((domain) => (
                  <SelectItem key={domain.id} value={domain.id} className="text-xs py-1.5">
                    <span className="font-medium">{domain.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedDomain === 'custom' && (
              <div className="mt-1.5">
                <input
                  type="text"
                  placeholder="Ketik domain khusus..."
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  className="flex h-8.5 w-full rounded-lg border border-border/60 bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Deployment */}
          <ExternalAIDeploymentSection
            deploymentMethod={deploymentMethod}
            setDeploymentMethod={setDeploymentMethod}
            customDeployment={customDeployment}
            setCustomDeployment={setCustomDeployment}
          />
        </div>

        {/* Keamanan & Kepatuhan */}
        <div className="pt-2 border-t border-border/40 space-y-1.5">
          <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
            Keamanan & Kepatuhan
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
              const isSelected = complianceItems.some((c) => c.toLowerCase().includes(item.toLowerCase()));
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
