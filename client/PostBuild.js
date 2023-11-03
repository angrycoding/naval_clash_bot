const
	Path = require('path'),
	CSSO = require('csso'),
	SVGO = require('svgo'),
	FS = require('fs/promises'),
	Cheerio = require('cheerio'),
	Crypto = require('crypto'),
	Terser = require('terser').minify,
	RecursiveReadDir = require('recursive-readdir')
	
var svgo = new SVGO({
	plugins: [
		{
			cleanupIDs: false
		}
	]
});
	
	
const endsWith = (file, endings) => {
	return endings.some(ending => file.endsWith(ending));
}
	
const getFiles = (dirPath, extensions) => new Promise(resolve => {
	RecursiveReadDir(dirPath, [(file, stats) => {
		return stats.isFile() && (extensions && !extensions.some(ext => file.endsWith(ext)));
	}], (error, files) => resolve(files));
});

const createPreload = async(distDir) => {

	const indexPath = Path.resolve(distDir, 'index.html');
	const indexBundle = await FS.readFile(indexPath, 'utf-8');

	let files = await getFiles(distDir, [".svg", ".woff2"]);
	files = files.map((file) => Path.relative(distDir, file));
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

const minifyJS = (path) => new Promise(async(resolve) => {
	const data = await FS.readFile(path, 'utf-8');
	if (typeof data !== 'string' || !data.length) return resolve();
	let result = '';
	try {
		
		result = (await Terser(data, {
			toplevel: true,
			compress: {
				pure_getters: true,
				unused: true,
				dead_code: true,
				drop_console: true,
				passes: 4,
				toplevel: true,
			},
			mangle: {
				toplevel: true,
			}
		}))?.code;
	} catch (e) {
		console.info('ERROR?');
		console.info(e);
		return;
	}
	if (typeof result !== 'string') result = '';
	if (result.length >= data.length) return resolve();
	console.info('[ COMPRESS ]', path, `${data.length}b -> ${result.length}b`);
	await FS.writeFile(path, result);
	resolve();
});

const getFileHash = (path) => new Promise(resolve => {
	const hash = Crypto.createHash('sha1');
	const stream = require('fs').createReadStream(path);
	stream.on('error', () => resolve(''));
	stream.on('data', chunk => hash.update(chunk));
	stream.on('end', () => resolve(hash.digest('hex')));
});

class PostBuild {

	constructor(distDir) {
		this.distDir = distDir;
	}

	apply(compiler) {

		compiler.hooks.afterEmit.tapAsync("PostBuild", async (compilation, callback) => {

			const { distDir } = this;

			await createPreload(distDir);

			for (const file of await getFiles(distDir)) {

				if (0);

				if (endsWith(file, ['.json'])) {
					console.info('[ COMPRESS ]', file);
					let data = await FS.readFile(file, 'utf-8');
					try { data = JSON.parse(data); } catch (e) {}
					await FS.writeFile(file, JSON.stringify(data));
				}

				else if (endsWith(file, [".map", ".LICENSE.txt"])) {
					console.info('[ REMOVE ]', file);
					await FS.unlink(file);
				}

				else if (endsWith(file, ['.css'])) {
					await minifyCSS(file);
				}

				else if (endsWith(file, ['.svg'])) {
					await minifySVG(file);
				}

				else if (endsWith(file, ['.js'])) {
					await minifyJS(file, this.globalDefs);
				}

			}

			const allFilesHash = {};
			for (const file of await getFiles(distDir)) {
				let relPath = Path.relative(distDir, file);
				if (['sw.js', 'robots.txt', 'naval_clash_bot.json'].includes(relPath)) continue;
				if (relPath === 'index.html') relPath = '';
				allFilesHash[`/${relPath}`] = await getFileHash(file);
			}
		
			await FS.writeFile(Path.resolve(distDir, "naval_clash_bot.json"), JSON.stringify(allFilesHash));
		
		
		

			callback();
		});
	}
}

module.exports = PostBuild;