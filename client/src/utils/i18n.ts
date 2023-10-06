import userLocale from "./userLocale";

const Messages = {
	LOADING: ['Loading', 'Загрузка'],
	PLEASE_WAIT: ['please wait', 'пожалуйста подождите'],
	WAITING_FOR_PLAYER: ['Waiting', 'Ждём $0'],
	ENEMY_FALLBACK_NAME: ['enemy', 'оппонента'],
	READY_TO_PLAY: ['Ready to play', 'Готов к игре'],
	CHANGE_LAYOUT: ['Change layout $0', 'поменять расположение $0'],
	YOU_WIN: ['You win!', 'Вы выиграли!'],
	YOU_LOSE: ['You lose!', 'Вы проиграли!'],
	PLAY_AGAIN_WITH: ['Play again with $0 ($1)', 'Играть ещё с $0 ($1)'],
	PLAY_AGAIN: ['Play again!', 'Играть ещё'],
	GAME_OVER: [
		'This game is over, but you can play more!',
		'Игра окончена, но вы можете сыграть еще!'
	]
}

const i18n = (id: keyof typeof Messages, ...args: any[]): string => {
	

	return Messages[id][userLocale === 'en' ? 0 : 1];
}

export default i18n;