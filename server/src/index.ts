import { Server, Socket } from 'socket.io';
import ServerToClientEvents from '../../client/src/types/ServerToClientEvents';
import ClientToServerEvents from '../../client/src/types/ClientToServerEvents';
import Settings from '../../client/src/Settings';
import { GameStatus } from '../../client/src/types/GameState';
import generateUniqueId from '../../client/src/utils/generateUniqueId';
import { Map } from '../../client/src/utils/mapUtils';
import getRandomInt from '../../client/src/utils/getRandomInt';

const MISSED_ACTIONS: {[userId: string]: Array<
	[number, 'shot', string, number] |
	[number, 'giveup', string, string]
>} = {};

interface SocketData {
	map: Map;
	userId: string;
	userName: string;
	replayId: string;
}

const socketIO = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>({
	path: Settings.socketIoPath,
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

const getRandomUserName = (locale: string) => {
	const names = (locale === 'en' ? Settings.randomNamesEn : Settings.randomNamesRu);
	const ranks = (locale === 'en' ? Settings.randomRanksEn : Settings.randomRanksRu);
	return [names[getRandomInt(0, names.length - 1)], ranks[getRandomInt(0, ranks.length - 1)]].join(' ')
}

const cleanupMissedActions = () => {
	for (const userId in MISSED_ACTIONS) {

		MISSED_ACTIONS[userId] = MISSED_ACTIONS[userId].filter(missedAction => {
			return Date.now() - missedAction[0] <= 1000 * 60;
		});

		if (!MISSED_ACTIONS[userId].length) {
			delete MISSED_ACTIONS[userId];
		}

	}
	setTimeout(cleanupMissedActions, 1000 * 30);
}

const getNonEmptyString = (value: any): string => {
	if (typeof value === 'string' && value.trim()) {
		return value.trim();
	}
	return '';
}

const closeSocket = (socket) => {
	socket.removeAllListeners();
	socket.disconnect();
}

const startBattle = (socket1, socket2, whosTurn?: string) => {

	const userIds = [socket1.data.userId, socket2.data.userId];

	whosTurn = getNonEmptyString(whosTurn);

	
	const data = {
		replayId: generateUniqueId(),
		watchDog: 0,
		status: GameStatus.ACTIVE,
		whosTurn: (
			userIds.includes(whosTurn) ?
			whosTurn : userIds[getRandomInt(0, 1)]
		),
		users: {
			[userIds[0]]: {
				map: socket1.data.map,
				userName: socket1.data.userName,
			},
			[userIds[1]]: {
				map: socket2.data.map,
				userName: socket2.data.userName,
			}
		}
	};

	socket1.emit('startGameResponse', data);
	socket2.emit('startGameResponse', data);

	delete socket1.data.map;
	delete socket1.data.replayId;

	delete socket2.data.map;
	delete socket2.data.replayId;
}

socketIO.on('connection', async(socket) => {

	// socket.data.userId = getNonEmptyString(socket?.handshake?.auth?.userId);
	// if (!socket.data.userId) return closeSocket(socket);
	
	socket.data.userName = (() => {
		let locale = getNonEmptyString(socket?.handshake?.auth?.locale).toLowerCase();
		locale = ['en', 'ru'].includes(locale) ? locale : 'en';
		const result = getNonEmptyString(socket?.handshake?.auth?.userName);
		return (result ? result : getRandomUserName(locale));
	})();

	while (MISSED_ACTIONS[socket.data.userId]?.length) {
		const action = MISSED_ACTIONS[socket.data.userId].shift();
		if (action[1] === 'shot') {
			socket.emit('shot', action[2], action[3]);
		} else if (action[2] === 'giveup') {
			socket.emit('giveup', action[2], action[3]);
		}
	}


	socket.on('startGameRequest', async(map: Map, fromUserId: string, replayId?: string, withUserId?: string, whosTurn?: string) => {

		fromUserId = getNonEmptyString(fromUserId);
		if (!fromUserId) return;
		socket.data.userId = fromUserId;

		replayId = getNonEmptyString(replayId);
		withUserId = getNonEmptyString(withUserId);
		whosTurn = getNonEmptyString(whosTurn);

		if (typeof map !== 'object' || !map) return;
		socket.data.map = map;

		const allSockets = await socketIO.fetchSockets();

		if (replayId && withUserId && [fromUserId, withUserId].includes(whosTurn)) {
			socket.data.replayId = replayId;
			const withSocket = allSockets.find(s => s.data.replayId === replayId && s.data.map && s.data.userId === withUserId);
			if (!withSocket) return;
			startBattle(socket, withSocket, whosTurn);
		} else {
			const readyToBattle: typeof allSockets = [];
			for (const socket of allSockets) {
				if (!socket.data.map) continue;
				readyToBattle.push(socket);
				while (readyToBattle.length >= 2) {
					const first = readyToBattle.shift();
					const second = readyToBattle.shift();
					startBattle(first, second);
				}
			}
		}

	});

	socket.on('shot', async(fromUserId: string, toUserId: string, index: number) => {
		fromUserId = getNonEmptyString(fromUserId);
		toUserId = getNonEmptyString(toUserId);
		if (!fromUserId || !toUserId || fromUserId === toUserId) return;
		if (socket.data.userId !== fromUserId) return;
		if (!Number.isInteger(index) || index < 0 || index > 99) return;
		const toSocket = (await socketIO.fetchSockets()).find(s => s.data.userId === toUserId);
		if (!toSocket) {
			if (!MISSED_ACTIONS[toUserId]) MISSED_ACTIONS[toUserId] = [];
			MISSED_ACTIONS[toUserId].push([ Date.now(), 'shot', fromUserId, index ]);
		} else {
			toSocket.emit('shot', fromUserId, index);
		}
	});

	socket.on('giveup', async(fromUserId: string, toUserId: string) => {
		fromUserId = getNonEmptyString(fromUserId);
		toUserId = getNonEmptyString(toUserId);
		if (!fromUserId || !toUserId || fromUserId === toUserId) return;
		if (socket.data.userId !== fromUserId) return;
		const toSocket = (await socketIO.fetchSockets()).find(s => s.data.userId === toUserId);
		if (!toSocket) {
			if (!MISSED_ACTIONS[toUserId]) MISSED_ACTIONS[toUserId] = [];
			MISSED_ACTIONS[toUserId].push([ Date.now(), 'giveup', fromUserId, toUserId ]);
		} else {
			toSocket.emit('giveup', fromUserId, toUserId);
		}
	})

	socket.on('readyToReplayRequest', async(replayId: string, fromUserId: string, withUserId: string) => {
		fromUserId = getNonEmptyString(fromUserId);
		withUserId = getNonEmptyString(withUserId);
		replayId = getNonEmptyString(replayId);
		if (!replayId || !fromUserId || !withUserId || fromUserId === withUserId) return;
		if (socket.data.userId !== fromUserId) return;
		socket.data.replayId = replayId;
		const withSocket = (await socketIO.fetchSockets()).find(s => s.data.replayId === replayId && s.data.userId === withUserId);
		if (!withSocket) return;
		delete socket.data.replayId;
		delete withSocket.data.replayId;
		socket.emit('readyToReplayResponse', replayId, withUserId);
		withSocket.emit('readyToReplayResponse', replayId, fromUserId);
	});

	socket.once('disconnect', () => {
		closeSocket(socket);
	});

});


socketIO.listen(Settings.socketIoPort);

cleanupMissedActions();