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