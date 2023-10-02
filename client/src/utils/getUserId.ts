import getRandomInt from "./getRandomInt";

declare const Telegram: any;

const getUserId = (): string => {
	const result: any = Telegram?.WebApp?.initDataUnsafe?.user?.id;
	if (Number.isInteger(result) && result > 0) return String(result);
	return [getRandomInt(0, 1000000), Date.now()].join('.');
}

export default getUserId;