import Map from "./Map";

export default interface ClientToServerEvents {
	setMap: (map: Map) => void;
	shot: (toId: string, index: number) => void;
}