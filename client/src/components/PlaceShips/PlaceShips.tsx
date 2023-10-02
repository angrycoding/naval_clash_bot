import React from 'react';
import styles from './PlaceShips.module.scss';
import clsx from 'clsx';
import Button from '../Button/Button';
import Router from '../Router/Router';
import Socket from '../../utils/Socket';
import Map from '../../types/Map';
import Field from '../Field/Field';
import ThreeDots from '../ThreeDots/ThreeDots';

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
			Socket.emit('setMap', map);
		});
	}

	render() {
		const { ready } = this.state;
		return <div className={clsx(styles.wrapper, ready && styles.ready)}>

			<div className={styles.fieldWrapper}>
				<Field ref={this.field} />
			</div>

			<div className={styles.buttons}>
				<Button onClick={this.ready} disabled={ready}>
					{ready ? <ThreeDots>Ждём оппонента</ThreeDots> : 'я готов к игре'}
				</Button>
				<Button onClick={this.placeShips} disabled={ready}>
					переставить
				</Button>
			</div>
			
		</div>
	}
}

export default PlaceShips;