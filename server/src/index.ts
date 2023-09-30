import { Server } from 'socket.io';

import ServerToClientEvents from '../../client/src/types/ServerToClientEvents';
import ClientToServerEvents from '../../client/src/types/ClientToServerEvents';
import Map from '../../client/src/types/Map';
import Settings from '../../client/src/Settings';


interface SocketData {
	map: Map;
	userId: string;
}

const socketIO = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>({
	path: Settings.socketPath,
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});


socketIO.on('connection', (socket) => {
	
	socket.on('setMap', async(map: Map, userId: string) => {

		if (!map || !userId) return;

		socket.data.map = map;
		socket.data.userId = userId;
		
		const all = await socketIO.fetchSockets();
		const readyToBattle: typeof all = [];

		for (const socket of all) {
			
			if (!socket.data.map) continue;
			if (!socket.data.userId) continue;

			readyToBattle.push(socket);

			if (readyToBattle.length === 2) {
				readyToBattle[0].emit('battle', readyToBattle[1].id, readyToBattle[1].data.map, true);
				readyToBattle[1].emit('battle', readyToBattle[0].id, readyToBattle[0].data.map, false);
				delete readyToBattle[0].data.map;
				delete readyToBattle[1].data.map;
				readyToBattle.splice(0, Infinity);
			}

		}


	});

	socket.on('shot', async(toId: string, index: number) => {
		console.info('SERVER RECEIVED SHOT', socket.id, '->', toId, index)
		const all = await socketIO.fetchSockets();
		const targetSocket = all.find(socket => socket.id === toId);
		if (!targetSocket) {
			console.info('TARGET_NOT_FOUND!');
			return;
		}
		targetSocket.emit('shot', index);
	});

	socket.once('disconnect', () => {
		socket.removeAllListeners();
		socket.disconnect();
	});

});

socketIO.listen(3495);