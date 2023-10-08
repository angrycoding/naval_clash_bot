import { GameStatus } from "../../types/GameState";
import { getTempUserId, refreshTempUserId } from "../../utils/tempUserId";
import i18n from "../../utils/i18n";
import { setGameState, useGameState } from "../../utils/useGameState";
import Banner from "../Banner/Banner";
import Button from "../Button/Button";
import Field from "../Field/Field"
import Layout from "../Layout/Layout"
import styles from './GameOver.module.scss'


const PlayAgainButton = () => (
	<Button onClick={() => {
		refreshTempUserId();
		setGameState(undefined)
	}}>{i18n('PLAY_AGAIN')}</Button>

)

const GameOver = () => {

	const myUserId = getTempUserId();
	const gameState = useGameState();
	const users = (gameState.users || {});
	const isMyTurn = (gameState.whosTurn === myUserId);
	const iConfirm = Boolean(users[myUserId]?.confirm);

	if (gameState.status === GameStatus.ACTIVE) {
		return (
			<Layout field1={
				<Banner kind={Banner.Kind.SLOW} />
			} field2={
				<Field
					map={{}}
					reverseLegend={true}
					hideAliveShips={true}
					status={<div className={styles.textWithButtons}>
						<div>
							<div>{isMyTurn ? i18n('YOU_LOSE') : i18n('YOU_WIN')}</div>
							<div>{isMyTurn ? i18n('SLOW_ACTION_YOU') : i18n('SLOW_ACTION_ENEMY')}</div>
						</div>
						<PlayAgainButton />
					</div>}
				/>
			} />
		)
	}

	if (gameState.status === GameStatus.WAITING_FOR_REPLAY) {
		return (
			<Layout field1={
				<Banner kind={iConfirm ? Banner.Kind.SADFACE : Banner.Kind.SAILOR} />
			} field2={
				<Field
					map={{}}
					reverseLegend={true}
					hideAliveShips={true}
					status={<div className={styles.textWithButtons}>
						<div>
							<div>{i18n('GAME_OVER_TITLE')}</div>
							{iConfirm ? i18n('ENEMY_GONE') : ''}
						</div>
						<PlayAgainButton />
					</div>}
				/>
			} />
		)
	}

	if (gameState.status === GameStatus.PLACESHIPS) {
		return (
			<Layout field1={
				<Banner kind={iConfirm ? Banner.Kind.SADFACE : Banner.Kind.SLOW} />
			} field2={
				<Field
					map={{}}
					reverseLegend={true}
					hideAliveShips={true}
					status={<div className={styles.textWithButtons}>
						<div>
							<div>{i18n('GAME_OVER_TITLE')}</div>
							{iConfirm ? i18n('ENEMY_GONE') : i18n('SLOW_PLACING_SHIPS')}
						</div>
						<PlayAgainButton />
					</div>}
				/>
			} />
		);
	}

	return (
		<Layout field1={
			<Banner kind={Banner.Kind.SAILOR} />
		} field2={
			<Field
				map={{}}
				reverseLegend={true}
				hideAliveShips={true}
				status={<div className={styles.textWithButtons}>
					<div>
						<div>{i18n('GAME_OVER_TITLE')}</div>
					</div>
					<PlayAgainButton />
				</div>}
			/>
		} />
	);
}

export default GameOver;