import React from 'react';
import Field from '../Field/Field';
import styles from './PlaceShips.module.scss';
import clsx from 'clsx';

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
		return <div className={clsx(styles.layout, ready && styles.disabled)}>
			<div className={styles.field}>
				<Field ref={this.field} />
			</div>
			<div className={styles.buttons}>
				<button onClick={this.ready} disabled={ready}>
					I AM READY
				</button>
				<button onClick={this.placeShips} disabled={ready}>
					CHANGE LAYOUT
				</button>
			</div>
		</div>
	}
}

export default PlaceShips;