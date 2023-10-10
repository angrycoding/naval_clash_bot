#!/usr/bin/env node

const
	Path = require('path'),
	FS = require('fs-extra'),
	Browserify = require('browserify'),
	RecursiveReadDir = require('recursive-readdir');

const DIST_DIR = Path.resolve(__dirname, 'dist');

const produceBundle = () => new Promise(async(resolve) => {

	const browserify = Browserify({
		bundleExternal: false,
		insertGlobalVars: {
			navigator: function() { return "undefined" },
			Telegram: function() { return "undefined" },
			__dirname: function () { return "__dirname"; }
		}
	})

	browserify.plugin(
		require('esmify')
	)

	for (const file of await RecursiveReadDir(DIST_DIR)) {
		if (!file.endsWith('.js')) continue;
		browserify.add(file);
	}
	
	browserify.bundle((error, result) => {
		result = (!error && result?.toString()) || '';
		if (!result) return resolve('');
		resolve(result);
	});

});


(async () => {
	const minified = await produceBundle();
	await FS.emptyDir(DIST_DIR);
	await FS.writeFile(Path.resolve(DIST_DIR, './index.js'), minified);
	await FS.copyFile(Path.resolve(__dirname, './pm2.json'), Path.resolve(DIST_DIR, './pm2.json'));
	await FS.copyFile(Path.resolve(__dirname, './package.json'), Path.resolve(DIST_DIR, './package.json'));
})();