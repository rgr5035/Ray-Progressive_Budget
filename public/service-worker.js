const FILES_TO_CACHE = [
    "/",
    "/index.html",
    ""
]

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE = "";

console.log(self);

self.addEventListener("install", function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Files were successfully pre-cached.");

            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
})

self.addEventListener("activate", function (e) {
    e.waitUntil(
        caches.keys().then((keylist) => {
            return Promise.all(

                keylist.map((key) => {

                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME)
                })
            )
        })
    )
})