import { useEffect, useState } from "react";
import socketIO from "../utils/Socket";
import GameState from "../types/GameState";
import { fillBorders } from "../utils/mapUtils";

let globalGameState: (0 | undefined | GameState) = 0;


socketIO.on('updateState', (gameState?: GameState) => {

	if (gameState) {
		const { users } = gameState;
		for (const userId in users) {
			fillBorders(users[userId].map);
		}
	}

	if (JSON.stringify(globalGameState) !== JSON.stringify(gameState)) {
		globalGameState = gameState;
		localStorage.setItem('sessionId', gameState?.id || '');
		document.dispatchEvent(new Event('updateGameState'));
	}

});


const useGameState = (): 0 | undefined | GameState => {

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

	return globalGameState;

}

export default useGameState;