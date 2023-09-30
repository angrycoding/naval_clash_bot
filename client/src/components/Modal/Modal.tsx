import React from 'react';
import ReactDOM from 'react-dom';
import Border from '../Border/Border';


class Modal extends React.Component {


	render() {
		return ReactDOM.createPortal(<>
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)'}}>

			</div>
			<div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', alignContent: 'center'}}>

				<Border>
					<div style={{width: 300, height: 200, margin: 20}}>
						Какой то текст возможно медовик
						Какой то текст возможно медовик
						Какой то текст возможно медовик
						Какой то текст возможно медовик
					</div>
				</Border>
				
			</div>
		</>, document.body)

	}
}

export default Modal;