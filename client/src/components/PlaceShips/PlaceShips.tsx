import React from 'react';
import Field from '../Field/Field';
import styles from './PlaceShips.module.scss';
import clsx from 'clsx';
import Border from '../Border/Border';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import Router from '../Router/Router';
import Socket from '../../utils/Socket';
import getUserId from '../../utils/getUserId';
import Map from '../../types/Map';

interface State {
	ready: boolean;
}

class PlaceShips extends React.Component<{}, State> {

	state: State = {
		ready: false
	}

	field: React.RefObject<Field> = React.createRef();

	startBattle = (enemyId: string, enemyMap: Map, isMyTurn: boolean) => {
		console.info('enemyId', enemyId)
		console.info('enemyMap', enemyMap)
		console.info('SERVER SAYS startBattle!');
		Router.go('/battle', {
			enemyId,
			isMyTurn,
			myMap: this.field.current?.get(),
			enemyMap
		});
	}

	componentDidMount = () => {
		// Socket.emit('inviteUserToPlay', 311775037);
	}


	componentWillUnmount(): void {
		Socket.off('battle', this.startBattle);
	}

	placeShips = () => {
		this.field.current?.randomize();
	}

	ready = () => {
		const map = this.field.current?.get();
		if (!map) return;
		this.setState({ ready: true }, () => {
			Socket.once('battle', this.startBattle);
			Socket.emit('setMap', map, getUserId());
		});
	}

	render() {
		const { ready } = this.state;
		return <div className={styles.wrapper}>

			<div className={styles.fieldWrapper}>
				<Field ref={this.field} className={styles.field} />
			</div>

			<div className={styles.buttons}>
				<Button onClick={this.ready} disabled={ready}>
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