import React from "react";
import classNames from "classnames/bind";
import { Input } from "antd";
import styles from "./Search.module.scss";
import { FiSearch } from "react-icons/fi";

const cx = classNames.bind(styles);

const Search: React.FC = () => {
	return (
		<div className={cx("wrapper")}>
			<span className={cx("icon")}>
				<FiSearch />
			</span>
			<Input
				placeholder="Search"
				className={cx("input")}
			/>
		</div>
	);
};

export default Search;
