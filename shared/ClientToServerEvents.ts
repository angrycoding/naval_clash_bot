import Map from "./Map";

export default interface ClientToServerEvents {
	inviteRequest: (fromUserId: string, inviteId: string) => void;
	startGameRequest: (map: Map, fromUserId: string, replayId?: string, withUserId?: string, whosTurn?: string) => void;
	shot: (fromUserId: string, toUserId: string, index: number) => void;
	readyToReplayRequest: (replayId: string, fromUserId: string, withUserId: string) => void;
}