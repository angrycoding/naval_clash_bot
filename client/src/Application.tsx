import useGameState from "./hooks/useGameState";
import { GameStatus } from "./types/GameState";
import PlaceShips from "./components/PlaceShips/PlaceShips";
import Battle from "./components/Battle/Battle";
import Loading from "./components/Loading/Loading";
import Replay from "./components/Replay/Replay";


const Application = () => {
	
	const gameState = useGameState();
	
	if (gameState === 0) {
		return <Loading />;
	}

	if (gameState === undefined) {
		return <PlaceShips />;
	}

	if (gameState.status === GameStatus.ACTIVE) {
		return <Battle gameState={gameState} />
	}

	if (gameState.status === GameStatus.WAITING_FOR_REPLAY) {
		return <Replay gameState={gameState} />
	}


	if (gameState.status === GameStatus.WAITING_FOR_PLAY) {
		return <PlaceShips gameState={gameState} />;
	}

	return <div>ИГРА БЫЛА ЗАКОНЧЕНА ИЛИ УДАЛЕНА</div>


	
}

export default Application;