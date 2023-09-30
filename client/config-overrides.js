const { override } = require('customize-cra');

const siteTitle = 'Telegram Mini App';
const isProduction = process.env.NODE_ENV === "production";

module.exports = {

	webpack: override(config => {

		config.plugins = config.plugins.map((plugin) => {
			
			if (plugin.constructor.name === "HtmlWebpackPlugin") {
				const userOptions = plugin.userOptions;

				plugin = new plugin.constructor({
					...userOptions,
					siteTitle,
					isProduction
				});
			}

			else if (plugin.constructor.name === "DefinePlugin") {
				plugin = new plugin.constructor({
					...plugin.definitions,
					siteTitle: `"${siteTitle}"`,
					isProduction
				});
			}

			return plugin;
		});
		
		return config;
	})

};