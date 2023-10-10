export enum GameStatus {
	ACTIVE,
	WAITING_FOR_REPLAY,
	PLACESHIPS,
	WAIT_FOR_CONTACT
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