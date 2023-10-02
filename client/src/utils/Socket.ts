import { Socket, io } from 'socket.io-client';
import getUserId from './getUserId';
import ServerToClientEvents from '../types/ServerToClientEvents';
import ClientToServerEvents from '../types/ClientToServerEvents';
import Settings from '../Settings';

declare const isProduction: boolean;

const socketIO: Socket<ServerToClientEvents, ClientToServerEvents> = io((
	isProduction ?
	'https://new.videotam.ru' :
	`http://localhost:${Settings.serverPort}`
), {
	path: Settings.socketPath,
	autoConnect: true,
	auth: {
		userId: getUserId()
	}
});

// @ts-ignore
window.xxx = () => {
	socketIO.disconnect();
	setTimeout(() => {
		socketIO.connect();
	}, 10000);
}

export default socketIO;