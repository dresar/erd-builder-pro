import { AIAction, actionIcons } from './actions/types';
import { erdActions } from './actions/erdActionConfigs';
import { notesActions } from './actions/notesActionConfigs';
import { flowchartActions } from './actions/flowchartActionConfigs';
import { dbClientActions } from './actions/dbClientActionConfigs';
import { grillMeAction } from './actions/grillMeActionConfig';

// ─── Re-export for external consumers ─────────────────
export type { AIAction };
export { actionIcons };
export { grillMeAction };

// ─── Registry ─────────────────────────────────────────

export const actionsRegistry: Record<string, AIAction[]> = {
  erd: erdActions,
  notes: notesActions,
  flowchart: flowchartActions,
  'db-client': dbClientActions,
};

export type ViewType = keyof typeof actionsRegistry;

export function getActionsForView(view: ViewType): AIAction[] {
  return actionsRegistry[view] || [];
}

export const allAIActions: AIAction[] = [
  grillMeAction,
  ...erdActions,
  ...flowchartActions,
  ...notesActions,
  ...dbClientActions,
];

export interface ActionCategory {
  id: string;
  name: string;
  actions: AIAction[];
}

export const actionCategories: ActionCategory[] = [
  {
    id: 'plan',
    name: 'Perencanaan',
    actions: [grillMeAction],
  },
  {
    id: 'erd',
    name: 'ERD & Database',
    actions: erdActions,
  },
  {
    id: 'flowchart',
    name: 'Flowchart & Alur',
    actions: flowchartActions,
  },
  {
    id: 'notes',
    name: 'Catatan & Dokumen',
    actions: notesActions,
  },
  {
    id: 'db-client',
    name: 'Database Client',
    actions: dbClientActions,
  },
];
