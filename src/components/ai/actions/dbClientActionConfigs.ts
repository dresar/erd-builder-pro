import type { AIAction } from './types';

const context = (ctx: Record<string, any>) => ctx.aiContextText || ctx.content || '(no DB Client context available)';

export const dbClientActions: AIAction[] = [
  {
    id: 'db-client-explain-table',
    label: 'Jelaskan Tabel',
    description: 'Analisis struktur tabel live.',
    icon: 'Explain',
    buildPrompt: ctx => `Explain the selected DB Client table using only this live schema metadata. Describe its purpose, columns, keys, and relationships. Clearly label any inference.\n\n${context(ctx)}`,
  },
  {
    id: 'db-client-analyze-query',
    label: 'Analisis Kueri',
    description: 'Evaluasi keamanan dan performa SQL.',
    icon: 'Query',
    buildPrompt: ctx => `Analyze the active SQL query for correctness, dialect compatibility, safety, and likely performance. Do not claim it was executed. Preserve the user's database dialect.\n\n${context(ctx)}`,
  },
  {
    id: 'db-client-generate-query',
    label: 'Buat Kueri',
    description: 'Rancang kueri SQL otomatis.',
    icon: 'SQL',
    buildPrompt: ctx => `Generate the SQL requested by the user using only tables and columns present in this DB Client context. Match the database dialect. Return a proposal only; never claim it was executed.\n\n${context(ctx)}`,
  },
  {
    id: 'db-client-suggest-indexes',
    label: 'Saran Indeks',
    description: 'Rekomendasi indeks performa kueri.',
    icon: 'Index',
    buildPrompt: ctx => `Suggest indexes using only existing tables, columns, keys, and the active query shown here. Explain the workload assumption and do not invent columns.\n\n${context(ctx)}`,
  },
  {
    id: 'db-client-schema-issues',
    label: 'Cek Risiko',
    description: 'Deteksi inkonsistensi skema DB.',
    icon: 'Review',
    buildPrompt: ctx => `Review this live database metadata for concrete schema risks such as mismatched keys, missing constraints, unsafe defaults, and naming inconsistencies. Separate observed facts from suggestions.\n\n${context(ctx)}`,
  },
];
