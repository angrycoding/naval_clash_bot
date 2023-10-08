import { Map } from "../utils/mapUtils";

export default interface ClientToServerEvents {
	shot: (fromUserId: string, toUserId: string, index: number) => void;
	startGameRequest: (map: Map, fromUserId: string, replayId?: string, withUserId?: string, whosTurn?: string) => void;
	readyToReplayRequest: (replayId: string, fromUserId: string, withUserId: string) => void;
}