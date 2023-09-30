import React,  { useState } from 'react';
import getRandomInt from '../../utils/getRandomInt';
import styles from './ThreeDots.module.scss';

export default (props: {children: any}) => {
	const [animationDelay] = useState(getRandomInt(0, 1000));
	return <span className={styles.wrapper} style={{'--animation-delay': `${animationDelay}`} as React.CSSProperties}>
		<span>{props.children}</span>
		<span>.</span>
		<span>.</span>
		<span>.</span>
	</span>
};

