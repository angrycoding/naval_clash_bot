import React from 'react';
import Field from './components/Field/Field';
import { DataConnection, Peer } from "peerjs";
import share from './utils/share';

import { io as SocketIO } from 'socket.io-client';
import Home from './components/Home/Home';
import PlaceShips from './components/PlaceShips/PlaceShips';
import Router from './components/Router/Router';
import theme from './index.module.scss';
import Battle from './components/Battle/Battle';


const socketIO = SocketIO('http://localhost:3001', {
	autoConnect: false
});



// const search = new URLSearchParams(window.location.search);

// @ts-ignore
const isInTelegram = Boolean(typeof window?.Telegram?.WebApp?.initDataUnsafe?.user === 'object')



try {
	// @ts-ignore
	window?.Telegram?.WebApp?.requestWriteAccess?.();
} catch (e) {}

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
			<line x1="0" y="0" x2="0" y2="${cellSize}" stroke="${theme.gridColor}" stroke-width="1" />
			<line x1="0" y="0" x2="${cellSize}" y2="0" stroke="${theme.gridColor}" stroke-width="1" />
		</pattern>
	</defs>
	<rect width="100%" height="100%" fill="url(#pattern_KJHz)" />
</svg>`



class App extends React.Component<{}, State> {

	state: State = {
		isConnected: false,
		view: 'users'
	}

	sendHandShake = () => {
		socketIO.emit('handshake', "I AM USER BLABLA")
	}

	updateConnectionState = () => {
		this.setState({ isConnected: socketIO.connected })
	}

	onUpdateUserList = (userList: any) => {
		console.info('userList', userList);
	}

	componentDidMount = async() => {
		socketIO.on('connect', this.updateConnectionState);
		socketIO.on('disconnect', this.updateConnectionState);
		socketIO.on('connect', this.sendHandShake);
		socketIO.on('userlist', this.onUpdateUserList);
	}

	componentWillUnmount = () => {
		socketIO.removeAllListeners();
		socketIO.disconnect();
	}

	render() {

		return (
			<Router style={{
				backgroundColor: 'white',
				backgroundPosition: 'center',
				backgroundImage: `url("data:image/svg+xml;base64,${window.btoa(svg)}")`
				}}>
				

				<Router.Route path="/" component={Home} />
				<Router.Route path="/placeShips" component={PlaceShips} />
				<Router.Route path="/battle" component={Battle} />
			</Router> 
		)


		// const { isConnected, view } = this.state;


		// if (1) return <PlaceShips />

		// // if (view === 'users') {
		// // 	return <UserList />
		// // }



		// // при выстреле по вражескому полю, играем все звуки и визуализируем все это дело
		// // и одновременно с этим отправляем на сервер наш выстрел

		// return <div style={{position: 'fixed', top: 20, left: 20, right: 20, bottom: 20, display: 'flex', gap: 20, flexDirection: 'column'}}>

		// 	<Field />

		// 	<Field enemy={true} />


		// </div>
	}
}

export default App;