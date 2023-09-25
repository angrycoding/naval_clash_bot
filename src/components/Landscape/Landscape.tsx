import React from 'react';
import styles from './Landscape.module.scss';

interface Props {
	children?: any;
}

interface State {
	isLandscape: boolean;
}

const isLandscape = (): boolean => {
	return (
		window.matchMedia("(orientation: landscape)").matches
	);
}

class Landscape extends React.Component<Props, State> {

	state: State = {
		isLandscape: isLandscape()
	}

	componentDidMount() {
		window.addEventListener('resize', this.orientationChange);
		document.addEventListener("orientationchange", this.orientationChange);
		if (window.screen.orientation) {
			window.screen.orientation.addEventListener('change', this.orientationChange);
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.orientationChange);
		document.removeEventListener("orientationchange", this.orientationChange);
		if (window.screen.orientation) {
			window.screen.orientation.removeEventListener('change', this.orientationChange);
		}
	}

	orientationChange = () => {
		this.setState({ isLandscape: isLandscape() });
	}

	render() {
		return <>
			{this.state.isLandscape && <div className={styles.overlay}>
				<img alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" />
				<div>
					<div className={styles.header}>Пожалуйста поверните телефон!</div>
					Данное приложение предназначено для работы только в <b>портретном режиме</b> отображения,{' '}
					пожалуйста переверните ваш телефон вертикально.
				</div>
			</div>}
			{this.props.children}
		</>;
	}
}

export default Landscape;