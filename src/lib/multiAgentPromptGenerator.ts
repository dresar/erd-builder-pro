import JSZip from 'jszip';
import { generateClaudeMasterPrompt } from './megaPrompt/claudeMasterPrompt';
import { generateDefaultBundleFiles, type GeneratedBundleFile } from './megaPrompt/defaultBundleFiles';

export type { GeneratedBundleFile };

export interface MultiAgentProjectConfig {
  projectName: string;
  domain: string;
  techStack: string;
  databaseType?: string;
  complianceList?: string[];
  diagrams?: any[];
  flowcharts?: any[];
  notes?: any[];
  customInstructions?: string;
  customDbml?: string;
  customPrd?: string;
  customWorkflows?: string;
}

export const AGENT_TEAM = [
  {
    id: 'tech_lead',
    name: 'Tech Lead & Architect',
    file: '.agents/01_TECH_LEAD.md',
    desc: 'System architecture, DDD boundaries, task orchestration, code review.',
  },
  {
    id: 'database_backend',
    name: 'Database & Backend',
    file: '.agents/02_DATABASE_BACKEND.md',
    desc: 'Relational schema, migrations, transactional services, API contracts.',
  },
  {
    id: 'frontend_ui',
    name: 'Frontend & UI/UX',
    file: '.agents/03_FRONTEND_UI.md',
    desc: 'Responsive UI components, state management, design system.',
  },
  {
    id: 'security_auth',
    name: 'Security & RBAC',
    file: '.agents/04_SECURITY_AUTH.md',
    desc: 'Auth sessions, RBAC matrices, data isolation, audit logging.',
  },
  {
    id: 'qa_tester',
    name: 'QA & Verification',
    file: '.agents/05_QA_TESTER.md',
    desc: 'Automated tests, verification checklists, regression safeguards.',
  },
];

function extractFullDbml(diagrams: any[] = []): string {
  if (!diagrams || diagrams.length === 0) {
    return `// Database Schema
Table users {
  id bigint [pk, increment]
  email varchar(255) [not null, unique]
  created_at timestamp [not null, default: \`now()\`]
  updated_at timestamp [not null, default: \`now()\`]
  deleted_at timestamp
}`;
  }

  const chunks: string[] = [];
  for (const diag of diagrams) {
    let rawData = diag.data;
    if (typeof rawData === 'string') {
      try {
        rawData = JSON.parse(rawData);
      } catch {}
    }

    const rawDbml = diag.dbml_source || diag.dbmlSource || rawData?.dbml_source || rawData?.dbmlSource;
    if (rawDbml && String(rawDbml).trim()) {
      chunks.push(String(rawDbml).trim());
      continue;
    }

    const entities = diag.entities || (Array.isArray(rawData?.nodes) ? rawData.nodes.map((n: any) => n.data) : []);
    if (entities.length === 0) continue;

    chunks.push(`// --- Diagram: ${diag.name || 'Core'} ---`);
    for (const ent of entities) {
      if (!ent) continue;
      const tableName = (ent.name || 'table').toLowerCase().replace(/\s+/g, '_');
      const lines: string[] = [`Table ${tableName} {`];
      const cols = ent.columns || [];
      if (cols.length === 0) {
        lines.push('  id bigint [pk, increment]');
      } else {
        for (const col of cols) {
          const typeStr = (col.type || 'varchar(255)').toUpperCase();
          const flags: string[] = [];
          if (col.is_pk) flags.push('pk');
          if (!col.is_nullable) flags.push('not null');
          if (col.is_unique) flags.push('unique');
          if (col.default_value) flags.push(`default: \`${col.default_value}\``);
          if (col.comment) flags.push(`note: '${col.comment.replace(/'/g, "\\'")}'`);
          const flagStr = flags.length > 0 ? ` [${flags.join(', ')}]` : '';
          lines.push(`  ${col.name} ${typeStr}${flagStr}`);
        }
      }
      lines.push('}');
      chunks.push(lines.join('\n'));
    }

    const rels = diag.relationships || (Array.isArray(rawData?.edges) ? rawData.edges : []);
    for (const rel of rels) {
      if (rel.source && rel.target && rel.source_column_id && rel.target_column_id) {
        chunks.push(`Ref: ${rel.source}.${rel.source_column_id} > ${rel.target}.${rel.target_column_id}`);
      }
    }
  }

  return chunks.length > 0 ? chunks.join('\n\n') : '// No tables defined';
}

