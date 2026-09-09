import { ApiEndpoint } from './types';

export function generateOpenApiSpec(projectName: string, domain: string, endpoints: ApiEndpoint[]): Record<string, any> {
  const paths: Record<string, any> = {};

  for (const ep of endpoints) {
    const openApiPath = ep.path.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
    if (!paths[openApiPath]) {
      paths[openApiPath] = {};
    }

    const methodKey = ep.method.toLowerCase();
    paths[openApiPath][methodKey] = {
      summary: ep.summary,
      description: ep.description,
      tags: ep.tags,
      parameters: ep.params
        .filter(p => p.in !== 'body')
        .map(p => ({
          name: p.name,
          in: p.in,
          required: p.required,
          description: p.description,
          schema: { type: p.type.toLowerCase() === 'integer' ? 'integer' : 'string' },
        })),
      ...(ep.requestBodyExample ? {
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' },
              example: ep.requestBodyExample,
            },
          },
        },
      } : {}),
      responses: {
        [ep.responseExample.status]: {
          description: ep.summary,
          content: {
            'application/json': {
              example: ep.responseExample.data,
            },
          },
        },
      },
    };
  }

  return {
    openapi: '3.0.3',
    info: {
      title: `${projectName} REST API`,
      description: `Spesifikasi Kontrak API Enterprise untuk domain ${domain}.`,
      version: '1.0.0',
    },
    servers: [
      { url: 'https://api.example.com/api/v1', description: 'Production Gateway' },
      { url: 'http://localhost:3000/api/v1', description: 'Development Server' },
    ],
    paths,
  };
}

export function generatePostmanCollection(projectName: string, endpoints: ApiEndpoint[]): Record<string, any> {
  const itemsByTag: Record<string, any[]> = {};

  for (const ep of endpoints) {
    const tag = ep.tags[0] || 'Umum';
    if (!itemsByTag[tag]) itemsByTag[tag] = [];

    itemsByTag[tag].push({
      name: `${ep.method} ${ep.summary}`,
      request: {
        method: ep.method,
        header: [
          { key: 'Content-Type', value: 'application/json' },
          { key: 'Authorization', value: 'Bearer {{token}}' },
        ],
        url: {
          raw: `{{baseUrl}}${ep.path}`,
          host: ['{{baseUrl}}'],
          path: ep.path.split('/').filter(Boolean),
        },
        ...(ep.requestBodyExample ? {
          body: {
            mode: 'raw',
            raw: JSON.stringify(ep.requestBodyExample, null, 2),
          },
        } : {}),
      },
    });
  }

  return {
    info: {
      name: `${projectName} Collection`,
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: Object.entries(itemsByTag).map(([tag, items]) => ({
      name: tag,
      item: items,
    })),
  };
}

export function downloadJsonFile(data: any, fileName: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
