const CACHE = 'string-studio-v1'

// Cache the app shell on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(['/', '/json', '/comparator', '/text'])
    )
  )
  self.skipWaiting()
})

// Clean up old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Network-first for navigation, cache-first for assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return

  if (event.request.mode === 'navigate') {
    // Network-first for HTML navigation — fall back to cached index.html
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/').then((r) => r ?? fetch(event.request))
      )
    )
  } else {
    // Cache-first for static assets
    event.respondWith(
      caches.match(event.request).then(
        (cached) => cached ?? fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE).then((cache) => cache.put(event.request, clone))
          }
          return response
        })
      )
    )
  }
})
