import { Socket, io } from 'socket.io-client';
import getUserId from './getUserId';
import ServerToClientEvents from '../types/ServerToClientEvents';
import ClientToServerEvents from '../types/ClientToServerEvents';
import Settings from '../Settings';
import generateUniqueId from './generateUniqueId';
import getTempUserId from './getTempUserId';

declare const Telegram: any;
declare const isProduction: boolean;

const gameIdOrSessionId = Telegram?.WebApp?.initDataUnsafe?.start_param;


const auth = Object.defineProperties({}, {

	// userId: String(getUserId()),
	// firstName: 'FIRST_NAME',
	// sessionId: gameIdOrSessionId?.startsWith('s') ? gameIdOrSessionId.slice(1) : `SESSION_ID`,
	// gameId: gameIdOrSessionId?.startsWith('g') ? gameIdOrSessionId.slice(1) : ''

	userName: {
		enumerable: true,
		get() {
			let result: any = Telegram?.WebApp?.initDataUnsafe?.user?.first_name;
			return (typeof result === 'string' ? result : '');
		}
	},

	userId: {
		enumerable: true,
		get() { return getTempUserId() }
	},

	sessionId: {
		enumerable: true,
		get() { return localStorage.getItem('sessionId') || '' }
	},

	time: {
		enumerable: true,
		get() { return Date.now() }
	},
})


const socketIO: Socket<ServerToClientEvents, ClientToServerEvents> = io((
	'isProduction' ?
	'https://new.videotam.ru' :
	`http://192.168.1.109:${Settings.socketIoPort}`
), {
	auth,
	path: Settings.socketIoPath,
	autoConnect: true,
});

// setTimeout(() => {
// 	socketIO.connect();
// }, 1000);

export default socketIO;