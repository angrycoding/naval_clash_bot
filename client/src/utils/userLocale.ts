import TelegramApi from "./TelegramApi";

const result: any = (
	TelegramApi.getUserLocale() ||
	navigator?.languages?.[0] ||
	navigator.language
);

const userLocale = (typeof result === 'string' ? result : 'en').toLowerCase();

export default userLocale;