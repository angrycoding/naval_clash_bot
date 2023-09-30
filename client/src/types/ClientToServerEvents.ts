import Map from "./Map";

export default interface ClientToServerEvents {
	setMap: (map: Map, userId: string) => void;
	shot: (toId: string, index: number) => void;
}