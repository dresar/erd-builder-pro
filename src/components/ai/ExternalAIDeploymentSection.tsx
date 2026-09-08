import React from 'react';
import { AlertCircle } from 'lucide-react';
import { FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type DeploymentMethod = 'vercel' | 'ai_choice' | 'local' | 'vps' | 'cloudflare' | 'aws' | 'other';

interface ExternalAIDeploymentSectionProps {
  deploymentMethod: DeploymentMethod;
  setDeploymentMethod: (v: DeploymentMethod) => void;
  customDeployment: string;
  setCustomDeployment: (v: string) => void;
}

const DEPLOYMENT_OPTIONS: Array<{ id: DeploymentMethod; label: string; isRecommended?: boolean; isAi?: boolean }> = [
  { id: 'vercel', label: 'Vercel (Serverless)', isRecommended: true },
  { id: 'ai_choice', label: 'Biarkan AI yang pilih (Serverless Vercel)', isAi: true },
  { id: 'local', label: 'Pengembangan lokal' },
  { id: 'vps', label: 'Docker / VPS Linux' },
  { id: 'cloudflare', label: 'Cloudflare Pages & Workers' },
  { id: 'aws', label: 'AWS Cloud Enterprise' },
  { id: 'other', label: 'Jawaban lain' },
];

export function ExternalAIDeploymentSection({
  deploymentMethod,
  setDeploymentMethod,
  customDeployment,
  setCustomDeployment,
}: ExternalAIDeploymentSectionProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/15 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <FieldLabel className="text-xs font-bold text-foreground">
            Metode deployment apa yang harus digunakan?
          </FieldLabel>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="text-muted-foreground hover:text-foreground cursor-pointer" aria-label="Penjelasan">
                  <AlertCircle className="size-3.5 text-amber-500/80" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-xs max-w-xs">
                Pilih Vercel (Serverless) untuk arsitektur serverless website production modern.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="space-y-1.5">
        {DEPLOYMENT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setDeploymentMethod(opt.id)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs transition-all ${
              deploymentMethod === opt.id
                ? 'bg-primary/10 border border-primary/40 font-medium text-foreground ring-1 ring-primary/20'
                : 'border border-transparent hover:bg-muted/30 text-muted-foreground'
            }`}
          >
            <span className={`flex size-4 items-center justify-center rounded-full border ${
              deploymentMethod === opt.id ? 'border-primary bg-primary' : 'border-muted-foreground/40'
            }`}>
              {deploymentMethod === opt.id && <span className="size-1.5 rounded-full bg-primary-foreground" />}
            </span>
            {opt.isRecommended && (
              <span className="rounded bg-primary/20 px-1.5 py-0.5 text-[10px] font-bold text-primary uppercase">
                Rekomendasi
              </span>
            )}
            <span className="flex-1">{opt.label}</span>
          </button>
        ))}
        {deploymentMethod === 'other' && (
          <div className="pt-1.5">
            <Input
              placeholder="Jawaban"
              value={customDeployment}
              onChange={(e) => setCustomDeployment(e.target.value)}
              className="h-8 text-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
}
