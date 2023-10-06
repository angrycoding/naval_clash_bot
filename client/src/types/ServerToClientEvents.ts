import GameState from "./GameState";

export default interface ServerToClientEvents {
	updateState: (gameState?: GameState) => void;
}