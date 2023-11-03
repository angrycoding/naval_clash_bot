import userLocale from "./userLocale";


export const Messages = {

	ONE_HOUR: ['hour', 'час'],
	TWO_HOURS: ['hours', 'часа'],
	FIVE_HOURS: ['hours', 'часов'],
	ONE_MINUTE: ['minute', 'минуту'],
	TWO_MINUTES: ['minutes', 'минуты'],
	FIVE_MINUTES: ['minutes', 'минут'],
	ONE_SECOND: ['second', 'секунду'],
	TWO_SECONDS: ['seconds', 'секунды'],
	FIVE_SECONDS: ['seconds', 'секунд'],

	CHANGE_LAYOUT: ['Change layout', 'поменять расположение'],
	READY_TO_PLAY: ['I am Ready to play', 'Я готов к игре'],
	WITH_RANDOM_ENEMY: ['Play with whoever wants to join', 'Игра со случайным противником'],
	GAME_WITH: ['Enemy', 'Противник'],
	WAITING_FOR: ['waiting', 'ждём'],
	WAITING_ENEMY: ['Waiting enemy', 'Ждем противника'],

	YOU_WIN: ['You win!', 'Вы выиграли!'],
	YOU_LOSE: ['You lose!', 'Вы проиграли!'],
	PLAY_MORE_WITH: ['play again with', 'хотите поиграть еще с'],
	PLAY_ONE_MORE_TIME: ['play one more time', 'давай ещё раз'],


	SLOW_ACTION_YOU: [
		'because you were too slow making your next shot',
		'потому что слишком долго решали куда выстрелить'
	],

	SLOW_ACTION_ENEMY: [
		'because the enemy disappeared somewhere, or was too slow making his next shot',
		'потому что противник куда то подевался, либо слишком долго решал куда выстрелить'
	],

	GAME_OVER_TITLE: ['Game over', 'Игра окончена'],
	
	ENEMY_GONE: [
		'because the enemy disappeared somewhere, or didn\'t want to play again',
		'потому что противник куда то подевался, либо не пожелал играть ещё раз'
	],

	SLOW_PLACING_SHIPS: [
		'because you were too slow placing your ships',
		'потому что вы слишком долго расставляли корабли'
	],

	PLAY_AGAIN: ['Play again', 'Играть ещё'],

	LOADING: ['Waiting for user to joing the game', 'Ждем подключения пользователя'],



}

const i18n = (id: keyof typeof Messages): string => {
	const isRu = (userLocale === 'ru');
	return Messages[id][isRu ? 1 : 0].trim();
}

export default i18n;