import React from 'react';
import Field from './components/Field/Field';
import { Peer } from "peerjs";

const search = new URLSearchParams(window.location.search);
const peer = new Peer(search.get('me') || '');



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
		return <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 50}}>

			<Field enemy={true} />

			<Field />

		</div>
	}
}

export default App;