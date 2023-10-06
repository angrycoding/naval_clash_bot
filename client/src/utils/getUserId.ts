declare const Telegram: any;

const getUserId = (): number => {

	const result: any = (
		parseInt(Telegram?.WebApp?.initDataUnsafe?.user_id, 10) ||
		parseInt(Telegram?.WebApp?.initDataUnsafe?.user?.id, 10)
	);
	
	return (Number.isInteger(result) && result > 0 ? result : 0);
}

export default getUserId;