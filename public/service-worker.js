const CACHE_VERSION = 'paper-shop-v1';
const CACHE_STATIC = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC = `${CACHE_VERSION}-dynamic`;
const CACHE_API = `${CACHE_VERSION}-api`;

// Файлы которые ОБЯЗАТЕЛЬНО должны быть в кэше
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/fonts/inter-cyrillic-400.woff2',
  '/fonts/inter-cyrillic-500.woff2',
  '/fonts/inter-cyrillic-600.woff2',
  '/fonts/rubik-cyrillic-400.woff2',
  '/fonts/rubik-cyrillic-500.woff2',
  '/fonts/rubik-cyrillic-700.woff2',
];

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Активация и очистка старых кэшей
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.startsWith(CACHE_VERSION)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Стратегия кэширования: Network First для HTML, Cache First для статики
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Пропускаем не-GET запросы
  if (request.method !== 'GET') return;

  // API запросы - Network First с fallback на кэш
  if (url.pathname.startsWith('/api')) {
    event.respondWith(networkFirst(request, CACHE_API));
    return;
  }

  // HTML - Network First (всегда свежее содержимое)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request, CACHE_DYNAMIC));
    return;
  }

  // Шрифты и статика - Cache First (редко меняются)
  if (
    url.pathname.includes('.woff2') ||
    url.pathname.includes('.woff') ||
    url.pathname.includes('.css') ||
    url.pathname.includes('.js')
  ) {
    event.respondWith(cacheFirst(request, CACHE_STATIC));
    return;
  }

  // Картинки - Cache First с обновлением в фоне
  if (url.pathname.includes('/images') || /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(url.pathname)) {
    event.respondWith(cacheFirstWithUpdate(request, CACHE_DYNAMIC));
    return;
  }

  // По умолчанию - Network First
  event.respondWith(networkFirst(request, CACHE_DYNAMIC));
});

/**
 * Cache First стратегия
 * Сначала ищет в кэше, если не найдено - запрашивает с сервера
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Fetch failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

/**
 * Network First стратегия
 * Сначала пытается запросить с сервера, если не удалось - ищет в кэше
 */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Network failed, using cache:', error);
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    return cached || new Response('Offline', { status: 503 });
  }
}

/**
 * Cache First с обновлением в фоне
 * Возвращает кэшированную версию, но обновляет в фоне
 */
async function cacheFirstWithUpdate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Возвращаем кэшированную версию сразу
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch((error) => {
      console.error('[SW] Background fetch failed:', error);
    });

  return cached || fetchPromise;
}

// Обработка сообщений от клиента
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
