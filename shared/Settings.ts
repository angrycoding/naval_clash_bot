const process = (
	typeof global?.process === 'object' &&
	typeof global?.process?.env === 'object' &&
	global?.process
);

const Settings = {

	// various frontend settings
	siteTitle: "Naval Clash",
	theme_color: "#517DA2",
	CACHE_NAME: "naval_clash_bot",

	// socket.io settings
	socketIoPort: 3495,
	socketIoPath: "/api/",
	socketIoHost: 'https://new.videotam.ru',

	// how long to wait for the next shot
	waitForShotS: 30,

	// when to start counting about shot timeout
	waitForShotShowS: 5,

	// how long to wait for replay
	waitForReplayS: 20,

	// how long to wait on place ship screen when playing with the stranger
	waitForPlayS: 45,

	// how long to wait on place ship screen when playing with the friend
	waitForPlayP2PS: 60,

	/* TELEGRAM BOT SETTINGS */

	// telegram api url (just in case if you need to change it for self hosted bots)
	// see https://core.telegram.org/bots/api#using-a-local-bot-api-server
	telegramBotApiUrl: "https://api.telegram.org",

	telegramBotRequestTimeoutMs: 1000,
	telegramBotToken: process?.env?.telegramBotToken,
	telegramWebhookUrl: process?.env?.telegramWebhookUrl,
	telegramBotPort: parseInt(process?.env?.telegramBotPort, 10),

	// various backend settings

	randomNamesUa: [
		"Володимир",
		"Михайло",
		"Дмитро",
		"Павло",
		"Олексій",
		"Руслан",
		"Іван"
	],

	randomRanksUa: [
		"Моряк",
		"Юнга",
		"Шкіпер",
		"Капітан",
		"Боцман",
		"Штурман"
	],

	randomNamesEn: [
		"Vladimir",
		"Mikhail",
		"Dmitriy",
		"Pavel",
		"Alexey",
		"Ruslan",
		"Ivan"
	],

	randomNamesRu: [
		"Владимир",
		"Михаил",
		"Дмитрий",
		"Павел",
		"Алексей",
		"Руслан",
		"Иван"
	],

	randomRanksEn: [
		"Sailor",
		"Shipboy",
		"Skipper",
		"Captain",
		"Boatswain",
		"Navigator"
	],

	randomRanksRu: [
		"Моряк",
		"Юнга",
		"Шкипер",
		"Капитан",
		"Боцман",
		"Штурман"
	],

}

export default Settings;