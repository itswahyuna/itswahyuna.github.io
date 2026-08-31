const CACHE_NAME = "itswahyuna-v1.0.7"; 
const CACHE_FILES = [ 
    "./", 
    "./index.html", 
    "./wahyuna.jpeg", 
    "./instagram.webp", 
    "./github.webp", 
    "./roblox.webp", 
    "./gmail.webp", 
]; 

const FONT_AWESOME = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"; 
  
self.addEventListener("install", event => {  
    event.waitUntil(  
        caches.open(CACHE_NAME)  
            .then(async cache => { 
                await cache.addAll(CACHE_FILES); 
 
                try { 
                    const response = await fetch(FONT_AWESOME); 
 
                    if (response.ok) { 
                        await cache.put(FONT_AWESOME, response); 
                    } 
                } catch (error) { 
                    error 
                } 
            }) 
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
  
                    // info  
                    self.clients.matchAll().then(clients => {  
                        clients.forEach(client => {  
                            client.postMessage({  
                                type: "CACHE_USED"  
                            });  
                        });  
                    });  
  
                    return cachedResponse;  
                }  
  
                return new Response("Offline", {  
                    status: 503  
                });  
            });  
        })  
    );  
});