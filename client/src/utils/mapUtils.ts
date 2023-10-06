import getRandomInt from "./getRandomInt";

export type Map = {[index: string]: number};

const SHIPS = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

const allShipIds = [
	1, 2, 3, 4,
	5, 6, 7,
	8, 9,
	10
]

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

function xy2index(xy: DOMPoint): number;
function xy2index(x: number, y: number): number;
function xy2index(x: any, y?: any): number {
	
	if (x instanceof DOMPoint) {
		y = x.y;
		x = x.x;
	}

	if (x < 0) return Infinity;
	if (y < 0) return Infinity;
	if (x > 9) return Infinity;
	if (y > 9) return Infinity;

	return y * 10 + x
}

const index2xy = (index: number, xOffset?: number, yOffset?: number): DOMPoint => {

	let x = index % 10;
    let y = Math.floor(index / 10);

	if (xOffset) {
		x += xOffset;
	}

	if (yOffset) {
		y += yOffset;
	}

	if (x < 0) x = Infinity;
	if (x > 9) x = Infinity;
	if (y < 0) y = Infinity;
	if (y > 9) y = Infinity;

	return new DOMPoint(x, y);

}

const isGameOver = (map: Map) => (
	allShipIds.every(id => isDeadShip(map, id)
))

const getShipId = (entity: any): number => {
	if (!isShip(entity)) return -1;
	return (entity >> 2) & 15;
}

const isSea = (entity: any): boolean => {
	if (!entity) return false;
	return (entity & 3) === 2;
}

const isShip = (entity: any): boolean => {
	if (!entity) return false;
	return [0, 1].includes(entity & 3);
}

const isHitShip = (entity: any): boolean => {
	if (!entity) return false;
	return (entity & 3) === 1;
}

const isDeadShip = (map: Map, shipId: number) => (
	Object.values(map)
	.filter(entity => getShipId(entity) === shipId)
	.every(isHitShip)
);

const isFresh = (map: Map) => !(
	Object.values(map).some(entity => isSea(entity) || isHitShip(entity))
)

const fillBorders = (map: Map) => {

	const shipCells: any = {};
	
	for (const index in map) {
		const indexNum = parseInt(index, 10);
		const entity = map[index];
		if (!isShip(entity)) continue;
		const isHit = isHitShip(entity);
		const shipId = getShipId(entity);
		if (!shipCells[shipId]) shipCells[shipId] = [];
		shipCells[shipId].push(isHit ? indexNum : undefined);
	}

	for (const shipId in shipCells) {
		const cells = shipCells[shipId];
		const isDead = cells.every((i: any) => i !== undefined);
		if (!isDead) continue;
		for (const index of cells) {
			const indexNum = Math.abs(parseInt(index));
			const { x, y } = index2xy(indexNum);
			for (let xx = x - 1; xx <= x + 1; xx++) {
				for (let yy = y - 1; yy <= y + 1; yy++) {
					const index = xy2index(xx, yy);
					if (map[index]) continue;
					map[index] = 2;
				}
			}
		}
	}

	// if (isGameOver(map)) {
	// 	for (const index in map) {
	// 		const indexNum = parseInt(index, 10);
	// 		const entity = map[index];
	// 		if (!isShip(entity)) continue;
	// 		if (!isDeadShip())
	// 		const isHit = isHitShip(entity);
	// 		const shipId = getShipId(entity);
	// 		if (!shipCells[shipId]) shipCells[shipId] = [];
	// 		shipCells[shipId].push(isHit ? indexNum : undefined);
	// 	}
	// }

}

const generateMap = (): Map => {

	const ships: DOMPoint[] = [];
	let matrix = createMatrix();

	// return { 0: (1 << 2 | 0) }

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
}

export {
	isSea,
	isShip,
	getShipId,
	isHitShip,
	isFresh,
	isDeadShip,
	isGameOver,
	generateMap,
	fillBorders,
	xy2index,
	index2xy
}