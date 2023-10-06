import { Map } from "../utils/mapUtils";

export default interface ClientToServerEvents {
	shot: (index: number) => void;
	setMap: (map: Map) => void;
	readyToReplay: () => void;
	readyToPlay: (map: Map) => void;
}