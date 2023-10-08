const Settings = {

	socketIoPort: 3495,
	socketIoPath: '/api/',

	telegramBotPort: 3494,
	telegramBotApiUrl: "https://api.telegram.org",
	telegramBotToken: "5847973427:AAGb4RCSqoaeaDW6WL-H9z1ubKUdp5-txCQ",
	telegramBotRequestTimeoutMs: 1000,

	defaultUserNameEn: 'Vladimir Sailor',
	defaultUserNameRu: 'Владимир Моряк',

	// ожидание следующего хода
	waitForShotS: 30,

	// когда начинать показывать таймер об истечении времени
	waitForShotShowS: 5,

	// ожидание подтверждения повторной игры
	waitForReplayS: 20,

	// таймер ожидания начала повторной игры
	waitForPlayS: 45

};

export default Settings;