import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Layers,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkspace } from '@/providers/WorkspaceProvider';
import { apiFetch } from '@/lib/api';
import { parseDbmlToTables, buildEndpointsFromTables, buildWorkflowStepsFromFlowchart } from '@/lib/api-engine/schemaParser';
import { generateOpenApiSpec, downloadJsonFile } from '@/lib/api-engine/exportUtils';
import { ApiSidebar } from '@/components/api-explorer/ApiSidebar';
import { EndpointTester } from '@/components/api-explorer/EndpointTester';
import { WorkflowSimulator } from '@/components/api-explorer/WorkflowSimulator';
import { ApiProjectList } from '@/components/api-explorer/ApiProjectList';

export function ApiExplorerRoute() {
  const { projectSlug } = useParams<{ projectSlug?: string }>();
  const navigate = useNavigate();
  const { projects = [], diagrams = [], flowcharts = [] } = useWorkspace();

  const [searchProjectQuery, setSearchProjectQuery] = useState('');
  const [activeMode, setActiveMode] = useState<'crud' | 'workflow'>('crud');
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('');
  const [endpointSearchQuery, setEndpointSearchQuery] = useState('');
  const [projectSiblings, setProjectSiblings] = useState<{
    project?: { id?: any; uid?: string; name?: string; description?: string; slug?: string } | null;
    notes?: any[];
    diagrams?: any[];
    flowcharts?: any[];
  } | null>(null);
  const [isLoadingSiblings, setIsLoadingSiblings] = useState(false);

  const currentProject = useMemo(() => {
    if (!projectSlug) return null;
    const matches = projects.filter(
      p =>
        String(p.slug) === String(projectSlug) ||
        String(p.uid) === String(projectSlug) ||
        String(p.id) === String(projectSlug) ||
        p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === projectSlug.toLowerCase()
    );
    if (matches.length === 0) return null;
    if (matches.length === 1) return matches[0];
    return [...matches].sort((a, b) => {
      const countA = (a.diagrams_count || 0) + (a.notes_count || 0) + (a.flowcharts_count || 0);
      const countB = (b.diagrams_count || 0) + (b.notes_count || 0) + (b.flowcharts_count || 0);
      if (countB !== countA) return countB - countA;
      return Number(b.id || 0) - Number(a.id || 0);
    })[0];
  }, [projects, projectSlug]);

  const targetId = useMemo(() => {
    if (currentProject) return String(currentProject.uid || currentProject.id);
    return projectSlug ? String(projectSlug) : '';
  }, [currentProject, projectSlug]);

  const projectName = useMemo(() => {
    if (projectSiblings?.project?.name) return projectSiblings.project.name;
    if (currentProject?.name) return currentProject.name;
    if (projectSlug) {
      const decoded = decodeURIComponent(projectSlug).replace(/[-_]/g, ' ');
      return decoded.charAt(0).toUpperCase() + decoded.slice(1);
    }
    return 'Sistem Enterprise';
  }, [projectSiblings, currentProject, projectSlug]);

  const domain = useMemo(() => {
    return projectSiblings?.project?.description || currentProject?.description || 'SaaS Multi-Tenant';
  }, [projectSiblings, currentProject]);

  useEffect(() => {
    if (!targetId) {
      setProjectSiblings(null);
      setIsLoadingSiblings(false);
      return;
    }
    let isMounted = true;
    setIsLoadingSiblings(true);
    apiFetch(`/api/projects/${encodeURIComponent(targetId)}/siblings`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (isMounted && data) {
          setProjectSiblings(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoadingSiblings(false);
      });
    return () => {
      isMounted = false;
    };
  }, [targetId]);

  const filteredDiagrams = useMemo(() => {
    if (projectSiblings?.diagrams && projectSiblings.diagrams.length > 0) {
      return projectSiblings.diagrams;
    }
    if (!currentProject) return diagrams;
    const pId = String(currentProject.id ?? '');
    const pUid = currentProject.uid ? String(currentProject.uid) : '';
    return diagrams.filter(d => {
      const dPid = String(d.project_id ?? d.projectId ?? d.project?.id ?? d.project?.uid ?? '');
      return (pId && dPid === pId) || (pUid && dPid === pUid);
    });
  }, [projectSiblings, diagrams, currentProject]);

  const filteredFlowcharts = useMemo(() => {
    if (projectSiblings?.flowcharts && projectSiblings.flowcharts.length > 0) {
      return projectSiblings.flowcharts;
    }
    if (!currentProject) return flowcharts;
    const pId = String(currentProject.id ?? '');
    const pUid = currentProject.uid ? String(currentProject.uid) : '';
    return flowcharts.filter(f => {
      const fPid = String(f.project_id ?? f.projectId ?? f.project?.id ?? f.project?.uid ?? '');
      return (pId && fPid === pId) || (pUid && fPid === pUid);
    });
  }, [projectSiblings, flowcharts, currentProject]);

  const dbmlSource = useMemo(() => {
    for (const d of filteredDiagrams) {
      if (d.dbml_source && d.dbml_source.trim()) return d.dbml_source;
      if (d.dbmlSource && d.dbmlSource.trim()) return d.dbmlSource;
    }
    return '';
  }, [filteredDiagrams]);

  const tables = useMemo(() => {
    if (isLoadingSiblings && !projectSiblings) return [];
    if (dbmlSource) {
      const parsed = parseDbmlToTables(dbmlSource);
      if (parsed.length > 0) return parsed;
    }

    const tList: any[] = [];
    for (const d of filteredDiagrams) {
      if (d.entities && d.entities.length > 0) {
        for (const ent of d.entities) {
          tList.push({
            name: ent.name.toLowerCase().replace(/\s+/g, '_'),
            columns: ent.columns || [],
          });
        }
      }
    }
    if (tList.length > 0) return tList;

    return [
      {
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', is_pk: true },
          { name: 'email', type: 'varchar(255)', is_unique: true },
          { name: 'username', type: 'varchar(100)' },
          { name: 'status', type: 'varchar(50)', enum_values: ['active', 'inactive'] },
          { name: 'created_at', type: 'timestamp' },
        ],
      },
    ];
  }, [isLoadingSiblings, projectSiblings, dbmlSource, filteredDiagrams]);

  const endpoints = useMemo(() => {
    return buildEndpointsFromTables(tables);
  }, [tables]);

  const workflowSteps = useMemo(() => {
    const fc = filteredFlowcharts[0];
    return buildWorkflowStepsFromFlowchart(fc, tables);
  }, [filteredFlowcharts, tables]);

  useEffect(() => {
    if (endpoints.length > 0 && (!selectedEndpointId || !endpoints.some(e => e.id === selectedEndpointId))) {
      setSelectedEndpointId(endpoints[0].id);
    }
  }, [endpoints, selectedEndpointId]);

  const selectedEndpoint = useMemo(() => {
    return endpoints.find(e => e.id === selectedEndpointId) || endpoints[0];
  }, [endpoints, selectedEndpointId]);

  const handleExportOpenApi = () => {
    try {
      const spec = generateOpenApiSpec(projectName, domain, endpoints);
      const slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '_') || 'api';
      downloadJsonFile(spec, `${slug}_openapi.json`);
      toast.success('OpenAPI diunduh');
    } catch {
      toast.error('Gagal mengunduh OpenAPI');
    }
  };

  const shortName = projectName.length > 22
    ? projectName.slice(0, 20) + '…'
    : projectName;

  if (!projectSlug) {
    return (
      <ApiProjectList
        projects={projects}
        diagrams={diagrams}
        flowcharts={flowcharts}
        searchQuery={searchProjectQuery}
        onSearchChange={setSearchProjectQuery}
      />
    );
  }

  const pSlug = currentProject?.slug || currentProject?.uid || projectSlug;

  return (
    <div className="flex-1 flex flex-col gap-3 overflow-hidden p-3.5 sm:p-5 h-full">
      <div className="flex flex-wrap items-center justify-between gap-2.5 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Button
            onClick={() => navigate('/api-explorer')}
            size="sm"
            variant="outline"
            className="h-8 gap-1 px-2.5 text-xs cursor-pointer border-border/70"
            title="Kembali ke daftar proyek"
          >
            <ArrowLeft className="size-3.5" />
            <span>Semua</span>
          </Button>

          <div className="min-w-0 max-w-[140px] sm:max-w-xs">
            <h1 className="text-xs sm:text-sm font-bold text-foreground truncate flex items-center gap-1.5">
              <span className="truncate">{shortName}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-primary/30 text-primary shrink-0">
                {endpoints.length}
              </Badge>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            onClick={handleExportOpenApi}
            size="sm"
            variant="outline"
            className="h-7.5 gap-1.5 px-2.5 text-xs cursor-pointer border-border/70"
          >
            <Download className="size-3.5" />
            <span>OpenAPI</span>
          </Button>

          <Button
            onClick={() => setActiveMode('workflow')}
            size="sm"
            className="h-7.5 gap-1.5 px-3 text-xs bg-gradient-to-r from-blue-600 to-cyan-500 hover:opacity-90 text-white cursor-pointer font-medium shadow-sm"
          >
            <Layers className="size-3.5" />
            <span>Alur Kerja</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row rounded-xl border border-border/70 bg-card overflow-hidden min-h-0 shadow-xs">
        {isLoadingSiblings && !projectSiblings ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2.5 text-xs text-muted-foreground p-8">
            <Loader2 className="size-5 animate-spin text-primary" />
            <span className="font-medium text-foreground">Menyiapkan API Explorer...</span>
            <span className="text-[11px] text-muted-foreground">Mengambil skema tabel, diagram, dan alur kerja proyek</span>
          </div>
        ) : (
          <>
            <ApiSidebar
              endpoints={endpoints}
              selectedEndpointId={selectedEndpointId}
              onSelectEndpoint={id => setSelectedEndpointId(id)}
              activeMode={activeMode}
              onChangeMode={mode => setActiveMode(mode)}
              searchQuery={endpointSearchQuery}
              onSearchChange={q => setEndpointSearchQuery(q)}
            />

            <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-background/50">
              {activeMode === 'crud' ? (
                selectedEndpoint ? (
                  <EndpointTester endpoint={selectedEndpoint} />
                ) : (
                  <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground">
                    Pilih endpoint.
                  </div>
                )
              ) : (
                <WorkflowSimulator initialSteps={workflowSteps} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
