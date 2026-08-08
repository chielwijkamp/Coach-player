const CACHE = 'coach-player-v2';

const STATIC = [
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(STATIC))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (
    request.mode === 'navigate' ||
    request.destination === 'document'
  ) {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match(request))
    );

    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cached =>
        cached ||
        fetch(request)
      )
  );
});
