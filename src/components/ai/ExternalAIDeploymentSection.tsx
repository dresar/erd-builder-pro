import React from 'react';
import { FieldLabel } from '@/components/ui/field';

export type DeploymentMethod = 'vercel' | 'ai_choice' | 'local' | 'vps' | 'cloudflare' | 'aws' | 'other';

interface ExternalAIDeploymentSectionProps {
  deploymentMethod: DeploymentMethod;
  setDeploymentMethod: (v: DeploymentMethod) => void;
  customDeployment: string;
  setCustomDeployment: (v: string) => void;
}

const DEPLOYMENT_OPTIONS: Array<{ id: DeploymentMethod; label: string }> = [
  { id: 'vercel', label: 'Vercel' },
  { id: 'ai_choice', label: 'AI Pilih' },
  { id: 'local', label: 'Lokal' },
  { id: 'vps', label: 'VPS' },
  { id: 'cloudflare', label: 'Cloudflare' },
  { id: 'aws', label: 'AWS' },
  { id: 'other', label: 'Lainnya' },
];

export function ExternalAIDeploymentSection({
  deploymentMethod,
  setDeploymentMethod,
  customDeployment,
  setCustomDeployment,
}: ExternalAIDeploymentSectionProps) {
  return (
    <div className="space-y-1.5">
      <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
        Deployment
      </FieldLabel>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
        {DEPLOYMENT_OPTIONS.map((opt) => {
          const isSelected = deploymentMethod === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setDeploymentMethod(opt.id)}
              className={`p-2 rounded-lg border text-xs font-medium truncate text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-primary/10 border-primary/40 text-foreground font-semibold ring-1 ring-primary/20'
                  : 'bg-muted/10 border-border/40 text-muted-foreground hover:bg-muted/20'
              }`}
            >
              {opt.label}
            </button>
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
