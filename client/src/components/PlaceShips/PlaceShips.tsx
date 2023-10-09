import Button from '../Button/Button';
import Field from '../Field/Field';
import ThreeDots from '../ThreeDots/ThreeDots';
import { useEffect, useState } from 'react';
import { Map, generateMap } from '../../utils/mapUtils';
import socketIO from '../../utils/Socket';
import Layout from '../Layout/Layout';
import Modal from '../Modal/Modal';
import GameState from '../../types/GameState';
import Counter from '../Counter/Counter';
import { getTempUserId } from '../../utils/tempUserId';
import i18n from '../../utils/i18n';
import { setGameState, useGameState } from '../../utils/useGameState';
import Settings from '../../Settings';
import formatTime from '../../utils/formatTime';
import styles from './PlaceShips.module.scss'
import TelegramApi from '../../utils/TelegramApi';


const PlaceShips = () => {

	const myUserId = getTempUserId();
	const gameState = useGameState();
	const [ myRandomMap, setMyRandomMap ] = useState<Map>(generateMap);
	const [ enemyRandomMap, setEnemyRandomMap ] = useState<Map>(generateMap);

	const users = (gameState.users || {});
	const enemyUserId = Object.keys(users).find(k => k !== myUserId) || '';
	const enemyName = users[enemyUserId]?.userName || '';
	const iConfirm = Boolean(users[myUserId]?.confirm);
	const iWin = (gameState.whosTurn === myUserId);

	TelegramApi.showHideBackButton(Boolean(enemyUserId));

	useEffect(() => {
		if (!iConfirm) return;
		const interval = setInterval(() => setEnemyRandomMap(generateMap()), 1000);
		return () => clearInterval(interval);
	}, [gameState]);

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
			myRandomMap,
			myUserId,
			gameState.replayId || '',
			enemyUserId || '',
			(iWin ? myUserId : enemyUserId) || ''
		);

	}

	const startGameResponse = (gameState: GameState) => {
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
			<Field map={myRandomMap} status={<Modal></Modal>} />
		} field2={
			<Field map={enemyRandomMap} reverseLegend={true} status={<Modal>
				<div className={styles.text}>
					<ThreeDots>{i18n('WAITING_ENEMY')}</ThreeDots>
				</div>
			</Modal>} />
		} />
	}

	// waiting for specific user to join
	if (iConfirm && enemyUserId) {
		return <Layout field1={
			<Field map={myRandomMap} status={<Modal></Modal>} />
		} field2={
			<Field map={enemyRandomMap} reverseLegend={true} status={<Modal>
				<div className={styles.text}>
					<div>{i18n('WAITING_ENEMY')}</div>
					{enemyName && <div>{enemyName}</div>}
					<Counter onRender={s => <ThreeDots>{formatTime(s)}</ThreeDots>} />
				</div>
			</Modal>} />
		} />
	}

	return <Layout field1={
		<Field map={myRandomMap} />
	} field2={
		<Field map={{}} reverseLegend={true} status={<Modal>
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


		</Modal>} />
	} />

}

export default PlaceShips;