const OPEN_CACHE = CACHE_NAME ? caches.open(CACHE_NAME) : null;

const getFromCache = async(requestUrl) => {
	if (!OPEN_CACHE) return;
	const cache = await OPEN_CACHE;
	return cache.match(requestUrl);
};

self.addEventListener('fetch', (event) => {
	const request = event.request;
	let requestUrl = request.url;
	if (request.method !== 'GET') return;
	if (requestUrl.includes('nocache')) return;
	if (request?.headers?.get('pragma') === 'no-cache') return;
	if (request?.headers?.get('cache-control') === 'no-cache') return;
	if (request.destination === 'document') requestUrl = '/';
	event.respondWith(new Promise(async (resolve) => {
		let response = await getFromCache(requestUrl);
		if (!response) response = await fetch(event.request);
		resolve(response);
	}));
});