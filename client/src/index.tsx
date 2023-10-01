import ReactDOM from 'react-dom/client';
import App from './App';
import './index.module.scss';
import TelegramEmulator from './components/TelegramEmulator/TelegramEmulator';

declare const Telegram: any;

const playWithUserId = (new URLSearchParams(window.location.search)).get('playWithUserId') || '';

// http://localhost:3000/#tgWebAppData=start_param%3D222

const Foo = (props: { children?: any }) => {
	return <>
		<div style={{position: 'fixed', top: 0, right: 0, zIndex: 2342432, border: '4px solid red'}}>
			playWithUserId={playWithUserId}
		</div>
		{props.children}
	</>
	
}

ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
).render(
	<TelegramEmulator>
		{/* <Foo> */}
			<App />
		{/* </Foo> */}
	</TelegramEmulator>
);