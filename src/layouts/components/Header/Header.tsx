import { Button, Col, Row, Space } from "antd";
import classNames from "classnames/bind";
import React, { useEffect } from "react";
import { AiOutlineShoppingCart, AiOutlineUser } from "react-icons/ai";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import { ICategory } from "~/interfaces";
import { AppDispatch, RootState } from "~/store";
import { getCategories } from "~/store/reducers/appSlice";
import { Search } from "../Search";
import styles from "./Header.module.scss";
import { getCategory } from "~/store/reducers/collectionSlice";

const cx = classNames.bind(styles);

const Header: React.FC = () => {
	const { categories } = useSelector((state: RootState) => state.app);
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		dispatch(getCategories());
	}, []);

	const handleClick = (slug: string) => dispatch(getCategory(slug));

	return (
		<>
			<section className={cx("wrapper")}>
				<header className={cx("header")}>
					<a
						className={cx("logo")}
						href="#"
					>
						<img src="https://media-api-beta.thinkpro.vn/media/core/site-configs/2023/3/16/logo-thinkpro.svg" />
					</a>
					<Search />
					<Space className={cx("cart")}>
						<Link to="/login">
							<Button
								shape="circle"
								className={cx("btn")}
								size="large"
								icon={<AiOutlineUser />}
							/>
							<span className={cx("quanlity")}>1</span>
						</Link>
						<Link to="/cart">
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
								slidesPerGroup={3}
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
												<Link
													to={category?.slug as string}
													className={cx("nav__link")}
													onClick={() => handleClick(category?.slug as string)}
												>
													<img
														className={cx("nav__img")}
														src={category?.image?.path as any}
													/>
													<p className={cx("nav__title")}>{category?.name}</p>
												</Link>
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
