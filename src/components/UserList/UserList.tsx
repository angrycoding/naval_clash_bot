import React from 'react';
import Router from '../Router/Router';

// <div style={{position: 'fixed', top: 20, left: 20, right: 20, bottom: 20, display: 'flex', gap: 20, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
				
// 				<div>isConnected = {String(isConnected)}</div>
// 				<div>isInTelegram = {String(isInTelegram)}</div>

// 			</div>

class UserList extends React.Component {

	componentDidMount(): void {
		
	}


	render() {
		return <div style={{
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
		}}>
			
			USER LIST

			<button onClick={() => Router.go('/users')}>
				GO TO MAP
			</button>

		</div>
	}


}

export default UserList;