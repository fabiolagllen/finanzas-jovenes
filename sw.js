const CACHE_NAME = 'finanzas-jovenes-v13';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './mobile-app.js',
  './profile-menu-sync.js',
  './menu-fix-loader.js',
  './supabase.js',
  './notifications.js',
  './payments.js',
  './profile.js',
  './reminders-menu.js'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(fetch(event.request).then(response => { if(response?.ok)caches.open(CACHE_NAME).then(c=>c.put(event.request,response.clone())); return response; }).catch(() => caches.match(event.request).then(c => c || caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => {
    const network=fetch(event.request).then(response=>{if(response?.ok)caches.open(CACHE_NAME).then(c=>c.put(event.request,response.clone()));return response}).catch(()=>cached);
    return cached||network;
  }));
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target=event.notification.data?.url||'./#pagos';
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{for(const client of list){if('focus'in client){client.navigate(target);return client.focus()}}return clients.openWindow(target)}));
});
self.addEventListener('push', event => {
  let data={};try{data=event.data?event.data.json():{}}catch(e){}
  event.waitUntil(self.registration.showNotification(data.title||'💚 FinanJoven',{body:data.body||'Tienes un nuevo recordatorio financiero.',icon:'./icon.svg',badge:'./icon.svg',tag:data.tag||'finanjoven-push',data:{url:data.url||'./#pagos'}}));
});
