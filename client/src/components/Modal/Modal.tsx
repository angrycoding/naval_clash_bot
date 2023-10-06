const Modal = (props: { children?: any }) => {
	return <div style={{
		pointerEvents: 'all',
		position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex',
		alignContent: 'center',
		alignItems: 'center',
		justifyContent: 'center',
		background: 'rgba(255, 255, 255, 0.7)',
	}}>
		<div style={{
			// border: '2px solid orange',
			minWidth: '90%',
			minHeight: '90%',
			display: 'flex',
			alignContent: 'center',
			justifyContent: 'center',
			alignItems: 'center'
		}}>{props.children}</div>
	</div>
}

export default Modal;