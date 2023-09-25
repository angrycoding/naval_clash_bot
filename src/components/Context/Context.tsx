import React from 'react';

interface Props {
	children?: any;
}

interface State {
	isConnected: boolean;
}


class Context extends React.Component<Props, State> {

	state: State = {
		isConnected: false
	}
	
	Context = React.createContext<State>(this.state);

	render() {
		return <this.Context.Provider value={this.state}>
			{this.props.children}			
		</this.Context.Provider>;
	}


}

export default Context;