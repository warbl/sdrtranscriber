var CACHE_NAME = 'sdr-transcriber';
var urlsToCache = [
	'/',
	'/completed',
	'./favicon.ico',
	'./index.html',
	'./maskable_icon.png',
	'../src/images/radio.png',
	'../src/index.css',
	
];

self.addEventListener('install', event =>{
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(function(cache) {
			console.log('Opened cache');
			return cache.addAll(urlsToCache);
		}));
});

// Cache and return requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Update a service worker
self.addEventListener('activate', event => {
  var cacheWhitelist = ['sdr-transcriber'];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});