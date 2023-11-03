import Map from "./Map";
import ShotResult from './ShotResult';
import CellType from "./CellType";
import getRandomInt from "./getRandomInt";

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

const placeShip = (matrix: ReturnType<typeof createMatrix>, size: number): boolean => {

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
			matrix[y][c] = 1;
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
			matrix[c][x] = 1;
		}
	}

	return true;

}

const xy2index = (x: number, y: number): number => {
	if (x < 0) return Infinity;
	if (y < 0) return Infinity;
	if (x > 9) return Infinity;
	if (y > 9) return Infinity;
	return y * 10 + x
}

const index2xy = (index: number): DOMPoint => {
	let x = index % 10;
	let y = Math.floor(index / 10);
	return new DOMPoint(x, y);
}

const indexOffset = (index: number, xOff: number, yOff: number): number  => {

	let {x, y} = index2xy(index)
	
	x += xOff;
	y += yOff;

	if (x < 0) x = Infinity;
	if (x > 9) x = Infinity;
	if (y < 0) y = Infinity;
	if (y > 9) y = Infinity;

	return xy2index(x, y);
}

const isGameOver = (map: Map) => (
	Object.values(map).every(i => [CellType.SEA, CellType.HIT].includes(i))
)

const isSea = (cell: any): boolean => {
	return cell === CellType.SEA;
}

const isShip = (cell: any): boolean => {
	return [CellType.SHIP, CellType.HIT].includes(cell);
}

const isHitShip = (cell: any): boolean => {
	return cell === CellType.HIT;
}

const isFresh = (map: Map) => !(
	Object.values(map).some(entity => isSea(entity) || isHitShip(entity))
)


const fillBordersAndGetDeadCells = (map: Map): number[] => {


	const ships: number[][] = [

	]

	for (let index = 0; index < 100; index++) {
		
		if (!isShip(map[index])) continue;

		const xminus1 = isShip(map[indexOffset(index, -1, 0)]);
		const yminus1 = isShip(map[indexOffset(index, 0, -1)]);

		const xplus1 = isShip(map[indexOffset(index, 1, 0)]);
		const xplus2 = isShip(map[indexOffset(index, 2, 0)]);
		const xplus3 = isShip(map[indexOffset(index, 3, 0)]);

		const yplus1 = isShip(map[indexOffset(index, 0, 1)]);
		const yplus2 = isShip(map[indexOffset(index, 0, 2)]);
		const yplus3 = isShip(map[indexOffset(index, 0, 3)]);

		if (!xminus1 && xplus1 && xplus2 && xplus3) {
			ships.push([index, index + 1, index + 2, index + 3]);
		}

		else if (!xminus1 && xplus1 && xplus2) {
			ships.push([index, index + 1, index + 2]);
		}

		else if (!xminus1 && xplus1) {
			ships.push([index, index + 1]);
		}

		else if (!yminus1 && yplus1 && yplus2 && yplus3) {
			ships.push([index, index + (10 * 1), index + (10 * 2), index + (10 * 3)]);
		}

		else if (!yminus1 && yplus1 && yplus2) {
			ships.push([index, index + (10 * 1), index + (10 * 2)]);
		}

		else if (!yminus1 && yplus1) {
			ships.push([index, index + (10 * 1)]);
		}

		else if (!yminus1 && !yplus1 && !xminus1 && !xplus1) {
			ships.push([index]);
		}


	}


	const deadCells: number[] = [];

	for (const cells of ships) {
		const isDead = cells.every(index => map[index] === 3);
		if (!isDead) continue;
		
		
		for (const index of cells) {
			deadCells.push(index);
			const { x, y } = index2xy(index);
			for (let xx = x - 1; xx <= x + 1; xx++) {
				for (let yy = y - 1; yy <= y + 1; yy++) {
					const index = xy2index(xx, yy);
					if (map[index]) continue;
					map[index] = CellType.SEA;
				}
			}
		}

	}

	return deadCells;
	

}

const makeShot = (map: Map, index: number): ShotResult => {
	const cellType = map[index];

	if (!cellType) {
		map[index] = CellType.SEA;
		return ShotResult.HIT_SEA;
	}

	if (cellType !== CellType.SHIP) {
		return ShotResult.NOTHING;
	}

	map[index] = CellType.HIT;
	const deadCells = fillBordersAndGetDeadCells(map);
	if (isGameOver(map)) return ShotResult.GAME_OVER;
	if (deadCells.includes(index)) return ShotResult.KILL_SHIP;
	return ShotResult.HIT_SHIP;
	
}

