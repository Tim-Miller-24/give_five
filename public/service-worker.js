import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Кеширование статических файлов
precacheAndRoute(self.__WB_MANIFEST);

// Кеширование изображений и видео для сторисов
registerRoute(
    ({ request }) => request.destination === 'image' || request.destination === 'video',
    new CacheFirst({
        cacheName: 'stories-media-cache',
        plugins: [
            new ExpirationPlugin({
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60,
            }),
        ],
    })
);

// Логирование кеширования
self.addEventListener('fetch', event => {
    console.log('Fetching:', event.request.url);
});