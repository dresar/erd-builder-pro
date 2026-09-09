import React from 'react';
import { FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type DeploymentMethod = 'vercel' | 'ai_choice' | 'local' | 'vps' | 'cloudflare' | 'aws' | 'other';

export const DEPLOYMENT_OPTIONS: Array<{ id: DeploymentMethod; label: string }> = [
  { id: 'vercel', label: 'Vercel' },
  { id: 'ai_choice', label: 'AI Pilih' },
  { id: 'local', label: 'Lokal' },
  { id: 'vps', label: 'VPS' },
  { id: 'cloudflare', label: 'Cloudflare' },
  { id: 'aws', label: 'AWS' },
  { id: 'other', label: 'Lainnya' },
];

interface ExternalAIDeploymentSectionProps {
  deploymentMethod: DeploymentMethod;
  setDeploymentMethod: (v: DeploymentMethod) => void;
  customDeployment: string;
  setCustomDeployment: (v: string) => void;
}

export function ExternalAIDeploymentSection({
  deploymentMethod,
  setDeploymentMethod,
  customDeployment,
  setCustomDeployment,
}: ExternalAIDeploymentSectionProps) {
  return (
    <div>
      <FieldLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 px-1 mb-1 block">
        Deployment
      </FieldLabel>

      <Select value={deploymentMethod} onValueChange={(v) => v && setDeploymentMethod(v as DeploymentMethod)}>
        <SelectTrigger className="h-8.5 text-xs bg-background border-border/60">
          <SelectValue placeholder="Pilih Deployment">
            {DEPLOYMENT_OPTIONS.find((d) => d.id === deploymentMethod)?.label || 'Vercel'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {DEPLOYMENT_OPTIONS.map((opt) => (
            <SelectItem key={opt.id} value={opt.id} className="text-xs py-1.5">
              <span className="font-medium">{opt.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {deploymentMethod === 'other' && (
        <div className="mt-1.5">
          <input
            type="text"
            placeholder="Target deployment..."
            value={customDeployment}
            onChange={(e) => setCustomDeployment(e.target.value)}
            className="flex h-8.5 w-full rounded-lg border border-border/60 bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      )}
    </div>
  );
}
