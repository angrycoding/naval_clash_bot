import Button from '../../components/Button/Button';
import Field from '../../components/Field/Field';
import ThreeDots from '../../components/ThreeDots/ThreeDots';
import { useEffect, useState } from 'react';
import { convertNewMapToOld, convertOldMapToNew, generateMap } from '../../../../shared/mapUtils';
import socketIO from '../../utils/Socket';
import Layout from '../../components/Layout/Layout';
import Modal from '../../components/Modal/Modal';
import GameState from '../../../../shared/GameState';
import Counter from '../../components/Counter/Counter';
import { getTempUserId } from '../../utils/tempUserId';
import i18n from '../../utils/i18n';
import { setGameState, useGameState } from '../../utils/useGameState';
import Settings from '../../../../shared/Settings';
import formatTime from '../../utils/formatTime';
import styles from './PlaceShips.module.scss'
import Map from '../../../../shared/Map';
import DemoField from '../../components/DemoField/DemoField';



const PlaceShips = () => {

	const myUserId = getTempUserId();
	const gameState = useGameState();
	const [ myRandomMap, setMyRandomMap ] = useState<Map>(generateMap);

	const users = (gameState.users || {});
	const enemyUserId = Object.keys(users).find(k => k !== myUserId) || '';
	const enemyName = users[enemyUserId]?.userName || '';
	const iConfirm = Boolean(users[myUserId]?.confirm);
	const iWin = (gameState.whosTurn === myUserId);

	const onGenerate = () => {
		setMyRandomMap(generateMap());
	}

	const startGameRequest = () => {


		setGameState({
			...gameState,
			watchDog: (enemyUserId ? gameState.watchDog : Infinity),
			users: {
				...gameState.users,
				[myUserId]: {
					...gameState.users[myUserId],
					confirm: true
				}
			}
		});

		socketIO.emit(
			'startGameRequest',
			convertNewMapToOld( myRandomMap ),
			myUserId,
			gameState.replayId || '',
			enemyUserId || '',
			(iWin ? myUserId : enemyUserId) || ''
		);

	}

	const startGameResponse = (gameState: GameState) => {

		for (const x in gameState.users) {
			const user = gameState.users[x];
			user.map = convertOldMapToNew(user.map);
		}

		setGameState({
			...gameState,
			watchDog: Date.now() + (Settings.waitForShotS * 1000)
		});
	}

	useEffect(() => {
		socketIO.on('startGameResponse', startGameResponse);
		return () => { socketIO.off('startGameResponse', startGameResponse) }
	}, []);

	// waiting for random user to join
	if (iConfirm && !enemyUserId) {
		return <Layout field1={
			<Field map={myRandomMap}><Modal></Modal></Field>
		} field2={
			
			<DemoField reverseLegend={true}>
				<div className={styles.text}>
					<ThreeDots>{i18n('WAITING_ENEMY')}</ThreeDots>
				</div>
			</DemoField>

		} />
	}

	// waiting for specific user to join
	if (iConfirm && enemyUserId) {
		return <Layout field1={
			<Field map={myRandomMap}><Modal></Modal></Field>
		} field2={
			<DemoField reverseLegend={true}>
				<div className={styles.text}>
					<div>{i18n('WAITING_ENEMY')}</div>
					{enemyName && <div>{enemyName}</div>}
					<Counter onRender={s => <ThreeDots>{formatTime(s)}</ThreeDots>} />
				</div>
			</DemoField>
		} />
	}

	return <Layout field1={
		<Field map={myRandomMap} />
	} field2={
		<DemoField reverseLegend={true}>
			<div className={styles.textWithButtons}>
				<div>
					{enemyUserId ? <>
						<div>{i18n('GAME_WITH')}:</div>
						<div>{enemyName}</div>
					</> : i18n('WITH_RANDOM_ENEMY')}
				</div>
				
				<div>
					<div>
						<Button onClick={startGameRequest} showTime={true}>
							{i18n('READY_TO_PLAY')}
						</Button>
					</div>
					<div>
						<Button onClick={onGenerate}>
							{i18n('CHANGE_LAYOUT')}
						</Button>
					</div>
				</div>
			</div>


		</DemoField>
	} />

}

export default PlaceShips;