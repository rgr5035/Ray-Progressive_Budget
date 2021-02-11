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
const DATA_CACHE = "data-cache-v1";

console.log(self);
console.log("service worker installed")

self.addEventListener("install", function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Files were successfully pre-cached.");

            return cache.addAll(FILES_TO_CACHE);
        })
    );

    self.skipWaiting();
})

// self.addEventListener("activate", function (e) {
//     e.waitUntil(
//         caches.keys().then((keylist) => {
//             return Promise.all(

//                 keylist.map((key) => {

//                     if (key !== CACHE_NAME && key !== DATA_CACHE_NAME)
//                 })
//             )
//         })
//     )
// })