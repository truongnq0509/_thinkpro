import React from "react";
import type { MenuProps } from "antd";
import { Layout, Menu, Input, Avatar, Space } from "antd";
import { Outlet, Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./AdminLayout.module.scss";
import { AiOutlineHome, AiOutlineLogout } from "react-icons/ai";
import { BsPhone } from "react-icons/bs";
import { BiCategoryAlt } from "react-icons/bi";
import { TbBrandCake } from "react-icons/tb";
import { FiSearch } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";

const { Content, Sider, Header } = Layout;

const cx = classNames.bind(styles);

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	type?: "group"
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
		type,
	} as MenuItem;
}

const items: MenuProps["items"] = [
	getItem(<Link to="/admin">Dashboard</Link>, "1", <AiOutlineHome size="18px" />),
	getItem(<Link to="/admin/products">Products</Link>, "2", <BsPhone size="18px" />),
	getItem(<Link to="/admin/categories">Categories</Link>, "3", <BiCategoryAlt size="18px" />),
	getItem(<Link to="/admin/brands">Brands</Link>, "4", <TbBrandCake size="18px" />),

	getItem(
		null,
		"grp",
		null,
		[
			getItem(<Link to="/admin/settings">Settings</Link>, "5", <IoSettingsOutline size="18px" />),
			getItem(<Link to="/logout">Logout</Link>, "6", <AiOutlineLogout size="18px" />),
		],
		"group"
	),
];

const AdminLayout: React.FC = () => {
	return (
		<Layout
			style={{
				display: "flex",
				minHeight: "100vh",
			}}
		>
			<Layout>
				<Sider
					width="240"
					style={{
						backgroundColor: "white",
					}}
				>
					<div className={cx("logo")}>
						<img
							src="https://media-api-beta.thinkpro.vn/media/core/site-configs/2023/3/16/logo-thinkpro.svg"
							alt="logo"
						/>
					</div>
					<Menu
						mode="inline"
						defaultSelectedKeys={["1"]}
						defaultOpenKeys={["sub1"]}
						style={{
							border: "none",
						}}
						items={items}
					/>
				</Sider>
				<Layout style={{ padding: "0 48px 24px 24px", minHeight: "100vh", background: "#f6f9fc" }}>
					<Header
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							padding: "0",
							height: "90px",
							backgroundColor: "transparent",
						}}
					>
						<div className={cx("search")}>
							<span className={cx("icon")}>
								<FiSearch />
							</span>
							<Input
								placeholder="Search"
								className={cx("input")}
							/>
						</div>
						<Space split="|">
							<Space>
								<Avatar
									style={{ objectFit: "cover", verticalAlign: "middle" }}
									size="large"
									src="https://haycafe.vn/wp-content/uploads/2022/11/Hinh-anh-don-gian.jpg"
								/>
								<span>Truong Nguyen</span>
							</Space>
							<div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
								<IoIosNotificationsOutline size="24px" />
							</div>
						</Space>
					</Header>
					<Outlet />
				</Layout>
			</Layout>
		</Layout>
	);
};

export default AdminLayout;
