import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ApiEndpoint } from '@/lib/api-engine/types';

interface CodeSnippetViewerProps {
  endpoint: ApiEndpoint;
  headers: Record<string, string>;
  body: string;
}

export function CodeSnippetViewer({ endpoint, headers, body }: CodeSnippetViewerProps) {
  const [lang, setLang] = useState<'curl' | 'fetch' | 'python' | 'axios'>('curl');
  const [copied, setCopied] = useState(false);

  const baseUrl = localStorage.getItem('prd_pro_api_base_url') || 'http://localhost:3000';
  const fullUrl = `${baseUrl.replace(/\/+$/, '')}${endpoint.path}`;

  const snippet = React.useMemo(() => {
    if (lang === 'curl') {
      const headerLines = Object.entries(headers)
        .map(([k, v]) => `  -H "${k}: ${v}" \\`)
        .join('\n');
      const bodyPart = ['POST', 'PUT', 'PATCH'].includes(endpoint.method) && body.trim()
        ? `  -d '${body.trim()}'`
        : '';
      return `curl -X ${endpoint.method} "${fullUrl}" \\\n${headerLines}${bodyPart ? '\n' + bodyPart : ''}`;
    }

    if (lang === 'fetch') {
      const bodyStr = ['POST', 'PUT', 'PATCH'].includes(endpoint.method) && body.trim()
        ? `,\n  body: JSON.stringify(${body.trim()})`
        : '';
      return `const response = await fetch("${fullUrl}", {
  method: "${endpoint.method}",
  headers: ${JSON.stringify(headers, null, 4)}${bodyStr}
});
const data = await response.json();
console.log(data);`;
    }

    if (lang === 'python') {
      const jsonPart = ['POST', 'PUT', 'PATCH'].includes(endpoint.method) && body.trim()
        ? `,\n    json=${body.trim()}`
        : '';
      return `import requests

url = "${fullUrl}"
headers = ${JSON.stringify(headers, null, 4)}

response = requests.${endpoint.method.toLowerCase()}(
    url,
    headers=headers${jsonPart}
)
print(response.json())`;
    }

    const axiosBody = ['POST', 'PUT', 'PATCH'].includes(endpoint.method) && body.trim()
      ? `, ${body.trim()}`
      : '';
    return `import axios from 'axios';

const response = await axios.${endpoint.method.toLowerCase()}("${fullUrl}"${axiosBody}, {
  headers: ${JSON.stringify(headers, null, 4)}
});
console.log(response.data);`;
  }, [lang, endpoint, headers, body, fullUrl]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      toast.success('Kode disalin');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Gagal menyalin');
    }
  };

  return (
    <div className="rounded-xl border border-border/70 bg-card overflow-hidden text-xs">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 bg-muted/20">
        <div className="flex items-center gap-1">
          {(['curl', 'fetch', 'python', 'axios'] as const).map(l => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                lang === l ? 'bg-background text-foreground shadow-xs font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {l === 'curl' ? 'cURL' : l === 'fetch' ? 'TypeScript Fetch' : l === 'python' ? 'Python' : 'Axios'}
            </button>
          ))}
        </div>

        <Button
          onClick={handleCopy}
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1 px-2.5 cursor-pointer border-border/70"
        >
          {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
          <span>{copied ? 'Disalin' : 'Salin'}</span>
        </Button>
      </div>

      <pre className="p-3 font-mono text-[11px] leading-relaxed overflow-x-auto custom-scrollbar bg-background/50 select-text">
        {snippet}
      </pre>
    </div>
  );
}
