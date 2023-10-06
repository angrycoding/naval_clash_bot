import React, { useEffect, useState } from 'react';
import styles from './Battle.module.scss';
import Field from '../Field/Field';
import beep from './censor-beep-01.mp3'
import { playSound } from '../../utils/playSound';
import socketIO from '../../utils/Socket';
import getTempUserId from '../../utils/getTempUserId';
import GameState, { GameStatus } from '../../types/GameState';
import { Map, generateMap, isFresh } from '../../utils/mapUtils';


const myUserId = getTempUserId();


const Counter = (props: {
	ms: number,
	onRender: (seconds: number) => any,
	// onExpired: () => void
}) => {

	const getSecondsLeft = () => {
		return Math.max(Math.ceil( (props.ms - Date.now()) / 1000  ), 0)
	}

	let secondsLeft = getSecondsLeft();

	const forceUpdate = (() => {
		const setForceUpdate = useState<any>(String(Math.random()))[1];
		return () => setForceUpdate(String(Math.random()));
	})();

	const myIn = () => {

		const newSecondsLeft = getSecondsLeft();
		if (secondsLeft === newSecondsLeft) return;
		secondsLeft = newSecondsLeft;

		forceUpdate();
	}

	useEffect(() => {
		const intervalRef = setInterval(myIn, 500);
		return () => clearInterval(intervalRef);
	}, []);

	return props.onRender(secondsLeft);
};




const renderTurnTimeout = (seconds: number) => {
	if (seconds <= 5) playSound(beep);
	// if (this.state.offline) {
	// 	return <div style={{color: 'red', fontSize: '20cqmin'}}>OFFLINE {seconds}</div>;
	// }
	// if (seconds > TURN_TIMEOUT_CRITICAL_S) return;
	return <div style={{color: 'red', fontSize: '10cqmin'}}>{seconds}</div>;
}


class TimeCounter extends React.Component<{
	ms: number
}> {

	startTime: number = 0;
	startValue: number = 0;
	isAttached: boolean = false;

	constructor(props: {ms: number}, context: any) {
		super(props);
		this.context = context;
		// this.startValue = this.props.seconds;
		// this.startTime = this.context.updated;
	}

	componentDidMount() {
		this.isAttached = true;
		this.doUpdate();
	}

	componentWillUnmount() {
		this.isAttached = false;
	}

	doUpdate = () => {
		if (!this.isAttached) return;
		this.forceUpdate();
		setTimeout(this.doUpdate, 450);
	}

	render() {
		return Math.max(Math.ceil( (this.props.ms - Date.now()) / 1000  ), 0)
	}

}



