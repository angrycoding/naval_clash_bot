import React from 'react';
import Field from '../Field/Field';
import styles from './Battle.module.scss';
import ThreeDots from '../ThreeDots/ThreeDots';
import Border from '../Border/Border';
import Socket from '../../utils/Socket';
import index2xy from '../../utils/index2xy';
import Map from '../../types/Map';


interface State {
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

	onEnemyHit = (index: number) => {
		if (this.state.isMyTurn) return;
		console.info('onEnemyHit', index2xy(index));
		this.myfield.current?.makeShot(index);
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
			console.info("MY LOOSE");
		}

		else if (changeSide) {
			this.setState({ isMyTurn: true });
		}
	}

	onMyTurn = (changeSide: boolean, allDead: boolean, index: number) => {

		Socket.emit('shot', this.props.enemyId, index);

		if (allDead) {
			console.info('MY WON')
		}

		else if (changeSide) {
			this.setState({ isMyTurn: false });
		}
	}

	render() {

		const { isMyTurn } = this.state;

		return (
			<div className={styles.outerWrapper}>
				<div className={styles.fields}>

					<div className={styles.wrapper}>
					
						<div className={styles.col}>
							<Field
								ref={this.myfield}
								onTurn={this.onEnemyTurn}
								status={
									
									isMyTurn ? (
										<Border>
											<div style={{padding: 20}}>
												<ThreeDots>
													ВАШ ХОД
												</ThreeDots>
											</div>
										</Border>
									)

									: undefined

								}
							/>
						</div>
						<div className={styles.col}>
							<Field
								ref={this.enemyfield}
								enemy={true}
								onTurn={this.onMyTurn}
								status={

									!isMyTurn ? (
										<Border>
											<div style={{padding: 20}}>
												<ThreeDots>
													ХОД ПРОТИВНИКА
												</ThreeDots>
											</div>
										</Border>
									)

									: undefined

								}
							/>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Battle;