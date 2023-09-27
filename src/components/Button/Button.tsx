import clsx from 'clsx';
import Border from '../Border/Border';
import styles from './Button.module.scss';

interface Props {
	children?: any;
	disabled?: boolean;
	onClick?: () => void;
}

const Button = (props: Props) => {
	return <div className={clsx(props.disabled && styles.disabled)}>
		<Border>
			<div className={styles.wrapper} onClick={props.onClick}>
				{props.children}
			</div>
		</Border>
	</div>
}

export default Button;