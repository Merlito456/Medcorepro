
const CACHE_NAME = 'medcore-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // Only attempt to cache or intercept GET requests
  if (event.request.method !== 'GET') return;

  // For Supabase and Gemini, we want network first
  if (url.includes('supabase.co') || url.includes('generativelanguage.googleapis.com')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
    return;
  }

  // For static assets, we use cache first
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
