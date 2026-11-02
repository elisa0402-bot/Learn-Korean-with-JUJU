/* Korean with Juju 쌤: fresh online lessons, cached copies when offline. */
const CACHE = 'juju-v2-20261102';
const CORE = ['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./app-update.js','./version.json'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE)
    .then(cache => cache.addAll(CORE.map(url => new Request(url, {cache:'reload'}))))
    .then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Preserve lessons already downloaded for offline use when migrating caches.
    const next = await caches.open(CACHE);
    for (const name of await caches.keys()) {
      if (name === CACHE || !name.startsWith('juju-')) continue;
      const previous = await caches.open(name);
      for (const request of await previous.keys()) {
        if (!await next.match(request)) {
          const response = await previous.match(request);
          if (response) await next.put(request, response);
        }
      }
      await caches.delete(name);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  const fresh = request.mode === 'navigate' || /\.(html|js|json|webmanifest)$/.test(url.pathname);
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(fresh ? new Request(request, {cache:'no-store'}) : request);
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(cache.put(request, copy).catch(() => {}));
      }
      return response;
    } catch (error) {
      const hit = await cache.match(request);
      if (hit) return hit;
      if (request.mode === 'navigate') {
        const home = await cache.match('./index.html');
        if (home) return home;
      }
      return Response.error();
    }
  })());
});
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
