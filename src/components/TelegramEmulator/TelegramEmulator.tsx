import React, { CSSProperties } from 'react';
import styles from './TelegramEmulator.module.scss'

declare const Telegram: any;
declare const siteTitle: string;
declare const isProduction: boolean;


interface Props {
	children?: any;
}

const TelegramEmulator = (isProduction ? (props: Props) => props.children : class extends React.Component<Props> {
	
	componentDidMount(): void {

		Telegram.WebApp.MainButton.onClick(() => {
			console.info('MAIN_BUTTON_CLICKC')
		})

		// @ts-ignore
		window.TelegramWebviewProxy = {
			postEvent: (event: string) => {
				console.info('CATCHED EVENT', event)
				// if (event === 'web_app_setup_back_button') {
				// 	this.setState({ backButtonVisible: Telegram.WebApp.BackButton.isVisible })
				// }
				// else {
				// 	console.info('X', event)
				// }
				this.forceUpdate();
			}
		}

	}

	backButtonClick = () => {
		Telegram?.WebView.callEventCallbacks('webview:backButtonClicked', function(callback: any, ...args: any[]) {
			callback.apply(Telegram.WebApp, args);
		});
	}

	mainButtonClick = () => {
		Telegram?.WebView.callEventCallbacks('webview:mainButtonClicked', function(callback: any, ...args: any[]) {
			callback.apply(Telegram.WebApp, args);
		});
	}


	render() {

		const backButtonVisible = Telegram?.WebApp?.BackButton?.isVisible;

		return <div className={styles.wrapper}>

			<div className={styles.header} style={{'--color': Telegram.WebApp.headerColor} as CSSProperties}>

				<div
					onClick={backButtonVisible ? this.backButtonClick : undefined}>
					{backButtonVisible ? '◀' : "🗙"}
				</div>

				<div>{siteTitle}</div>

				<div>⋮</div>

			</div>

			<div className={styles.content}>
				{this.props.children}
			</div>

			{Boolean(Telegram.WebApp.MainButton.isVisible) && (
				<div style={{
					backgroundColor: Telegram.WebApp.MainButton.color,
					color: Telegram.WebApp.MainButton.textColor,
					padding: 20,
					textAlign: 'center'}}
					onClick={this.mainButtonClick}>
					{Telegram.WebApp.MainButton.text}
				</div>
			)}

			<div className={styles.navigation}>
				<div onClick={this.backButtonClick}>◀</div>
				<div>◉</div>
				<div>◼</div>
			</div>
			
		</div>
	}
});

export default TelegramEmulator;