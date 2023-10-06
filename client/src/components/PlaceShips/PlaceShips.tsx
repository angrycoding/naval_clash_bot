import styles from '../Battle/Battle.module.scss';
import clsx from 'clsx';
import Button from '../Button/Button';
import Field from '../Field/Field';
import ThreeDots from '../ThreeDots/ThreeDots';
import { useState } from 'react';
import { Map, generateMap, isFresh } from '../../utils/mapUtils';
import socketIO from '../../utils/Socket';
import Layout from '../Layout/Layout';
import Modal from '../Modal/Modal';
import GameState from '../../types/GameState';
import Counter from '../Counter/Counter';
import getTempUserId from '../../utils/getTempUserId';

const myUserId = getTempUserId();


const PlaceShips = (props: { gameState?: GameState }) => {

	const { gameState } = props;
	const users = (gameState?.users || {});

	const [ randomMap, setRandomMap ] = useState<Map>(generateMap);
	const [ disabled, setDisabled ] = useState(Boolean(Object.keys(users?.[myUserId]?.map || {})?.length));
	

	
	const enemyUserId = Object.keys(users).find(k => k !== myUserId) || '';
	const enemyName = users?.[enemyUserId]?.userName || '';

	const onGenerate = () => {
		setRandomMap(generateMap());
	}

	const onReady = () => {
		setDisabled(true);
		socketIO.emit(gameState ? 'readyToPlay' : 'setMap', randomMap);
	}

	return <Layout field1={
		<Field map={randomMap} />
	} field2={
		<Field map={{}} status={

			<Modal>
				<Counter
					ms={gameState?.watchDog || 0}
					onRender={seconds => <div style={{
						display: 'flex', flexDirection: 'column',
						gap: '5cqh',
						justifyContent: 'space-between',
						alignContent: 'space-between',
						minWidth: '90%'}}>

						<div>

							{disabled ? (
								<Button disabled={disabled}>
									<ThreeDots>Ждём {enemyName || 'оппонента'}</ThreeDots>
								</Button>
							) : (
								<Button disabled={disabled} onClick={onReady}>
									ГОТОВ К ИГРЕ
								</Button>
							)}
						</div>
												
						<div>
							<Button onClick={onGenerate} disabled={disabled}>
								ПОМЕНЯТЬ {seconds || ''}
							</Button>
						</div>

					</div>}
				/>

			</Modal>

		} />
	} />
	


}

export default PlaceShips;