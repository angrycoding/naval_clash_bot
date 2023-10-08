import { Socket, io } from 'socket.io-client';
import ServerToClientEvents from '../types/ServerToClientEvents';
import ClientToServerEvents from '../types/ClientToServerEvents';
import Settings from '../Settings';
import userLocale from './userLocale';
import TelegramApi from './TelegramApi';

declare const isProduction: boolean;

const socketIO: Socket<ServerToClientEvents, ClientToServerEvents> = io((
	isProduction ?
	'https://new.videotam.ru' :
	`http://192.168.1.109:${Settings.socketIoPort}`
), {
	auth: {
		locale: userLocale,
		userName: TelegramApi.getFirstName() || new URLSearchParams(window.location.search).get('name'),
	},
	path: Settings.socketIoPath,
	autoConnect: true,
});

// @ts-ignore
window.terminateConn = () => {
	socketIO.disconnect();
	setTimeout(() => {
		socketIO.connect();
	}, 10000)
}

export default socketIO;