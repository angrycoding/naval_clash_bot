import TelegramApi from "./TelegramApi";

const inviteId = (() => {

	let inviteId: any;

	try {
		inviteId = window.atob(
			new URLSearchParams(window.location.search).get('inviteid') ||
			TelegramApi.getStartParam()
		);
	} catch (e) {}

	return (typeof inviteId === 'string' && inviteId.trim() ? inviteId : '');
})();

export default inviteId;