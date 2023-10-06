import clsx from 'clsx';
import Border from '../Border/Border';
import styles from './Button.module.scss';
import {playSound} from '../../utils/playSound';
import foo from './button-46.mp3';
import { CSSProperties } from 'react';

interface Props {
	children?: any;
	small?: boolean;
	disabled?: boolean;
	style?: CSSProperties;
	onClick?: () => void;
}

const Button = (props: Props) => {
	return <div className={clsx(styles.outer, props.disabled && styles.disabled, props.small && styles.small)} style={props.style}>
		<Border>
			<div className={styles.inner} onClick={() => {
				playSound(foo);
				props?.onClick?.()
			}}>
				{props.children}
			</div>
		</Border>
	</div>
}

export default Button;