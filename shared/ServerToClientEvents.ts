import GameState from "./GameState";

export default interface ServerToClientEvents {
	inviteResponse: (gameState: GameState) => void;
	shot: (fromUserId: string, index: number) => void;
	readyToReplayResponse: (replayId: string, withUserId: string) => void;
	startGameResponse: (gameState: GameState) => void;
}