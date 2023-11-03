import { GameStatus } from "../../shared/GameState";
import PlaceShips from "./views/PlaceShips/PlaceShips";
import Battle from "./views/Battle/Battle";
import Replay from "./views/Replay/Replay";
import GameOver from "./views/GameOver/GameOver";
import { useGameState } from "./utils/useGameState";
import WaitForContact from "./views/WaitForContact/WaitForContact";

const Application = () => {

	const gameState = useGameState();

	if (!gameState.watchDog) {
		return <GameOver />
	}

	if (gameState.status === GameStatus.WAIT_FOR_CONTACT) {
		return <WaitForContact />
	}

	if (gameState.status === GameStatus.PLACESHIPS) {
		return <PlaceShips />;
	}

	if (gameState.status === GameStatus.ACTIVE) {
		return <Battle />
	}

	if (gameState.status === GameStatus.WAITING_FOR_REPLAY) {
		return <Replay />
	}


	return <GameOver />;
	
}

export default Application;