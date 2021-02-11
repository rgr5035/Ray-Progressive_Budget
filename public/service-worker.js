const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/styles.css",
    "index.js",
    "manifest.webmanifest",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
]

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

console.log(self);


self.addEventListener("install", function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Files were successfully pre-cached.");

            return cache.addAll(FILES_TO_CACHE);
        })
    );
    
    //service worker skips the waiting phase during the install phase
    self.skipWaiting();
})

self.addEventListener("activate", function (e) {
    e.waitUntil(
        caches.keys().then((keylist) => {
            return Promise.all(

                keylist.map((key) => {

                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            )
        })
    );

    //claim method caused the pages to be controlled immediately
    self.clients.claim();
});

self.addEventListener("fetch", function (e) {
    if (e.request.url.includes("/api")) {
        e.respondWith(

            caches
            .open(DATA_CACHE_NAME)
            .then((cache) => {
                return (
                    fetch(e.request)
                    .then((response) => {

                        if (response.status === 200) {
                            cache.put(e.request.url, response.clone());
                        }

                        return response;
                    })
                    .catch((err) => {
                        return cache.match(e.request);
                    })
                );
            })
            .catch((err) => console.log(err))
        );
        return;
    }
    e.respondWith(
        caches.open(CACHE_NAME).then((cache) => {

            return cache.match(e.request).then((response) => {
                return response || fetch(e.request);
            });
        })
    );
});