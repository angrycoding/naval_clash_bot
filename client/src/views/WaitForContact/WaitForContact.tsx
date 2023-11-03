import { useEffect } from "react";
import socketIO from "../../utils/Socket";
import { setGameState } from "../../utils/useGameState";
import GameState from "../../../../shared/GameState";
import Settings from "../../../../shared/Settings";
import inviteId from "../../utils/inviteId";
import Layout from "../../components/Layout/Layout";
import Banner from "../../components/Banner/Banner";
import styles from './WaitForContact.module.scss';
import i18n from "../../utils/i18n";
import ThreeDots from "../../components/ThreeDots/ThreeDots";
import { getTempUserId } from "../../utils/tempUserId";
import DemoField from "../../components/DemoField/DemoField";

const WaitForContact = () => {

	const myUserId = getTempUserId();

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
		socketIO.emit('inviteRequest', myUserId, inviteId);
		socketIO.on('inviteResponse', onInviteResponse);
		return () => { socketIO.off('inviteResponse', onInviteResponse); }
	}, [])

	return <Layout field1={
		<Banner kind={Banner.Kind.SAILOR} />
	} field2={
		<DemoField reverseLegend={true}>
			<ThreeDots className={styles.text}>
				{i18n('LOADING')}
			</ThreeDots>
		</DemoField>
	} />

}

export default WaitForContact;