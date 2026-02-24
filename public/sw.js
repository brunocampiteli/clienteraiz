// Service Worker — Cliente Raiz Push Notifications

self.addEventListener("push", function (event) {
  var data = { title: "Cliente Raiz", body: "", url: "/app" };

  if (event.data) {
    try {
      data = Object.assign(data, event.data.json());
    } catch (e) {
      data.body = event.data.text();
    }
  }

  var options = {
    body: data.body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: data.tag || "cr-notification",
    data: { url: data.url || "/app" },
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options).then(function () {
      // Notify open tabs so they can add to in-app notification list
      return self.clients
        .matchAll({ type: "window" })
        .then(function (clientList) {
          clientList.forEach(function (client) {
            client.postMessage({
              type: "push-received",
              title: data.title,
              body: data.body,
              url: data.url,
            });
          });
        });
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  var url = (event.notification.data && event.notification.data.url) || "/app";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        for (var i = 0; i < clientList.length; i++) {
          var client = clientList[i];
          if (client.url.indexOf(self.location.origin) !== -1 && "focus" in client) {
            client.focus();
            client.navigate(url);
            return;
          }
        }
        return self.clients.openWindow(url);
      })
  );
});

self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});
