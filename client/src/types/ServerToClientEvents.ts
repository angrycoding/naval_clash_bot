import Map from "./Map";

export default interface ServerToClientEvents {
	shot: (...indexes: number[]) => void;
	battle: (
		userId: string,
		map: Map,
		turn: boolean
	) => void;
}