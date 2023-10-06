import { useState } from "react";
import GameState from "../../types/GameState";
import getTempUserId from "../../utils/getTempUserId";
import Counter from "../Counter/Counter";
import Field from "../Field/Field";
import Layout from "../Layout/Layout";
import socketIO from "../../utils/Socket";
import Modal from "../Modal/Modal";
import Button from "../Button/Button";

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
						{winner ? 'Вы выиграли!' : 'Вы проиграли :('}
					</div>
					
					
					<Counter
						ms={watchDog}
						onRender={s => <>

							<Button disabled={disabled} onClick={onReadyToReplay}>
								{
									disabled ?
									<>ЖДЕМ {enemyName} {s}</> :
									<>играть еще c {enemyName} {s}</>
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