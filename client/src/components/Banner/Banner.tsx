import clsx from "clsx";
import styles from './Banner.module.scss';
import DemoField from "../DemoField/DemoField";

enum Kind {
	SADFACE,
	SAILOR,
	SLOW
}

const BannerBase = (props: { kind: Kind }) => {
	const { kind } = props;
	return (
		<DemoField>
			<div className={clsx(
				styles.banner,
				kind === Kind.SADFACE && styles.sad,
				kind === Kind.SAILOR && styles.sailor,
				kind === Kind.SLOW && styles.slow
			)} />
		</DemoField>
	)
}

const Banner = Object.assign(BannerBase, {
	Kind: Kind
})

export default Banner;