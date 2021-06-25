var CACHE_NAME = "letmeask-by-allankehl";

var urlsToCache = [
    "/",
    "/favicon/apple-icon-57x57.png",
    "/favicon/apple-icon-60x60.png",
    "/favicon/apple-icon-72x72.png",
    "/favicon/apple-icon-76x76.png",
    "/favicon/apple-icon-114x114.png",
    "/favicon/apple-icon-120x120.png",
    "/favicon/apple-icon-144x144.png",
    "/favicon/apple-icon-152x152.png",
    "/favicon/apple-icon-180x180.png",
    "/favicon/android-icon-192x192.png",
    "/favicon/favicon-32x32.png",
    "/favicon/favicon-96x96.png",
    "/favicon/favicon-16x16.png",
    "/favicon/favicon.ico",
    "/favicon/ms-icon-144x144.png",
    "/favicon/ms-icon-150x150.png",
    "/favicon/ms-icon-310x310.png",
    "/favicon/ms-icon-70x70.png",
    "/favicon/icon-512x512.png",
    "/static/css/main.chunk.css",
    "/static/css/main.chunk.css.map",
    "/static/js/2.chunk.js",
    "/static/js/2.chunk.js.map",
    "/static/js/main.chunk.js",
    "/static/js/main.chunk.js.map",
    "/static/js/runtime-main.chunk.js",
    "/static/js/runtime-main.chunk.js.map",
    "/media/copy.svg",
    "/media/delete-modal.svg",
    "/media/empty-questions.svg",
    "/media/google-icon-color.svg",
    "/media/google-icon.svg",
    "/media/illustration.svg",
    "/media/log-in.svg",
    "/media/logo.svg",
];

self.addEventListener("install", function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
