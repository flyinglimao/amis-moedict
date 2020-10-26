const CACHE_NAME = 'cache-v1';
self.addEventListener('fetch', function(event) {
    if (event.request.method != 'GET') return;

    event.respondWith(async function() {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse) {
            event.waitUntil(cache.add(event.request));
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
