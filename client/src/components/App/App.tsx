import Home from '../Home/Home';
import PlaceShips from '../PlaceShips/PlaceShips';
import Router from '../Router/Router';
import theme from '../../index.module.scss';
import Battle from '../Battle/Battle';
import generateGrid from '../../utils/generateGrid';
import styles from './App.module.scss';

const LAYER_GRID_BG = generateGrid(1.2, 20, theme.smallGridColor);

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




const App = () => (
	<Router className={styles.layer} style={LAYER_GRID_BG}>
		<Router.Route path="/" component={PlaceShips} />
		<Router.Route path="/battle" component={Battle} />
	</Router> 
);

export default App;