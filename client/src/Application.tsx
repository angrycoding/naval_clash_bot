import { GameStatus } from "./types/GameState";
import PlaceShips from "./components/PlaceShips/PlaceShips";
import Battle from "./components/Battle/Battle";
import Replay from "./components/Replay/Replay";
import GameOver from "./components/GameOver/GameOver";
import { useGameState } from "./utils/useGameState";



const Application = () => {

	const gameState = useGameState();

	if (!gameState.watchDog) {
		return <GameOver />
	}

	if (gameState.status === GameStatus.PLACESHIPS) {
		return <PlaceShips />;
	}

	if (gameState.status === GameStatus.ACTIVE) {
		return <Battle gameState={gameState} />
	}

	if (gameState.status === GameStatus.WAITING_FOR_REPLAY) {
		return <Replay />
	}


	return <GameOver />;
	
}

export default Application;