import TurndownService from "turndown";

interface ReadUrlResult {
  success: boolean;
  url: string;
  title: string;
  markdown: string;
  wordCount: number;
  excerpt: string;
}

function isPrivateOrLocalIp(hostname: string): boolean {
  const cleanHost = hostname.toLowerCase().trim();
  if (
    cleanHost === "localhost" ||
    cleanHost.endsWith(".localhost") ||
    cleanHost === "127.0.0.1" ||
    cleanHost === "0.0.0.0" ||
    cleanHost === "::1"
  ) {
    return true;
  }

  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = cleanHost.match(ipv4Regex);
  if (match) {
    const [, a, b] = match.map(Number);
    if (a === 127) return true;
    if (a === 10) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 169 && b === 254) return true;
    if (a === 0) return true;
  }

  return false;
}

function cleanHtmlContent(rawHtml: string): { title: string; bodyHtml: string } {
  const titleMatch = rawHtml.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  let title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : '';

  let sanitized = rawHtml
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, '')
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
    .replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, '');

  const mainMatch = sanitized.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i) ||
                    sanitized.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i);

  if (mainMatch && mainMatch[1].trim().length > 200) {
    sanitized = mainMatch[1];
  } else {
    const bodyMatch = sanitized.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch && bodyMatch[1].trim().length > 200) {
      sanitized = bodyMatch[1];
    }
  }

  if (!title) {
    const h1Match = sanitized.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1Match) {
      title = h1Match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    }
  }

  return { title: title || 'Dokumen Web', bodyHtml: sanitized };
}

export async function readUrlToMarkdown(rawUrl: string): Promise<ReadUrlResult> {
  let targetUrl: URL;
  try {
    targetUrl = new URL(rawUrl.trim());
  } catch {
    throw new Error("Format URL tidak valid. Pastikan diawali dengan http:// atau https://");
  }

  if (targetUrl.protocol !== "http:" && targetUrl.protocol !== "https:") {
    throw new Error("Hanya protokol HTTP dan HTTPS yang didukung.");
  }

  if (isPrivateOrLocalIp(targetUrl.hostname)) {
    throw new Error("Akses ke jaringan lokal atau privat diblokir demi keamanan.");
  }

  const response = await fetch(targetUrl.toString(), {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,text/plain,text/markdown;q=0.9,*/*;q=0.8",
      "Accept-Language": "id,en-US,en;q=0.9",
    },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil halaman web (HTTP ${response.status}: ${response.statusText})`);
  }

  const contentType = response.headers.get("content-type") || "";
  const rawText = await response.text();

  if (!rawText.trim()) {
    throw new Error("Halaman web kosong atau tidak memiliki konten teks.");
  }

  let title = targetUrl.hostname;
  let markdown = "";

  if (contentType.includes("text/markdown") || contentType.includes("text/plain")) {
    markdown = rawText.trim();
    title = targetUrl.pathname.split("/").filter(Boolean).pop() || targetUrl.hostname;
  } else {
    const { title: extractedTitle, bodyHtml } = cleanHtmlContent(rawText);
    title = extractedTitle || targetUrl.hostname;

    const turndown = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      bulletListMarker: "-",
    });

    turndown.addRule("table", {
      filter: "table",
      replacement: (content) => `\n\n${content}\n\n`,
    });

    turndown.addRule("tableRow", {
      filter: "tr",
      replacement: (content, node) => {
        let separator = "";
        const parent = node.parentElement;
        const isHeaderRow = parent?.nodeName === "THEAD" ||
                           (!parent?.querySelector("thead") && node === parent?.firstElementChild);

        if (isHeaderRow) {
          const cellCount = (node as HTMLElement).querySelectorAll("th, td").length;
          separator = "|" + "---|".repeat(Math.max(1, cellCount)) + "\n";
        }
        return "|" + content + "\n" + separator;
      },
    });

    turndown.addRule("tableCell", {
      filter: ["th", "td"],
      replacement: (content) => ` ${content.trim()} |`,
    });

    markdown = turndown.turndown(bodyHtml);
  }

  markdown = markdown
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const MAX_CHARS = 35_000;
  if (markdown.length > MAX_CHARS) {
    markdown = markdown.slice(0, MAX_CHARS) + "\n\n> *[... Konten dokumen web dipotong hingga 35.000 karakter agar efisien untuk konteks AI ...]*";
  }

  const words = markdown.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const excerpt = words.slice(0, 40).join(" ") + (wordCount > 40 ? "..." : "");

  return {
    success: true,
    url: targetUrl.toString(),
    title,
    markdown,
    wordCount,
    excerpt,
  };
}
