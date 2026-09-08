import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogBody
} from "@/components/ui/dialog";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, RefreshCw, Check, Share2, Globe, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface ShareModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  documentType: 'erd' | 'notes' | 'drawings' | 'flowchart';
  documentUid: string;
  documentId: number | string;
  documentTitle: string;
  isPublicView?: boolean;
  initialSettings?: {
    is_public: boolean;
    share_token?: string;
    expiry_date?: string;
  };
  onSettingsSaved?: () => void;
}

export function ShareModal({
  isOpen,
  onOpenChange,
  documentType,
  documentUid,
  documentId,
  documentTitle,
  isPublicView = false,
  initialSettings,
  onSettingsSaved
}: ShareModalProps) {
  const [token, setToken] = React.useState(initialSettings?.share_token || '');
  const [isCopied, setIsCopied] = React.useState(false);
  const [isPublic, setIsPublic] = React.useState(initialSettings?.is_public || false);
  const [durationDays, setDurationDays] = React.useState<string>('');
  const [isSaving, setIsSaving] = React.useState(false);

  // Initialize duration from expiry_date if available
  React.useEffect(() => {
    if (initialSettings?.expiry_date) {
      const expiry = new Date(initialSettings.expiry_date);
      const now = new Date();
      const diffTime = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) setDurationDays(diffDays.toString());
    }
    setToken(initialSettings?.share_token || '');
    setIsPublic(initialSettings?.is_public || false);
  }, [initialSettings]);

  // Map drawing to drawings for URL consistency
  // Map internal types to professional URL type names
  const urlTypeMap: Record<string, string> = {
    erd: 'diagram',
    notes: 'note',
    drawings: 'drawing',
    flowchart: 'flowchart'
  };
  const urlType = urlTypeMap[documentType] || documentType;
  
  const shareUrl = `${window.location.origin}/view/${urlType}/${documentUid}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    toast.success("Tautan berhasil disalin!");
    setTimeout(() => setIsCopied(false), 2000);
  };

  const generateToken = () => {
    const newToken = Math.random().toString(36).substring(2, 10).toUpperCase();
    setToken(newToken);
    toast.info("Token aman dibuat");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const endpoint = documentType === 'erd' ? 'diagrams' : (documentType === 'flowchart' ? 'flowcharts' : documentType);
      
      let expiry_date = null;
      if (durationDays && !isNaN(parseInt(durationDays))) {
        const d = new Date();
        d.setDate(d.getDate() + parseInt(durationDays));
        expiry_date = d.toISOString();
      }

      const res = await apiFetch(`/api/${endpoint}/${documentId}/share`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_public: isPublic,
          share_token: token,
          expiry_date
        })
      });

      if (!res.ok) throw new Error("Gagal menyimpan pengaturan");

      toast.success("Pengaturan berbagi diperbarui!");
      if (onSettingsSaved) onSettingsSaved();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isPublicView ? "Bagikan Dokumen" : `Bagikan "${documentTitle}"`}</DialogTitle>
          <DialogDescription>
            {isPublicView 
              ? "Bagikan tautan ini kepada orang lain untuk melihat dokumen ini."
              : isPublic 
                ? "Siapa saja yang memiliki tautan dapat melihat dokumen ini tanpa akun." 
                : "Dokumen ini saat ini privat. Hanya Anda yang dapat mengaksesnya."}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          {!isPublicView && (
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 transition-colors hover:bg-muted/50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  {isPublic ? <Globe className="w-4 h-4 text-primary" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                  <Label htmlFor="public-status" className="text-sm font-bold">Akses Publik</Label>
                </div>
                <p className="text-[11px] text-muted-foreground">Aktifkan akses melalui tautan publik</p>
              </div>
              <Checkbox
                id="public-status"
                checked={isPublic}
                onCheckedChange={checked => setIsPublic(checked)}
              />
            </div>
          )}

          <div className={`space-y-4 transition-all duration-300 ${(isPublic || isPublicView) ? 'opacity-100' : 'opacity-40 pointer-events-none grayscale-[0.5]'}`}>
            <div className="space-y-2">
              <Label htmlFor="share-link" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tautan Publik</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  id="share-link"
                  readOnly 
                  value={shareUrl} 
                  className="flex-1 bg-muted/20 font-mono text-xs"
                />
                <Button 
                  onClick={handleCopy} 
                  size="icon" 
                  variant="outline"
                  className="shrink-0 cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors"
                  disabled={!isPublic && !isPublicView}
                >
                  {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {!isPublicView && (
              <>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="access-token" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Token Akses (Opsional)</Label>
                    <Button 
                      variant="link" 
                      size="sm" 
                      onClick={generateToken}
                      className="h-auto p-0 text-[10px] uppercase font-bold tracking-tighter cursor-pointer text-primary hover:no-underline"
                      disabled={!isPublic}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Buat Token
                    </Button>
                  </div>
                  <Input 
                    id="access-token"
                    placeholder="Token" 
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    disabled={!isPublic}
                    className="font-mono text-xs"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <Label htmlFor="valid-until" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Durasi (Hari)</Label>
                  <Input 
                    id="valid-until"
                    type="number"
                    placeholder="Selamanya"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    disabled={!isPublic}
                    className="text-xs"
                  />
                </div>
              </>
            )}
          </div>
        </DialogBody>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          {isPublicView ? (
            <Button 
              type="button" 
              onClick={() => onOpenChange(false)}
              className="cursor-pointer w-full sm:w-auto font-bold"
            >
              Tutup
            </Button>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => onOpenChange(false)}
                className="cursor-pointer order-2 sm:order-1 font-semibold"
                disabled={isSaving}
              >
                Batal
              </Button>
              <Button 
                type="button" 
                onClick={handleSave}
                className="cursor-pointer order-1 sm:order-2 font-bold min-w-[120px]"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : "Simpan"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
