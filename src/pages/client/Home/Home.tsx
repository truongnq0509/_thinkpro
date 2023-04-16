import { Button, Col, List, Row, Space } from "antd";
import classNames from "classnames/bind";
import React, { useState, useEffect } from "react";
import { BiSupport } from "react-icons/bi";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { MdEmail } from "react-icons/md";
import { RiQuillPenFill } from "react-icons/ri";
import { TbClockHour8 } from "react-icons/tb";
import { Link } from "react-router-dom";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper";
import { Product } from "~/components/Product";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Swiper, SwiperSlide } from "swiper/react";
import styles from "./Home.module.scss";
import { ICategory, IProduct } from "~/interfaces";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "~/store";
import { getCategory } from "~/store/reducers/appSlice";

const cx = classNames.bind(styles);

const data = [
	{
		icon: <RiQuillPenFill color="#5ac262" />,
		content: (
			<span>
				Được <span style={{ color: "#5ac262" }}>trải nghiệm</span> sản phẩm.
			</span>
		),
	},
	{
		icon: <BiSupport color="#3295fb" />,
		content: (
			<span>
				Tư vấn viên <span style={{ color: "#3295fb" }}>tận tâm </span> và có
				<span style={{ color: "#3295fb" }}> chuyên môn.</span>
			</span>
		),
	},
	{
		icon: <MdEmail color="#fa664c" />,
		content: (
			<span>
				Chúng tôi có Trung tâm
				<span style={{ color: "#fa664c" }}> bảo vệ quyền lợi</span> khách hàng.
			</span>
		),
	},
	{
		icon: <TbClockHour8 color="#712eff" />,
		content: (
			<span>
				Thời gian <span style={{ color: "#712eff" }}>phục vụ</span> đến{" "}
				<span style={{ color: "#712eff" }}>23:59</span> .
			</span>
		),
	},
];

const HomePage: React.FC = () => {
	const { products, categories } = useSelector((state: RootState) => state.app);
	const dispatch = useDispatch<AppDispatch>();
	const [slug, setSlug] = useState<string>("ban-phim");

	useEffect(() => {
		dispatch(getCategory((categories[0]?.slug as string) || "ban-phim"));
	}, []);

	const handleClick = (slug: string) => {
		setSlug(slug);
		dispatch(getCategory(slug));
	};

	return (
		<section className={cx("wrapper")}>
			<section className={cx("banner")}>
				<Row
					gutter={[0, 0]}
					style={{ height: "100%" }}
				>
					<Col
						xs={0}
						sm={0}
						md={8}
						lg={8}
						xl={8}
						xxl={8}
					>
						<div className={cx("content")}>
							<h2>Giao diện mới, phục vụ bạn và người thân tốt hơn 💚💚💚</h2>
							<p>
								Sau 6 tháng cải tiến, ThinkPro chính thức ra mắt phiên bản Website mới. Đội ngũ ThinkPro
								luôn tự hào với sứ mệnh trở thành thương hiệu bán lẻ Laptop và đồ công nghệ tốt cho bạn
								và người thân!
							</p>
						</div>
					</Col>
					<Col
						xs={24}
						sm={24}
						md={16}
						lg={16}
						xl={16}
						xxl={16}
					>
						<img
							src="https://images.thinkgroup.vn/unsafe/1600x600/https://media-api-beta.thinkpro.vn/media/core/categories/2023/3/16/329409720_776699303816616_5609673989706713871_n.jpeg"
							className={cx("image")}
						/>
					</Col>
				</Row>
			</section>
			<section className={cx("usp")}>
				<h2>
					<span>ThinkPro</span>
					<span>Là nơi để bạn và người thân tin tưởng lựa chọn</span>
				</h2>
				<List
					grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 2, xl: 4, xxl: 4 }}
					dataSource={data}
					renderItem={(item) => (
						<List.Item style={{ height: "100%" }}>
							<div className={cx("item")}>
								<div className={cx("item__icon")}>{item.icon}</div>
								<div className={cx("item__content")}>{item.content}</div>
							</div>
						</List.Item>
					)}
					className={cx("items")}
				/>
			</section>
			<section className={cx("suggestion")}>
				<h2>Gợi ý cho bạn</h2>
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
							modules={[Navigation, Pagination, Scrollbar, A11y]}
							spaceBetween={10}
							slidesPerView="auto"
							navigation={{
								nextEl: `.${cx("next")}`,
								prevEl: `.${cx("prev")}`,
							}}
						>
							{categories?.map((category: ICategory) => {
								return (
									<SwiperSlide
										key={category?._id}
										style={{ width: "auto" }}
									>
										<Button
											size="large"
											style={{
												fontSize: "12px",
												border: "none",
												fontWeight: 500,
												background: category?.slug == slug ? "#0065ee1a" : "#fff",
												color: category?.slug == slug ? "#0065ee" : "#333",
											}}
											onClick={() => handleClick(category?.slug as string)}
										>
											{category?.name}
										</Button>
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
				<List
					grid={{ gutter: 12, xs: 1, sm: 2, md: 4, lg: 4, xl: 5, xxl: 5 }}
					dataSource={products}
					style={{
						height: "100%",
					}}
					renderItem={(product: IProduct) => (
						<List.Item style={{ height: "100%" }}>
							<Link to={`/products/${product?.slug}`}>
								<Product product={product} />
							</Link>
						</List.Item>
					)}
					className={cx("products")}
				/>
			</section>
		</section>
	);
};

export default HomePage;
