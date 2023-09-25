import React, { CSSProperties } from 'react';

interface Props {
	style?: CSSProperties;
	children?: any;
	className?: string;
	onSuccess: () => void;
	onError: (mounted: boolean) => void;
}

interface State {
	error?: string | true;
}

export default class SafeContainer extends React.Component<Props, State> {

	private static lastRenderedContent: any;

	constructor(props: Props) {
		super(props);
		this.state = {};
	}

	static getDerivedStateFromError() {
		const content = SafeContainer.lastRenderedContent;
		return { error: (content instanceof HTMLElement && content.innerHTML) || true };
	}

	componentDidUpdate(oldProps: Props, oldState: State) {
		if (oldState !== this.state && this.state.error) {
			this.props.onError(true);
		}
	}

	componentDidMount() {
		if (!this.state.error) {
			this.props.onSuccess();
		} else {
			this.props.onError(false);
		}
	}

	render() {
		const { error } = this.state;
		const { className, style } = this.props;
		if (typeof error === 'string') return <div className={className} style={style} dangerouslySetInnerHTML={{__html: error}}></div>;
		if (error) return <></>;
		return <div className={className} style={style} ref={n => SafeContainer.lastRenderedContent = n}>{this.props.children}</div>;
	}
}
