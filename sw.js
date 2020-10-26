const CACHE_NAME = 'cache-v1';
self.addEventListener('install', function() {
    console.log('install')
    caches.open(CACHE_NAME).add('/');
});
this.addEventListener('activate', function(event) {
    console.log('activated!');
  });
self.addEventListener('fetch', function(event) {
    console.log(event.request);
    if (event.request.method != 'GET') return;

    event.respondWith(async function() {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
            event.waitUntil(cache.add(event.request)).cache(_ => {});
            return cachedResponse;
        }

        return fetch(event.request).then(function (response) {
            if (response && response.status === 200) {
                cache.put(event.target, response.clone());
            }

            return response;
        });
    }());
});
