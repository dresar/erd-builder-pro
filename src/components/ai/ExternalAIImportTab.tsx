import React from 'react';
import { FileText, Database, Network, FolderPlus } from 'lucide-react';
import { FieldLabel } from '@/components/ui/field';
import { InfoTip } from './InfoTip';

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

interface ExternalAIImportTabProps {
  rawJson: string;
  setRawJson: (v: string) => void;
  parsedData: ParsedExternalBundle | null;
  detectedTableCount: number;
  targetMode: 'new_project' | 'current_project';
  setTargetMode: (m: 'new_project' | 'current_project') => void;
  projectName: string;
}

export function ExternalAIImportTab({
  rawJson,
  setRawJson,
  parsedData,
  detectedTableCount,
  targetMode,
  setTargetMode,
  projectName,
}: ExternalAIImportTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
            Hasil AI
          </FieldLabel>
          <InfoTip text="Mendukung bundel JSON lengkap, skema DBML, flowchart JSON, atau dokumen PRD Markdown." />
        </div>
        <textarea 
          placeholder="Tempel"
          value={rawJson}
          onChange={(e) => setRawJson(e.target.value)}
          rows={8}
          className="w-full p-2.5 font-mono text-xs rounded-lg bg-muted/20 border border-border/40 resize-y text-foreground outline-none focus:border-indigo-500/50 leading-relaxed"
        />
      </div>

      {/* Validation Status Cards */}
      {rawJson.trim() && (
        <div className="p-3 rounded-xl border border-border/40 bg-muted/10 space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-foreground">Analisis</span>
            <InfoTip text="Status deteksi aset dari teks yang ditempelkan." />
          </div>
          
          {parsedData ? (
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2 rounded-lg border border-border/30 bg-background flex items-center gap-2">
                <FileText className={`size-3.5 ${parsedData.prd ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                <div className="truncate">
                  <p className="text-xs font-bold truncate">PRD</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {parsedData.prd?.content_markdown ? `✓ ${parsedData.prd.content_markdown.length} kar` : '–'}
                  </p>
                </div>
              </div>

              <div className="p-2 rounded-lg border border-border/30 bg-background flex items-center gap-2">
                <Database className={`size-3.5 ${detectedTableCount > 0 ? 'text-indigo-400' : 'text-muted-foreground'}`} />
                <div className="truncate">
                  <p className="text-xs font-bold truncate">ERD</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {detectedTableCount > 0 ? `✓ ${detectedTableCount} tabel` : '–'}
                  </p>
                </div>
              </div>

              <div className="p-2 rounded-lg border border-border/30 bg-background flex items-center gap-2">
                <Network className={`size-3.5 ${parsedData.flowchart?.nodes?.length ? 'text-amber-500' : 'text-muted-foreground'}`} />
                <div className="truncate">
                  <p className="text-xs font-bold truncate">Alur</p>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {parsedData.flowchart?.nodes?.length ? `✓ ${parsedData.flowchart.nodes.length} node` : '–'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-destructive font-mono">Format belum sesuai.</p>
          )}
        </div>
      )}

      {/* Target Project Selection */}
      <div className="p-3 rounded-xl border border-border/40 bg-muted/5 space-y-2">
        <div className="flex items-center gap-1.5">
          <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
            Target Proyek
          </FieldLabel>
          <InfoTip text="Pilih membuat proyek baru untuk bundel ini atau menggabungkan ke proyek saat ini." />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setTargetMode('new_project')}
            className={`p-2.5 rounded-lg border text-left transition-all flex items-center gap-2 ${
              targetMode === 'new_project'
                ? 'bg-indigo-500/10 border-indigo-500/40 text-foreground font-semibold ring-1 ring-indigo-500/20'
                : 'bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20'
            }`}
          >
            <FolderPlus className="size-4 text-indigo-400 shrink-0" />
            <div className="truncate">
              <p className="text-xs font-semibold truncate">Proyek Baru</p>
              <p className="text-[10px] text-muted-foreground truncate">
                {parsedData?.project?.name || projectName || 'Proyek Baru'}
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTargetMode('current_project')}
            className={`p-2.5 rounded-lg border text-left transition-all flex items-center gap-2 ${
              targetMode === 'current_project'
                ? 'bg-indigo-500/10 border-indigo-500/40 text-foreground font-semibold ring-1 ring-indigo-500/20'
                : 'bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20'
            }`}
          >
            <Database className="size-4 text-amber-400 shrink-0" />
            <div className="truncate">
              <p className="text-xs font-semibold truncate">Proyek Aktif</p>
              <p className="text-[10px] text-muted-foreground truncate">Gabungkan aset</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
