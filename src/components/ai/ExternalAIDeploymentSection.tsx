import React from 'react';
import { FieldLabel } from '@/components/ui/field';
import { InfoTip } from './InfoTip';

export type DeploymentMethod = 'vercel' | 'ai_choice' | 'local' | 'vps' | 'cloudflare' | 'aws' | 'other';

interface ExternalAIDeploymentSectionProps {
  deploymentMethod: DeploymentMethod;
  setDeploymentMethod: (v: DeploymentMethod) => void;
  customDeployment: string;
  setCustomDeployment: (v: string) => void;
}

const DEPLOYMENT_OPTIONS: Array<{ id: DeploymentMethod; label: string; tip: string; isRecommended?: boolean }> = [
  { id: 'vercel', label: 'Vercel', tip: 'Serverless Functions & Edge (Rekomendasi)', isRecommended: true },
  { id: 'ai_choice', label: 'AI Pilih', tip: 'Otomatis pilih Serverless Vercel' },
  { id: 'local', label: 'Lokal', tip: 'Pengembangan lokal' },
  { id: 'vps', label: 'VPS', tip: 'Docker / VPS Linux' },
  { id: 'cloudflare', label: 'Cloudflare', tip: 'Cloudflare Pages & Workers' },
  { id: 'aws', label: 'AWS', tip: 'AWS Cloud Enterprise' },
  { id: 'other', label: 'Lainnya', tip: 'Infrastruktur khusus' },
];

export function ExternalAIDeploymentSection({
  deploymentMethod,
  setDeploymentMethod,
  customDeployment,
  setCustomDeployment,
}: ExternalAIDeploymentSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
          Deployment
        </FieldLabel>
        <InfoTip text="Pilih metode deployment sistem. Disarankan Vercel Serverless untuk performa produksi website modern." />
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
        {DEPLOYMENT_OPTIONS.map((opt) => {
          const isSelected = deploymentMethod === opt.id;
          return (
            <div
              key={opt.id}
              className={`flex items-center justify-between gap-1 p-2 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-primary/10 border-primary/40 text-foreground font-semibold ring-1 ring-primary/20'
                  : 'bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20'
              }`}
            >
              <button
                type="button"
                onClick={() => setDeploymentMethod(opt.id)}
                className="flex-1 text-xs truncate cursor-pointer text-left"
              >
                {opt.label}
              </button>
              <InfoTip text={opt.tip} />
            </div>
          );
        })}
      </div>

      {deploymentMethod === 'other' && (
        <div className="pt-1">
          <input
            type="text"
            placeholder="Target"
            value={customDeployment}
            onChange={(e) => setCustomDeployment(e.target.value)}
            className="flex h-8 w-full rounded-lg border border-border/60 bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      )}
    </div>
  );
}
