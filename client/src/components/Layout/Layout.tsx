import clsx from 'clsx';
import styles from './Layout.module.scss'

const Layout = (props: { className?: string, field1: any, field2: any }) => (
	<div className={clsx(styles.wrapper, props.className)}>
		<div className={styles.firstColumn}>
			{props.field1}
		</div>
		<div className={styles.lastColumn}>
			{props.field2}
		</div>
	</div>
)

export default Layout;