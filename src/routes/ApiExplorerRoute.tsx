import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Database,
  ArrowLeft,
  Search,
  FolderKanban,
  Download,
  Layers,
  ChevronRight,
  Code2,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkspace } from '@/providers/WorkspaceProvider';
import { apiFetch } from '@/lib/api';
import { parseDbmlToTables, buildEndpointsFromTables, buildWorkflowStepsFromFlowchart } from '@/lib/api-engine/schemaParser';
import { generateOpenApiSpec, generatePostmanCollection, downloadJsonFile } from '@/lib/api-engine/exportUtils';
import { ApiSidebar } from '@/components/api-explorer/ApiSidebar';
import { EndpointTester } from '@/components/api-explorer/EndpointTester';
import { WorkflowSimulator } from '@/components/api-explorer/WorkflowSimulator';

export function ApiExplorerRoute() {
  const { projectSlug } = useParams<{ projectSlug?: string }>();
  const navigate = useNavigate();
  const { projects = [], diagrams = [], flowcharts = [] } = useWorkspace();

  const [searchProjectQuery, setSearchProjectQuery] = useState('');
  const [activeMode, setActiveMode] = useState<'crud' | 'workflow'>('crud');
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('');
  const [endpointSearchQuery, setEndpointSearchQuery] = useState('');
  const [projectSiblings, setProjectSiblings] = useState<{
    notes?: any[];
    diagrams?: any[];
    flowcharts?: any[];
  } | null>(null);

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

  const projectName = useMemo(() => {
    if (currentProject?.name) return currentProject.name;
    if (projectSlug) {
      const decoded = decodeURIComponent(projectSlug).replace(/[-_]/g, ' ');
      return decoded.charAt(0).toUpperCase() + decoded.slice(1);
    }
    return 'Sistem Enterprise';
  }, [currentProject, projectSlug]);

  const domain = useMemo(() => {
    return currentProject?.description || 'SaaS Multi-Tenant';
  }, [currentProject]);

  useEffect(() => {
    if (!currentProject) {
      setProjectSiblings(null);
      return;
    }
    const pId = String(currentProject.id || currentProject.uid);
    let isMounted = true;
    apiFetch(`/api/projects/${pId}/siblings`)
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (isMounted && data) {
          setProjectSiblings(data);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [currentProject]);

  const filteredDiagrams = useMemo(() => {
    if (projectSiblings?.diagrams && projectSiblings.diagrams.length > 0) {
      return projectSiblings.diagrams;
    }
    if (!currentProject) return diagrams;
    const pId = String(currentProject.id || currentProject.uid);
    return diagrams.filter(d => String(d.project_id || d.projectId) === pId);
  }, [projectSiblings, diagrams, currentProject]);

  const filteredFlowcharts = useMemo(() => {
    if (projectSiblings?.flowcharts && projectSiblings.flowcharts.length > 0) {
      return projectSiblings.flowcharts;
    }
    if (!currentProject) return flowcharts;
    const pId = String(currentProject.id || currentProject.uid);
    return flowcharts.filter(f => String(f.project_id || f.projectId) === pId);
  }, [projectSiblings, flowcharts, currentProject]);

  const dbmlSource = useMemo(() => {
    for (const d of filteredDiagrams) {
      if (d.dbml_source && d.dbml_source.trim()) return d.dbml_source;
      if (d.dbmlSource && d.dbmlSource.trim()) return d.dbmlSource;
    }
    return '';
  }, [filteredDiagrams]);

  const tables = useMemo(() => {
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
  }, [dbmlSource, filteredDiagrams]);

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

  const handleExportPostman = () => {
    try {
      const collection = generatePostmanCollection(projectName, endpoints);
      const slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '_') || 'api';
      downloadJsonFile(collection, `${slug}_postman_collection.json`);
      toast.success('Postman Collection diunduh');
    } catch {
      toast.error('Gagal mengunduh Postman');
    }
  };

  if (!projectSlug) {
    const filteredProjects = !searchProjectQuery.trim()
      ? projects
      : projects.filter(p => (p.name || '').toLowerCase().includes(searchProjectQuery.toLowerCase()));

    return (
      <div className="flex-1 flex flex-col gap-4 p-4 sm:p-6 overflow-y-auto custom-scrollbar max-w-6xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Code2 className="size-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground">API Explorer &amp; Simulator</h1>
              <p className="text-xs text-muted-foreground">Pilih proyek untuk menguji CRUD dan mensimulasikan alur kerja API</p>
            </div>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchProjectQuery}
              onChange={e => setSearchProjectQuery(e.target.value)}
              placeholder="Cari"
              className="w-full text-xs h-8 pl-8 pr-3 rounded-lg border border-border/70 bg-card text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {filteredProjects.map(proj => {
            const pId = String(proj.id || proj.uid);
            const pSlug = proj.slug || proj.uid || pId;
            const tableCount = diagrams.filter(d => String(d.project_id || d.projectId) === pId).length;
            const fcCount = flowcharts.filter(f => String(f.project_id || f.projectId) === pId).length;

            return (
              <div
                key={pId}
                onClick={() => navigate(`/api-explorer/${pSlug}`)}
                className="group rounded-xl border border-border/70 bg-card p-4 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-7 rounded-md bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                      <FolderKanban className="size-3.5" />
                    </div>
                    <span className="text-sm font-semibold text-foreground truncate group-hover:text-indigo-400 transition-colors">
                      {proj.name}
                    </span>
                  </div>
                  <ChevronRight className="size-4 text-muted-foreground group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {proj.description || 'Proyek tanpa deskripsi khusus.'}
                </p>

                <div className="flex items-center gap-3 text-[11px] text-muted-foreground border-t border-border/50 pt-2.5">
                  <span className="flex items-center gap-1">
                    <Database className="size-3 text-emerald-400" />
                    {tableCount} Diagram
                  </span>
                  <span className="flex items-center gap-1">
                    <Layers className="size-3 text-violet-400" />
                    {fcCount} Alur
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-7.5 text-xs font-medium cursor-pointer group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all"
                >
                  Buka API
                </Button>
              </div>
            );
          })}
        </div>
      </div>
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

          <div className="min-w-0">
            <h1 className="text-sm font-bold text-foreground truncate flex items-center gap-2">
              <span>{projectName}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-indigo-500/30 text-indigo-400">
                {endpoints.length} Endpoints
              </Badge>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            onClick={handleExportOpenApi}
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 px-3 text-xs cursor-pointer border-border/70"
          >
            <Download className="size-3.5" />
            <span>OpenAPI</span>
          </Button>

          <Button
            onClick={handleExportPostman}
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 px-3 text-xs cursor-pointer border-border/70"
          >
            <Download className="size-3.5" />
            <span>Postman</span>
          </Button>

          <Button
            onClick={() => navigate(`/agent-generator/${pSlug}`)}
            size="sm"
            className="h-8 gap-1.5 px-3 text-xs bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
          >
            <Users className="size-3.5" />
            <span>Generator Agen</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row rounded-xl border border-border/70 bg-card overflow-hidden min-h-0 shadow-xs">
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
                Pilih endpoint dari bilah sisi untuk mulai menguji.
              </div>
            )
          ) : (
            <WorkflowSimulator initialSteps={workflowSteps} />
          )}
        </div>
      </div>
    </div>
  );
}
