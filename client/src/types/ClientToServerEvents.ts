import { Map } from "../utils/mapUtils";

export default interface ClientToServerEvents {
	startGameRequest: (map: Map, fromUserId: string, replayId?: string, withUserId?: string, whosTurn?: string) => void;
	shot: (fromUserId: string, toUserId: string, index: number) => void;
	readyToReplayRequest: (replayId: string, fromUserId: string, withUserId: string) => void;
}