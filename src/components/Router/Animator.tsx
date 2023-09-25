import React, { CSSProperties } from 'react';
import clsx from 'clsx';
import SafeContainer from './SafeContainer';
import styles from './Animator.module.scss';

const routerAnimationDurationMs = 250;

export enum Transition {
	SLIDE_TO_LEFT,
	SLIDE_TO_RIGHT,
	SLIDE_TO_DOWN,
	SLIDE_TO_UP,
	SLIDE_TO_LEFT_OPACITY,
	SLIDE_TO_RIGHT_OPACITY,
	OPACITY,
	IMMEDIATE,
};


type ComponentType = Function | ((params: ComponentProps) => any) | any;
interface ComponentProps { [key: string]: any };
interface ComponentInterface { component: ComponentType, props: ComponentProps };
type Component = ComponentType | ComponentInterface;

interface Props {
	style?: CSSProperties;
	className?: string;
	onError: () => void;
}

type Callback = (error: boolean) => void;

interface State {
	loading?: boolean;
	Component1: Component;
	Component2: Component;
	callback?: Callback;
	activeLayer: number;
	transition?: number;
	animating?: boolean;
}


const renderComponent = (Component: Component): any => (
	Component.props ? (
		typeof Component.component === 'function' ?
		<Component.component {...Component.props} /> :
		Component.component
	) : (
		typeof Component === 'function' ?
		<Component /> :
		Component
	)
);

export default class extends React.Component<Props, State> {

	static Component: Component;

	get isLoading(): boolean {
		return Boolean(this.state.loading);
	}

	constructor(props: Props) {
		super(props);
		this.state = {
			activeLayer: 1,
			transition: Transition.IMMEDIATE,
			Component1: undefined,
			Component2: undefined
		};
	}

	// вызывается для начала анимации
	load = (component: Component, transition: Transition, callback: Callback) => {
		if (!component) {
			callback(true);
		} else if (this.state.activeLayer === 1) {
			this.setState({
				loading: true,
				callback: callback,
				Component2: component,
				transition: transition,
			});
		} else {
			this.setState({
				loading: true,
				callback: callback,
				Component1: component,
				transition: transition,
			});
		}
	}

	// вызывается когда компонент был успешно вставлен
	private onSuccess = () => {
		if (this.state.transition !== Transition.IMMEDIATE) {
			this.setState({ animating: true });
		} else {
			this.onAnimationEnd();
		}
	}

	// вызывается при ошибке монтирования либо рендеринга
	private onError = (isMounted: boolean) => {

		const { callback, activeLayer } = this.state;

		if (activeLayer === 1) {
			this.setState({
				loading: undefined,
				Component2: undefined
			}, () => {


				if (isMounted) {
					this.props.onError();
				}

				else if (callback) {
					callback(true);
				}

			});
		}
		
		else {
			this.setState({
				loading: undefined,
				Component1: undefined
			}, () => {
				if (isMounted) {
					this.props.onError();
				}
				
				else if (callback) {
					callback(true);
				}
			});
		}

	}

	// вызывается по завершению анимации
	private onAnimationEnd = (event?: React.AnimationEvent) => {
		if (event && event.animationName !== styles.ANIMATING) return;
		const { callback, activeLayer } = this.state;
		if (activeLayer === 1) {
			this.setState({
				activeLayer: 2,
				loading: undefined,
				callback: undefined,
				animating: undefined,
				Component1: undefined,
			}, () => callback && callback(false));
		} else {
			this.setState({
				activeLayer: 1, 
				loading: undefined,
				callback: undefined,
				animating: undefined,
				Component2: undefined,
			}, () => callback && callback(false));
		}
	}

	

	render() {
		const { style, className } = this.props;
		const { activeLayer, Component1, Component2, animating, transition } = this.state;
		return <div style={{
			'--router-animation-duration-ms': `${routerAnimationDurationMs}ms`
		} as React.CSSProperties} className={clsx(
			styles.wrapper,
			animating && styles.animating,
			animating && transition === Transition.SLIDE_TO_LEFT && styles.slideToLeft,
			animating && transition === Transition.SLIDE_TO_RIGHT && styles.slideToRight,
			animating && transition === Transition.SLIDE_TO_DOWN && styles.slideToDown,
			animating && transition === Transition.SLIDE_TO_UP && styles.slideToUp,
			animating && transition === Transition.SLIDE_TO_LEFT_OPACITY && styles.slideToLeftOpacity,
			animating && transition === Transition.SLIDE_TO_RIGHT_OPACITY && styles.slideToRightOpacity,
			animating && transition === Transition.OPACITY && styles.opacity
		)} onAnimationEnd={this.onAnimationEnd}>

			{Component1 && (
				<SafeContainer
					style={style}
					className={clsx(className, activeLayer === 1 ? styles.active : styles.inactive)}
					onError={this.onError} onSuccess={this.onSuccess}>
					{renderComponent(Component1)}
				</SafeContainer>
			)}

			{Component2 && (
				<SafeContainer
					style={style}
					className={clsx(className, activeLayer === 2 ? styles.active : styles.inactive)}
					onError={this.onError} onSuccess={this.onSuccess}>
					{renderComponent(Component2)}
				</SafeContainer>
			)}
			

		</div>;

	}
}

