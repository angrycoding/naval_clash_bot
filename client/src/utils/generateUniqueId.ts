import getRandomInt from './getRandomInt';

const DEFAULT_UNIQUE_ID_LENGTH = 32;

const getRandomBoolean = (): boolean => {
	return Boolean(Math.round(Math.random()));
};

const getRandomLetter = (): string => {
	let letter = String.fromCharCode(getRandomInt(97, 122));
	if (getRandomBoolean()) letter = letter.toUpperCase();
	return letter;
};

const getRandomLetterOrDigit = (): string => {
	if (getRandomBoolean()) return String(getRandomInt(0, 9));
	return getRandomLetter();
};

const generateUniqueId = (length?: number, prefix?: string): string => {
	let result = '';
	let flag = false;
	if (!length) length = DEFAULT_UNIQUE_ID_LENGTH;
	const time = new Date().getTime().toString(16).split('');
	while (result.length < length) {
		let tc = ((flag = !flag) && time.shift());
		if (!tc) tc = getRandomLetterOrDigit();
		else if (getRandomBoolean()) tc = tc.toUpperCase();
		result += tc;
	}
	return (prefix || '') + result;
};

export default generateUniqueId;