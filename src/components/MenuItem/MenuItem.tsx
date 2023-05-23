import React from "react";
import classNames from "classnames/bind";
import styles from "./MenuItem.module.scss";
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg";

type Props = {
	icon: any;
	title: any;
	action: any;
	isActive: any;
};

const cx = classNames.bind(styles);

const MenuItem = ({ icon, title, action, isActive = null }: Props) => {
	return (
		<button
			className={cx("menu-item", {
				"is-active": isActive && isActive(),
			})}
			onClick={action}
			title={title}
			type="button"
		>
			<svg className="remix">
				<use xlinkHref={`${remixiconUrl}#ri-${icon}`} />
			</svg>
		</button>
	);
};

export default MenuItem;
