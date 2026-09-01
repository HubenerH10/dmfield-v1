/* DM Field — cache offline. Troque a versão a cada nova subida do index.html. */
const CACHE = 'dmfield-set2026-v2';
const ARQ = ['index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(ARQ).catch(function () {}); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.map(function (k) { return k === CACHE ? null : caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  if (e.request.url.indexOf('script.google.com') > -1) return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      const rede = fetch(e.request).then(function (r) {
        if (r && r.status === 200 && r.type === 'basic') {
          const cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, cp); });
        }
        return r;
      }).catch(function () { return hit; });
      return hit || rede;
    })
  );
});
