const CACHE_NAME = "itswahyuna-v1.1.7";
console.log("versi cache=" + CACHE_NAME);
const CACHE_FILES = [ 
    "./", 
    "./index.html",
    "./manifest.json",
    "./assets/wahyuna-192.png",
    "./assets/wahyuna-512.png",
    "./assets/wahyuna-i.png",
    "./main.js",
    "./number-of-senders.js",
    "./grav.js",
    "./main.css",
    "./assets/wahyuna.jpeg",
    "./assets/instagram.webp",
    "./assets/github.webp",
    "./assets/roblox.webp",
    "./assets/gmail.webp",
    "./assets/verif.png",
    "./assets/favicon.ico",
];

const FA = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
  
self.addEventListener("install", event => {  
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll(CACHE_FILES);

        try {
            const response = await fetch(FA);
            if (response.ok) {
                await cache.put(FA, response);
            } else {
                console.warn(response.status);
            }
        } catch (error) {
            console.warn(error);
        }

        await self.skipWaiting();
    })());
});  
  
self.addEventListener("activate", event => {  
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(
            keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
        );
        await self.clients.claim();
    })());
});  
  
self.addEventListener("fetch", event => {  
  
    // request get  
    if (event.request.method !== "GET") {  
        return;  
    }  

    if (
        event.request.url.startsWith("chrome-extension://") ||
        event.request.url.startsWith("chrome://")
    ) {
        return;
    }
  
    event.respondWith(  
  
        // online ambil dari server  
        fetch(event.request, {  
            cache: "no-store"  
        })  
  
        .then(response => {  
  
            if (response.ok) {  
  
                // simpan cache terbaru  
                const responseClone = response.clone();  
  
                caches.open(CACHE_NAME).then(cache => {  
                    cache.put(event.request, responseClone).catch(error => {
                        console.error("Cache failed:", error);
                    });  
                });  
            }  
  
            return response;  
        })  
  
        .catch(() => {  
  
            // offline  
            // ambil cache  
            return caches.match(event.request).then(cachedResponse => {  
  
                if (cachedResponse) {
                    if (event.request.mode === "navigate") {
                        return self.clients.matchAll().then(clients => {
                            clients.forEach(client => {
                                client.postMessage({
                                    type: "CACHE_USED"
                                });
                            });
                            return cachedResponse;
                        });
                    }
  
                    return cachedResponse;  
                }  
  
                return new Response("Offline", {  
                    status: 503  
                });  
            });  
        })  
    );  
});