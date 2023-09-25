const copyToClipboard = (text: string) => {
	var inputEl = document.createElement('input');
	inputEl.style.position = 'absolute';
	inputEl.style.top = '-100000px';
	document.documentElement.appendChild(inputEl);
	inputEl.value = text;
	inputEl.select();
	inputEl.setSelectionRange(0, 99999);
	document.execCommand('copy');
	document.documentElement.removeChild(inputEl);
}

export default (text: string, hint: string): void => {
	copyToClipboard(text);
};