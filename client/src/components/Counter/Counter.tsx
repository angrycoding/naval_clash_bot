import React from "react";

class Counter extends React.Component<{
	ms: number,
	onRender: (s: number) => any
}> {

	startTime: number = 0;
	startValue: number = 0;
	isAttached: boolean = false;

	componentDidMount() {
		this.isAttached = true;
		this.doUpdate();
	}

	componentWillUnmount() {
		this.isAttached = false;
	}

	doUpdate = () => {
		if (!this.isAttached) return;
		this.forceUpdate();
		setTimeout(this.doUpdate, 450);
	}

	render() {
		return this.props.onRender(Math.max(Math.ceil( (this.props.ms - Date.now()) / 1000  ), 0))
	}

}

export default Counter;