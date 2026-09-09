import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Activity, AlertTriangle, CheckCircle, Info, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/api';
import { useWorkspace } from '@/providers/WorkspaceProvider';

interface HealthData {
  project: { id: number; name: string; description: string };
  counts: Record<string, number>;
  coverageScores: Record<string, number>;
  overallScore: number;
  criticalIssues: string[];
  warnings: string[];
  nextActions: string[];
}

const COVERAGE_LABELS: Record<string, string> = {
  requirements: 'Requirements', architecture: 'Architecture', database: 'Database',
  api: 'API Docs', workflow: 'Workflow', security: 'Security', testing: 'Testing', documentation: 'Documentation',
};

function CoverageBar({ label, score }: { label: string; score: number }) {
  const color = score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span>{label}</span>
        <span className="font-mono font-medium">{score}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-700`} style={{ width: score + '%' }} />
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500';
  const label = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Needs Work' : 'Critical';
  return (
    <div className="flex flex-col items-center py-6">
      <div className={`text-7xl font-bold ${color}`}>{score}</div>
      <div className="text-sm text-muted-foreground mt-1">Project Health Score</div>
      <Badge className="mt-2" variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'}>{label}</Badge>
    </div>
  );
}

export function ProjectHealthRoute() {
  const { projectSlug } = useParams<{ projectSlug?: string }>();
  const { projects = [] } = useWorkspace();
  const [health, setHealth] = useState<HealthData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const slug = projectSlug || (projects[0] ? String(projects[0].uid || projects[0].slug || projects[0].id) : '');

  const fetchHealth = async () => {
    if (!slug) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await apiFetch('/api/project-health/' + slug);
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Failed'); return; }
      setHealth(data);
    } catch (err: any) { setError(err.message); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchHealth(); }, [slug]);

  if (!slug) return <div className="flex items-center justify-center h-full text-muted-foreground text-sm">Select a project first</div>;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <div className="border-b px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-base font-semibold flex items-center gap-2"><Activity className="w-4 h-4" />Project Health</h1>
          <p className="text-xs text-muted-foreground">{health?.project?.name || 'Loading…'}</p>
        </div>
        <Button size="sm" variant="outline" onClick={fetchHealth} disabled={isLoading} className="gap-1 text-xs h-7">
          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />Refresh
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && <div className="flex items-center justify-center h-48 text-muted-foreground text-sm"><RefreshCw className="w-4 h-4 animate-spin mr-2" />Loading health data…</div>}
        {error && <div className="m-6 p-4 rounded-lg border border-destructive/50 bg-destructive/5 text-destructive text-sm">{error}</div>}

        {health && !isLoading && (
          <div className="p-6 space-y-6">
            <ScoreRing score={health.overallScore} />

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {Object.entries(health.counts).map(([key, val]) => (
                <div key={key} className="rounded-lg border bg-card p-3 text-center">
                  <div className="text-2xl font-bold">{val}</div>
                  <div className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g,' $1').trim()}</div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border bg-card p-4 space-y-3">
              <h2 className="text-sm font-semibold">Coverage Breakdown</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(health.coverageScores).map(([key, score]) => (
                  <CoverageBar key={key} label={COVERAGE_LABELS[key] || key} score={score} />
                ))}
              </div>
            </div>

            {health.criticalIssues.length > 0 && (
              <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 space-y-2">
                <h2 className="text-sm font-semibold text-destructive flex items-center gap-1"><AlertTriangle className="w-4 h-4" />Critical Issues ({health.criticalIssues.length})</h2>
                {health.criticalIssues.map((issue, i) => <p key={i} className="text-sm text-destructive/80">{issue}</p>)}
              </div>
            )}

            {health.warnings.length > 0 && (
              <div className="rounded-lg border border-yellow-500/40 bg-yellow-50 dark:bg-yellow-950/20 p-4 space-y-2">
                <h2 className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 flex items-center gap-1"><AlertTriangle className="w-4 h-4" />Warnings ({health.warnings.length})</h2>
                {health.warnings.map((w, i) => <p key={i} className="text-sm text-yellow-700/80 dark:text-yellow-400/80">{w}</p>)}
              </div>
            )}

            {health.nextActions.length > 0 && (
              <div className="rounded-lg border bg-card p-4 space-y-2">
                <h2 className="text-sm font-semibold flex items-center gap-1"><Info className="w-4 h-4" />Recommended Next Actions</h2>
                {health.nextActions.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />{a}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}