function extractFullWorkflows(flowcharts: any[] = []): string {
  if (!flowcharts || flowcharts.length === 0) {
    return '1. Mulai Permintaan Klien ➔ 2. Validasi Autentikasi ➔ 3. Mutasi Transaksi Basis Data ➔ 4. Respon Berhasil';
  }

  const sections: string[] = [];
  for (const fc of flowcharts) {
    const title = fc.title || fc.name || 'Alur Logika Bisnis';
    let data = fc.data || fc;
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {}
    }
    const nodes = Array.isArray(data?.nodes) ? data.nodes : [];
    const edges = Array.isArray(data?.edges) ? data.edges : [];

    sections.push(`### ${title}`);
    if (nodes.length > 0) {
      nodes.forEach((n: any, idx: number) => {
        const label = n.data?.label || n.label || `Langkah ${idx + 1}`;
        const shape = n.data?.shape || n.shape || 'proses';
        sections.push(`${idx + 1}. [${String(shape).toUpperCase()}] ${label}`);
      });
    }
    if (edges.length > 0) {
      edges.forEach((e: any) => {
        const sourceNode = nodes.find((n: any) => n.id === e.source || n.label === e.sourceLabel);
        const targetNode = nodes.find((n: any) => n.id === e.target || n.label === e.targetLabel);
        const source = sourceNode?.data?.label || sourceNode?.label || e.sourceLabel || e.source;
        const target = targetNode?.data?.label || targetNode?.label || e.targetLabel || e.target;
        const edgeLabel = e.label ? ` (Kondisi: ${e.label})` : '';
        sections.push(`- \`${source}\` ➔ \`${target}\`${edgeLabel}`);
      });
    }
    sections.push('');
  }
  return sections.join('\n');
}

function extractFullNotes(notes: any[] = []): string {
  if (!notes || notes.length === 0) return '';
  return notes
    .map((n) => {
      const rawContent = n.content_markdown || n.content || '';
      const cleanContent = rawContent
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
      if (!cleanContent) return '';
      return `### ${n.title || 'Dokumen Spesifikasi / PRD'}\n${cleanContent}`;
    })
    .filter(Boolean)
    .join('\n\n');
}

export function buildClaudeMasterPrompt(config: MultiAgentProjectConfig): string {
  const fullDbml = config.customDbml?.trim() || extractFullDbml(config.diagrams);
  const fullWorkflows = config.customWorkflows?.trim() || extractFullWorkflows(config.flowcharts);
  const fullNotes = config.customPrd?.trim() || extractFullNotes(config.notes);

  return generateClaudeMasterPrompt({
    projectName: config.projectName,
    domain: config.domain,
    techStack: config.techStack,
    fullDbml,
    fullWorkflows,
    fullNotes,
    customInstructions: config.customInstructions,
  });
}

export function buildDefaultBundleFiles(config: MultiAgentProjectConfig): GeneratedBundleFile[] {
  const fullDbml = extractFullDbml(config.diagrams);
  return generateDefaultBundleFiles({
    projectName: config.projectName,
    domain: config.domain,
    techStack: config.techStack,
    fullDbml,
  });
}

export function downloadMegaPromptFile(promptText: string, projectName: string): void {
  const blob = new Blob([promptText], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'project';
  a.href = url;
  a.download = `mega_prompt_${slug}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function downloadAgentBundleZip(files: GeneratedBundleFile[], projectName: string): Promise<void> {
  const zip = new JSZip();
  const folderName = `${projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'project'}-multiagent-bundle`;
  const root = zip.folder(folderName) || zip;

  for (const f of files) {
    root.file(f.path, f.content);
  }

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
