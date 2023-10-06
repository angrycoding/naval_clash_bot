import { useEffect, useState } from 'react';
import styles from './Battle.module.scss';
import Field from '../Field/Field';
import socketIO from '../../utils/Socket';
import getTempUserId from '../../utils/getTempUserId';
import GameState from '../../types/GameState';
import { Map, fillBorders, getShipId, isFresh, isHitShip, isShip } from '../../utils/mapUtils';
import Layout from '../Layout/Layout';
import theme from '../../index.module.scss';
import Counter from '../Counter/Counter';

const myUserId = getTempUserId();

const SHOW_TIMER = 10;

const Battle = (props: { gameState: GameState }) => {

	const { gameState } = props;
	const { users, watchDog } = gameState;
	const enemyUserId = Object.keys(users).find(k => k !== myUserId) || '';
	const enemyName = users[enemyUserId].userName || '';
	const freshMap = isFresh(users[enemyUserId].map);

	const enemyMap = users[enemyUserId].map;

	const [ enemyMapOverlay, setEnemyMapOverlay ] = useState<Map>({});

	const [ whosTurn, setWhosTurn ] = useState(gameState.whosTurn);
	useEffect(() => setWhosTurn(gameState.whosTurn), [gameState.whosTurn]);


	const onHit = (index: number) => {

		socketIO.emit('shot', index);

		const map: Map = {
			...enemyMap,
			...enemyMapOverlay
		}

		const entity = map[index];

		if (!entity) {
			map[index] = entity | 2;
			setWhosTurn(enemyUserId);
		}

		else if (isShip(entity) && !isHitShip(entity)) {
			map[index] = getShipId(entity) << 2 | 1;
		}

		fillBorders(map);
		setEnemyMapOverlay(map);
	}

	const isMyTurn = (whosTurn === myUserId);

	return <Layout field1={
		<Field
			map={users[myUserId].map}
			background={isMyTurn ? theme.redBg : undefined}
			status={<>

				
				{!isMyTurn && (

					<Counter ms={watchDog} onRender={secondsLeft => {

						if (secondsLeft <= SHOW_TIMER) {
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
			
			map={{
				...enemyMap,
				...enemyMapOverlay
			}}

			onHit={isMyTurn ? onHit : undefined}
			background={isMyTurn ? undefined : theme.redBg}

			status={
				<Counter ms={watchDog} onRender={secondsLeft => {



					if (isMyTurn && secondsLeft <= SHOW_TIMER) {
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