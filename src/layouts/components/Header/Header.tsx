import { Button, Col, Row, Space } from "antd";
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

const cx = classNames.bind(styles);

const Header: React.FC = () => {
	const { categories } = useSelector((state: RootState) => state.app);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(getCategories());
	}, []);

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
						<Link to="/dang-nhap">
							<Button
								shape="circle"
								className={cx("btn")}
								size="large"
								icon={<AiOutlineUser />}
							/>
							<span className={cx("quanlity")}>1</span>
						</Link>
						<Link to="/gio-hang">
							<Button
								shape="circle"
								className={cx("btn")}
								size="large"
								icon={<AiOutlineShoppingCart />}
							/>
							<span className={cx("quanlity")}>1</span>
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
