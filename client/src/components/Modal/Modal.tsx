import styles from './Modal.module.scss'

const Modal = (props: {
	children?: any,
}) => {

	return <div className={styles.modal}>
		<div>{props.children}</div>
	</div>
}

export default Modal;