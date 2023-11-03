import { useEffect, useState } from "react";
import Modal from "../Modal/Modal";
import Field from "../Field/Field";
import { generateMap, makeRandomShot } from "../../../../shared/mapUtils";
import ShotResult from "../../../../shared/ShotResult";


const DemoField = (props: { reverseLegend?: boolean, children?: any }) => {

	let [ map, setMap ] = useState(generateMap());

	const makeNextShot = () => {
		const r = makeRandomShot(map);
		if (r === ShotResult.GAME_OVER) {
			setMap(map = generateMap());
			makeRandomShot(map);
			setMap({...map})
		} else {
			setMap({...map});
		}
		setTimeout(makeNextShot, 1000);
	}

	useEffect(() => {

		makeNextShot();

		return () => {
			// clearInterval(x);
		}
	}, [])

	return <Field map={map} reverseLegend={props.reverseLegend}>
		<Modal>
			{props.children}
		</Modal>
	</Field>

}

export default DemoField;