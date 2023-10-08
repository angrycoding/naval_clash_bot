declare const Telegram: any;

const setHeaderColor = (color: string) => {
	try { Telegram?.WebApp?.setHeaderColor(color) }
	catch (e) {}
}

const requestWriteAccess = () => {
	try { Telegram?.WebApp?.requestWriteAccess?.() }
	catch (e) {}
}

const enableClosingConfirmation = () => {
	try { Telegram?.WebApp?.enableClosingConfirmation() }
	catch (e) {}
}

const expand = () => {
	try { Telegram?.WebApp?.expand() }
	catch (e) {}
}

const showConfirm = (message: string) => new Promise<boolean>(resolve => {
	try { return Telegram?.WebApp?.showConfirm(message, resolve) }
	catch (e) {}
	resolve(confirm(message));
})

const getStartParam = (): string => {
	const result = Telegram?.WebApp?.initDataUnsafe?.start_param;
	return (typeof result === 'string' ? result : '');
}

const getFirstName = (): string => {
	const result = Telegram?.WebApp?.initDataUnsafe?.user?.first_name;
	return (typeof result === 'string' ? result : '');
}

const getUserId = (): number => {
	const result = parseInt(Telegram?.WebApp?.initDataUnsafe?.user?.id, 10);
	return (Number.isInteger(result) && result > 0 ? result : 0);
}

const getUserLocale = (): string => {
	const result = Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
	return (typeof result === 'string' && result.trim() ? result : '');
}

const TelegramApi = {
	expand,
	getUserId,
	showConfirm,
	getFirstName,
	getStartParam,
	setHeaderColor,
	getUserLocale,
	requestWriteAccess,
	enableClosingConfirmation,
	isTelegram: Boolean(typeof Telegram?.WebApp?.initDataUnsafe?.user === 'object')
}

export default TelegramApi;