import React from 'react';
import Field from '../Field/Field';
import styles from './PlaceShips.module.scss';
import clsx from 'clsx';
import Border from '../Border/Border';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import Router from '../Router/Router';

interface State {
	ready: boolean;
}

class PlaceShips extends React.Component<{}, State> {

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
		return <div className={styles.wrapper}>

				<Field ref={this.field} />

				<div className={styles.spacer} />

				<div className={styles.buttons}>
					<Button onClick={() => Router.go('/battle')} disabled={ready}>
						I AM READY
					</Button>
					<Button onClick={this.placeShips} disabled={ready}>
						CHANGE LAYOUT
					</Button>
				</div>
				
			</div>
	}
}

export default PlaceShips;