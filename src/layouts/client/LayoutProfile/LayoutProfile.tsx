import React from "react";
import styles from "./LayoutProfile.module.scss";
import classNames from "classnames/bind";
import { Row, Col } from "antd";
import { BiEditAlt } from "react-icons/bi";
import { Link, NavLink, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "~/store";
import { useTitle } from "~/hooks";

type Props = {};

const cx = classNames.bind(styles);

const LayoutProfile = (props: Props) => {
	const { user } = useSelector((state: RootState) => state.auth);
	useTitle("Thinkpro | Thông Tin Cá Nhân");

	return (
		<div className={cx("wrapper")}>
			<Row gutter={[32, 32]}>
				<Col
					xs={24}
					sm={24}
					md={4}
				>
					<div className={cx("profile")}>
						<div className={cx("profile__header")}>
							<img
								src={
									user?.avatar ||
									"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSIsmpJQm0OTBcGyY-Y3ECq4UMpN2lAcagoQ&usqp=CAU"
								}
								alt="avatar"
							/>
							<div className={cx("profile__info")}>
								<span>{`${user?.firstName} ${user?.lastName}`}</span>
								<Link to="/tai-khoan">
									<BiEditAlt />
									<span>Sửa hồ sơ</span>
								</Link>
							</div>
						</div>
						<div className={cx("profile__body")}>
							<div className={cx("profile__list")}>
								<NavLink
									to="/tai-khoan/profile"
									className={cx("profile__link")}
								>
									- Hồ sơ
								</NavLink>
								<NavLink
									to="/tai-khoan/mat-khau"
									className={cx("profile__link")}
								>
									- Đổi mật khẩu
								</NavLink>
								<NavLink
									to=""
									className={cx("profile__link")}
								>
									- Đơn mua
								</NavLink>
							</div>
						</div>
					</div>
				</Col>
				<Col
					xs={24}
					sm={24}
					md={20}
				>
					<div className={cx("content")}>
						<Outlet />
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default LayoutProfile;
