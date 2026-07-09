// ── notificatie-sw.js ──
// Lichte service worker, UITSLUITEND om showNotification() beschikbaar te
// maken voor meldingen die vanuit de open pagina zelf worden aangestuurd.
//
// Dit is GEEN Firebase Cloud Messaging: geen VAPID-key, geen serverside
// verzending, geen Blaze-plan nodig. Het lost alleen op dat de klassieke
// `new Notification()`-aanroep op sommige browsers (o.a. Chrome op Android)
// niet is toegestaan buiten een service worker — met deze registratie
// gebruikt de app overal dezelfde, breed ondersteunde weergavemethode.
//
// BELANGRIJK: dit bestand moet in de ROOT van je website staan, naast je
// HTML-bestand (dus bijv. https://jouwgebruikersnaam.github.io/amac-wachtrij/notificatie-sw.js).

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

// Klik op de melding: brengt een al-open tabblad naar voren, of opent er een.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow('./');
    })
  );
});
