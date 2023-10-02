import { Server } from 'socket.io';
import ServerToClientEvents from '../../client/src/types/ServerToClientEvents';
import ClientToServerEvents from '../../client/src/types/ClientToServerEvents';
import Map from '../../client/src/types/Map';
import Settings from '../../client/src/Settings';


const POSTPONED_SHOTS: {[userId: string]: number[]} = {
	
}

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


const closeSocket = (socket) => {
	const userId = socket?.handshake?.auth?.userId;
	console.info(`disconnected ${JSON.stringify(userId)}`)
	socket.removeAllListeners();
	socket.disconnect();
}

socketIO.on('connection', (socket) => {

	const userId = socket?.handshake?.auth?.userId;

	console.info(`connected ${JSON.stringify(userId)}`);

	if (typeof userId !== 'string' || !userId.trim()) return closeSocket(socket);

	socket.data.userId = userId;

	if (POSTPONED_SHOTS[userId]) {
		socket.emit('shot', ...POSTPONED_SHOTS[userId]);
		delete POSTPONED_SHOTS[userId];
	}

	socket.on('setMap', async(map: Map) => {
		
		if (!map) return;
		socket.data.map = map;
		console.info('setMap', userId);
		delete POSTPONED_SHOTS[userId];
		
		const all = await socketIO.fetchSockets();
		const readyToBattle: typeof all = [];

		for (const socket of all) {
			if (!socket.data.map) continue;
			readyToBattle.push(socket);
			while (readyToBattle.length >= 2) {
				const first = readyToBattle.shift();
				const second = readyToBattle.shift();

				console.info('start battle', first.data.userId, second.data.userId);

				first.emit(
					'battle',
					second.data.userId,
					second.data.map,
					true
				);

				second.emit(
					'battle',
					first.data.userId,
					first.data.map,
					false
				);

				delete first.data.map;
				delete second.data.map;
			}
		}

	});

	socket.on('shot', async(toUserId: string, index: number) => {
		
		console.info(`SERVER RECEIVED SHOT ${userId} -> ${toUserId}`);

		const all = await socketIO.fetchSockets();
		const targetSocket = all.find(socket => socket.data.userId === toUserId);

		if (!targetSocket) {
			console.info('TARGET socket _NOT_FOUND!');
			if (!POSTPONED_SHOTS[toUserId]) {
				POSTPONED_SHOTS[toUserId] = [];
			}
			POSTPONED_SHOTS[toUserId].push(index);
			return;
		}

		targetSocket.emit('shot', index);

	});

	socket.once('disconnect', () => {
		closeSocket(socket);
	});

});


socketIO.listen(Settings.serverPort);