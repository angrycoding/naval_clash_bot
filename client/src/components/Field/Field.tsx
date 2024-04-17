import React, { CSSProperties } from 'react';
import clsx from "clsx";
import styles from './Field.module.scss';
import theme from '../../index.module.scss'
import getRandomInt from '../../../../shared/getRandomInt';

import h1 from './h1.png';
import h2 from './h2.png';
import c1 from './c1.png';
import c2 from './c2.png';
import c3 from './c3.png';

import generateGrid from '../../utils/generateGrid';
import { indexOffset, isHitShip, isSea, isShip } from '../../../../shared/mapUtils';
import Map from '../../../../shared/Map';
import userLocale from '../../utils/userLocale';

const FIELD_GRID_BG = generateGrid(1.2, '10%', theme.gridColor);

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]


const LETTERS = (
	userLocale === 'ru' ? ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И', 'К'] :
	userLocale === 'uk' ? ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Є', 'Ж', 'З', 'И'] :
	['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] 
);


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
	children?: any;
	reverseLegend?: boolean;
	hideAliveShips?: boolean;
	onHit?: (index: number) => void;
}

class Field extends React.Component<Props> {

	onHit = (index: number) => {
		this.props?.onHit?.(index);
	}

	render() {

		const { map, reverseLegend, hideAliveShips, background, className, children, style } = this.props;

		

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
				{LETTERS.map(letter => <Label key={letter}>{letter}</Label>)}
			</div>
			

			<div className={styles.innerWrapper}>
				<div className={styles.digits}>
					{DIGITS.map(digit => <Label key={digit}>{digit}</Label>)}
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
							const leftObject = (hideAliveShips ? isHitShip : isShip)(map[indexOffset(index, -1, 0)]);
							const rightObject = (hideAliveShips ? isHitShip : isShip)(map[indexOffset(index, 1, 0)]);
							const topObject = (hideAliveShips ? isHitShip : isShip)(map[indexOffset(index, 0, -1)]);
							const bottomObject = (hideAliveShips ? isHitShip : isShip)(map[indexOffset(index, 0, 1)]);

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
						<div>{children}</div>
					</div>
					

				</div>

			</div>
			
		</div>
	}
}

export default Field;