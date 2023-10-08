import { useEffect, useState } from "react";
import GameState, { GameStatus } from "../types/GameState";

const DEFAULT_GAME_STATE: GameState = {
	replayId: '',
	watchDog: Infinity,
	status: GameStatus.PLACESHIPS,
	whosTurn: '',
	users: {
	}
}


let globalGameState = DEFAULT_GAME_STATE;

setInterval(() => {
	const { watchDog } = globalGameState;
	if (watchDog === Infinity || watchDog <= 0) return;

	const secondsLeft = Math.ceil( (watchDog - Date.now()) / 1000  );
	
	if (secondsLeft <= 0) {
		globalGameState.watchDog = 0;
		setGameState(globalGameState);
	}

}, 250);


export const setGameState = (gameState?: Partial<GameState>) => {
	globalGameState = gameState ? { ...globalGameState, ...gameState } : DEFAULT_GAME_STATE;
	document.dispatchEvent(new Event('updateGameState'));
}

export const useGameState = (): GameState => {

	const forceUpdate = (() => {
		const setForceUpdate = useState<any>(String(Math.random()))[1];
		return () => setForceUpdate(String(Math.random()));
	})();

	useEffect(() => {
		document.addEventListener('updateGameState', forceUpdate);
		return () => {
			document.removeEventListener('updateGameState', forceUpdate);
		};
	});

	return globalGameState
}