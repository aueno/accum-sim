const CACHE_NAME = 'accum-sim-v1';

const urlsToCache = [
  '/',
  '/accum-sim/',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// インストール時キャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// 有効化
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// フェッチ戦略（超重要）
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // ナビゲーション（ページ）はネット優先＋フォールバック
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('/'))
    );
    return;
  }

  // その他（JS/CSS/画像）はキャッシュ優先
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        })
      );
    })
  );
});