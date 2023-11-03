import React,  { CSSProperties, useState } from 'react';
import getRandomInt from '../../../../shared/getRandomInt';
import styles from './ThreeDots.module.scss';
import clsx from 'clsx';


interface Props {
	children?: any;
	className?: string;
	style?: CSSProperties;
}

const ThreeDots = (props: Props) => {
	const [animationDelay] = useState(getRandomInt(0, 1000));
	return <span className={clsx(styles.wrapper, props.className)} style={{
		'--animation-delay': `${animationDelay}`,
		...(props.style || {})
	} as React.CSSProperties}>
		<span>{props.children}</span>
		<span>.</span>
		<span>.</span>
		<span>.</span>
	</span>
};

export default ThreeDots;