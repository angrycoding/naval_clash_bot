import { useEffect } from 'react';
import styles from './Battle.module.scss';
import Field from '../../components/Field/Field';
import socketIO from '../../utils/Socket';
import { getTempUserId } from '../../utils/tempUserId';
import GameState, { GameStatus } from '../../../../shared/GameState';
import { isFresh, makeShot } from '../../../../shared/mapUtils';
import Layout from '../../components/Layout/Layout';
import theme from '../../index.module.scss';
import Counter from '../../components/Counter/Counter';
import { setGameState, useGameState } from '../../utils/useGameState';
import Settings from '../../../../shared/Settings';
import ShotResult from '../../../../shared/ShotResult';
import { playSound } from '../../utils/playSound';
import getRandomInt from '../../../../shared/getRandomInt';

import miss from './miss.mp3';
import hit1 from './hit1.mp3';
import hit2 from './hit2.mp3';
import hit3 from './hit3.mp3';
import hit4 from './hit4.mp3';


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
		const shotResult = makeShot(myMap, index);
		if (shotResult === ShotResult.HIT_SEA) {
			playSound(miss);
			setGameState({ whosTurn: myUserId })
		} else if (shotResult === ShotResult.GAME_OVER) {
			playSound(hit1);
			setWaitingForReplay(gameState);
		} else if ([ShotResult.HIT_SHIP, ShotResult.KILL_SHIP].includes(shotResult)) {
			playSound([hit2, hit3, hit4][getRandomInt(0, 2)]);
			setWaitingForNextTurn(gameState);
		}

	}

	const onMyShot = (index: number) => {
		const shotResult = makeShot(enemyMap, index);
		socketIO.emit('shot', myUserId, enemyUserId, index);
		if (shotResult === ShotResult.HIT_SEA) {
			playSound(miss);
			setGameState({ whosTurn: enemyUserId })
		} else if (shotResult === ShotResult.GAME_OVER) {
			playSound(hit1);
			setWaitingForReplay(gameState);
		} else if ([ShotResult.HIT_SHIP, ShotResult.KILL_SHIP].includes(shotResult)) {
			playSound([hit2, hit3, hit4][getRandomInt(0, 2)]);
			setWaitingForNextTurn(gameState);
		}
	}

	useEffect(() => {
		socketIO.on('shot', onEnemyShot);
		return () => { socketIO.off('shot', onEnemyShot); }
	});

	return <Layout field1={
		<Field map={{...myMap}} background={isMyTurn ? theme.redBg : undefined}>
			
			{!isMyTurn && (

				<Counter onRender={secondsLeft => {

					if (secondsLeft <= Settings.waitForShotShowS) {
						return <div className={styles.timer}>
							{secondsLeft}
						</div>
					}


				}} />

			)}


		</Field>
	} field2={
		<Field
			reverseLegend={true}
			hideAliveShips={true}
			map={{...enemyMap}}
			onHit={isMyTurn ? onMyShot : undefined}
			background={isMyTurn ? undefined : theme.redBg}>
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
		</Field>
	} />

}


export default Battle;