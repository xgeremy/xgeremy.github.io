const CACHE = 'xg-v2';
const PRECACHE = ['/', '/index.html', '/cuidados.html', '/consentimiento.html', '/offline.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const { request: req } = e;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Fonts + imgur → cache first (immutable)
  if (url.hostname === 'fonts.gstatic.com' || url.hostname === 'i.imgur.com') {
    e.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
      caches.open(CACHE).then(c => c.put(req, res.clone()));
      return res;
    })));
    return;
  }

  // HTML → network first, fallback cache
  if (req.headers.get('Accept')?.includes('text/html')) {
    e.respondWith(fetch(req).then(res => {
      caches.open(CACHE).then(c => c.put(req, res.clone()));
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('/offline.html'))));
    return;
  }

  // Everything else → stale-while-revalidate
  e.respondWith(caches.match(req).then(cached => {
    const network = fetch(req).then(res => {
      caches.open(CACHE).then(c => c.put(req, res.clone()));
      return res;
    });
    return cached || network;
  }));
});
