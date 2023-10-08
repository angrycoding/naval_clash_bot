import i18n from "./i18n";
import plural from "./plural";

const HOURS = [i18n('ONE_HOUR'), i18n('TWO_HOURS'), i18n('FIVE_HOURS')];
const MINUTES = [i18n('ONE_MINUTE'), i18n('TWO_MINUTES'), i18n('FIVE_MINUTES')];
const SECONDS = [i18n('ONE_SECOND'), i18n('TWO_SECONDS'), i18n('FIVE_SECONDS')];


const formatTime = (seconds: number): string => {
	var showSeconds = false;
	const hours = Math.floor(seconds / 3600);
	seconds %= 3600;
	const minutes = Math.floor(seconds / 60);
	seconds %= 60;
	const result = [];
	if (hours) result.push(plural(hours, HOURS));
	if (showSeconds ? (hours || minutes) : minutes) result.push(plural(minutes, MINUTES));
	if (showSeconds ? true : seconds) result.push(plural(seconds, SECONDS));
	return result.join(' ');
};

export default formatTime;