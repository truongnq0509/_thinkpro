import { Button, Col, Row, Space, Popover } from "antd";
import classNames from "classnames/bind";
import React, { useEffect } from "react";
import { AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import { ICategory } from "~/interfaces";
import { AppDispatch, RootState } from "~/store";
import { getCategories } from "~/store/reducers/appSlice";
import { Search } from "../Search";
import styles from "./Header.module.scss";
import { logout as apiLogout } from "~/services/authService";
import { setCurrentUser, login } from "~/store/reducers/authSlice";
import { useNavigate } from "react-router-dom";
import { getQuantity, setCartQuantity } from "~/store/reducers/cartSlice";

const cx = classNames.bind(styles);

const Header: React.FC = () => {
	const { categories } = useSelector((state: RootState) => state.app);
	const { user, loggedIn } = useSelector((state: RootState) => state.auth);
	const { quantity } = useSelector((state: RootState) => state.cart);
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	useEffect(() => {
		dispatch(getCategories());
		if (loggedIn && quantity) dispatch(getQuantity());
	}, []);

	const handleLogout = async () => {
		await apiLogout();

		// xóa user localstorage
		dispatch(
			setCurrentUser({
				firstName: "",
				lastName: "",
				avatar: "",
				role: "",
			})
		);

		//
		dispatch(
			login({
				accessToken: "",
				loggedIn: false,
			})
		);

		// xóa giỏ hàng
		dispatch(setCartQuantity(-quantity));
		navigate("/dang-nhap");
	};

	return (
		<>
			<section className={cx("wrapper")}>
				<header className={cx("header")}>
					<Link
						className={cx("logo")}
						to="/"
					>
						<img src="https://media-api-beta.thinkpro.vn/media/core/site-configs/2023/3/16/logo-thinkpro.svg" />
					</Link>
					<Search />
					<Space className={cx("cart")}>
						{loggedIn ? (
							<Popover
								placement="bottom"
								content={
									<div
										style={{
											display: "flex",
											flexDirection: "column",
											gap: 8,
											fontSize: 12,
										}}
									>
										<Link to="/tai-khoan/profile">
											<Button className={cx("btn")}>Tài khoản của tôi</Button>
										</Link>
										<Link to="/tai-khoan/don-mua">
											<Button className={cx("btn")}>Đơn hàng</Button>
										</Link>
										<Button
											className={cx("btn")}
											onClick={handleLogout}
										>
											Đăng xuất
										</Button>
									</div>
								}
							>
								<Link
									to="/tai-khoan/profile"
									style={{
										display: "block",
										width: 40,
										height: 40,
									}}
								>
									<img
										src={
											user.avatar ||
											"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSIsmpJQm0OTBcGyY-Y3ECq4UMpN2lAcagoQ&usqp=CAU"
										}
										alt=""
										style={{
											width: "100%",
											height: "100%",
											objectFit: "cover",
											borderRadius: "50%",
										}}
									/>
								</Link>
							</Popover>
						) : (
							<Link to="/dang-nhap">
								<Button
									shape="circle"
									className={cx("btn")}
									size="large"
									icon={<AiOutlineUser />}
								/>
							</Link>
						)}
						<Link to="/gio-hang">
							<Button
								shape="circle"
								className={cx("btn")}
								size="large"
								icon={<AiOutlineShoppingCart />}
							/>
							{quantity ? <span className={cx("quantity")}>{quantity}</span> : ""}
						</Link>
					</Space>
				</header>
			</section>
			<section className={cx("wrapper")}>
				<nav className={cx("nav")}>
					<Row>
						<Col
							xs={{ span: 18 }}
							sm={{ span: 20 }}
							md={{ span: 21 }}
							lg={{ span: 21 }}
							xl={{ span: 22 }}
							xxl={{ span: 22 }}
						>
							<Swiper
								// install Swiper modules
								modules={[Navigation, Pagination, Scrollbar, A11y]}
								spaceBetween={10}
								slidesPerView="auto"
								navigation={{
									nextEl: `.${cx("next")}`,
									prevEl: `.${cx("prev")}`,
								}}
								slidesPerGroup={2}
							>
								{categories?.map((category: ICategory) => {
									return (
										<SwiperSlide
											key={category?._id}
											style={{
												width: "auto",
											}}
										>
											<div className={cx("nav__item")}>
												<NavLink
													to={category?.slug as string}
													state={{
														slug: category.slug,
														isSlug: false,
													}}
													className={({ isActive }) =>
														cx("nav__link", {
															active: isActive,
														})
													}
												>
													<img
														className={cx("nav__img")}
														src={category?.image?.path as any}
													/>
													<p className={cx("nav__title")}>{category?.name}</p>
												</NavLink>
											</div>
										</SwiperSlide>
									);
								})}
							</Swiper>
						</Col>
						<Col
							xs={{ span: 6 }}
							sm={{ span: 4 }}
							md={{ span: 3 }}
							lg={{ span: 3 }}
							xl={{ span: 2 }}
							xxl={{ span: 2 }}
							style={{ display: "flex", alignItems: "center" }}
						>
							<Space
								wrap
								style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
							>
								<Button
									type="primary"
									shape="circle"
									icon={<GrFormPrevious style={{ fontSize: "16px" }} />}
									size="middle"
									className={cx("prev")}
								/>
								<Button
									type="primary"
									shape="circle"
									icon={<GrFormNext style={{ fontSize: "16px" }} />}
									size="middle"
									className={cx("next")}
								/>
							</Space>
						</Col>
					</Row>
				</nav>
			</section>
		</>
	);
};

export default Header;
