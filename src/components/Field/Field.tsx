import React from 'react';
import styles from './Field.module.scss';
import generateMap from '../../utils/generateMap';
import Map from '../../types/Map';
import xy2index from '../../utils/xy2index';
import index2xy from '../../utils/index2xy';
import clsx from 'clsx';
import playSound from '../../utils/playSound';
import explode from './phit.wav';
import dead from './dead.wav';

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

class Field extends React.Component<Props, State> {

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

		return <div className={styles.bar}>

			<div>
				<div>1</div>
				<div>2</div>
				<div>3</div>
				<div>4</div>
				<div>5</div>
				<div>6</div>
				<div>7</div>
				<div>8</div>
				<div>9</div>
				<div>10</div>
			</div>
			
			<div>
					<div>1</div>
					<div>2</div>
					<div>3</div>
					<div>4</div>
					<div>5</div>
					<div>6</div>
					<div>7</div>
					<div>8</div>
					<div>9</div>
					<div>10</div>
				</div>

			{/* <div className={styles.foo}> */}

			

				
				<div className={clsx(className, styles.field, enemy && styles.enemy)}>

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
			{/* </div> */}

		</div>
	}

}

export default Field;