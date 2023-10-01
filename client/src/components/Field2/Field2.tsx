import React, { CSSProperties } from 'react';
import clsx from "clsx";
import styles from './Field2.module.scss';
import Map from '../../types/Map';
import generateMap from '../../utils/generateMap';
import theme from '../../index.module.scss'
import getRandomInt from '../../utils/getRandomInt';

import miss from './miss.wav';

import hit1 from './hit1.wav';
import hit2 from './hit2.wav';
import hit3 from './hit3.wav';
import hit4 from './hit4.wav';

import h1 from './h1.png';
import h2 from './h2.png';
import c1 from './c1.png';
import c2 from './c2.png';
import c3 from './c3.png';

import xy2index from '../../utils/xy2index';
import index2xy from '../../utils/index2xy';
import { playSound } from '../../utils/playSound';

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

const SeaCell = React.memo(() => (
	<div style={{
		// transform: `rotate(${getRandomInt(0, 3) * 90 + getRandomInt(-10, 10)}deg)`,
		'--maskSize': `${getRandomInt(60, 80)}%`,
		'--maskImage': `url("${[h1, h2][getRandomInt(0, 1)]}")`
	} as CSSProperties} />
));


const CellHit = React.memo(() => (
	<div style={{
		transform: `rotate(${getRandomInt(0, 3) * 90 + getRandomInt(-10, 10)}deg)`,
		'--maskSize': `${getRandomInt(60, 80)}%`,
		'--maskImage': `url("${[c1, c2, c3][getRandomInt(0, 2)]}")`
	} as CSSProperties} />
));


const Label = React.memo((props: { children: any }) => (
	<div style={{
		transform: `rotate(${getRandomInt(-5, 5)}deg)`,
	}}>{props.children}</div>
));




const generateGrid = () => {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
		<defs>
			<pattern id="pattern_KJHz" patternUnits="userSpaceOnUse" width="10%" height="10%">
				<line x1="0" y1="0" x2="0" y2="10%" stroke="${theme.gridColor}" stroke-width="2" />
				<line x1="0" y1="0" x2="10%" y2="0" stroke="${theme.gridColor}" stroke-width="2" />
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#pattern_KJHz)" />
	</svg>`
	return `url("data:image/svg+xml;base64,${window.btoa(svg)}")`;
}


interface Props {
	style?: CSSProperties;
	className?: string;
	enemy?: boolean;
	gameOver?: boolean;
	disabled?: boolean;
	status?: any;
	onTurn?: (changeTurn: boolean, allDead: boolean, index: number) => void;
}

interface State {
	map: Map;
}


class Field2 extends React.Component<Props, State> {

	constructor(props: Props) {
		super(props);
		this.state = {
			map: props.enemy ? {} : generateMap()
		}
	}

	makeShot = (index: number) => {

		const { onTurn } = this.props;


		let changeSide = false;
		let callTurn = false;
		let allDead = false;

		this.setState(state => {

			let map = state.map;
			const entity = map[index];

			if (!entity) {
				playSound(miss);
				map = { ...map, [index]: entity | 2 }
				changeSide = true;
				allDead = false;
				callTurn = true;
			}
	
			else if (isShip(entity) && !isHitShip(entity)) {
	
				map = {
					...map,
					[index]: getShipId(entity) << 2 | 1
				};
	
				if (isDeadShip(map, getShipId(entity))) {
					playSound(hit1);
					changeSide = false;
					allDead = isGameOver(map);
					callTurn = true;
				} else {
					playSound([hit2, hit3, hit4][getRandomInt(0, 2)]);
					changeSide = false;
					allDead = false;
					callTurn = true;
				}
				
	
	
			}
	
			return { ...state, map: fillBorders(map) };

		}, () => {
			if (!callTurn) return;
			onTurn?.(changeSide, allDead, index);
		})


	}

	randomize = () => {
		this.setState(state => ({ ...state, map: generateMap() }));
	}

	get = (): Map => {
		return {...this.state.map};
	}

	set = (map: Map) => {
		this.setState(state => ({ ...state, map: { ...map} }));
	}

	render() {

		const { map } = this.state;
		const { className, enemy, gameOver, status, style, disabled } = this.props;

		return <div className={clsx(
			className,
			styles.field,
			enemy && styles.enemy,
			gameOver && styles.gameOver,
			disabled && styles.disabled
		)} style={style}>


			<div className={styles.letters}>
				{new Array(10).fill(0).map((_, i) => <Label key={i}>{String.fromCharCode(i + 65)}</Label>)}
			</div>

			<div className={styles.innerWrapper}>
				<div className={styles.digits}>
					{new Array(10).fill(0).map((_, i) => <Label key={i}>{i + 1}</Label>)}
				</div>


				<div className={styles.grid} style={{backgroundImage: generateGrid()}}>

					{new Array(100).fill(0).map((_, index) => {


						const entity = map[index];

						if (isSea(entity)) {
							return (
								<div key={index} className={styles.sea}>
									<SeaCell />
								</div>
							)
						}


						if (isShip(entity)) {


							const isHit = isHitShip(entity);
							const leftObject = (enemy && !gameOver ? isHitShip : isShip)(map[xy2index(index2xy(index, -1, 0))]);
							const rightObject = (enemy && !gameOver ? isHitShip : isShip)(map[xy2index(index2xy(index, 1, 0))]);
							const topObject = (enemy && !gameOver ? isHitShip : isShip)(map[xy2index(index2xy(index, 0, -1))]);
							const bottomObject = (enemy && !gameOver ? isHitShip : isShip)(map[xy2index(index2xy(index, 0, 1))]);

							const isSquare = Boolean(!leftObject && !rightObject && !topObject && !bottomObject);
							const isVerStart = Boolean(!leftObject && !rightObject && !topObject && bottomObject);
							const isVerEnd = Boolean(!leftObject && !rightObject && topObject && !bottomObject);
							const isVerCenter = Boolean(!leftObject && !rightObject && topObject && bottomObject);
							const isHorStart = Boolean(!leftObject && rightObject && !topObject && !bottomObject);
							const isHorEnd = Boolean(leftObject && !rightObject && !topObject && !bottomObject);
							const isHorCenter = Boolean(leftObject && rightObject && !topObject && !bottomObject);



							return (
								<div key={index}
									onClick={() => this.makeShot(index)}
									className={clsx(
										isSquare && [styles.ship, styles.one, isHit && styles.hit],
										isVerStart && [styles.ship, styles.verStart, isHit && styles.hit],
										isVerEnd && [styles.ship, styles.verEnd, isHit && styles.hit],
										isHorStart && [styles.ship, styles.horStart, isHit && styles.hit],
										isHorEnd && [styles.ship, styles.horEnd, isHit && styles.hit],
										isVerCenter && [styles.ship, styles.verCenter, isHit && styles.hit],
										isHorCenter && [styles.ship, styles.horCenter, isHit && styles.hit]
									)}
								>
									<CellHit />
								</div>
							)
						}


						return <div key={index} onClick={() => this.makeShot(index)} />

					})}

					{status && <div className={styles.status}>
						<div>{status}</div>
					</div>}
					

				</div>

			</div>
			
		</div>
	}
}

export default Field2;