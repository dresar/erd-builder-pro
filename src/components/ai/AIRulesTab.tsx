import { useState, useEffect } from 'react';
import { BookText, Cable, Database, Share2, Save, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAIRules, ViewType } from '@/hooks/useAIRules';
import { toast } from 'sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const VIEW_TABS: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  { id: 'erd', label: 'ERD', icon: <Database className="w-4 h-4" /> },
  { id: 'notes', label: 'Catatan', icon: <BookText className="w-4 h-4" /> },
  { id: 'flowchart', label: 'Flowchart', icon: <Share2 className="w-4 h-4" /> },
  { id: 'db-client', label: 'Koneksi DB', icon: <Cable className="w-4 h-4" /> },
];

export function AIRulesTab() {
  const [activeView, setActiveView] = useState<ViewType>('erd');
  const { rules, isLoading, isSaving, saveRules } = useAIRules(activeView);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    setDraft(rules?.content ?? '');
  }, [rules]);

  const handleSave = async () => {
    await saveRules(draft);
    toast.success('✓ Tersimpan!');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="flex items-center gap-1.5">
          <h2 className="text-lg font-semibold text-foreground">Aturan AI</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger type="button" className="text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Penjelasan">
                <AlertCircle className="size-3.5 text-amber-500/80 hover:text-amber-500" />
              </TooltipTrigger>
              <TooltipContent className="text-xs max-w-xs">
                Aturan khusus yang otomatis aktif saat Anda membuka tampilan ini.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Aturan per tampilan kerja.
        </p>
      </div>

      {/* View type tabs */}
      <div className="flex gap-1 bg-muted border border-border rounded-lg p-1 w-fit">
        {VIEW_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold transition-all ${
              activeView === tab.id
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Rules editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Aturan {activeView.toUpperCase()}
          </label>
          {rules && !rules.is_enabled && (
            <span className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
              <AlertCircle className="w-3 h-3" />
              Nonaktif
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Instruksi"
            className="w-full min-h-70 bg-muted/30 border border-border rounded-lg p-4 text-sm font-mono text-foreground focus:outline-none focus:border-primary/50 resize-y placeholder:text-muted-foreground/50"
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-[11px] text-muted-foreground max-w-lg">
          Aturan ditaati kecuali Anda meminta hal lain di pesan.
        </p>
        <Button
          onClick={handleSave}
          disabled={isSaving || isLoading}
          variant="outline"
          size="sm"
          className="h-9 px-4 border-border hover:bg-muted bg-muted/50 text-xs font-semibold"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
          ) : (
            <Save className="w-3.5 h-3.5 mr-1.5" />
          )}
          Simpan
        </Button>
      </div>
    </div>
  );
}
