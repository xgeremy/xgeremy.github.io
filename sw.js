// ═══════════════════════════════════════════════════
// XGEREMY™ — Service Worker v1
// Cache-first para assets estáticos, network-first
// para HTML para que el SEO siempre esté fresco.
// ═══════════════════════════════════════════════════

const CACHE = 'xgeremy-v1';
const OFFLINE_URL = '/offline.html';

// Assets que se pre-cachean en la instalación
const PRECACHE = [
  '/',
  '/index.html',
  '/cuidados.html',
  '/consentimiento.html',
  '/offline.html',
  '/sitemap.xml',
  'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap'
];

// ── INSTALL: pre-cachear
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: limpiar caches viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ── FETCH: estrategia según tipo de recurso
self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  // Solo manejar GET
  if (request.method !== 'GET') return;

  // HTML → Network first (para que SEO y contenido siempre estén frescos)
  if (request.headers.get('Accept')?.includes('text/html')) {
    e.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request).then(r => r || caches.match(OFFLINE_URL)))
    );
    return;
  }

  // Fuentes de Google → Cache first (casi nunca cambian)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          caches.open(CACHE).then(c => c.put(request, res.clone()));
          return res;
        });
      })
    );
    return;
  }

  // Imágenes de Imgur → Cache first, stale-while-revalidate
  if (url.hostname === 'i.imgur.com') {
    e.respondWith(
      caches.match(request).then(cached => {
        const network = fetch(request).then(res => {
          caches.open(CACHE).then(c => c.put(request, res.clone()));
          return res;
        });
        return cached || network;
      })
    );
    return;
  }

  // Todo lo demás → Network first con fallback a cache
  e.respondWith(
    fetch(request)
      .then(res => {
        if (res.ok) caches.open(CACHE).then(c => c.put(request, res.clone()));
        return res;
      })
      .catch(() => caches.match(request))
  );
});
