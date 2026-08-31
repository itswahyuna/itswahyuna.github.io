const CACHE_NAME = "itswahyuna-v1.0.0";

const CACHE_FILES = [
    "./",
    "./index.html",
    "./wahyuna.jpeg",
    "./instagram.webp",
    "./github.webp",
    "./roblox.webp",
    "./gmail.webp",
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(CACHE_FILES))
    );

    self.skipWaiting();
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );

    self.clients.claim();
});

self.addEventListener("fetch", event => {

    // request GET
    if (event.request.method !== "GET") {
        return;
    }

    event.respondWith(

        // online
        fetch(event.request, {
            cache: "no-store"
        })

        .then(response => {

            if (response.ok) {

                // simpan cache terbaru
                const responseClone = response.clone();

                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseClone);
                });
            }

            return response;
        })

        .catch(() => {

            // offline
            return caches.match(event.request);
        })
    );
});