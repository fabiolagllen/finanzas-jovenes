const CACHE_NAME = 'finanzas-jovenes-v8';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './mobile-app.js',
  './notifications.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Las páginas HTML siempre intentan cargarse desde la versión actual.
  // Esto evita que el menú abra una versión vieja o una página de error guardada.
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  // Para CSS, JS, imágenes y demás recursos usamos caché con actualización en red.
  event.respondWith(
    caches.match(event.request).then(cached => {
      const network = fetch(event.request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => cached);
      return cached || network;
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = event.notification.data && event.notification.data.url ? event.notification.data.url : './#panel';
  event.waitUntil(
    clients.matchAll({type:'window',includeUncontrolled:true}).then(list => {
      for(const client of list){
        if('focus' in client){
          client.navigate(target);
          return client.focus();
        }
      }
      return clients.openWindow(target);
    })
  );
});

self.addEventListener('push', event => {
  let data={};
  try{data=event.data ? event.data.json() : {};}catch(e){data={};}
  const title=data.title || '💚 FinanJoven';
  const options={
    body:data.body || 'Tienes un nuevo recordatorio financiero.',
    icon:'./icon.svg',
    badge:'./icon.svg',
    tag:data.tag || 'finanjoven-push',
    data:{url:data.url || './#panel'}
  };
  event.waitUntil(self.registration.showNotification(title,options));
});
