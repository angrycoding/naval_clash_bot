import styles from './Layout.module.scss'

const Layout = (props: { field1: any, field2: any }) => (
	<div className={styles.wrapper}>
		<div className={styles.firstColumn}>
			{props.field1}
		</div>
		<div className={styles.lastColumn}>
			{props.field2}
		</div>
	</div>
)

export default Layout;