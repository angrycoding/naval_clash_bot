import copyToClipboard from './copyToClipboard';

export default (text: string, hint: string): void => {
	if (navigator.share) {
		navigator.share({text: text});
	} else {
		copyToClipboard(text, hint);
	}
};