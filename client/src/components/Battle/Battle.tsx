import React from 'react';
import clsx from 'clsx';
import styles from './Battle.module.scss';
import Socket from '../../utils/Socket';
import Map from '../../types/Map';
import Field from '../Field/Field';
import Button from '../Button/Button';
import Router from '../Router/Router';


interface State {
	myWin?: boolean;
	gameOver?: boolean;
	isMyTurn?: boolean,
}

class Battle extends React.Component<{
	enemyId: string,
	isMyTurn: boolean,
	myMap: Map,
	enemyMap: Map
}, State> {

	myfield: React.RefObject<Field> = React.createRef();
	enemyfield: React.RefObject<Field> = React.createRef();

	state: State = {
		isMyTurn: this.props.isMyTurn
	}

	onEnemyHit = (...indexes: number[]) => {
		const { isMyTurn, gameOver } = this.state;
		if (isMyTurn || gameOver) return;
		this.myfield.current?.makeShot(...indexes);
	}

	componentDidMount = () => {
		this.myfield.current?.set(this.props.myMap);
		this.enemyfield.current?.set(this.props.enemyMap);
		Socket.on('shot', this.onEnemyHit);
	}

	componentWillUnmount = () => {
		Socket.off('shot', this.onEnemyHit);
	}

	onEnemyTurn = (changeSide: boolean, allDead: boolean) => {

		if (allDead) {
			this.setState(state => ({
				...state,
				gameOver: true,
				myWin: false
			}))
		}

		else if (changeSide) {
			this.setState(state => ({
				...state,
				isMyTurn: true
			}));
		}
	}

	onMyTurn = (changeSide: boolean, allDead: boolean, index: number) => {

		if (allDead) {
			this.setState(state => ({
				...state,
				myWin: true,
				gameOver: true
			}), () => {
				Socket.emit('shot', this.props.enemyId, index);
			})
		} else if (changeSide) {
			this.setState(state => ({
				...state,
				isMyTurn: false
			}), () => {
				Socket.emit('shot', this.props.enemyId, index);
			});
		} else {
			Socket.emit('shot', this.props.enemyId, index);
		}


	}

	render() {

		const { isMyTurn, gameOver, myWin } = this.state;

		return (
			<div className={clsx(styles.wrapper, isMyTurn ? styles.secondColActive : styles.firstColActive)}>

				<div className={styles.firstColumn}>
					<Field
						ref={this.myfield}
						onTurn={this.onEnemyTurn}
						disabled={isMyTurn}
						status={gameOver && <div style={{fontSize: '8cqmin', display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center', gap: '8cqmin'}}>
							{myWin ? (
								<div>Вы выиграли!</div>
							) : (
								<div>Вы проиграли :(</div>
							)}
							<Button onClick={() => Router.goBack()}>Играть ещё?</Button>
						</div>}
					/>

				</div>

				<div className={styles.lastColumn}>

					
					<Field
						ref={this.enemyfield}
						gameOver={gameOver}
						enemy={true}
						onTurn={this.onMyTurn}
						disabled={!isMyTurn}
					/>

				</div>
			</div>
		);
	}
}

export default Battle;