const Battle = (props: { gameState: GameState }) => {

	const { gameState } = props;
	
	const [ generatedMap, setGeneratedMap ] = useState(generateMap);
	const { whosTurn, users, status, watchDog } = gameState;
	const isMyTurn = (whosTurn === myUserId);
	const enemyUserId = Object.keys(users).find(k => k !== myUserId) || '';

	const [ readyToReplay, setReadyToReplay ] = useState(Boolean(users[myUserId].replay));
	const [ readyToPlay, setReadyToPlay ] = useState(Boolean(Object.keys(users[myUserId].map).length));



	useEffect(() => {
		setReadyToPlay(false);
		setReadyToReplay(false);
	}, [status])


	const enemyName = users[enemyUserId].userName || '';


	const onReadyToReplay = () => {
		setReadyToReplay(true);
		socketIO.emit('readyToReplay');
	}

	const regenerateMap = () => {
		setGeneratedMap(generateMap())
	}

	const onReadyToPlay = () => {
		setReadyToPlay(true);
		socketIO.emit('readyToPlay', generatedMap);
	}

	const freshMap = isFresh(users[enemyUserId].map);

	return <div className={styles.wrapper}>

			
		<div className={styles.firstColumn}>

			<Field


				map={
					status === GameStatus.WAITING_FOR_PLAY ? generatedMap : users[myUserId].map
				}

				background={
					status === GameStatus.WAITING_FOR_PLAY ? undefined :
					isMyTurn ? 'rgba(0, 0, 0, 0.1)' : undefined
				}


				status={<>
				
					{(status === GameStatus.ACTIVE && !isMyTurn) && (
						<div>
							До конца:{' '}
							<TimeCounter
								ms={watchDog}
								// onRender={renderTurnTimeout}
								// onExpired={onTurnTimerExpired}
							/>
						</div>
					)}

					{status === GameStatus.FINISHED && (
						<div>ИГРА ОКОНЧЕНА</div>
					)}

					{status === GameStatus.WAITING_FOR_REPLAY && <div style={{pointerEvents: 'all'}}>
						

						<Counter
							ms={watchDog}
							onRender={s => (
								<button disabled={readyToReplay} onClick={onReadyToReplay}>
									играть еще c {enemyName} {s}
								</button>
							)}
						/>

						{/* // <div style={{fontSize: '8cqmin', display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center', gap: '8cqmin'}}>
						// 	sfsadf
						// </div> */}
					</div>}

				</>}

				// status={<>

					
					
				// 	{status === GameStatus.WAITING_FOR_REPLAY && (
				// 		<div style={{fontSize: '8cqmin', display: 'flex', flexDirection: 'column', alignContent: 'center', alignItems: 'center', gap: '8cqmin'}}>


				// 			{isMyTurn ? (
				// 				<div>Вы выиграли!</div>
				// 			) : (
				// 				<div>Вы проиграли :(</div>
				// 			)}

				// 			{JSON.stringify({
				// 				me: users[myUserId].replay,
				// 				enemy: users[enemyUserId].replay
				// 			})}


				// 			<Counter
				// 				ms={watchDog}
				// 				onRender={s => (
				// 					<button disabled={readyToReplay} onClick={onReadyToReplay}>
				// 						играть еще {s}
				// 					</button>
				// 				)}
				// 				// onExpired={onTurnTimerExpired}
				// 			/>


				// 		</div>
				// 	)}

				// </>}


			/>
		</div>

		<div className={styles.lastColumn}>
			<Field

			
				reverseLegend={true}
				map={status === GameStatus.WAITING_FOR_PLAY ? {} : users[enemyUserId].map}
				hideAliveShips={status === GameStatus.ACTIVE}
				
				background={
					[GameStatus.WAITING_FOR_PLAY].includes(status) ? 'rgba(0, 255, 0, 0.2)' :
					isMyTurn ? undefined : 'rgba(255, 0, 0, 0.2)'
				}

				onHit={
					status === GameStatus.ACTIVE && isMyTurn ?
					index => socketIO.emit('shot', index) :
					undefined
				}

				status={<>
					
					{[GameStatus.WAITING_FOR_PLAY].includes(status) && (
						<div style={{pointerEvents: 'all'}}>
							
							<div>
								<button
									onClick={regenerateMap}
									disabled={readyToPlay}
									>
									ПОМЕНЯТЬ
								</button>
							</div>

							<div>
								<button
									onClick={onReadyToPlay}
									disabled={readyToPlay}
									>
									ГОТОВ
								</button>
							</div>

							<div>
								<Counter
									ms={watchDog}
									onRender={s => s}
								/>
							</div>
							
						</div>
					)}
				
					{(status === GameStatus.ACTIVE && freshMap) && (
						<div>ИМЯ ПРОТИВНИКА</div>
					)}

					{(status === GameStatus.ACTIVE && isMyTurn) && (
						<div>
							До конца:{' '}
							<TimeCounter
								ms={watchDog}
								// onRender={renderTurnTimeout}
								// onExpired={onTurnTimerExpired}
							/>
						</div>
					)}


				</>}


			/>
		</div>

	</div>

}


export default Battle;