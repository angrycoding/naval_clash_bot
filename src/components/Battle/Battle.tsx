import React, { CSSProperties } from 'react';
import Field from '../Field/Field';
import styles from './Battle.module.scss';
import clsx from 'clsx';
import Border from '../Border/Border';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import theme from '../../index.module.scss';

interface State {
	ready: boolean;
}



class Battle extends React.Component<{}, State> {

	state: State = {
		ready: false
	}

	field: React.RefObject<Field> = React.createRef();

	placeShips = () => {
		this.field.current?.randomize();
	}

	ready = () => {
		this.setState({ ready: true });
	}

	render() {
		const { ready } = this.state;
		return (
			<div className={styles.outerWrapper}>
				<div className={styles.fields}>

					<div className={styles.wrapper}>
					
						<div className={styles.col}>
							<Field />
						</div>
						<div className={styles.col}>
							<Field enemy={true} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Battle;