import ReactDOM from 'react-dom/client';
import Application from './Application';
import theme from './index.module.scss';
import generateGrid from './utils/generateGrid';
import TelegramApi from './utils/TelegramApi';
import selfUpdate from './utils/selfUpdate';
import Settings from '../../shared/Settings';

const LAYER_GRID_BG = generateGrid(1.2, 20, theme.smallGridColor);

TelegramApi.expand();
TelegramApi.setHeaderColor(Settings.theme_color);
TelegramApi.enableClosingConfirmation();
setTimeout(selfUpdate, 1000 * 5);

ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
).render(
	<div className={theme.wrapper} style={LAYER_GRID_BG}>
		<Application />
	</div>
);