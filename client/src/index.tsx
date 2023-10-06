import ReactDOM from 'react-dom/client';
import Application from './Application';
import theme from './index.module.scss';
import generateGrid from './utils/generateGrid';
import TelegramApi from './utils/TelegramApi';

const LAYER_GRID_BG = generateGrid(1.2, 20, theme.smallGridColor);

TelegramApi.expand();
TelegramApi.setHeaderColor('#517DA2');
TelegramApi.enableClosingConfirmation();


// B1
// http://localhost:3000/#tgWebAppData=start_param%3Dg188ga6f06X4I3F86c681EPH946j54U1a%3D%26user_id%3D31177503711
// B2

// http://localhost:3000/#tgWebAppData=start_param%3DsSESSION_ID%3D%26user_id%3D3117750371
// @ts-ignore
// 
// http://localhost:3000/#tgWebAppData=start_param%3D188ga6f06X4I3F86c681EPH946j54U1a%3D%26user_id%3D311775037




ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
).render(
	<div className={theme.wrapper} style={LAYER_GRID_BG}>
		<Application />
	</div>
);