import { Socket, io } from 'socket.io-client';
import ServerToClientEvents from '../types/ServerToClientEvents';
import ClientToServerEvents from '../types/ClientToServerEvents';
import Settings from '../Settings';
import getTempUserId from './getTempUserId';
import userLocale from './userLocale';
import TelegramApi from './TelegramApi';

declare const isProduction: boolean;

const auth = Object.defineProperties({
	locale: userLocale,
	userName: TelegramApi.getFirstName()
}, {

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
	isProduction ?
	'https://new.videotam.ru' :
	`http://192.168.1.109:${Settings.socketIoPort}`
), {
	auth,
	path: Settings.socketIoPath,
	autoConnect: true,
});

export default socketIO;