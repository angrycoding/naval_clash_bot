#!/usr/bin/env node

const FS = require('fs-extra');
const Path = require('path');
const Browserify = require('browserify');
const UglifyJS = require('uglify-es');
const RecursiveReadDir = require('recursive-readdir');

const DIST_DIR = Path.resolve(__dirname, 'dist');

const produceBundle = (options) => new Promise(async(resolve) => {

	const browserify = Browserify({
		bundleExternal: false,
	})

	browserify.plugin(
		require('esmify')
	)

	for (const file of await RecursiveReadDir(DIST_DIR)) {
		if (!file.endsWith('.js')) continue;
		// const path = Buffer.from(file, 'base64').toString();
		browserify.add(
			file
			// StringToStream(await FS.readFile(file)),
			// { file: path }
		);
	}
	
	browserify.bundle((error, result) => {


		result = (!error && result?.toString()) || '';
		if (!result) return resolve('');


		result = UglifyJS.minify(result, {
			toplevel: true,
			compress: {
				// drop_console: true,
				passes: 4,
				toplevel: true,
				global_defs: {
					// PRODUCTION: true
				}
			},
			mangle: {
				toplevel: true
			}
		});

		result = (!result?.error && result?.code) || '';

		resolve(result);

	})
});


(async () => {

	const minified = await produceBundle();

	await FS.emptyDir(DIST_DIR);
	await FS.writeFile(Path.resolve(DIST_DIR, './index.js'), minified);
	await FS.copyFile(Path.resolve(__dirname, './pm2.json'), Path.resolve(DIST_DIR, './pm2.json'));
	await FS.copyFile(Path.resolve(__dirname, './package.json'), Path.resolve(DIST_DIR, './package.json'));

})();