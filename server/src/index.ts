import { Server, Socket } from 'socket.io';

const socketIO = new Server({
	path: '/api/',
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

socketIO.on('connection', (socket: Socket) => {

	socket.on('setMap', async(map, userid) => {
		// @ts-ignore
		socket.map = map;
		// @ts-ignore
		socket.userid = userid;

		console.info('setMap', userid)

		const readyToBattle = [];
		const all = await socketIO.fetchSockets();

		for (const socket of all) {
			// @ts-ignore
			if (!socket.map) continue;
			readyToBattle.push(socket);
			if (readyToBattle.length === 2) {
				readyToBattle[0].emit('battle', readyToBattle[1].id, readyToBattle[1].map, true);
				readyToBattle[1].emit('battle', readyToBattle[0].id, readyToBattle[0].map, false);
				delete readyToBattle[0].map;
				delete readyToBattle[1].map;
				readyToBattle.splice(0, Infinity);
			}
		}
	})

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