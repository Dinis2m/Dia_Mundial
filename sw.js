// sw.js - Service Worker for Dia Mundial da Ciência
// Version: 1.0.0
const VERSION = 'v1.0.0';
const CACHE_NAME = `science-day-${VERSION}`;
const STATIC_CACHE = `science-day-static-${VERSION}`;
const DYNAMIC_CACHE = `science-day-dynamic-${VERSION}`;
const OFFLINE_CACHE = `science-day-offline-${VERSION}`;

// Assets to precache
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/animations.js',
  '/manifest.json',
  '/assets/icons/science-icon.svg',
  '/assets/icons/energy-icon.svg',
  '/assets/icons/peace-icon.svg',
  '/assets/icons/diplomacy-icon.svg',
  '/assets/images/Cientistas/Marie_Curie.jpg',
  '/assets/images/Cientistas/Albert_Einstein.jpg',
  '/assets/images/Cientistas/TuYouyou.jpeg',
  '/assets/images/Cientistas/Abdus Salam.jpeg',
  '/assets/images/Cientistas/Jennifer_Doudna.jpg',
  '/assets/images/Cientistas/CarlosChagas.jpeg',
  '/assets/images/Cientistas/RosalingFranklin.jpeg',
  '/assets/images/Cientistas/KatherineJohnson.jpeg',
  '/assets/images/Cientistas/Fei-Fei Lis.jpeg'
];

// External resources to cache (Google Fonts, AOS)
const EXTERNAL_PATTERNS = [
  /^https:\/\/fonts\.googleapis\.com\/.*/,
  /^https:\/\/fonts\.gstatic\.com\/.*/,
  /^https:\/\/unpkg\.com\/aos@2\.3\.4\/.*/
];

// Install event - precache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        return cache.addAll(PRECACHE_ASSETS).catch(err => {
          console.warn('[SW] Some assets failed to precache:', err);
        });
      }),
      caches.open(OFFLINE_CACHE).then(cache => {
        return cache.add('/offline.html').catch(() => {});
      })
    ]).then(() => {
      console.log('[SW] Install complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('science-day-') &&
            ![STATIC_CACHE, DYNAMIC_CACHE, OFFLINE_CACHE].includes(name))
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] Activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension, data:, blob: URLs
  if (!url.protocol.startsWith('http')) return;

  // Strategy: Cache First for static assets
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Strategy: Network First for HTML (with offline fallback)
  if (isHTMLRequest(request)) {
    event.respondWith(networkFirstWithOffline(request));
    return;
  }

  // Strategy: Stale While Revalidate for external resources (fonts, AOS)
  if (isExternalResource(url)) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    return;
  }

  // Strategy: Network First for images (with cache fallback)
  if (request.destination === 'image') {
    event.respondWith(networkFirstWithCache(request, DYNAMIC_CACHE));
    return;
  }

  // Default: Network First with cache fallback
  event.respondWith(networkFirstWithCache(request, DYNAMIC_CACHE));
});

// Cache First strategy - for static assets
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// Network First with offline fallback - for HTML
async function networkFirstWithOffline(request) {
  const cache = await caches.open(DYNAMIC_CACHE);

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;

    // Offline fallback
    const offlineCache = await caches.open(OFFLINE_CACHE);
    const offline = await offlineCache.match('/offline.html');
    if (offline) return offline;

    return new Response(
      `<!DOCTYPE html><html lang="pt-PT"><head><meta charset="UTF-8"><title>Offline</title>
      <style>body{font-family:sans-serif;text-align:center;padding:3rem;background:#0b0f19;color:#fff}
      .icon{font-size:4rem;margin-bottom:1rem}button{padding:.8rem 1.5rem;background:#00f3ff;color:#0b0f19;border:none;border-radius:.5rem;font-weight:bold;cursor:pointer}
      </style></head><body>
      <div class="icon">📡</div><h1>Você está offline</h1>
      <p>Verifique sua conexão e tente novamente.</p>
      <button onclick="window.location.reload()">Recarregar</button></body></html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

// Stale While Revalidate - for external resources
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => cached);

  return cached || fetchPromise;
}

// Network First with cache fallback - for images and default
async function networkFirstWithCache(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response('Offline', { status: 503 });
  }
}

// Helper functions
function isStaticAsset(url) {
  return url.pathname.match(/\.(css|js|json|svg|ico|woff2?|ttf|eot)$/);
}

function isHTMLRequest(request) {
  return request.headers.get('Accept')?.includes('text/html') ||
         request.mode === 'navigate';
}

function isExternalResource(url) {
  return EXTERNAL_PATTERNS.some(pattern => pattern.test(url.href));
}

// Background Sync for newsletter submissions
self.addEventListener('sync', event => {
  if (event.tag === 'newsletter-sync') {
    event.waitUntil(syncNewsletter());
  }
});

async function syncNewsletter() {
  try {
    const db = await openDB();
    const pending = await db.getAll('newsletter-queue');

    for (const item of pending) {
      try {
        await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data)
        });
        await db.delete('newsletter-queue', item.id);
      } catch (err) {
        console.warn('[SW] Newsletter sync failed for:', item.id);
      }
    }
  } catch (err) {
    console.warn('[SW] Background sync error:', err);
  }
}

// Simple IndexedDB wrapper for offline queue
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ScienceDayDB', 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('newsletter-queue')) {
        db.createObjectStore('newsletter-queue', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

// Push notifications (if needed in future)
self.addEventListener('push', event => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/assets/icons/science-icon.svg',
    badge: '/assets/icons/science-icon.svg',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'Abrir' },
      { action: 'close', title: 'Fechar' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clientList => {
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        return clients.openWindow(event.notification.data.url);
      })
    );
  }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
  if (event.tag === 'content-update') {
    event.waitUntil(updateContent());
  }
});

async function updateContent() {
  // Could check for updated content from server
  console.log('[SW] Periodic sync: checking for updates');
}