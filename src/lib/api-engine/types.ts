export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  default?: string;
  in: 'path' | 'query' | 'header' | 'body';
}

export interface ApiEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  tableName: string;
  tableTitle: string;
  summary: string;
  description: string;
  params: ApiParam[];
  requestBodyExample?: Record<string, any>;
  responseExample: {
    status: number;
    data: any;
  };
  tags: string[];
}

export interface SimulationResult {
  status: number;
  statusText: string;
  latencyMs: number;
  headers: Record<string, string>;
  data: any;
  timestamp: string;
}

export interface WorkflowStep {
  id: string;
  order: number;
  title: string;
  method: HttpMethod;
  endpoint: string;
  tableName: string;
  description: string;
  requestPayload: Record<string, any>;
  expectedStatus: number;
  status: 'idle' | 'running' | 'success' | 'failed';
  result?: SimulationResult;
}
