import GameState from "./GameState";

export default interface ServerToClientEvents {
	shot: (fromUserId: string, index: number) => void;
	giveup: (fromUserId: string, toUserId: string) => void;
	readyToReplayResponse: (replayId: string, withUserId: string) => void;
	startGameResponse: (gameState: GameState) => void;
}