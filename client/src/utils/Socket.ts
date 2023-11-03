import { Socket, io } from 'socket.io-client';
import ServerToClientEvents from '../../../shared/ServerToClientEvents';
import ClientToServerEvents from '../../../shared/ClientToServerEvents';
import Settings from '../../../shared/Settings';
import userLocale from './userLocale';
import TelegramApi from './TelegramApi';
import persistentUserId from './persistentUserId';

declare const isProduction: boolean;

const socketIO: Socket<ServerToClientEvents, ClientToServerEvents> = io((
	isProduction ? Settings.socketIoHost : `:${Settings.socketIoPort}`
), {
	auth: {
		locale: userLocale,
		persistentUserId,
		userName: TelegramApi.getFirstName() || new URLSearchParams(window.location.search).get('name'),
	},
	path: Settings.socketIoPath,
	autoConnect: true,
});

export default socketIO;