import React, { useState, useRef } from 'react';
import { FileText, Database, Network, FolderPlus, Upload, FileCode, X } from 'lucide-react';
import { FieldLabel } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
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
  const [isDragging, setIsDragging] = useState(false);
  const [loadedFileName, setLoadedFileName] = useState<string | null>(null);
  const [loadedFileSize, setLoadedFileSize] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileRead = async (file: File) => {
    try {
      const text = await file.text();
      setRawJson(text);
      setLoadedFileName(file.name);
      const sizeInKb = (file.size / 1024).toFixed(1);
      setLoadedFileSize(`${sizeInKb} KB`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileRead(file);
    }
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileRead(file);
    }
  };

  const handleClear = () => {
    setRawJson('');
    setLoadedFileName(null);
    setLoadedFileSize(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
              Hasil AI
            </FieldLabel>
            <InfoTip text="Unggah berkas atau tempel JSON, DBML, atau Markdown hasil arsitektur AI." />
          </div>
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.dbml,.sql,.txt,.md"
              onChange={handleFileChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-7 px-2.5 text-xs font-medium gap-1.5 border-border/50 hover:bg-muted/40 cursor-pointer"
            >
              <Upload className="size-3 text-indigo-400" />
              <span>Unggah Berkas</span>
            </Button>
          </div>
        </div>

        {loadedFileName && (
          <div className="mb-2 px-2.5 py-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/5 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <FileCode className="size-3.5 text-indigo-400 shrink-0" />
              <span className="text-xs font-mono font-medium text-foreground truncate">{loadedFileName}</span>
              <span className="text-[10px] text-muted-foreground shrink-0">({loadedFileSize})</span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded transition-colors cursor-pointer"
              title="Hapus berkas"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setIsDragging(false);
          }}
          onDrop={handleDrop}
          className="relative"
        >
          <textarea
            placeholder="Tempel JSON atau seret berkas ke sini..."
            value={rawJson}
            onChange={(e) => {
              setRawJson(e.target.value);
              if (!e.target.value) {
                setLoadedFileName(null);
                setLoadedFileSize(null);
              }
            }}
            rows={8}
            className={`w-full p-2.5 font-mono text-xs rounded-lg bg-muted/20 border transition-all resize-y text-foreground outline-none leading-relaxed ${
              isDragging
                ? 'border-indigo-500 ring-2 ring-indigo-500/30 bg-indigo-500/10'
                : 'border-border/40 focus:border-indigo-500/50'
            }`}
          />
          {isDragging && (
            <div className="absolute inset-0 rounded-lg bg-indigo-500/10 backdrop-blur-[1px] border-2 border-dashed border-indigo-500 flex flex-col items-center justify-center gap-2 pointer-events-none">
              <Upload className="size-6 text-indigo-400 animate-bounce" />
              <p className="text-xs font-semibold text-indigo-300">Lepaskan berkas di sini untuk memuat</p>
            </div>
          )}
        </div>
      </div>

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
