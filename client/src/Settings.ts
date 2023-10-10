const Settings = {

	socketIoPort: 3495,
	socketIoPath: '/api/',

	randomNamesEn: [
		'Vladimir',
		'Mikhail',
		'Dmitriy',
		'Pavel',
		'Alexey',
		'Ruslan',
		'Ivan'
	],

	randomNamesRu: [
		'Владимир',
		'Михаил',
		'Дмитрий',
		'Павел',
		'Алексей',
		'Руслан',
		'Иван'
	],

	randomRanksEn: [
		'Sailor',
		'Shipboy',
		'Skipper',
		'Captain',
		'Boatswain',
		'Navigator'
	],

	randomRanksRu: [
		'Моряк',
		'Юнга',
		'Шкипер',
		'Капитан',
		'Боцман',
		'Штурман'
	],

	// how long to wait for the next turn
	waitForShotS: 30,

	// when to show timer with expiring time
	waitForShotShowS: 5,

	// how long to wait for replay confirmation
	waitForReplayS: 20,

	// how long to wait for replay start
	waitForPlayS: 45,


	// how long to wait for placing ships when joining pair to pair gam
	waitForPlayP2PS: 60,


	// BOT SETTINGS

	telegramBotPort: 3494,
	telegramBotApiUrl: "https://api.telegram.org",
	telegramWebhookUrl: "",
	telegramBotToken: "",
	telegramBotRequestTimeoutMs: 1000,

};

export default Settings;