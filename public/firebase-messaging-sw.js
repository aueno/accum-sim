importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js");
const firebaseConfig = {
  apiKey: "AIzaSyB4R1Mnfqwktn9C2zJ1eaXId6DYUcbiZ8s",
  authDomain: "accum-sim.firebaseapp.com",
  projectId: "accum-sim",
  messagingSenderId: "378268289284",
  appId: "1:378268289284:web:a4e6478a8b023a7939e851",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

/**
 * バックグラウンド通知
 */
// --- IndexedDB utility（SW用簡易） ---
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('AccumSimDB', 1);

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);

    req.onupgradeneeded = () => {
      const db = req.result;

      if (!db.objectStoreNames.contains('notifications')) {
        db.createObjectStore('notifications', {
          keyPath: 'id',
          autoIncrement: true,
        });
      }
    };
  });
}

async function saveNotificationToDB(item) {
  const db = await openDB();
  const tx = db.transaction('notifications', 'readwrite');
  const store = tx.objectStore('notifications');
  store.add(item);

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}


// --- Push handler ---
self.addEventListener("push", (event) => {
  if (!event.data) return;

  const payload = event.data.json();

  const title =
    payload.notification?.title ||
    payload.data?.title ||
    "通知";

  const body =
    payload.notification?.body ||
    payload.data?.body ||
    "";

  const unread = Number(payload.data?.unreadCount || 0);

  const item = {
    timestamp: Date.now(),
    title,
    body,
    read: false,
    url: payload.data?.url,
    tag: payload.data?.tag,
    unreadCount: unread,
  };

  event.waitUntil(
    (async () => {
      // ✅ IndexedDB保存
      await saveNotificationToDB(item);

      // ✅ 通知表示
      await self.registration.showNotification(title, {
        body,
        icon: "/logo.png",
        tag: item.tag || "default",
        renotify: false,
        data: item,
      });


      // ✅ iOSバッジ設定
      if ("setAppBadge" in self.registration) {
        await self.registration.setAppBadge(unread);
      }

      // ✅ フロントに通知（リアルタイム更新用）
      const clientsList = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clientsList) {
        client.postMessage({
          type: "NEW_NOTIFICATION",
          payload: item,
        });
      }
    })()
  );
});


// --- 通知クリック ---
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/accum-sim/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(url) && "focus" in client) {
            return client.focus();
          }
        }
        return clients.openWindow(url);
      })
  );
});