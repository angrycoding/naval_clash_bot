import { useEffect, useState } from "react";
import socketIO from "../../utils/Socket";
import { setGameState } from "../../utils/useGameState";
import GameState from "../../types/GameState";
import Settings from "../../Settings";
import inviteId from "../../utils/inviteId";
import Layout from "../Layout/Layout";
import Banner from "../Banner/Banner";
import Field from "../Field/Field";
import { Map, generateMap } from "../../utils/mapUtils";
import Modal from "../Modal/Modal";
import styles from './WaitForContact.module.scss';
import i18n from "../../utils/i18n";
import ThreeDots from "../ThreeDots/ThreeDots";
import { getTempUserId } from "../../utils/tempUserId";

const WaitForContact = () => {

	const myUserId = getTempUserId();
	const [ randomMap, setRandomMap ] = useState<Map>(generateMap);

	const onInviteResponse = (gameState: GameState) => {

		do {
			if (gameState.replayId !== inviteId) break;
			const userIds = Object.keys(gameState.users);
			const myId = userIds.find(u => u === myUserId);
			const enemyId = userIds.find(u => u !== myUserId);
			if (!myId || !enemyId || myId === enemyId) break;
			return setGameState({
				...gameState,
				watchDog: Date.now() + (Settings.waitForPlayP2PS * 1000)
			});
		} while (0);

		socketIO.emit('inviteRequest', myUserId, inviteId);
		
	}

	useEffect(() => {
		const interval = setInterval(() => setRandomMap(generateMap()), 1000);
		socketIO.emit('inviteRequest', myUserId, inviteId);
		socketIO.on('inviteResponse', onInviteResponse);
		return () => {
			clearInterval(interval);
			socketIO.off('inviteResponse', onInviteResponse);
		}
	}, [])

	return <Layout field1={
		<Banner kind={Banner.Kind.SAILOR} />
	} field2={
		<Field map={randomMap} reverseLegend={true} status={<Modal>
			<ThreeDots className={styles.text}>
				{i18n('LOADING')}
			</ThreeDots>
		</Modal>} />
	} />

}

export default WaitForContact;