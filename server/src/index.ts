import HTTP from 'http';
import { v4 as uuidv4 } from 'uuid';
import { Server } from 'socket.io';
import { answerCallbackQuery, sendMessage, updateWebhookUrl } from './Telegram';
import Settings from '../../shared/Settings';
import ServerToClientEvents from '../../shared/ServerToClientEvents';
import ClientToServerEvents from '../../shared/ClientToServerEvents';
import getRandomInt from '../../shared/getRandomInt';
import { GameStatus } from '../../shared/GameState';
import Map from '../../shared/Map';

const MISSED_SHOTS: {[userId: string]: Array<[number, string, number]>} = {};

interface SocketData {
	map: Map;
	userId: string;
	userName: string;
	replayId: string;
	inviteId: string;
	persistentUserId: string;
}


const socketIO = new Server<ClientToServerEvents, ServerToClientEvents, {}, SocketData>({
	path: Settings.socketIoPath,
	cors: {
		origin: "*",
		methods: ["GET", "POST"]
	}
});

const getRandomUserName = (locale: string) => {
	const names = (locale === 'en' ? Settings.randomNamesEn : locale === 'uk' ? Settings.randomNamesUa : Settings.randomNamesRu);
	const ranks = (locale === 'en' ? Settings.randomRanksEn : locale === 'uk' ? Settings.randomRanksUa : Settings.randomRanksRu);
	return [names[getRandomInt(0, names.length - 1)], ranks[getRandomInt(0, ranks.length - 1)]].join(' ')
}

const cleanupMissedShots = () => {
	for (const userId in MISSED_SHOTS) {

		MISSED_SHOTS[userId] = MISSED_SHOTS[userId].filter(missedAction => {
			return Date.now() - missedAction[0] <= 1000 * 60;
		});

		if (!MISSED_SHOTS[userId].length) {
			delete MISSED_SHOTS[userId];
		}

	}
	setTimeout(cleanupMissedShots, 1000 * 30);
}

const getPositiveInteger = (value: any): number => {
	if (Number.isInteger(value) && value > 0) {
		return value;
	}
	return 0;
}

const getNonEmptyString = (value: any): string => {
	if (typeof value === 'string' && value.trim()) {
		return value.trim();
	}
	return '';
}

const closeSocket = (socket) => {
	delete socket.data.map;
	delete socket.data.userName;
	delete socket.data.replayId;
	delete socket.data.inviteId;
	delete socket.data.persistentUserId;
	socket.removeAllListeners();
	socket.disconnect();
}

