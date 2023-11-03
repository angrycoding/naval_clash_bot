import { useEffect } from "react";
import { GameStatus } from "../../../../shared/GameState";
import { getTempUserId } from "../../utils/tempUserId";
import Field from "../../components/Field/Field";
import Layout from "../../components/Layout/Layout";
import socketIO from "../../utils/Socket";
import Modal from "../../components/Modal/Modal";
import Button from "../../components/Button/Button";
import i18n from "../../utils/i18n";
import Settings from "../../../../shared/Settings";
import { setGameState, useGameState } from "../../utils/useGameState";
import styles from './Replay.module.scss';


const Replay = () => {

	const myUserId = getTempUserId();
	const gameState = useGameState();
	const { users, whosTurn, replayId } = gameState;
	const winner = (whosTurn === myUserId);
	const enemyUserId = Object.keys(users).find(k => k !== myUserId) || '';
	const enemyName = users[enemyUserId].userName || '';
	const iConfirm = Boolean(users[myUserId]?.confirm);

	const readyToReplayRequest = () => {
		setGameState({
			...gameState,
			users: {
				...gameState.users,
				[myUserId]: {
					...gameState.users[myUserId],
					confirm: true
				}
			}
		});
		socketIO.emit('readyToReplayRequest', replayId, myUserId, enemyUserId);
	}

	const onReadyToReplayResponse = (replayId: string, withUserId: string) => {
		if (replayId !== gameState.replayId || withUserId !== enemyUserId) return;
		gameState.watchDog = Date.now() + (Settings.waitForPlayS * 1000);
		gameState.users[myUserId].map = {};
		gameState.users[enemyUserId].map = {};
		gameState.status = GameStatus.PLACESHIPS;
		setGameState(gameState);
	}

	useEffect(() => {
		socketIO.on('readyToReplayResponse', onReadyToReplayResponse);
		return () => { socketIO.off('readyToReplayResponse', onReadyToReplayResponse); }
	}, [])


	return <Layout field1={
		<Field map={users[myUserId].map}>
			<Modal>
				<div className={styles.text}>
					<div>
						<div>{winner ? i18n('YOU_WIN') : i18n('YOU_LOSE')}</div>
						<div>{i18n('PLAY_MORE_WITH')}</div>
						<div>{enemyName}?</div>
					</div>
					<Button disabled={iConfirm} onClick={readyToReplayRequest} showTime={true}>
						{i18n('PLAY_ONE_MORE_TIME')}
					</Button>
				</div>
			</Modal>
		</Field>
	} field2={
		<Field
			reverseLegend={true}
			hideAliveShips={false}
			map={users[enemyUserId].map}
		/>
	} />
}

export default Replay;