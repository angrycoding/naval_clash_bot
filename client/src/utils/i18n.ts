import userLocale from "./userLocale";


export const Messages = {

	ONE_HOUR: ['hour', 'час', 'година'],
	TWO_HOURS: ['hours', 'часа', 'години'],
	FIVE_HOURS: ['hours', 'часов', 'годин'],
	ONE_MINUTE: ['minute', 'минуту', 'хвилина'],
	TWO_MINUTES: ['minutes', 'минуты', 'хвилини'],
	FIVE_MINUTES: ['minutes', 'минут', 'хвилин'],
	ONE_SECOND: ['second', 'секунду', 'секунда'],
	TWO_SECONDS: ['seconds', 'секунды', 'секунди'],
	FIVE_SECONDS: ['seconds', 'секунд', 'секунд'],

	CHANGE_LAYOUT: ['Change layout', 'поменять расположение', 'змінити розташування'],
	READY_TO_PLAY: ['I am Ready to play', 'Я готов к игре', 'Я готов до гри'],
	WITH_RANDOM_ENEMY: ['Play with whoever wants to join', 'Игра со случайным противником', 'Гра з випадковим супротивником'],
	GAME_WITH: ['Enemy', 'Противник', 'Супротивник'],
	WAITING_FOR: ['waiting', 'ждём', 'очікуємо'],
	WAITING_ENEMY: ['Waiting enemy', 'Ждем противника', 'Очікуємо на супротивника'],

	YOU_WIN: ['You win!', 'Вы выиграли!', 'Ви перемогли!'],
	YOU_LOSE: ['You lose!', 'Вы проиграли!', 'Ви програли!'],
	PLAY_MORE_WITH: ['play again with', 'хотите поиграть еще с', 'бажаєте пограти ще з'],
	PLAY_ONE_MORE_TIME: ['play one more time', 'давай ещё раз', 'давай зіграємо ще'],


	SLOW_ACTION_YOU: [
		'because you were too slow making your next shot',
		'потому что слишком долго решали куда выстрелить',
		'тому що ти занадто повільно робив наступний постріл'
	],

	SLOW_ACTION_ENEMY: [
		'because the enemy disappeared somewhere, or was too slow making his next shot',
		'потому что противник куда то подевался, либо слишком долго решал куда выстрелить',
		'тому що супротивник кудись зник чи занадто повільно робив наступний постріл'
	],

	GAME_OVER_TITLE: ['Game over', 'Игра окончена', 'Гра скінчена'],
	
	ENEMY_GONE: [
		'because the enemy disappeared somewhere, or didn\'t want to play again',
		'потому что противник куда то подевался, либо не пожелал играть ещё раз',
		'тому що супротивник кудись зник чи не забажав грати ще раз'
	],

	SLOW_PLACING_SHIPS: [
		'because you were too slow placing your ships',
		'потому что вы слишком долго расставляли корабли',
		'тому що ви занадто повільно розташовували кораблі'
	],

	PLAY_AGAIN: ['Play again', 'Играть ещё', 'Грати ще'],

	LOADING: ['Waiting for user to join the game', 'Ждем подключения пользователя', 'Очікуємо підключення користувача'],



}

const i18n = (id: keyof typeof Messages): string => {
	return Messages[id][
		userLocale === 'ru' ? 1 :
		userLocale === 'uk' ? 2 :
		0
	].trim();
}

export default i18n;