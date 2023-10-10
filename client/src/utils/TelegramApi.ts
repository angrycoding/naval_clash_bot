import EventEmitter from "events";

declare const Telegram: any;

declare interface TelegramApiClass {
    on(event: 'onBackButtonClicked', listener: () => void): this;
}

class TelegramApiClass extends EventEmitter {

	isTelegram = Boolean(typeof Telegram?.WebApp?.initDataUnsafe?.user === 'object');

	private onBackButtonClicked = () => {
		this.emit('onBackButtonClicked');
	}

	constructor() {
		super();
		Telegram?.WebApp?.onEvent?.('backButtonClicked', this.onBackButtonClicked)
	}

	expand = () => {
		try { Telegram?.WebApp?.expand() }
		catch (e) {}
	}

	setHeaderColor = (color: string) => {
		try { Telegram?.WebApp?.setHeaderColor(color) }
		catch (e) {}
	}

	requestWriteAccess = () => {
		try { Telegram?.WebApp?.requestWriteAccess?.() }
		catch (e) {}
	}

	enableClosingConfirmation = () => {
		try { Telegram?.WebApp?.enableClosingConfirmation() }
		catch (e) {}
	}

	showConfirm = (message: string) => new Promise<boolean>(resolve => {
		try { return Telegram?.WebApp?.showConfirm(message, resolve) }
		catch (e) {}
		resolve(confirm(message));
	})

	getStartParam = (): string => {
		const result = Telegram?.WebApp?.initDataUnsafe?.start_param;
		return (typeof result === 'string' ? result : '');
	}

	getFirstName = (): string => {
		const result = Telegram?.WebApp?.initDataUnsafe?.user?.first_name;
		return (typeof result === 'string' ? result : '');
	}

	getUserId = (): number => {
		const result = parseInt(Telegram?.WebApp?.initDataUnsafe?.user?.id, 10);
		return (Number.isInteger(result) && result > 0 ? result : 0);
	}

	getUserLocale = (): string => {
		const result = Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
		return (typeof result === 'string' && result.trim() ? result : '').trim().toLowerCase();
	}

	showHideBackButton = (show: boolean) => {
		if (show) {
			Telegram?.WebApp?.BackButton?.show();
		} else {
			Telegram?.WebApp?.BackButton?.hide();
		}
	}
	
}

const TelegramApi = new TelegramApiClass();

export default TelegramApi;