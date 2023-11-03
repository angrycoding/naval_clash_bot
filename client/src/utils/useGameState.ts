import { useEffect, useState } from "react";
import GameState, { GameStatus } from "../../../shared/GameState";
import beep from './beep.mp3';
import { playSound } from "./playSound";
import inviteId from "./inviteId";


const DEFAULT_GAME_STATE: GameState = {
	replayId: '',
	watchDog: Infinity,
	status: GameStatus.PLACESHIPS,
	whosTurn: '',
	users: {}
};

const WAIT_FOR_CONTACT_STATE: GameState = {
	replayId: '',
	watchDog: Infinity,
	status: GameStatus.WAIT_FOR_CONTACT,
	whosTurn: '',
	users: {}
}

let globalGameState = (
	inviteId ? WAIT_FOR_CONTACT_STATE :
	DEFAULT_GAME_STATE
);


export const useSecondsLeft = () => {

	const forceUpdate = (() => {
		const setForceUpdate = useState<any>(String(Math.random()))[1];
		return () => setForceUpdate(String(Math.random()));
	})();

	useEffect(() => {
		document.addEventListener('counter', forceUpdate);
		return () => document.removeEventListener('counter', forceUpdate);
	}, []);

	return Math.max(Math.ceil((globalGameState.watchDog - Date.now()) / 1000), 0);
	
}

(() => {

	let prevValue = -1;

	setInterval(() => {
		const { watchDog } = globalGameState;
		if (watchDog === Infinity || watchDog <= 0) return;
		const secondsLeft = Math.ceil((watchDog - Date.now()) / 1000);
		if (secondsLeft !== prevValue) {
			prevValue = secondsLeft;
			document.dispatchEvent(new Event('counter'));
			if (secondsLeft && secondsLeft <= 5) playSound(beep);
		}
		if (secondsLeft <= 0) {
			globalGameState.watchDog = 0;
			setGameState(globalGameState);
		}
	}, 250);

})();



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