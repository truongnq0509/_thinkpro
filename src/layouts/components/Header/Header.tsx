import { Button, Space, Tag, Row, Col } from "antd";
import classNames from "classnames/bind";
import React from "react";
import { Link } from "react-router-dom";
import { Search } from "../Search";
import styles from "./Header.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper";

import { AiOutlineUser, AiOutlineShoppingCart, AiFillFacebook, AiOutlineYoutube, AiOutlinePhone } from "react-icons/ai";

const cx = classNames.bind(styles);

const Header: React.FC = () => {
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
						<Col span="22">
							<Swiper
								// install Swiper modules
								modules={[Navigation, Pagination, Scrollbar, A11y]}
								spaceBetween={50}
								slidesPerView={8}
								navigation={{
									nextEl: `.${cx("next")}`,
									prevEl: `.${cx("prev")}`,
								}}
							>
								<SwiperSlide>
									<div className={cx("nav__item")}>
										<Link
											to="/"
											className={cx("nav__link")}
										>
											<img
												className={cx("nav__img")}
												src="https://images.thinkgroup.vn/unsafe/96x96/https://media-api-beta.thinkpro.vn/media/core/categories/2022/3/22/Case-may-tinh-thinkpro.png"
											/>
											<p className={cx("nav__title")}>Laptop</p>
										</Link>
									</div>
								</SwiperSlide>
								<SwiperSlide>
									<div className={cx("nav__item")}>
										<Link
											to="/"
											className={cx("nav__link")}
										>
											<img
												className={cx("nav__img")}
												src="https://images.thinkgroup.vn/unsafe/96x96/https://media-api-beta.thinkpro.vn/media/core/categories/2022/3/22/Case-may-tinh-thinkpro.png"
											/>
											<p className={cx("nav__title")}>Laptop</p>
										</Link>
									</div>
								</SwiperSlide>
								<SwiperSlide>
									<div className={cx("nav__item")}>
										<Link
											to="/"
											className={cx("nav__link")}
										>
											<img
												className={cx("nav__img")}
												src="https://images.thinkgroup.vn/unsafe/96x96/https://media-api-beta.thinkpro.vn/media/core/categories/2022/3/22/Case-may-tinh-thinkpro.png"
											/>
											<p className={cx("nav__title")}>Laptop</p>
										</Link>
									</div>
								</SwiperSlide>
								<SwiperSlide>
									<div className={cx("nav__item")}>
										<Link
											to="/"
											className={cx("nav__link")}
										>
											<img
												className={cx("nav__img")}
												src="https://images.thinkgroup.vn/unsafe/96x96/https://media-api-beta.thinkpro.vn/media/core/categories/2022/3/22/Case-may-tinh-thinkpro.png"
											/>
											<p className={cx("nav__title")}>Laptop</p>
										</Link>
									</div>
								</SwiperSlide>
								<SwiperSlide>
									<div className={cx("nav__item")}>
										<Link
											to="/"
											className={cx("nav__link")}
										>
											<img
												className={cx("nav__img")}
												src="https://images.thinkgroup.vn/unsafe/96x96/https://media-api-beta.thinkpro.vn/media/core/categories/2022/3/22/Case-may-tinh-thinkpro.png"
											/>
											<p className={cx("nav__title")}>Laptop</p>
										</Link>
									</div>
								</SwiperSlide>
								<SwiperSlide>
									<div className={cx("nav__item")}>
										<Link
											to="/"
											className={cx("nav__link")}
										>
											<img
												className={cx("nav__img")}
												src="https://images.thinkgroup.vn/unsafe/96x96/https://media-api-beta.thinkpro.vn/media/core/categories/2022/3/22/Case-may-tinh-thinkpro.png"
											/>
											<p className={cx("nav__title")}>Laptop</p>
										</Link>
									</div>
								</SwiperSlide>
								<SwiperSlide>
									<div className={cx("nav__item")}>
										<Link
											to="/"
											className={cx("nav__link")}
										>
											<img
												className={cx("nav__img")}
												src="https://images.thinkgroup.vn/unsafe/96x96/https://media-api-beta.thinkpro.vn/media/core/categories/2022/3/22/Case-may-tinh-thinkpro.png"
											/>
											<p className={cx("nav__title")}>Laptop</p>
										</Link>
									</div>
								</SwiperSlide>
								<SwiperSlide>
									<div className={cx("nav__item")}>
										<Link
											to="/"
											className={cx("nav__link")}
										>
											<img
												className={cx("nav__img")}
												src="https://images.thinkgroup.vn/unsafe/96x96/https://media-api-beta.thinkpro.vn/media/core/categories/2022/3/22/Case-may-tinh-thinkpro.png"
											/>
											<p className={cx("nav__title")}>Laptop</p>
										</Link>
									</div>
								</SwiperSlide>
								<SwiperSlide>
									<div className={cx("nav__item")}>
										<Link
											to="/"
											className={cx("nav__link")}
										>
											<img
												className={cx("nav__img")}
												src="https://images.thinkgroup.vn/unsafe/96x96/https://media-api-beta.thinkpro.vn/media/core/categories/2022/3/22/Case-may-tinh-thinkpro.png"
											/>
											<p className={cx("nav__title")}>Laptop</p>
										</Link>
									</div>
								</SwiperSlide>
								<SwiperSlide>
									<div className={cx("nav__item")}>
										<Link
											to="/"
											className={cx("nav__link")}
										>
											<img
												className={cx("nav__img")}
												src="https://images.thinkgroup.vn/unsafe/96x96/https://media-api-beta.thinkpro.vn/media/core/categories/2022/3/22/Case-may-tinh-thinkpro.png"
											/>
											<p className={cx("nav__title")}>Laptop</p>
										</Link>
									</div>
								</SwiperSlide>
								<SwiperSlide>
									<div className={cx("nav__item")}>
										<Link
											to="/"
											className={cx("nav__link")}
										>
											<img
												className={cx("nav__img")}
												src="https://images.thinkgroup.vn/unsafe/96x96/https://media-api-beta.thinkpro.vn/media/core/categories/2022/3/22/Case-may-tinh-thinkpro.png"
											/>
											<p className={cx("nav__title")}>Laptop</p>
										</Link>
									</div>
								</SwiperSlide>
								<SwiperSlide>
									<div className={cx("nav__item")}>
										<Link
											to="/"
											className={cx("nav__link")}
										>
											<img
												className={cx("nav__img")}
												src="https://images.thinkgroup.vn/unsafe/96x96/https://media-api-beta.thinkpro.vn/media/core/categories/2022/3/22/Case-may-tinh-thinkpro.png"
											/>
											<p className={cx("nav__title")}>Laptop</p>
										</Link>
									</div>
								</SwiperSlide>
							</Swiper>
						</Col>
						<Col
							span="2"
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
