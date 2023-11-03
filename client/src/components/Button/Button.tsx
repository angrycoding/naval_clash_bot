import clsx from 'clsx';
import Border from '../Border/Border';
import styles from './Button.module.scss';
import {playSound} from '../../utils/playSound';
import foo from './button-46.mp3';
import { CSSProperties } from 'react';
import Counter from '../Counter/Counter';
import formatTime from '../../utils/formatTime';
import i18n from '../../utils/i18n';


interface Props {
	children?: any;
	disabled?: boolean;
	style?: CSSProperties;
	onClick?: () => void;
	showTime?: boolean;
}

const Button = (props: Props) => (
	<div className={clsx(styles.outer, props.disabled && styles.disabled)} style={props.style}>
		<Border>
			<div className={styles.inner} onClick={() => {
				playSound(foo);
				props?.onClick?.()
			}}>
				{props.children}

				{props.showTime && (
					<Counter onRender={secondsLeft => (
						<div className={styles.timer}>
							({i18n('WAITING_FOR')}{' '}{formatTime(secondsLeft)})
						</div>
					)} />
				)}

			</div>
		</Border>
	</div>
);

export default Button;