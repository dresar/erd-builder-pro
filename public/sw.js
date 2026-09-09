const CACHE_NAME = 'prd-pro-cache-v2.2';
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

function isCacheableApiRequest(url) {
  const u = new URL(url);
  return CACHEABLE_API_PATHS.some((p) => u.pathname.startsWith(p));
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = event.request.url;

  if (!url.startsWith(self.location.origin) && !url.includes('/api/')) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cached = (await caches.match('/index.html')) || (await caches.match('/'));
        return cached || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      })
    );
    return;
  }

  if (url.includes('/api/')) {
    if (!isCacheableApiRequest(url)) return;

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
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      })
    );
    return;
  }

  if (url.includes('/assets/')) {
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
          .catch(() => cached || new Response('Asset unavailable', { status: 503 }));
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
        .catch(() => cached || new Response('', { status: 408 }));
      return cached || fetchPromise;
    })
  );
});
