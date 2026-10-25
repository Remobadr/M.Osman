// عامل الخدمة: يستقبل إشعارات التذكير بعد الصلاة ويعرضها حتى لو كان الموقع مغلقاً
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { data = { body: event.data && event.data.text() }; }
  const title = data.title || 'سيرة ومسيرة عطاء وأثر لا يزول';
  const options = {
    body: data.body || 'لا تنسوا الأستاذ محمد عثمان من صالح دعائكم، رحمه الله.',
    icon: 'images/121536840_1013870365703207_8939207304560790042_n.jpg',
    badge: 'images/121536840_1013870365703207_8939207304560790042_n.jpg',
    dir: 'rtl',
    lang: 'ar',
    tag: data.tag || 'memorial-reminder',
    renotify: true,
    data: { url: data.url || './' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL((event.notification.data && event.notification.data.url) || './', self.registration.scope).href;
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const c of all) {
      if (c.url.startsWith(self.registration.scope) && 'focus' in c) return c.focus();
    }
    return self.clients.openWindow(target);
  })());
});
