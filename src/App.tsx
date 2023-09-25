import React from 'react';
import Field from './components/Field/Field';
import { Peer } from "peerjs";

const search = new URLSearchParams(window.location.search);
const peer = new Peer(search.get('me') || '');


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



class App extends React.Component {


	onMessage = (data: any) => {

		console.info('RECEIVED', data)
		
	}

	componentDidMount(): void {




		/*
		
		// @ts-ignore
		window.sendTo = (peerId: string, message: any) => {
			const conn = peer.connect(peerId);
			// conn.on('open', () => {
				// console.info('CONNECTED!')
				conn.send(message)
			// })
		}

		peer.on('open', function(id) {
			console.log('My peer ID is: ' + id);
			// 
			// conn.on("open", () => {
			// 	console.info('OPENED1')
	
			// 	// @ts-ignore
			// 	window.foo = (x: any) => {
			// 	// 	console.info(conn);
			// 		conn.send(x);
			// 	}
	
	
	
		
			// })
			// conn.on('data', (data: any) => {
			// 	console.info('RECEIVED', data)
			// })
		});

		peer.on('connection', (connection) => {
			connection.on('data', this.onMessage)
		})
		
		
		



		// });
		*/
	}

	render() {
		return <div style={{position: 'fixed', top: 20, left: 20, right: 20, bottom: 20, display: 'flex', gap: 20, flexDirection: 'column'}}>

			<Field />

			<Field enemy={true} />


		</div>
	}
}

export default App;