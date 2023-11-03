const
	Path = require('path'),
	PostBuild = require('./PostBuild'),
	TSCompilerPlugin = require('webpack-rollup-ts-compiler'),
	FontPreloadPlugin = require('webpack-font-preload-plugin'),
	MinimalClassnameGenerator = require('webpack-minimal-classnames'),
	{ override, removeModuleScopePlugin, babelInclude } = require('customize-cra');

let DIST_DIR = '';


const isProduction = process.env.NODE_ENV === "production";

const generateMinimalClassname = MinimalClassnameGenerator({
	length: 1,
	excludePatterns: [/ad/i]
})

let settings = {};

module.exports = {

	paths: (paths) => {
		DIST_DIR = paths.appBuild;
	},

	webpack: override((config) => {

		


		if (isProduction) {
			JSON.stringify(config, (_key, value) => {
				if (typeof value === 'object' && value && typeof value.loader === 'string' &&
					value.loader.includes('css-loader') && value.options && value.options.modules) {
					value.options.modules.getLocalIdent = generateMinimalClassname;
				}
				return value;
			})
		}
		



		config = removeModuleScopePlugin()(config);

		config = babelInclude()(config);

		if (isProduction) {
			delete config.devtool;
		}

		config.plugins = config.plugins.map((plugin) => {

			if (isProduction && plugin.constructor.name === 'WebpackManifestPlugin') {
				return undefined;
			}

			if (0);

			else if (plugin.constructor.name === "HtmlWebpackPlugin") {
				plugin = new plugin.constructor({
					...plugin.userOptions,
					cache: false,
					templateParameters: () => ({ settings }),
					isProduction,
				});
			}

			else if (plugin.constructor.name === "DefinePlugin") {
				plugin = new plugin.constructor({
					...plugin.definitions,
					isProduction
				});
			}

			return plugin;
		})

		config.plugins.push(new TSCompilerPlugin(
			Path.resolve(__dirname, '../shared/Settings.ts'), {
				postprocess: (result) => {
					settings = new Function(`return ${result}`)()
					return {}
				}
			}
		))


		config.plugins.push(new TSCompilerPlugin(Path.resolve(__dirname, 'src/serviceWorker.ts'), {
			to: 'sw.js',
		}))

		config.plugins.push(new TSCompilerPlugin(Path.resolve(__dirname, 'src/manifest.ts'), {
			to: 'manifest.json',
			postprocess: (manifest) => JSON.stringify(new Function(`return ${manifest}`)(), null, '\t') },
		));

		if (isProduction) {
			config.plugins.push(new PostBuild(DIST_DIR));
		} else {
			config.plugins.push(new FontPreloadPlugin());
		}

		
		return config;
	})

};