import styles from './Modal.module.scss'

const Modal = (props: {
	children?: any,
	badge?: any
}) => {

	return <div className={styles.modal}>

		<div>{props.children}</div>

{props.badge && (
							<div>

							{props.badge}
							
						</div>
		
		)}


	</div>
}

export default Modal;