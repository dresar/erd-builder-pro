import { useState } from 'react';
import {
  Globe,
  Loader2,
  Check,
  X,
  ExternalLink,
  BookOpen,
  FileText,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';

export interface AttachedWebDoc {
  id: string;
  url: string;
  title: string;
  wordCount: number;
  markdown: string;
}

interface WebUrlReaderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAttachDoc: (doc: AttachedWebDoc) => void;
}

export function WebUrlReaderDialog({
  open,
  onOpenChange,
  onAttachDoc,
}: WebUrlReaderDialogProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedDoc, setFetchedDoc] = useState<{
    url: string;
    title: string;
    markdown: string;
    wordCount: number;
    excerpt: string;
  } | null>(null);

  if (!open) return null;

  const handleFetchUrl = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanUrl = url.trim();
    if (!cleanUrl) {
      toast.error('Masukkan URL terlebih dahulu');
      return;
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      toast.error('URL harus diawali dengan http:// atau https://');
      return;
    }

    setIsLoading(true);
    setFetchedDoc(null);

    try {
      const res = await apiFetch('/api/ai/read-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: cleanUrl }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Gagal membaca tautan');
      }

      setFetchedDoc(data);
      toast.success('Halaman web berhasil dikonversi ke Markdown');
    } catch (err: any) {
      toast.error(err?.message || 'Gagal mengambil konten URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttach = () => {
    if (!fetchedDoc) return;
    onAttachDoc({
      id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      url: fetchedDoc.url,
      title: fetchedDoc.title,
      wordCount: fetchedDoc.wordCount,
      markdown: fetchedDoc.markdown,
    });
    toast.success(`Dokumen "${fetchedDoc.title}" terlampir`);
    setUrl('');
    setFetchedDoc(null);
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/70 bg-muted/20">
          <div className="flex items-center gap-2">
            <Globe className="size-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-foreground">
              Baca Dokumen Web (URL ke Markdown)
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
          <form onSubmit={handleFetchUrl} className="space-y-2">
            <label className="text-xs font-medium text-foreground block">
              Tautan Halaman Web / Dokumentasi
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Globe className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://docs.stripe.com/api atau link docs lainnya"
                  className="w-full text-xs h-8.5 pl-8 pr-3 rounded-lg border border-border/70 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !url.trim()}
                size="sm"
                className="h-8.5 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <BookOpen className="size-3.5" />
                )}
                <span>{isLoading ? 'Membaca...' : 'Baca Konten'}</span>
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Sistem akan mengambil teks, membersihkan iklan &amp; navigasi, lalu mengonversi HTML menjadi Markdown bersih untuk dibaca oleh AI.
            </p>
          </form>

          {/* Result Card */}
          {fetchedDoc && (
            <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/5 p-3.5 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-foreground block truncate">
                    {fetchedDoc.title}
                  </span>
                  <a
                    href={fetchedDoc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1 mt-0.5 truncate"
                  >
                    <span className="truncate">{fetchedDoc.url}</span>
                    <ExternalLink className="size-3 shrink-0" />
                  </a>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium shrink-0">
                  {fetchedDoc.wordCount.toLocaleString()} kata
                </span>
              </div>

              <div className="rounded-md border border-border/60 bg-background/80 p-2.5 max-h-36 overflow-y-auto custom-scrollbar text-[11px] text-muted-foreground font-mono leading-relaxed whitespace-pre-wrap">
                {fetchedDoc.excerpt}
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  onClick={handleAttach}
                  size="sm"
                  className="h-8 gap-1.5 px-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                >
                  <Check className="size-3.5" />
                  <span>Lampirkan ke Obrolan</span>
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-4 py-2.5 border-t border-border/70 bg-muted/10">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs cursor-pointer"
          >
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}
