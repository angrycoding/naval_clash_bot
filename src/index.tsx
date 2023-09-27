import ReactDOM from 'react-dom/client';
import App from './App';
import './index.module.scss';
import TelegramEmulator from './components/TelegramEmulator/TelegramEmulator';

ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
).render(
	<TelegramEmulator>
		<App />
	</TelegramEmulator>
);