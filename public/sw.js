/* eslint-disable no-restricted-globals */
/**
 * Service Worker for Dashboard Market Hub PWA
 * 오프라인 지원, 캐싱, 백그라운드 동기화
 */

const CACHE_NAME = 'dm-hub-v1';
const RUNTIME_CACHE = 'dm-hub-runtime';

// 캐시할 정적 파일 목록
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// 설치 이벤트 - 정적 자산 캐싱
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// 활성화 이벤트 - 오래된 캐시 제거
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch 이벤트 - 네트워크 우선, 캐시 폴백 전략
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API 요청은 캐시하지 않음
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // 정적 자산: Cache First 전략
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  // 기타 요청: Network First, Cache Fallback 전략
  event.respondWith(
    fetch(request)
      .then((response) => {
        // 성공적인 응답을 런타임 캐시에 저장
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // 네트워크 실패 시 캐시에서 찾기
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          // 오프라인 페이지 반환 (옵션)
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }

          return new Response('오프라인 상태입니다.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          });
        });
      })
  );
});

// 백그라운드 동기화
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);

  if (event.tag === 'sync-data') {
    event.waitUntil(
      // 백그라운드에서 데이터 동기화 수행
      syncData()
    );
  }
});

// 푸시 알림
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');

  let notificationData = {
    title: 'Dashboard Market Hub',
    body: '새로운 알림이 있습니다.',
    icon: '/icon-192x192.png',
    badge: '/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data,
      };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // 이미 열린 윈도우가 있으면 포커스
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      // 없으면 새 윈도우 열기
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// 메시지 수신 (클라이언트로부터)
self.addEventListener('message', (event) => {
  console.log('[Service Worker] Message received:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(event.data.payload);
      })
    );
  }
});

// 백그라운드 데이터 동기화 함수
async function syncData() {
  try {
    console.log('[Service Worker] Syncing data in background...');

    // 실제로는 서버와 동기화 수행
    // const response = await fetch('/api/sync', { method: 'POST' });

    // 클라이언트에게 동기화 완료 알림
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        timestamp: Date.now(),
      });
    });

    return Promise.resolve();
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
    return Promise.reject(error);
  }
}

// 주기적인 백그라운드 동기화 (Periodic Background Sync API)
self.addEventListener('periodicsync', (event) => {
  console.log('[Service Worker] Periodic sync:', event.tag);

  if (event.tag === 'data-sync') {
    event.waitUntil(syncData());
  }
});

console.log('[Service Worker] Loaded');
