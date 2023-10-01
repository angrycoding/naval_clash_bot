import React, { CSSProperties } from 'react';
import Animator, { Transition } from './Animator';
import { uri_resolve } from '../../utils/uri_resolve';

declare const Telegram: any;

const cleanupUrl = (url: string): string => {
	let result = String(url.split('#').shift());
	result = String(result.split('?').shift());
	result = result.replace(/\/+/g, '/');
	result = result.replace(/^\//, '');
	result = result.replace(/\/$/, '');
	result = '/' + result + '/';
	if (result === '//') result = '/';
	return result;
}


interface RouteProps {
	path: string;
	component: any;
}

class Route extends React.Component<RouteProps> {}

interface RouterProps {
	className?: string;
	style?: CSSProperties;
	children: React.ReactElement<RouteProps> | React.ReactElement<RouteProps>[];
}

class Router extends React.Component<RouterProps> {

	private history: string[] = [];
	static Route = Route;
	static instance: Router | null;
	private animator: React.RefObject<Animator> = React.createRef();

	static goBack() {
		const { instance } = Router;
		if (!instance) return;
		instance.goBackward();
	}

	static go(path: string, props?: {[key: string]: any}) {
		const { instance } = Router;
		if (!instance) return;

		const newUrl = uri_resolve(path, instance.history[instance.history.length - 1]);
		instance.goForward(cleanupUrl(newUrl), props);

		// const anchor = document.createElement('div');
		// anchor.setAttribute('data-href', cleanupUrl(path));
		// const evObj = new MouseEvent('click');
		// Object.defineProperty(evObj, 'target', {value: anchor, enumerable: true});
		// document.dispatchEvent(evObj);
	}

	componentDidMount(): void {
		Router.instance = this;
		document.addEventListener('click', this.onAnchorClick);
		Telegram.WebApp.BackButton.onClick(this.onBackButton);
		const animator = (this.animator.current);
		if (animator) {
			const loadComponent = this.getComponent('/');
			animator.load(loadComponent, Transition.IMMEDIATE, error => {
				this.history.push('/');
			});
		}
	}
	
	componentWillUnmount() {
		Router.instance = null;
		Telegram.WebApp.BackButton.offClick(this.onBackButton);
		document.removeEventListener('click', this.onAnchorClick);
	}

	private updateBackButtonVisibility = () => {
		if (this.history.length === 1) {
			Telegram.WebApp.BackButton.hide();
		} else {
			Telegram.WebApp.BackButton.show();
		}
	}

	private getComponent = (path: string): typeof Animator.Component => {
		const cleanUrl = cleanupUrl(path);
		const children: unknown[] = React.Children.toArray(this.props.children);
		for (let c = 0; c < children.length; c++) {
			const route = children[c] as Route;
			const routePath = cleanupUrl(route.props.path);
			if (routePath !== cleanUrl) continue;
			return {
				component: route.props.component,
				props: {}
			};
		}
	}

	private onAnchorClick = (event: MouseEvent) => {
		const target = event.target;
		if (!(target instanceof Element)) return;
		const anchor = target.closest('*[data-href]');
		if (!(anchor instanceof HTMLElement)) return;
		event.stopPropagation();
		event.preventDefault();
		const href = (anchor.getAttribute('data-href') || '');
		const newUrl = uri_resolve(href, this.history[this.history.length - 1]);
		this.goForward(cleanupUrl(newUrl));
	}

	private goForward = (path: string, props?: {[key: string]: any}) => {
		const animator = (this.animator.current);
		if (!animator || animator.isLoading) return;
		const loadComponent = this.getComponent(path);
		animator.load({ ...loadComponent, props }, Transition.SLIDE_TO_LEFT_OPACITY, error => {
			this.history.push(cleanupUrl(path));
			this.updateBackButtonVisibility();
		})
	}

	private onBackButton = () => {
		const animator = (this.animator.current);
		if (!animator || animator.isLoading) return;
		if (this.history.length > 1) {
			this.goBackward();
		}
	}

	private goBackward = () => {
		const animator = (this.animator.current);
		if (!animator) return;
		const path = this.history[this.history.length - 2];
		if (!path) return;
		const loadComponent = this.getComponent(path);
		animator.load(loadComponent, Transition.SLIDE_TO_RIGHT_OPACITY, error => {
			this.history.pop();
			this.updateBackButtonVisibility();
		});
	}

	render = () => (
		<Animator
			ref={this.animator}
			style={this.props.style}
			className={this.props.className}
			onError={this.goBackward}
		/>
	);

}

export default Router;