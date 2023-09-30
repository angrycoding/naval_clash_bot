import { Socket, io } from 'socket.io-client';
import getUserId from './getUserId';
import ServerToClientEvents from '../types/ServerToClientEvents';
import ClientToServerEvents from '../types/ClientToServerEvents';
import Settings from '../Settings';

declare const isProduction: boolean;

// const auth = {
// 	userid: getUserId()
// }

const socketIO: Socket<ServerToClientEvents, ClientToServerEvents> = io('https://new.videotam.ru', {
	path: Settings.socketPath,
	autoConnect: true,
	// auth
});

export default socketIO;