import React, { CSSProperties } from 'react';
import clsx from "clsx";
import styles from './Field.module.scss';
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

import { playSound } from '../../utils/playSound';
import generateGrid from '../../utils/generateGrid';
import { Map, getShipId, index2xy, isDeadShip, isFresh, isHitShip, isSea, isShip, xy2index } from '../../utils/mapUtils';


const FIELD_GRID_BG = generateGrid(1.2, '10%', theme.gridColor);


const CROSSES = [c1, c2, c3];
const MISSES = [h1, h2];



const SeaCell = React.memo(() => (
	<div style={{
		// transform: `rotate(${getRandomInt(0, 3) * 90 + getRandomInt(-10, 10)}deg)`,
		'--maskSize': `${getRandomInt(80, 90)}%`,
		'--maskImage': `url("${MISSES[getRandomInt(0, MISSES.length - 1)]}")`
	} as CSSProperties} />
));


const CellHit = React.memo(() => (
	<div style={{
		transform: `rotate(${getRandomInt(0, 3) * 90 + getRandomInt(-10, 10)}deg)`,
		'--maskSize': `${getRandomInt(60, 80)}%`,
		'--maskImage': `url("${CROSSES[getRandomInt(0, CROSSES.length - 1)]}")`
	} as CSSProperties} />
));


const Label = React.memo((props: { children: any }) => (
	<div style={{
		transform: `rotate(${getRandomInt(-5, 5)}deg)`,
	}}>{props.children}</div>
));


interface Props {
	map: Map;
	style?: CSSProperties;
	className?: string;
	background?: string;
	status?: any;
	reverseLegend?: boolean;
	hideAliveShips?: boolean;
	onHit?: (index: number) => void;
}

class Field extends React.Component<Props> {

	componentDidUpdate = (oldProps: Readonly<Props>) => {
		
		if (JSON.stringify(oldProps.map) === JSON.stringify(this.props.map)) return;


		if (isFresh(this.props.map)) return;

		const oldMap = oldProps.map;
		const newMap = this.props.map;

		let sound = '';

		for (const index in newMap) {
			if (newMap[index] === oldMap[index]) continue;
			const oldEntity = oldMap[index];
			const newEntity = newMap[index];
			if (oldEntity === undefined && newEntity !== undefined) {
				if (!sound) sound = miss;
			} else if (!isHitShip(oldEntity) && isHitShip(newEntity)) {
				if (isDeadShip(this.props.map, getShipId(newEntity))) {
					sound = hit1;
				} else {
					sound = [hit2, hit3, hit4][getRandomInt(0, 2)];
				}
				break;
			}
		}

		if (sound) {
			playSound(sound)
		}
	}

	onHit = (index: number) => {
		this.props?.onHit?.(index);
	}

	render() {

		const { map, reverseLegend, hideAliveShips, background, className, status, style } = this.props;

		return <div className={clsx(
			className,
			styles.outerWrapper,
			reverseLegend && styles.reverseLegend,
			hideAliveShips && styles.hideAliveShips
		)} style={{
			...(style),
			'--background': background
		} as CSSProperties}>


			<div className={styles.letters}>
				{new Array(10).fill(0).map((_, i) => <Label key={i}>{String.fromCharCode(i + 65)}</Label>)}
			</div>

			<div className={styles.innerWrapper}>
				<div className={styles.digits}>
					{new Array(10).fill(0).map((_, i) => <Label key={i}>{i + 1}</Label>)}
				</div>


				<div className={styles.grid} style={FIELD_GRID_BG}>


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
							const leftObject = (hideAliveShips ? isHitShip : isShip)(map[xy2index(index2xy(index, -1, 0))]);
							const rightObject = (hideAliveShips ? isHitShip : isShip)(map[xy2index(index2xy(index, 1, 0))]);
							const topObject = (hideAliveShips ? isHitShip : isShip)(map[xy2index(index2xy(index, 0, -1))]);
							const bottomObject = (hideAliveShips ? isHitShip : isShip)(map[xy2index(index2xy(index, 0, 1))]);

							const isSquare = Boolean(!leftObject && !rightObject && !topObject && !bottomObject);
							const isVerStart = Boolean(!leftObject && !rightObject && !topObject && bottomObject);
							const isVerEnd = Boolean(!leftObject && !rightObject && topObject && !bottomObject);
							const isVerCenter = Boolean(!leftObject && !rightObject && topObject && bottomObject);
							const isHorStart = Boolean(!leftObject && rightObject && !topObject && !bottomObject);
							const isHorEnd = Boolean(leftObject && !rightObject && !topObject && !bottomObject);
							const isHorCenter = Boolean(leftObject && rightObject && !topObject && !bottomObject);


							return (
								<div key={index}
									onClick={isHit ? undefined : () => this.onHit(index)}
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


						return <div key={index} onClick={() => this.onHit(index)} />

					})}

					<div className={styles.status}>
						<div>{status}</div>
					</div>
					

				</div>

			</div>
			
		</div>
	}
}

export default Field;