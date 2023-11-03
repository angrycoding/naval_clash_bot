import Settings from "../../../shared/Settings";

declare const isProduction: boolean;

if (isProduction && navigator.serviceWorker && typeof navigator.serviceWorker === "object") {
	navigator.serviceWorker.register("/sw.js");
}

const fetchUrlNoCache = async(url: string): Promise<Response | undefined> => {
	const headers = new Headers();
	headers.append("pragma", "no-cache");
	headers.append("cache-control", "no-cache");
	try {
		const response = await fetch(`${url}?nocache&${Math.random()}`, { method: "GET", headers });
		return (response instanceof Response ? response : undefined);
	} catch (e) {}
}

const getFileListFromServer = async(): Promise<{[key: string]: string}> => {
	do try {
		let result: any = await fetchUrlNoCache('/naval_clash_bot.json');
		if (!result) break;
		result = await result?.json();
		if (!result) break;
		if (typeof result !== 'object') break;
		if (!Object.keys(result).length) break;
		if (!Object.values(result).every(x => typeof x === 'string' && x.trim())) break;
		return result;
	} catch (e) {} while (0);
	return {}
}

const selfUpdate = async() => {

	if (!Settings.CACHE_NAME) return;
	if (typeof caches !== 'object') return;

	const serverFiles = await getFileListFromServer();
	const cache = await caches.open(Settings.CACHE_NAME);

	for (const path in serverFiles) {
		const hash = serverFiles[path];
		let response = await cache.match(path);
		if (!response || hash !== response.headers.get('hash')) {
			response = await fetchUrlNoCache(path);
			if (!response) continue;
			const newHeaders = new Headers(response.headers);
			newHeaders.set('hash', hash);
			newHeaders.set('path', path);
			console.info('ADD', path)
			await cache.put(path, new Response(response.body, {
				status: response.status,
				statusText: response.statusText,
				headers: newHeaders
			}));
		}
	}

	for (const response of await cache.matchAll()) {
		const path = response.headers.get('path');
		if (path && !serverFiles[path]) {
			await cache.delete(path);
			console.info('REMOVE', path)
		}
	}

	
}

export default selfUpdate;