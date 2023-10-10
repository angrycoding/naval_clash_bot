import { useEffect } from 'react';
import styles from './Battle.module.scss';
import Field from '../Field/Field';
import socketIO from '../../utils/Socket';
import { getTempUserId } from '../../utils/tempUserId';
import GameState, { GameStatus } from '../../types/GameState';
import { fillBorders, getShipId, isFresh, isGameOver, isHitShip, isShip } from '../../utils/mapUtils';
import Layout from '../Layout/Layout';
import theme from '../../index.module.scss';
import Counter from '../Counter/Counter';
import { setGameState, useGameState } from '../../utils/useGameState';
import Settings from '../../Settings';

const setWaitingForReplay = (gameState: GameState) => {
	gameState.watchDog = Date.now() + (Settings.waitForReplayS * 1000);
	gameState.status = GameStatus.WAITING_FOR_REPLAY;
	setGameState(gameState);
}

const setWaitingForNextTurn = (gameState: GameState) => {
	gameState.watchDog = Date.now() + (Settings.waitForShotS * 1000);
	setGameState(gameState);
}

const Battle = () => {

	const myUserId = getTempUserId();
	const gameState = useGameState();
	const { users } = gameState;
	const enemyUserId = Object.keys(users).find(k => k !== myUserId) || '';
	const enemyName = users[enemyUserId].userName || '';
	const freshMap = isFresh(users[enemyUserId].map);
	const isMyTurn = (gameState.whosTurn === myUserId);
	const myMap = users[myUserId].map;
	const enemyMap = users[enemyUserId].map;

	const onEnemyShot = (fromUserId: string, index: number) => {
		
		if (isMyTurn || fromUserId !== enemyUserId) return;

		const entity = myMap[index];
		
		if (!entity) {
			myMap[index] = entity | 2;
			gameState.whosTurn = myUserId;
			fillBorders(myMap);
		} else if (isShip(entity) && !isHitShip(entity)) {
			myMap[index] = getShipId(entity) << 2 | 1;
			fillBorders(myMap);
		}

		if (isGameOver(myMap)) {
			setWaitingForReplay(gameState);
		} else {
			setWaitingForNextTurn(gameState);
		}



	}

	const onMyShot = (index: number) => {

		const entity = enemyMap[index];
		
		if (!entity) {
			socketIO.emit('shot', myUserId, enemyUserId, index);
			enemyMap[index] = entity | 2;
			gameState.whosTurn = enemyUserId;
			fillBorders(enemyMap);
		} else if (isShip(entity) && !isHitShip(entity)) {
			socketIO.emit('shot', myUserId, enemyUserId, index);
			enemyMap[index] = getShipId(entity) << 2 | 1;
			fillBorders(enemyMap);
		}
		
		if (isGameOver(enemyMap)) {
			setWaitingForReplay(gameState);
		} else {
			setWaitingForNextTurn(gameState);
		}
		
	}

	useEffect(() => {
		socketIO.on('shot', onEnemyShot);
		return () => { socketIO.off('shot', onEnemyShot); }
	});

	return <Layout field1={
		<Field
			map={{...myMap}}
			background={isMyTurn ? theme.redBg : undefined}
			status={<>

				
				{!isMyTurn && (

					<Counter onRender={secondsLeft => {

						if (secondsLeft <= Settings.waitForShotShowS) {
							return <div className={styles.timer}>
								{secondsLeft}
							</div>
						}


					}} />

				)}


			</>}
		/>
	} field2={
		<Field
			reverseLegend={true}
			hideAliveShips={true}
			map={{...enemyMap}}
			onHit={isMyTurn ? onMyShot : undefined}
			background={isMyTurn ? undefined : theme.redBg}

			status={
				<Counter onRender={secondsLeft => {



					if (isMyTurn && secondsLeft <= Settings.waitForShotShowS) {
						return <div className={styles.timer}>
							{secondsLeft}
						</div>
					}

					if (freshMap) {
						return <div className={styles.enemyName}>
							{enemyName}
						</div>
					}
					
				}} />
			}
				
			
		/>
	} />

}


export default Battle;