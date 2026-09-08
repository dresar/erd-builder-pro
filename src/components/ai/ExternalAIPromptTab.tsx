import React from 'react';
import { Copy, Check, FileText, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FieldLabel } from '@/components/ui/field';
import { Badge } from '@/components/ui/badge';
import { InfoTip } from './InfoTip';
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
      {/* 1. Strategi Prompting */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
            Strategi
          </FieldLabel>
          <InfoTip text="Pilih paket all-in-one untuk hasil instan, atau strategi bertahap untuk merantai PRD ke ERD dan Flowchart." />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STRATEGY_PRESETS.map((strat) => {
            const isSelected = selectedStrategy === strat.id;
            return (
              <div
                key={strat.id}
                className={`flex items-center justify-between gap-1 p-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-foreground font-semibold ring-1 ring-indigo-500/20'
                    : 'bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedStrategy(strat.id)}
                  className="flex-1 text-xs truncate cursor-pointer text-left"
                >
                  {strat.label}
                </button>
                <InfoTip text={strat.description} />
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Context Chaining Box (bila strategi bertahap dipilih) */}
      {isChainingStrategy && (
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <FileText className="size-3.5 text-indigo-400" />
              <span className="text-xs font-semibold text-foreground">Konteks PRD</span>
              <InfoTip text="Pilih catatan proyek atau tempel ringkasan PRD agar ERD/Flowchart sesuai kebutuhan." />
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
                  <InfoTip text="Pilih diagram ERD untuk menyelaraskan entitas tabel pada flowchart." />
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

      {/* 3. Parameter Sistem (Nama Proyek & Skala Tabel) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
              Nama Proyek
            </FieldLabel>
            <InfoTip text="Nama sistem yang langsung disuntikkan ke dalam prompt AI." />
          </div>
          <input
            type="text"
            placeholder="Nama"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="flex h-8 w-full rounded-lg border border-border/60 bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
              Skala Tabel
            </FieldLabel>
            <InfoTip text="Target jumlah tabel relasional pada skema DBML." />
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {SCALE_PRESETS.map((scale) => {
              const isSelected = selectedScale === scale.id;
              return (
                <div
                  key={scale.id}
                  className={`flex items-center justify-between gap-1 p-1.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'bg-indigo-500/10 border-indigo-500/40 text-foreground font-semibold ring-1 ring-indigo-500/20'
                      : 'bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedScale(scale.id as any)}
                    className="flex-1 text-xs truncate cursor-pointer text-left"
                  >
                    {scale.label}
                  </button>
                  <InfoTip text={scale.description} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Domain Bisnis */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
            Domain Bisnis
          </FieldLabel>
          <InfoTip text="Pilih domain untuk penyesuaian modul dan entitas data spesifik." />
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {DOMAIN_PRESETS.map((domain) => {
            const isSelected = selectedDomain === domain.id;
            return (
              <div
                key={domain.id}
                className={`flex items-center justify-between gap-1 p-1.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-500/10 border-indigo-500/40 text-foreground font-semibold ring-1 ring-indigo-500/20'
                    : 'bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedDomain(domain.id)}
                  className="flex-1 text-xs truncate cursor-pointer text-left"
                >
                  {domain.label}
                </button>
                <InfoTip text={domain.description} />
              </div>
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

      {/* 5. Metode Deployment */}
      <ExternalAIDeploymentSection
        deploymentMethod={deploymentMethod}
        setDeploymentMethod={setDeploymentMethod}
        customDeployment={customDeployment}
        setCustomDeployment={setCustomDeployment}
      />

      {/* 6. Kepatuhan & Keamanan */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
            Keamanan
          </FieldLabel>
          <InfoTip text="Standar tata kelola data enterprise dan kontrol akses." />
        </div>
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

      {/* 7. Output Prompt */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
              Prompt Siap Pakai
            </FieldLabel>
            <Badge variant="secondary" className="text-[10px] font-mono">Claude / ChatGPT</Badge>
            <InfoTip text="Salin prompt ini ke Claude atau ChatGPT, lalu tempelkan hasilnya di tab Impor." />
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
