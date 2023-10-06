import { clearGameState } from "../../hooks/useGameState";
import i18n from "../../utils/i18n";
import Button from "../Button/Button";
import Field from "../Field/Field"
import Layout from "../Layout/Layout"
import styles from './GameOver.module.scss'

const GameOver = () => (
	<Layout field1={
		<Field
			map={{}}
			status={<div className={styles.banner} />}
		/>
	} field2={
		<Field
			map={{}}
			reverseLegend={true}
			hideAliveShips={true}
			status={<div className={styles.gameOver}>
				{i18n('GAME_OVER')}
				<Button onClick={clearGameState}>{i18n('PLAY_AGAIN')}</Button>
			</div>}
		/>
	} />
)

export default GameOver;