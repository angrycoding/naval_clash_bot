import { useSecondsLeft } from "../../utils/useGameState";

const Counter = (props: { onRender: (seconds: number) => any }) => {
	const secondsLeft = useSecondsLeft()
	if (secondsLeft === Infinity) return '';
	if (secondsLeft <= 0) return '';
	return props.onRender(secondsLeft);
}

export default Counter;