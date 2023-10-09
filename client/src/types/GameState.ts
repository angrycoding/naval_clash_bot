export enum GameStatus {
	ACTIVE,
	WAITING_FOR_REPLAY,
	PLACESHIPS,
	I_GAVE_UP,
	ENEMY_GAVE_UP
}

interface GameState {

	replayId: string;
	status: GameStatus;
	watchDog: number;
	whosTurn: string;

	users: {
		[userId: string]: {
			confirm?: boolean;
			userName: string;
			map: {[index: number]: number}
		}
	}
}

export default GameState;