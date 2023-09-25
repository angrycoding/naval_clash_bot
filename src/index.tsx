import ReactDOM from 'react-dom/client';
import App from './App';
import Landscape from './components/Landscape/Landscape';
import './index.scss';
import TelegramEmulator from './components/TelegramEmulator/TelegramEmulator';

ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
).render(
	<TelegramEmulator>
		<Landscape>
			<App />
		</Landscape>
	</TelegramEmulator>
);