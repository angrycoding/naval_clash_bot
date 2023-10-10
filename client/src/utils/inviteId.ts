import TelegramApi from "./TelegramApi";

const inviteId = (() => {
	const result = window.atob(TelegramApi.getStartParam());
	return (typeof result === 'string' && result.trim() ? result : '');
})();

export default inviteId;