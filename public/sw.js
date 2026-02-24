self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
  // Basic fetch handler
  e.respondWith(fetch(e.request));
});
