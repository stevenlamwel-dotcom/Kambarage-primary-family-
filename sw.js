const CACHE_NAME = 'kambarage-alumni-v1';
const APP_SHELL = [
  './',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for Supabase/API calls, cache-first for the app shell itself.
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (url.includes('supabase.co') || url.includes('qrserver.com') || url.includes('googleapis.com') || url.includes('jsdelivr.net')) {
    return; // let these go straight to network, don't intercept
  }
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
