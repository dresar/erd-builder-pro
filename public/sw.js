const CACHE_NAME = 'prd-pro-cache-v2.4';
const API_CACHE_NAME = 'prd-pro-api-v1.0';

const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/favicon.png',
  '/logo.png',
  '/manifest.webmanifest',
  '/icons/icon-192x192-any.png',
  '/icons/icon-192x192-maskable.png',
  '/icons/icon-512x512-any.png',
  '/icons/icon-512x512-maskable.png',
];

const CACHEABLE_API_PATHS = [
  '/api/projects',
  '/api/diagrams',
  '/api/notes',
  '/api/flowcharts',
  '/api/drawings',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(SHELL_ASSETS.map((a) => cache.add(a)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME && k !== API_CACHE_NAME) return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});

function isCacheableApiRequest(urlObj) {
  return CACHEABLE_API_PATHS.some((p) => urlObj.pathname.startsWith(p));
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;
  let urlObj;
  try {
    urlObj = new URL(url);
  } catch {
    return;
  }

  const isSameOrigin = urlObj.origin === self.location.origin;
  const isApiCall = urlObj.pathname.startsWith('/api/');

  if (!isSameOrigin && !isApiCall) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((c) => c.put('/index.html', clone)).catch(() => {});
          }
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cached = (await cache.match('/index.html')) || (await cache.match('/')) || (await caches.match('/index.html'));
          if (cached) return cached;
          try {
            return await fetch('/index.html');
          } catch {}
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>PRD PRO</title></head><body style="background:#0a0d14;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><div style="text-align:center;"><h2>Anda Sedang Offline</h2><p style="color:#888;">Silakan periksa koneksi internet Anda.</p><button onclick="location.reload()" style="padding:8px 16px;background:#4f46e5;color:#fff;border:none;border-radius:6px;cursor:pointer;">Muat Ulang</button></div></body></html>',
            { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  if (isApiCall) {
    if (!isCacheableApiRequest(urlObj)) return;

    event.respondWith(
      caches.open(API_CACHE_NAME).then(async (cache) => {
        try {
          const networkResponse = await fetch(event.request.clone());
          if (networkResponse.ok) {
            try {
              const clone = networkResponse.clone();
              cache.put(event.request, clone).catch(() => {});
            } catch {}
          }
          return networkResponse;
        } catch {
          const cached = await cache.match(event.request);
          if (cached) return cached;
          return new Response(JSON.stringify({ error: 'offline', cached: false }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      })
    );
    return;
  }

  if (urlObj.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request)
          .then((res) => {
            if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
              try {
                const clone = res.clone();
                caches.open(CACHE_NAME).then((c) => c.put(event.request, clone)).catch(() => {});
              } catch {}
            }
            return res;
          })
          .catch(() => cached || new Response('Asset unavailable', { status: 404 }));
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((res) => {
          if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
            try {
              const clone = res.clone();
              caches.open(CACHE_NAME).then((c) => c.put(event.request, clone)).catch(() => {});
            } catch {}
          }
          return res;
        })
        .catch(async () => {
          if (cached) return cached;
          if (event.request.headers.get('accept')?.includes('text/html') || event.request.mode === 'navigate') {
            const indexHtml = (await caches.match('/index.html')) || (await caches.match('/'));
            if (indexHtml) return indexHtml;
          }
          return new Response('Unavailable', { status: 404 });
        });
      return cached || fetchPromise;
    })
  );
});
