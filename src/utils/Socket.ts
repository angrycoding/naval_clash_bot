import { io as SocketIO } from 'socket.io-client';
import getUserId from './getUserId';

declare const isProduction: boolean;

// const auth = {
// 	userid: getUserId()
// }

const socketIO = SocketIO('https://new.videotam.ru', {
	path: '/api/',
	autoConnect: true,
	// auth
});

export default socketIO;