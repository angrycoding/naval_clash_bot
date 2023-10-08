import ReactDOM from 'react-dom/client';
import Application from './Application';
import theme from './index.module.scss';
import generateGrid from './utils/generateGrid';
import TelegramApi from './utils/TelegramApi';

const LAYER_GRID_BG = generateGrid(1.2, 20, theme.smallGridColor);

TelegramApi.expand();
TelegramApi.setHeaderColor('#517DA2');
TelegramApi.enableClosingConfirmation();

ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
).render(
	<div className={theme.wrapper} style={LAYER_GRID_BG}>
		<Application />
	</div>
);