const startBattle = (socket1, socket2, whosTurn?: string) => {

	const userIds = [socket1.data.userId, socket2.data.userId];

	whosTurn = getNonEmptyString(whosTurn);

	
	const data = {
		replayId: uuidv4(),
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

	const persistentUserId = getNonEmptyString(socket?.handshake?.auth?.persistentUserId);
	if (!persistentUserId) return closeSocket(socket);
	socket.data.persistentUserId = persistentUserId;

	socket.data.userName = (() => {
		let locale = getNonEmptyString(socket?.handshake?.auth?.locale).toLowerCase();
		locale = ['en', 'ru', 'uk'].includes(locale) ? locale : 'en';
		const result = getNonEmptyString(socket?.handshake?.auth?.userName);
		return (result ? result : getRandomUserName(locale));
	})();

	while (MISSED_SHOTS[socket.data.userId]?.length) {
		const action = MISSED_SHOTS[socket.data.userId].shift();
		socket.emit('shot', action[1], action[2]);
	}

	// sent by client when he is waiting for friend's connection
	socket.on('inviteRequest', async(fromUserId: string, inviteId: string) => {
		
		fromUserId = getNonEmptyString(fromUserId);
		inviteId = getNonEmptyString(inviteId);
		if (!fromUserId || !inviteId) return;
		
		socket.data.userId = fromUserId;
		socket.data.inviteId = inviteId;
		
		const enemySocket = (await socketIO.fetchSockets()).find(socket => (
			socket.data.persistentUserId !== persistentUserId &&
			socket.data.userId !== fromUserId &&
			socket.data.inviteId === inviteId
		));

		if (!enemySocket) return;
		const enemyUserId = enemySocket.data.userId;

		delete socket.data.userId;
		delete socket.data.inviteId;
		delete enemySocket.data.userId;
		delete enemySocket.data.inviteId;

		
		const data = {
			replayId: inviteId,
			watchDog: 0,
			status: GameStatus.PLACESHIPS,
			whosTurn: [fromUserId, enemyUserId][getRandomInt(0, 1)],
			users: {
				[fromUserId]: {
					map: {},
					userName: socket.data.userName,
				},
				[enemyUserId]: {
					map: {},
					userName: enemySocket.data.userName,
				}
			}
		};

		socket.emit('inviteResponse', data);
		enemySocket.emit('inviteResponse', data);

	});

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
			const withSocket = allSockets.find(s => (
				s.data.persistentUserId !== persistentUserId &&
				s.data.replayId === replayId &&
				s.data.map &&
				s.data.userId === withUserId
			));
			if (!withSocket) return;
			startBattle(socket, withSocket, whosTurn);
		} else {
			const readyToBattle: typeof allSockets = [];
			for (const socket of allSockets) {
				if (!socket.data.map) continue;
				if (socket.data.inviteId) continue;
				if (socket.data.replayId) continue;
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
		const toSocket = (await socketIO.fetchSockets()).find(s => (
			s.data.persistentUserId !== persistentUserId &&
			s.data.userId === toUserId
		));
		if (!toSocket) {
			if (!MISSED_SHOTS[toUserId]) MISSED_SHOTS[toUserId] = [];
			MISSED_SHOTS[toUserId].push([ Date.now(), fromUserId, index ]);
		} else {
			toSocket.emit('shot', fromUserId, index);
		}
	});

	// sent by client when he wants to play with same player again
	socket.on('readyToReplayRequest', async(replayId: string, fromUserId: string, withUserId: string) => {
		fromUserId = getNonEmptyString(fromUserId);
		withUserId = getNonEmptyString(withUserId);
		replayId = getNonEmptyString(replayId);
		if (!replayId || !fromUserId || !withUserId || fromUserId === withUserId) return;
		if (socket.data.userId !== fromUserId) return;
		socket.data.replayId = replayId;
		const withSocket = (await socketIO.fetchSockets()).find(s => (
			s.data.persistentUserId !== persistentUserId &&
			s.data.replayId === replayId &&
			s.data.userId === withUserId
		));
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

cleanupMissedShots();




/* TELGRAM BOT */

console.info('bot settings:', {
	telegramBotPort: Settings.telegramBotPort,
	telegramBotToken: Settings.telegramBotToken,
	telegramWebhookUrl: Settings.telegramWebhookUrl
})

if (Number.isInteger(Settings.telegramBotPort) &&
	typeof Settings.telegramBotToken === 'string' &&
	typeof Settings.telegramWebhookUrl === 'string') {
	(async() => {

		await updateWebhookUrl(Settings.telegramWebhookUrl);

		HTTP.createServer((request, response) => {
			
			let body: any = '';

			request.on('data', (chunk) => body += chunk.toString('utf8'));
			request.on('end', () => {

				try { body = JSON.parse(body) }
				catch (e) {}
				if (typeof body !== 'object' || !body) return;


				// console.info(body);

				const entity = (body?.callback_query || body?.message);
				const myUserId = getPositiveInteger(entity?.from?.id);
				const replyInRussian = (getNonEmptyString(entity?.from?.language_code) === 'ru');
				const replyInUkrainian = (getNonEmptyString(entity?.from?.language_code) === 'uk');

				console.info({ replyInUkrainian })

				if (!myUserId) return;

				const callbackQueryId = getNonEmptyString(body?.callback_query?.id);
				if (callbackQueryId) answerCallbackQuery(callbackQueryId);

				const callbackQueryData = getNonEmptyString(body?.callback_query?.data);

				if (callbackQueryData === 'create_game') {
					const inviteId = uuidv4();
					if (replyInRussian) {
						sendMessage(`
							Хорошо, вот ссылка для игры с другом, <b>отправь</b> ее тому с кем ты хочешь сыграть.
							Затем <b>нажми</b> на нее и жди пока друг присоединится к твоей игре
							https://t.me/naval_clash_bot/play?startapp=${Buffer.from(inviteId).toString('base64')}
						`, myUserId, { disable_notification: true })
					}
					
					else if (replyInUkrainian) {
						sendMessage(`
							Добре, ось посилання для гри з другом, <b>відправь</b> її тому, з ким бажаєш зіграти.
							Потім <b>натисни</b> на неї та очікуй доки друг доєднається до твоєї гри
							https://t.me/naval_clash_bot/play?startapp=${Buffer.from(inviteId).toString('base64')}
						`, myUserId, { disable_notification: true })
					}
					
					else {
						sendMessage(`
							Okay, here is the link to play with the friend, <b>send it</b> to one of your friends.
							Then <b>click</b> on it and wait until your friend will join the game
							https://t.me/naval_clash_bot/play?startapp=${Buffer.from(inviteId).toString('base64')}
						`, myUserId, { disable_notification: true })
					}
				}

				else if (callbackQueryData === 'send_link') {
					if (replyInRussian) {
						sendMessage(`
							Хорошо, вот ссылка для игры со <b>случайным</b> противником, просто <b>нажми</b> и <b>жди</b>
							пока кто-нибудь присоединится к твоей игре
							https://t.me/naval_clash_bot/play
						`, myUserId, { disable_notification: true })
					}
					
					else if (replyInUkrainian) {
						sendMessage(`
							Добре, ось посилання для гри з <b>випадковим</b> супротивником, просто <b>натисни</b> та <b>очікуй</b>
							доки хто-небудь доєднається до твоєї гри
							https://t.me/naval_clash_bot/play
						`, myUserId, { disable_notification: true })
					}
					
					else {
						sendMessage(`
							Okay, here is the link to play with <b>whoever</b> wants to join, just <b>click</b> on it
							and <b>wait</b> until somebody will join your game
							https://t.me/naval_clash_bot/play
						`, myUserId, { disable_notification: true })
					}
				}

				else if (replyInRussian) {

					sendMessage(`Привет, с кем ты хочешь поиграть?`, myUserId, {
						disable_notification: true,
						reply_markup: {
							inline_keyboard: [
								[{
									text: 'С другом',
									callback_data: 'create_game'
								}],
								[{
									text: 'Со случайным противником',
									callback_data: 'send_link'
								}]
							]
						}
					});

				}

				else if (replyInUkrainian) {

					sendMessage(`Привіт, з ким ти хочеш зіграти?`, myUserId, {
						disable_notification: true,
						reply_markup: {
							inline_keyboard: [
								[{
									text: 'З другом',
									callback_data: 'create_game'
								}],
								[{
									text: 'З випадковим супротивником',
									callback_data: 'send_link'
								}]
							]
						}
					});

				}
				
				else {

					sendMessage(`Hi, who do you want to play with this time?`, myUserId, {
						disable_notification: true,
						reply_markup: {
							inline_keyboard: [
								[{
									text: 'With on of my friends',
									callback_data: 'create_game'
								}],
								[{
									text: 'With anyone whoever wants to join',
									callback_data: 'send_link'
								}]
							]
						}
					});


				}



			});

			response.end();

		}).listen(Settings.telegramBotPort, '127.0.0.1');

	})();
}

else {
	console.info('Incorrect settings, bot won\'t start');
}