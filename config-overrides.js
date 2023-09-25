const
	{ override } = require('customize-cra');

module.exports = {

	webpack: override(config => {
		return config;
	})

};