const convertOldMapToNew = (map: Map): Map => {
	const result: Map = {};
	for (const index in map) result[index] = CellType.SHIP;
	return result;
}

const convertNewMapToOld = (map: Map): Map => {


	const ships: any = [];

	for (const indexStr in map) {
		const index = parseInt(indexStr, 10);

		if (ships.flat(Infinity).includes(index)) continue;

		const cells = [index];
		let left = true, right = true, bottom = true, top = true;
		for (let c = 0; c < 4; c++) {
			let ind = 0;
			if (left && (left = !!map[ind = indexOffset(index, -(c + 1), 0)])) cells.push(ind);
			if (right && (right = !!map[ind = indexOffset(index, (c + 1), 0)])) cells.push(ind);
			if (top && (top = !!map[ind = indexOffset(index, 0, -(c + 1))])) cells.push(ind);
			if (bottom && (bottom = !!map[ind = indexOffset(index, 0, (c + 1))])) cells.push(ind);
		}


		ships.push(cells);

	}


	const oldMap: Map = {};
	for (let index = 0; index < 10; index++) {
		const indexes = ships[index];


		for (let x of indexes) {
			oldMap[x] = index + 1 << 2 | 0
		}


	}

	return oldMap;




}

const generateMap = (): Map => {

	const result: Map = {};
	let matrix = createMatrix();

	iteration: for (;;) {
		for (let index = 0; index < SHIPS.length; index++) {
			if (!placeShip(matrix, SHIPS[index])) {
				matrix = createMatrix();
				continue iteration;
			}
		}
		break;
	}

	for (let index = 0; index < 100; index++) {
		const { x, y } = index2xy(index);
		if (!matrix?.[x]?.[y]) continue;
		result[index] = CellType.SHIP;
	}


	return result;
}


const getAllNonHitIndexes = (map: Map): number[] => {
	const result: number[] = [];
	for (let c = 0; c < 100; c++) {
		if (!map[c] || map[c] === CellType.SHIP) result.push(c);
	}
	return result;

}

const getFirstHitButNotDeadShipCells = (map: Map): number => {

	for (let index = 0; index < 100; index++) {
		if (!isShip(map[index])) continue;
		const cells = [index]
		let left = true, right = true, bottom = true, top = true;
		for (let c = 0; c < 4; c++) {
			let ind = 0;
			if (left && (left = isShip(map[ind = indexOffset(index, -(c + 1), 0)]))) cells.push(ind);
			if (right && (right = isShip(map[ind = indexOffset(index, (c + 1), 0)]))) cells.push(ind);
			if (top && (top = isShip(map[ind = indexOffset(index, 0, -(c + 1))]))) cells.push(ind);
			if (bottom && (bottom = isShip(map[ind = indexOffset(index, 0, (c + 1))]))) cells.push(ind);
		}
		
		
		const hit = cells.filter(cell => map[cell] === CellType.HIT);
		const ship = cells.filter(cell => map[cell] === CellType.SHIP);

		if (hit.length && ship.length) {


			let ar = hit.map(hitIndex => [
				indexOffset(hitIndex, -1, 0),
				indexOffset(hitIndex, 1, 0),
				indexOffset(hitIndex, 0, -1),
				indexOffset(hitIndex, 0, 1)
			]).flat().filter(a => Number.isFinite(a) && (
				(hit.length === 1 && map[a] === undefined) ||
				map[a] === CellType.SHIP
			));
			return ar[getRandomInt(0, ar.length - 1)];
		}

	}

	return -1;

}

const makeRandomShot = (map: Map): ShotResult => {
	const moo = getFirstHitButNotDeadShipCells(map);
	if (moo !== -1) return makeShot(map, moo)
	let ind = getAllNonHitIndexes(map);
	let ixx = ind[getRandomInt(0, ind.length - 1)];
	return makeShot(map, ixx);
}

export {
	isSea,
	isShip,
	isHitShip,
	indexOffset,
	isFresh,
	generateMap,
	makeShot,
	makeRandomShot,
	convertOldMapToNew,
	convertNewMapToOld
}