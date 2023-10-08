import GameState from "./GameState";

export default interface ServerToClientEvents {
	shot: (fromUserId: string, index: number) => void;
	readyToReplayResponse: (replayId: string, withUserId: string) => void;
	startGameResponse: (gameState: GameState) => void;
}