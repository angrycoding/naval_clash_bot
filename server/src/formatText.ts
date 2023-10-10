import { load } from "cheerio";

const formatText = (text: string) => {
	text = text.trim();
	text = text.replace(/[\n\t]+/g, ' ');
	text = text.replace(/[\n\t\s]*(<br\s*\/>|<br>)[\n\t\s]*/g, '\n');

	const $ = load(text, {
		decodeEntities: false
	});

	$('*').each(function() {
		var element = $(this);
		// @ts-ignore
		var tagName = this.tagName;
		if (![
			'html', 'body',
			'b', 'strong',
			'i', 'em',
			'u', 'ins',
			's', 'strike', 'del',
			'a',
			'code', 'pre',
		].includes(tagName)) {
			element.replaceWith(element.text());
		}
	});

	return $('body').html();
}

export default formatText;