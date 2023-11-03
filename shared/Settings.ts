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

	// telegram bot settings
	telegramBotPort: 3494,
	telegramBotApiUrl: "https://api.telegram.org",
	telegramWebhookUrl: "",
	telegramBotToken: "",
	telegramBotRequestTimeoutMs: 1000,


	// various backend settings
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