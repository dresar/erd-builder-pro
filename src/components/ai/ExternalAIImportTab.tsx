import React from 'react';
import { FileText, Database, Network, FolderPlus } from 'lucide-react';
import { FieldLabel } from '@/components/ui/field';

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
    <div className="space-y-5">
      <div>
        <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1 mb-1.5 block">
          Tempelkan Hasil dari Claude / ChatGPT
        </FieldLabel>
        <textarea 
          placeholder="JSON"
          value={rawJson}
          onChange={(e) => setRawJson(e.target.value)}
          rows={10}
          className="w-full p-3 font-mono text-xs rounded-lg bg-muted/20 border border-border/40 resize-y text-foreground outline-none focus:border-indigo-500/50 leading-relaxed"
        />
        <p className="text-[11px] text-muted-foreground mt-1.5 px-1">
          Mendukung bundel JSON lengkap, skema DBML, flowchart JSON murni, atau dokumen PRD Markdown.
        </p>
      </div>

      {/* Validation Status Cards */}
      {rawJson.trim() && (
        <div className="p-4 rounded-xl border border-border/40 bg-muted/10 space-y-3">
          <p className="text-xs font-semibold text-foreground">Hasil Analisis:</p>
          
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
            <p className="text-xs text-destructive font-mono">Format belum sesuai atau ada sintaks yang belum lengkap.</p>
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
  );
}
