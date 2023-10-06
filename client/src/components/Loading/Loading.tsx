import { useEffect, useState } from 'react';
import { generateMap } from '../../utils/mapUtils';
import Field from '../Field/Field';
import Layout from '../Layout/Layout';
import styles from './Loading.module.scss';
import i18n from '../../utils/i18n';


const Loading = () => {

	const [ randomMap1, setRandomMap1 ] = useState(generateMap());
	const [ randomMap2, setRandomMap2 ] = useState(generateMap());
	
	useEffect(() => {

		const intervalRef = setInterval(() => {
			setRandomMap1(generateMap())
			setRandomMap2(generateMap())
		}, 250)


		return () => clearInterval(intervalRef);

	}, [])
	
	return (
		<div className={styles.wrapper}>
			<Layout field1={
				<Field map={randomMap1} />
			} field2={
				<Field map={randomMap2} />
			} />
			<div>
				{i18n('LOADING')}
				<div>{i18n('PLEASE_WAIT')}</div>
			</div>
		</div>
	);

}

export default Loading;