import ReactDOM from 'react-dom/client';
import Application from './Application';
import theme from './index.module.scss';
import generateGrid from './utils/generateGrid';

declare const Telegram: any;
const LAYER_GRID_BG = generateGrid(1.2, 20, theme.smallGridColor);

// B1
// http://localhost:3000/#tgWebAppData=start_param%3Dg188ga6f06X4I3F86c681EPH946j54U1a%3D%26user_id%3D31177503711

// B2
// http://localhost:3000/#tgWebAppData=start_param%3DsSESSION_ID%3D%26user_id%3D3117750371

// @ts-ignore
// const isInTelegram = Boolean(typeof window?.Telegram?.WebApp?.initDataUnsafe?.user === 'object')



// try {
// 	// @ts-ignore
// 	window?.Telegram?.WebApp?.requestWriteAccess?.();
// } catch (e) {}

try {
	// @ts-ignore
	window?.Telegram?.WebApp?.setHeaderColor('#517DA2');
} catch (e) {}

try {
	// @ts-ignore
	window?.Telegram?.WebApp?.enableClosingConfirmation();
} catch (e) {}

try {
	// @ts-ignore
	window?.Telegram?.WebApp?.expand();
} catch (e) {}


// const showConfirm = (message: string) => new Promise<boolean>(resolve => {
// 	try {
// 		// @ts-ignore
// 		return window?.Telegram?.WebApp?.showConfirm(message, resolve);
// 	} catch (e) {}
// 	resolve(confirm(message));
// });


// http://localhost:3000/#tgWebAppData=start_param%3D188ga6f06X4I3F86c681EPH946j54U1a%3D%26user_id%3D311775037


try {
	// @ts-ignore
	window?.Telegram?.WebApp?.setHeaderColor('#517DA2');
} catch (e) {}

try {
	// @ts-ignore
	window?.Telegram?.WebApp?.expand();
} catch (e) {}



ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
).render(
	<div className={theme.wrapper} style={LAYER_GRID_BG}>
		<Application />
	</div>
);