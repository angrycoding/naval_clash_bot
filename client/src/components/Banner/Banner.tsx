import clsx from "clsx";
import Field from "../Field/Field"
import styles from './Banner.module.scss';
import { generateMap } from "../../utils/mapUtils";

enum Kind {
	SADFACE,
	SAILOR,
	SLOW
}

const BannerBase = (props: { kind: Kind }) => {
	const { kind } = props;
	return (
		<Field
			map={generateMap()}
			status={<div className={clsx(
				styles.banner,
				kind === Kind.SADFACE && styles.sad,
				kind === Kind.SAILOR && styles.sailor,
				kind === Kind.SLOW && styles.slow
			)} />}
		/>
	)
}

const Banner = Object.assign(BannerBase, {
	Kind: Kind
})

export default Banner;