import TelegramApi from "./TelegramApi";

const result: any = (
	TelegramApi.getUserLocale() ||
	navigator?.languages?.[0] ||
	navigator?.language
);

const userLocale = (
	result?.trim()?.split('-')?.[0] || 'en'
).toLowerCase();

export default userLocale;