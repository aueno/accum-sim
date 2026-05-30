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
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] background message", payload);

  const title =
    payload.notification?.title || "通知";

  const options = {
    body: payload.notification?.body || "",
    icon: "/logo.png",

    tag: payload.data?.tag || "default",
    renotify: false,

    data: payload.data || {},
  };

  self.registration.showNotification(title, options);
});


self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});