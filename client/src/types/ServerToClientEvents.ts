import Map from "./Map";

export default interface ServerToClientEvents {
	shot: (index: number) => void;
	battle: (userId: string, map: Map, turn: boolean) => void;
}