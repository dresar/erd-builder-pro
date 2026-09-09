export interface ParsedExternalBundle {
  project?: {
    name?: string;
    description?: string;
  };
  prd?: {
    title?: string;
    content_markdown?: string;
  };
  erd?: {
    title?: string;
    dbml?: string;
  };
  flowchart?: {
    title?: string;
    nodes?: any[];
    edges?: any[];
  };
}
