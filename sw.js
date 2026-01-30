/**
 * Service Worker para funcionalidad offline (PWA)
 */

const CACHE_NAME = 'hola-mundo-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/manifest.json',
    '/assets/favicon.svg'
];

// Instalar Service Worker y cachear recursos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('📦 Cacheando recursos...');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activar y limpiar caches antiguos
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('🗑️ Eliminando cache antiguo:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Estrategia: Network First, fallback a Cache
self.addEventListener('fetch', (event) => {
    // Solo manejar requests GET
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clonar respuesta para guardar en cache
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // Si falla la red, buscar en cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Fallback para navegación
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});
