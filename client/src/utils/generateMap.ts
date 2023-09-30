import Map from "../types/Map";
import getRandomInt from "./getRandomInt";
import xy2index from "./xy2index";

const SHIPS = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

const createMatrix = () => [
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const placeShip = (matrix: ReturnType<typeof createMatrix>, size: number, shipId: number): boolean => {

	const fieldSize = 10;
	const aMax = fieldSize - 1;
	const bMax = fieldSize - size;

	if (getRandomInt(0, 1)) {

		const x = getRandomInt(0, bMax);
		const y = getRandomInt(0, aMax);

		if (x > 0) {
			if (matrix[y][x - 1]) return false;
			if (y > 0 && matrix[y - 1][x - 1]) return false;
			if (y < aMax && matrix[y + 1][x - 1]) return false;
		}

		if ((x + size) < fieldSize) {
			if (matrix[y][x + size]) return false;
			if (y > 0 && matrix[y - 1][x + size]) return false;
			if (y < aMax && matrix[y + 1][x + size]) return false;
		}

		for (let c = x; c < x + size; c++) {
			if (y > 0 && matrix[y - 1][c]) return false;
			if (y < aMax && matrix[y + 1][c]) return false;
			if (matrix[y][c]) return false;
			matrix[y][c] = shipId;
		}
	}

	else {


		const x = getRandomInt(0, aMax);
		const y = getRandomInt(0, bMax);

		if (y > 0) {
			if (matrix[y - 1][x]) return false;
			if (x > 0 && matrix[y - 1][x - 1]) return false;
			if (x < aMax && matrix[y - 1][x + 1]) return false;
		}

		if ((y + size) < fieldSize) {
			if (matrix[y + size][x]) return false;
			if (x > 0 && matrix[y + size][x - 1]) return false;
			if (x < aMax && matrix[y + size][x + 1]) return false;
		}

		for (let c = y; c < y + size; c++) {
			if (x > 0 && matrix[c][x - 1]) return false;
			if (x < aMax && matrix[c][x + 1]) return false;
			if (matrix[c][x]) return false;
			matrix[c][x] = shipId;
		}
	}

	return true;

}


const generateMap = (): Map => {

	const ships: DOMPoint[] = [];
	let matrix = createMatrix();

	iteration: for (;;) {
		ships.splice(0, Infinity);
		for (let index = 0; index < SHIPS.length; index++) {

			
			if (!placeShip(matrix, SHIPS[index], index + 1 << 2 | 0)) {
				matrix = createMatrix();
				continue iteration;
			}



		}
		break;
	}

	const result: Map = {};

	for (let y = 0; y < matrix.length; y++) {
		const row = matrix[y];
		for (let x = 0; x < row.length; x++) {
			if (!row[x]) continue;
			const index = xy2index(x, y);
			result[index] = row[x];
		}
	}

	return result;
};

export default generateMap;