#!/usr/bin/env node

const
	Path = require('path'),
	CSSO = require('csso'),
	SVGO = require('svgo'),
	FS = require('fs/promises'),
	Cheerio = require('cheerio'),
	Crypto = require('crypto'),
	Terser = require('terser').minify,
	RecursiveReadDir = require('recursive-readdir');

const DIST_DIR = Path.resolve(__dirname, 'dist');
const CACHE_NAME = 'naval_clash_bot';

var svgo = new SVGO({
	plugins: [
		{
		  cleanupIDs: false
		}
	  ]
});

const getFiles = (dirPath, extensions) => new Promise(resolve => {
	RecursiveReadDir(dirPath, [(file, stats) => {
		return stats.isFile() && (extensions && !extensions.some(ext => file.endsWith(ext)));
	}], (error, files) => resolve(files));
});

const minifyJS = (path) => new Promise(async(resolve) => {
	const data = await FS.readFile(path, 'utf-8');
	if (typeof data !== 'string' || !data.length) return resolve();
	let result = '';
	try {
		result = (await Terser(data, {
			toplevel: true,
			compress: {
				drop_console: true,
				passes: 4,
				toplevel: true,
				global_defs: {
					CACHE_NAME
				},
			},
			mangle: {
				toplevel: true,
			},
		}))?.code;
	} catch (e) {}
	if (typeof result !== 'string') result = '';
	if (!result.length || result.length >= data.length) return resolve();
	console.info('[ COMPRESS ]', path, `${data.length}b -> ${result.length}b`);
	await FS.writeFile(path, result);
	resolve();
});

const minifyCSS = (path) => new Promise(async(resolve) => {
	const data = await FS.readFile(path, 'utf-8');
	if (typeof data !== 'string' || !data.length) return resolve();
	let result = CSSO.minify(data, { comments: false }).css;
	if (typeof result !== 'string') result = '';
	if (!result.length || result.length >= data.length) return resolve();
	console.info('[ COMPRESS ]', path, `${data.length}b -> ${result.length}b`);
	await FS.writeFile(path, result);
	resolve();
});

const minifySVG = (path) => new Promise(async(resolve) => {
	const data = await FS.readFile(path, 'utf-8');
	if (typeof data !== 'string' || !data.length) return resolve();
	let result = (await svgo.optimize(data, {path: path})).data;
	if (typeof result !== 'string') result = '';
	if (!result.length || result.length >= data.length) return resolve();
	console.info('[ COMPRESS ]', path, `${data.length}b -> ${result.length}b`);
	await FS.writeFile(path, result);
	resolve();
});

const createPreload = async() => {

	const indexPath = Path.resolve(DIST_DIR, 'index.html');
	const indexBundle = await FS.readFile(indexPath, 'utf-8');

	let files = await getFiles(DIST_DIR, [".svg", ".woff2"]);
	files = files.map((file) => Path.relative(DIST_DIR, file));
	var $ = Cheerio.load(indexBundle, { decodeEntities: false });
	for (const file of files) {
		console.info("[ createPreload ]", file);
		
		if (file.endsWith('.woff2')) {
			$("head").prepend(
				`<link rel="preload" href="/${file}" as="font" fetchpriority="high" crossorigin />`
			);
		}

		else if (file.endsWith('.svg')) {
			$("head").prepend(
				`<link rel="preload" href="/${file}" as="image" fetchpriority="high" />`
			);
		}


		
	}

	await FS.writeFile(indexPath, $.html());

};

const getFileHash = (path) => new Promise(resolve => {
	const hash = Crypto.createHash('sha1');
	const stream = require('fs').createReadStream(path);
	stream.on('error', () => resolve(''));
	stream.on('data', chunk => hash.update(chunk));
	stream.on('end', () => resolve(hash.digest('hex')));
});



(async () => {

	await createPreload();

	for (const file of await getFiles(DIST_DIR, [".map", ".LICENSE.txt", "asset-manifest.json"])) {
		console.info('[ REMOVE ]', file);
		await FS.unlink(file);
	}

	for (const file of await getFiles(DIST_DIR, [".css"])) {
		await minifyCSS(file);
	}

	for (const file of await getFiles(DIST_DIR, [".svg"])) {
		await minifySVG(file);
	}


	for (const file of await getFiles(DIST_DIR, [".js"])) {
		await minifyJS(file);
	}




	const allFilesHash = {};
	for (const file of await getFiles(DIST_DIR)) {
		let relPath = Path.relative(DIST_DIR, file);
		if (['sw.js', 'robots.txt', 'naval_clash_bot.json'].includes(relPath)) continue;
		if (relPath === 'index.html') relPath = '';
		allFilesHash[`/${relPath}`] = await getFileHash(file);
	}


	await FS.writeFile(Path.resolve(DIST_DIR, "naval_clash_bot.json"), JSON.stringify(allFilesHash));
	

})();