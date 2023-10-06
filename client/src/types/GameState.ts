export enum GameStatus {
	ACTIVE,
	WAITING_FOR_REPLAY,
	WAITING_FOR_PLAY,
	FINISHED,
}

interface GameState {

	status: GameStatus;
	watchDog: number;
	

	id: string;
	whosTurn: string;

	users: {
		[userId: string]: {
			replay: boolean,
			userName: string;
			map: {[index: number]: number}
		}
	}
}

export default GameState;