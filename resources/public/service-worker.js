const CACHE_NAME = 'WebTeleprompter-Cache-v7';
const urlsToCache = [
	// URLs
	'/',
	'/documents',
	'/settings',
	'/donate',
	'/i18n.json',
	// Google
	'https://fonts.googleapis.com/css?family=PT+Sans&display=swap',
	// Libs/JS
	'/lib/css/libs.min.css',
	'/stylesheets/style.css',
	'/lib/tinymce/tinymce.min.js',
	'/lib/tinymce/skins/ui/oxide/skin.min.css',
	'/lib/tinymce/skins/ui/oxide/content.min.css',
	'/lib/tinymce/skins/content/default/content.min.css',
	'/lib/tinymce/themes/silver/theme.min.js',
	'/lib/tinymce/plugins/advlist/plugin.min.js',
	'/lib/tinymce/plugins/lists/plugin.min.js',
	'/lib/tinymce/plugins/preview/plugin.min.js',
	'/lib/tinymce/plugins/searchreplace/plugin.min.js',
	'/lib/tinymce/plugins/visualblocks/plugin.min.js',
	'/lib/tinymce/plugins/table/plugin.min.js',
	'/lib/tinymce/plugins/paste/plugin.min.js',
	'/lib/tinymce/plugins/help/plugin.min.js',
	'/lib/tinymce/plugins/wordcount/plugin.min.js',
	'/lib/tinymce/jquery.tinymce.min.js',
	'/lib/js/libs.min.js',
	'/javascripts/app.js',
	'/images/howto_android.jpg',
	'/images/howto_chrome.png',
	'/images/howto_ios.jpg',
	'/lib/webfonts/fa-brands-400.eot',
	'/lib/webfonts/fa-brands-400.svg',
	'/lib/webfonts/fa-brands-400.ttf',
	'/lib/webfonts/fa-brands-400.woff',
	'/lib/webfonts/fa-brands-400.woff2',
	'/lib/webfonts/fa-regular-400.eot',
	'/lib/webfonts/fa-regular-400.svg',
	'/lib/webfonts/fa-regular-400.ttf',
	'/lib/webfonts/fa-regular-400.woff',
	'/lib/webfonts/fa-regular-400.woff2',
	'/lib/webfonts/fa-solid-900.eot',
	'/lib/webfonts/fa-solid-900.svg',
	'/lib/webfonts/fa-solid-900.ttf',
	'/lib/webfonts/fa-solid-900.woff',
	'/lib/webfonts/fa-solid-900.woff2',
	// Icons
	'/icons/icon-72x72.png',
	'/icons/icon-96x96.png',
	'/icons/icon-128x128.png',
	'/icons/icon-144x144.png',
	'/icons/icon-152x152.png',
	'/icons/icon-192x192.png',
	'/icons/icon-384x384.png',
	'/icons/icon-512x512.png',
	'/launch-screens/launch-screen-2048x2732.png',
	'/launch-screens/launch-screen-2732x2048.png',
	'/launch-screens/launch-screen-1668x2388.png',
	'/launch-screens/launch-screen-2388x1668.png',
	'/launch-screens/launch-screen-1668x2224.png',
	'/launch-screens/launch-screen-2224x1668.png',
	'/launch-screens/launch-screen-1536x2048.png',
	'/launch-screens/launch-screen-2048x1536.png',
	'/launch-screens/launch-screen-1242x2688.png',
	'/launch-screens/launch-screen-2688x1242.png',
	'/launch-screens/launch-screen-1125x2436.png',
	'/launch-screens/launch-screen-2436x1125.png',
	'/launch-screens/launch-screen-828x1792.png',
	'/launch-screens/launch-screen-1792x828.png',
	'/launch-screens/launch-screen-1242x2208.png',
	'/launch-screens/launch-screen-2208x1242.png',
	'/launch-screens/launch-screen-750x1334.png',
	'/launch-screens/launch-screen-1334x750.png',
	'/launch-screens/launch-screen-640x1136.png',
	'/launch-screens/launch-screen-1136x640.png',
	'/favicons/apple-touch-icon-57x57.png',
	'/favicons/apple-touch-icon-60x60.png',
	'/favicons/apple-touch-icon-72x72.png',
	'/favicons/apple-touch-icon-76x76.png',
	'/favicons/apple-touch-icon-114x114.png',
	'/favicons/apple-touch-icon-120x120.png',
	'/favicons/apple-touch-icon-144x144.png',
	'/favicons/apple-touch-icon-152x152.png',
	'/favicons/favicon-16x16.png',
	'/favicons/favicon-32x32.png',
	'/favicons/favicon-96x96.png',
	'/favicons/favicon-128x128.png',
	'/favicons/favicon-196x196.png',
	'/favicons/ms-tile-70x70.png',
	'/favicons/ms-tile-144x144.png',
	'/favicons/ms-tile-150x150.png',
	'/favicons/ms-tile-310x150.png',
	'/favicons/ms-tile-310x310.png',
	'/favicons/favicon.ico',
	'/favicon.ico'
];

self.addEventListener('install', event => {
	self.skipWaiting();

	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
	);
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(response => {
			if (response) {
				return response;
			}

			const fetchRequest = event.request.clone();

			return fetch(fetchRequest).then(response => {
				if (
					!response ||
					response.status !== 200 ||
					response.type !== 'basic'
				) {
					return response;
				}

				const responseToCache = response.clone();

				event.waitUntil(
					caches.open(CACHE_NAME).then(cache => {
						cache.put(event.request, responseToCache);
					})
				);

				return response;
			});
		})
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches
			.keys()
			.then(cacheNames =>
				Promise.all(
					cacheNames
						.filter(cacheName => cacheName !== CACHE_NAME)
						.map(cacheName => caches.delete(cacheName))
				)
			)
	);
});
