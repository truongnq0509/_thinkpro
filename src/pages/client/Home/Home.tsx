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
import { IProduct } from "~/interfaces";
import { getProducts as apiGetProducts } from "~/services/productService";

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
	const [products, setProducts] = useState<IProduct[]>([]);

	useEffect(() => {
		const fetchApi = async () => {
			const response = await apiGetProducts();
			setProducts(response?.data);
		};
		fetchApi();
	}, []);

	return (
		<section className={cx("wrapper")}>
			<section className={cx("banner")}>
				<Row
					gutter={[0, 0]}
					style={{ height: "100%" }}
				>
					<Col span="8">
						<div className={cx("content")}>
							<h2>Giao diện mới, phục vụ bạn và người thân tốt hơn 💚💚💚</h2>
							<p>
								Sau 6 tháng cải tiến, ThinkPro chính thức ra mắt phiên bản Website mới. Đội ngũ ThinkPro
								luôn tự hào với sứ mệnh trở thành thương hiệu bán lẻ Laptop và đồ công nghệ tốt cho bạn
								và người thân!
							</p>
						</div>
					</Col>
					<Col span="16">
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
					grid={{ gutter: 24, column: 4 }}
					dataSource={data}
					renderItem={(item) => (
						<List.Item style={{ margin: 0 }}>
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
					<Col span="22">
						<Swiper
							// install Swiper modules
							modules={[Navigation, Pagination, Scrollbar, A11y]}
							spaceBetween={0}
							slidesPerView={11}
							navigation={{
								nextEl: `.${cx("next")}`,
								prevEl: `.${cx("prev")}`,
							}}
						>
							<SwiperSlide>
								<Link to="/">
									<Button
										size="large"
										style={{
											fontSize: "12px",
											border: "none",
											backgroundColor: "#fff",
											fontWeight: 500,
										}}
									>
										Điện Thoại
									</Button>
								</Link>
							</SwiperSlide>
							<SwiperSlide>
								<Link to="/">
									<Button
										size="large"
										style={{
											fontSize: "12px",
											border: "none",
											backgroundColor: "#fff",
											fontWeight: 500,
										}}
									>
										Điện Thoại
									</Button>
								</Link>
							</SwiperSlide>
							<SwiperSlide>
								<Link to="/">
									<Button
										size="large"
										style={{
											fontSize: "12px",
											border: "none",
											backgroundColor: "#fff",
											fontWeight: 500,
										}}
									>
										Điện Thoại
									</Button>
								</Link>
							</SwiperSlide>
							<SwiperSlide>
								<Link to="/">
									<Button
										size="large"
										style={{
											fontSize: "12px",
											border: "none",
											backgroundColor: "#fff",
											fontWeight: 500,
										}}
									>
										Điện Thoại
									</Button>
								</Link>
							</SwiperSlide>
							<SwiperSlide>
								<Link to="/">
									<Button
										size="large"
										style={{
											fontSize: "12px",
											border: "none",
											backgroundColor: "#fff",
											fontWeight: 500,
										}}
									>
										Điện Thoại
									</Button>
								</Link>
							</SwiperSlide>
							<SwiperSlide>
								<Link to="/">
									<Button
										size="large"
										style={{
											fontSize: "12px",
											border: "none",
											backgroundColor: "#fff",
											fontWeight: 500,
										}}
									>
										Điện Thoại
									</Button>
								</Link>
							</SwiperSlide>
							<SwiperSlide>
								<Link to="/">
									<Button
										size="large"
										style={{
											fontSize: "12px",
											border: "none",
											backgroundColor: "#fff",
											fontWeight: 500,
										}}
									>
										Điện Thoại
									</Button>
								</Link>
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
				<List
					grid={{ gutter: 16, column: 5 }}
					dataSource={products}
					renderItem={(product: IProduct) => (
						<List.Item>
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
