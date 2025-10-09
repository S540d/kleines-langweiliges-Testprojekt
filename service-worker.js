const CACHE_VERSION = '1.3.1';
const BUILD_DATE = '2025-01-08'; // Cache busting - update on each version
const CACHE_NAME = `eisenhauer-matrix-v${CACHE_VERSION}-${BUILD_DATE}`;
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json'
];

// Files that should always be fetched from network first
// Expanded to ensure latest version is always loaded
const networkFirstFiles = [
  './index.html',
  './style.css',
  './script.js',
  './manifest.json'
];

// Install Service Worker
self.addEventListener('install', event => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch - Network First for important files, Cache First for others
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const pathname = url.pathname;

  // Check if this file should use network-first strategy
  const isNetworkFirst = networkFirstFiles.some(file =>
    pathname.endsWith(file) || pathname === '/' || pathname === '/index.html'
  );

  if (isNetworkFirst) {
    // Network First Strategy - Always try network with cache-busting, fallback to cache
    event.respondWith(
      fetch(event.request, {
        cache: 'no-cache' // Force revalidation with server
      })
        .then(response => {
          // Check if valid response
          if (response && response.status === 200 && response.type === 'basic') {
            // Clone and cache the response
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.match(event.request);
        })
    );
  } else {
    // Cache First Strategy - Try cache first, fallback to network
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            return response;
          }

          return fetch(event.request).then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone and cache
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });

            return response;
          });
        })
    );
  }
});

// Activate - Clean up old caches
self.addEventListener('activate', event => {
  // Take control of all pages immediately
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Delete all caches except the current one
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});
