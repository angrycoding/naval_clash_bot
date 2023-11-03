import React, { CSSProperties } from 'react';
import styles from './Border.module.scss';
import getRandomInt from '../../../../shared/getRandomInt';

interface Props {
	children?: any;
}

function getRandomFloat(min: number, max: number, decimals: number) {
	const str = (Math.random() * (max - min) + min).toFixed(
	  decimals,
	);
  
	return parseFloat(str);
  }

class Border extends React.Component<Props> {

	sizes = [
		getRandomFloat(3, 5, 2),
		getRandomFloat(3, 5, 2),
		getRandomFloat(3, 5, 2),
		getRandomFloat(3, 5, 2),
		getRandomInt(1, 20),
		getRandomInt(1, 20),
		getRandomInt(1, 20),
		getRandomInt(1, 20),
		getRandomInt(50, 100),
		getRandomInt(50, 100),
		getRandomInt(50, 100),
		getRandomInt(50, 100),
		getRandomInt(0, 1),
		getRandomInt(0, 1),
		getRandomFloat(-0.5, 0.5, 2),
		getRandomFloat(-0.25, 0.25, 2),
		getRandomFloat(-1, 1, 2)
	]


	render() {
		return <div className={styles.box} style={{

			'--border-size1': `${this.sizes[0]}px`,
			'--border-size2': `${this.sizes[1]}px`,
			'--border-size3': `${this.sizes[2]}px`,
			'--border-size4': `${this.sizes[3]}px`,

			'--border-round1': `${this.sizes[4]}px`,
			'--border-round2': `${this.sizes[5]}px`,
			'--border-round3': `${this.sizes[6]}px`,
			'--border-round4': `${this.sizes[7]}px`,

			'--border-round5': `${this.sizes[8]}px`,
			'--border-round6': `${this.sizes[9]}px`,
			'--border-round7': `${this.sizes[10]}px`,
			'--border-round8': `${this.sizes[11]}px`,

			'--transform': [
				this.sizes[12] ? `scaleY(-100%)` : '',
				this.sizes[13] ? `scaleX(-100%)` : '',
				`skewX(${this.sizes[14]}deg)`,
				`rotate(${this.sizes[15]}deg)`,
			].join(' ')
		} as CSSProperties}>
			<div style={{
				transform: `rotate(${this.sizes[16]}deg)`
			}}>
				{this.props.children}
			</div>
	  </div>
	}
}

export default Border;