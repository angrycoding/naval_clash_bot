import React from 'react';
import Home from './components/Home/Home';
import PlaceShips from './components/PlaceShips/PlaceShips';
import Router from './components/Router/Router';
import theme from './index.module.scss';
import Battle from './components/Battle/Battle';



// @ts-ignore
const isInTelegram = Boolean(typeof window?.Telegram?.WebApp?.initDataUnsafe?.user === 'object')



// try {
// 	// @ts-ignore
// 	window?.Telegram?.WebApp?.requestWriteAccess?.();
// } catch (e) {}

try {
	// @ts-ignore
	window?.Telegram?.WebApp?.setHeaderColor('#517DA2');
} catch (e) {}

try {
	// @ts-ignore
	window?.Telegram?.WebApp?.enableClosingConfirmation();
} catch (e) {}

try {
	// @ts-ignore
	window?.Telegram?.WebApp?.expand();
} catch (e) {}


const showConfirm = (message: string) => new Promise<boolean>(resolve => {
	try {
		// @ts-ignore
		return window?.Telegram?.WebApp?.showConfirm(message, resolve);
	} catch (e) {}
	resolve(confirm(message));
});


interface State {
	isConnected: boolean;
	view: string;
}

const cellSize = 16;


const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
	<defs>
		<pattern id="pattern_KJHz" patternUnits="userSpaceOnUse" width="${cellSize}" height="${cellSize}" patternTransform="rotate(0)">
			<line x1="0" y="0" x2="0" y2="${cellSize}" stroke="${theme.smallGridColor}" stroke-width="1" />
			<line x1="0" y="0" x2="${cellSize}" y2="0" stroke="${theme.smallGridColor}" stroke-width="1" />
		</pattern>
	</defs>
	<rect width="100%" height="100%" fill="url(#pattern_KJHz)" />
</svg>`



class App extends React.Component<{}, State> {

	state: State = {
		isConnected: false,
		view: 'users'
	}

	render() {

		return (
			<Router style={{
				backgroundColor: 'white',
				backgroundPosition: 'center',
				backgroundImage: `url("data:image/svg+xml;base64,${window.btoa(svg)}")`
			}}>
				
				
				<Router.Route path="/" component={PlaceShips} />
				<Router.Route path="/placeShips" component={PlaceShips} />
				<Router.Route path="/battle" component={Battle} />
			</Router> 
		)
	}
}

export default App;