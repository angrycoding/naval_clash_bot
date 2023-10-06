import { useState } from "react";
import GameState from "../../types/GameState";
import getTempUserId from "../../utils/getTempUserId";
import Counter from "../Counter/Counter";
import Field from "../Field/Field";
import Layout from "../Layout/Layout";
import socketIO from "../../utils/Socket";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import i18n from "../../utils/i18n";

const myUserId = getTempUserId();

const Replay = (props: { gameState: GameState }) => {

	const { users, watchDog, whosTurn } = props.gameState;
	const [ disabled, setDisabled ] = useState(Boolean(users[myUserId].replay));
	const winner = (whosTurn === myUserId);
	const enemyUserId = Object.keys(users).find(k => k !== myUserId) || '';
	const enemyName = users[enemyUserId].userName || '';

	const onReadyToReplay = () => {
		setDisabled(true);
		socketIO.emit('readyToReplay');
	}


	return <Layout field1={
		<Field
			map={users[myUserId].map}
			background={undefined}
			status={<Modal>

				<div style={{display: 'flex', flexDirection: 'column', gap: 32}}>
				
					<div style={{fontSize: '8cqmin'}}>
						{winner ? i18n('YOU_WIN') : i18n('YOU_LOSE')}
					</div>
					
					
					<Counter
						ms={watchDog}
						onRender={s => <>

							<Button disabled={disabled} onClick={onReadyToReplay}>
								{
									disabled ?
									i18n('WAITING_FOR_PLAYER', enemyName, s) :
									i18n('PLAY_AGAIN_WITH', enemyName, s)
								}
								
							</Button>

						</>}
					/>

				</div>



			</Modal>}
		/>
	} field2={
		<Field
			reverseLegend={true}
			hideAliveShips={false}
			map={users[enemyUserId].map}
		/>
	} />
}

export default Replay;