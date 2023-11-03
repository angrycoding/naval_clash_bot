import Settings from '../../shared/Settings';
import favicon from '../public/favicon.svg';




export default {
	name: Settings.siteTitle,
	short_name: Settings.siteTitle,
	description: "description",
	background_color: Settings.theme_color,
	theme_color: Settings.theme_color,
	display: "standalone",
	orientation: "portrait",
	start_url: "/?{{getUniqueId}}sss",
	icons: [{
		src: favicon,
		type: "image/png",
		sizes: "512x512"
	}]
}