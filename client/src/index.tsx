import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import './index.module.scss';
import TelegramEmulator from './components/TelegramEmulator/TelegramEmulator';

// http://localhost:3000/#tgWebAppData=start_param%3D222

ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
).render(
	<TelegramEmulator>
		<App />
	</TelegramEmulator>
);