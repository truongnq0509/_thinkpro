import { Layout } from "antd";
import classNames from "classnames/bind";
import React from "react";
import { Outlet } from "react-router-dom";
import styles from "./DefaultLayout.module.scss";
import { GlobalStyles } from "~/components/GlobalStyles";
import { Footer } from "~/layouts/components/Footer";
import { Header } from "~/layouts/components/Header";

const cx = classNames.bind(styles);

const { Content } = Layout;

const DefaultLayout: React.FC = () => {
	return (
		<GlobalStyles>
			<Layout className={cx("wrapper")}>
				<Header />
				<Content className={cx("main")}>
					<section className={cx("content")}>
						<Outlet />
					</section>
				</Content>
				<Footer />
			</Layout>
		</GlobalStyles>
	);
};

export default DefaultLayout;
