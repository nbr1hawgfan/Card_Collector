const CACHE_NAME = "rookie-vault-v24";

const APP_SHELL = [
  "./",
  "./index.html",
  "./css/app.css?v=24",
  "./css/cardsight-diagnostics.css?v=24",
  "./css/sports-feed.css?v=24",
  "./js/app.js?v=24",
  "./js/cardsight-diagnostics.js?v=24",
  "./js/sports-feed.js?v=24",
  "./manifest.webmanifest",
  "./icons/icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(APP_SHELL)
    )
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
  if (event.request.method !== "GET") {
    return;
  }

  const url = new URL(event.request.url);

  // CRITICAL:
  // Never intercept or cache Supabase, CardSight, signed image URLs,
  // authentication requests, or any other cross-origin network traffic.
  if (url.origin !== self.location.origin) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then(response => {
          if (response.ok) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then(cache =>
              cache.put("./index.html", copy)
            );
          }

          return response;
        })
        .catch(() => caches.match("./index.html"))
    );

    return;
  }

  const isAppAsset =
    url.pathname.includes("/css/") ||
    url.pathname.includes("/js/") ||
    url.pathname.includes("/icons/") ||
    url.pathname.endsWith("/manifest.webmanifest");

  if (!isAppAsset) {
    return;
  }

  event.respondWith(
    fetch(event.request, { cache: "no-store" })
      .then(response => {
        if (response.ok) {
          const copy = response.clone();

          caches.open(CACHE_NAME).then(cache =>
            cache.put(event.request, copy)
          );
        }

        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
