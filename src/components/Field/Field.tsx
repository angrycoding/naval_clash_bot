import React, { CSSProperties } from 'react';
import styles from './Field.module.scss';
import generateMap from '../../utils/generateMap';
import Map from '../../types/Map';
import xy2index from '../../utils/xy2index';
import index2xy from '../../utils/index2xy';
import clsx from 'clsx';
import playSound from '../../utils/playSound';
import explode from './phit.wav';
import dead from './dead.wav';
import getRandomInt from '../../utils/getRandomInt';
import theme from '../../index.module.scss';

const getShipId = (entity: any): number => {
	if (!isShip(entity)) return -1;
	return (entity >> 2);
}

const isMissHit = (entity: any): boolean => {
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


interface Props {
	enemy?: boolean;
	className?: string;
}

interface State {
	map: Map;
}

const allShipIds = [
	1, 2, 3, 4,
	5, 6, 7,
	8, 9,
	10
]

const isDeadShip = (map: Map, shipId: number) => (
	Object.values(map)
	.filter(entity => getShipId(entity) === shipId)
	.every(isHitShip)
)

const isGameOver = (map: Map) => (
	allShipIds.every(id => isDeadShip(map, id)
))


const fillBorders = (map: Map): Map => {

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

	return map;
}



  const generateGrid = (cellSize: number) => {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
		<defs>
			<pattern id="pattern_KJHz" patternUnits="userSpaceOnUse" width="10%" height="10%">
				<line x1="0" y1="0" x2="0" y2="10%" stroke="${theme.gridColor}" stroke-width="1" />
				<line x1="0" y1="0" x2="10%" y2="0" stroke="${theme.gridColor}" stroke-width="1" />
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#pattern_KJHz)" />
	</svg>`
	return `url("data:image/svg+xml;base64,${window.btoa(svg)}")`;
}



class Field extends React.Component<Props, State> {

	labelAngles = new Array(20).fill(0).map(() => getRandomInt(-5, 10))

	state: State = {
		map: generateMap()
	}
	
	randomize = () => {
		this.setState({ map: generateMap() });
	}

	makeShot = (index: number) => {

		let map = this.state.map;

		const entity = map[index];

		if (!entity) {
			console.info('play sound miss')
			map = { ...map, [index]: entity | 2 }
		}

		else if (isShip(entity) && !isHitShip(entity)) {

			map = {
				...map,
				[index]: entity | 1
			};

			if (isGameOver(map)) {
				console.info('game over')
			}

			else if (isDeadShip(map, getShipId(entity))) {
				console.info('play sound ship dead');
				playSound(dead);
			}

			else {
				console.info('play sound ship hit')
				playSound(explode);
			}


		}

		this.setState({ map: fillBorders(map) });

	}

	render() {

		const { enemy, className } = this.props;
		const { map } = this.state;

		return <div className={clsx(className, styles.field, enemy && styles.enemy)}>

			<div>
				{new Array(10).fill(0).map((_, i) => <div key={i}>{i + 1}</div>)}
			</div>

			<div>
				{new Array(10).fill(0).map((_, i) => <div key={i}>{String.fromCharCode(i + 65)}</div>)}
			</div>

			<div style={{
				backgroundImage: generateGrid(10)
			} as CSSProperties}>

				{new Array(100).fill(0).map((_, index) => {


					const entity = map[index];

					if (isMissHit(entity)) {
						return (
							<div key={index}>
								<div>•</div>
							</div>
						)
					}


					if (isShip(entity)) {


						const isHit = isHitShip(entity);
						const leftObject = (enemy ? isHitShip : isShip)(map[xy2index(index2xy(index, -1, 0))]);
						const rightObject = (enemy ? isHitShip : isShip)(map[xy2index(index2xy(index, 1, 0))]);
						const topObject = (enemy ? isHitShip : isShip)(map[xy2index(index2xy(index, 0, -1))]);
						const bottomObject = (enemy ? isHitShip : isShip)(map[xy2index(index2xy(index, 0, 1))]);

						const isSquare = Boolean(!leftObject && !rightObject && !topObject && !bottomObject);
						const isVerStart = Boolean(!leftObject && !rightObject && !topObject && bottomObject);
						const isVerEnd = Boolean(!leftObject && !rightObject && topObject && !bottomObject);
						const isVerCenter = Boolean(!leftObject && !rightObject && topObject && bottomObject);
						const isHorStart = Boolean(!leftObject && rightObject && !topObject && !bottomObject);
						const isHorEnd = Boolean(leftObject && !rightObject && !topObject && !bottomObject);
						const isHorCenter = Boolean(leftObject && rightObject && !topObject && !bottomObject);



						return (
							<div key={index} onClick={() => this.makeShot(index)}>
								{isSquare && <div className={clsx(styles.ship, styles.one, isHit && styles.hit)} />}
								{isVerStart && <div className={clsx(styles.ship, styles.verStart, isHit && styles.hit)} />}
								{isVerEnd && <div className={clsx(styles.ship, styles.verEnd, isHit && styles.hit)} />}
								{isHorStart && <div className={clsx(styles.ship, styles.horStart, isHit && styles.hit)} />}
								{isHorEnd && <div className={clsx(styles.ship, styles.horEnd, isHit && styles.hit)} />}
								{isVerCenter && <div className={clsx(styles.ship, styles.verCenter, isHit && styles.hit)} />}
								{isHorCenter && <div className={clsx(styles.ship, styles.horCenter, isHit && styles.hit)} />}
							</div>
						)
					}


					return <div key={index} onClick={() => this.makeShot(index)} />

				})}


			</div>

		</div>
	}

}

export default Field;