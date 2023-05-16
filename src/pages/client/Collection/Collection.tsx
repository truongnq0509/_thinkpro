import { Button, List, Tooltip, Radio, Space, Row, Col, Skeleton } from "antd";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import slugify from "react-slugify";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { Product } from "~/components/Product";
import { IBrand, IProduct } from "~/interfaces";
import { AppDispatch, RootState } from "~/store";
import { getBrand, getCategory } from "~/store/reducers/collectionSlice";
import styles from "./Collection.module.scss";
import { MdKeyboardArrowDown, MdOutlineArrowRightAlt } from "react-icons/md";
import type { RadioChangeEvent } from "antd";
import { useTitle } from "~/hooks";

const cx = classNames.bind(styles);

type Props = {};
interface IFilter {
	name: string | React.ReactNode;
	value: number;
	sort: string;
	order: string;
}

let locale = {
	emptyText: (
		<span className={cx("empty")}>
			<svg
				fill="none"
				height="96"
				viewBox="0 0 96 96"
				width="96"
				xmlns="http://www.w3.org/2000/svg"
				style={{ color: "rgb(0, 101, 238)" }}
			>
				<path
					clipRule="evenodd"
					d="M25.8159 13.065C25.8159 12.666 25.9734 12.285 26.2554 12.0045C26.5359 11.7225 26.9184 11.565 27.3159 11.565H61.1469L78.3159 30.603V54.5325C78.3159 54.5325 78.3699 74.298 72.7554 83.7345C72.4824 84.168 72.0054 84.4305 71.4924 84.4305C65.7519 84.435 31.6704 84.435 22.1424 84.435C21.6174 84.435 21.1299 84.159 20.8584 83.7075C20.5869 83.256 20.5734 82.695 20.8209 82.2315C25.4754 72.1245 25.8159 54.5325 25.8159 54.5325V13.065Z"
					fillRule="evenodd"
					style={{ fill: "currentcolor", opacity: "0.4" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M78.3159 54.5625C78.3159 54.5625 78.3699 74.328 72.7554 83.7645C72.4824 84.198 72.0054 84.4605 71.4924 84.4605C65.7519 84.465 31.6704 84.465 22.1424 84.465C21.6174 84.465 21.1299 84.1875 20.8584 83.736C20.5869 83.286 20.5734 82.725 20.8209 82.26L20.8794 82.131C39.3504 82.9995 66.1734 79.764 69.7059 78.381C73.4799 76.9035 78.2409 62.7255 78.3144 54.7485L78.3159 54.5625Z"
					fill="currentColor"
					fillRule="evenodd"
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M78.3155 30.603C73.7615 28.8045 68.9405 28.7535 63.992 29.5185C63.533 29.5905 63.0665 29.445 62.729 29.124C62.3915 28.803 62.2235 28.344 62.273 27.882C62.816 22.341 62.2685 16.92 61.1465 11.565C68.4035 16.9515 74.1335 23.2935 78.3155 30.603Z"
					fill="currentColor"
					fillRule="evenodd"
				></path>{" "}
				<path
					d="M78.9941 78C87.2784 78 93.9941 71.2843 93.9941 63C93.9941 54.7157 87.2784 48 78.9941 48C70.7099 48 63.9941 54.7157 63.9941 63C63.9941 71.2843 70.7099 78 78.9941 78Z"
					fill="currentColor"
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M77.4941 55.5V70.5C77.4941 71.328 78.1661 72 78.9941 72C79.8221 72 80.4941 71.328 80.4941 70.5V55.5C80.4941 54.672 79.8221 54 78.9941 54C78.1661 54 77.4941 54.672 77.4941 55.5Z"
					fill="#EEFEFB"
					fillRule="evenodd"
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M86.4941 61.5H71.4941C70.6661 61.5 69.9941 62.172 69.9941 63C69.9941 63.828 70.6661 64.5 71.4941 64.5H86.4941C87.3221 64.5 87.9941 63.828 87.9941 63C87.9941 62.172 87.3221 61.5 86.4941 61.5Z"
					fill="#EEFEFB"
					fillRule="evenodd"
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M25.8145 22.077V43.3455C27.8005 39.741 30.9775 36.9045 34.8325 35.346C35.902 34.914 36.9625 34.485 37.9075 34.1025C38.4745 33.8745 38.845 33.324 38.845 32.712C38.845 32.1015 38.4745 31.551 37.9075 31.3215C36.964 30.9405 35.905 30.513 34.837 30.081C30.979 28.5225 27.802 25.6845 25.8145 22.077Z"
					fill="#EEFEFB"
					fillRule="evenodd"
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M36.7503 32.2845C37.3173 32.055 37.6893 31.5045 37.6893 30.8925C37.6893 30.282 37.3173 29.7315 36.7503 29.502C35.8068 29.121 34.7478 28.6935 33.6798 28.2615C29.1543 26.433 25.5663 22.845 23.7363 18.3195C23.3028 17.2485 22.8738 16.188 22.4913 15.2415C22.2618 14.6745 21.7113 14.304 21.1008 14.304C20.4888 14.304 19.9383 14.6745 19.7103 15.2415C19.3278 16.185 18.9003 17.244 18.4698 18.312C16.6413 22.836 13.0533 26.4255 8.52931 28.2555C7.45681 28.689 6.39331 29.1195 5.44531 29.502C4.87981 29.7315 4.50781 30.282 4.50781 30.8925C4.50781 31.5045 4.87981 32.055 5.44531 32.283C6.39331 32.667 7.45681 33.0975 8.53081 33.531C13.0548 35.361 16.6428 38.9505 18.4698 43.476C18.9018 44.5425 19.3293 45.6 19.7088 46.5435C19.9383 47.1105 20.4888 47.481 21.1008 47.481C21.7113 47.481 22.2618 47.1105 22.4913 46.5435C22.8723 45.5985 23.3013 44.538 23.7333 43.4685C25.5633 38.9445 29.1513 35.3565 33.6753 33.5265C34.7463 33.0945 35.8053 32.6655 36.7503 32.2845Z"
					fill="currentColor"
					fillRule="evenodd"
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M52.8879 59.016C53.3379 58.8345 53.6304 58.3995 53.6304 57.915C53.6304 57.4305 53.3379 56.9955 52.8879 56.814C52.8879 56.814 52.8864 56.814 52.8864 56.8125C48.7509 55.1415 45.4704 51.8625 43.7979 47.727C43.7964 47.724 43.7964 47.7225 43.7949 47.7195C43.6134 47.271 43.1784 46.977 42.6939 46.977C42.2094 46.977 41.7744 47.271 41.5929 47.7195V47.721C39.9219 51.8565 36.6429 55.137 32.5059 56.8095C32.5044 56.811 32.5014 56.811 32.4999 56.8125C32.0499 56.994 31.7559 57.4305 31.7559 57.915C31.7559 58.3995 32.0499 58.836 32.4999 59.0175C32.5029 59.019 32.5059 59.0205 32.5089 59.0205C36.6429 60.693 39.9219 63.9735 41.5929 68.109C41.5929 68.1105 41.5929 68.112 41.5944 68.1135C41.7759 68.5605 42.2109 68.8545 42.6939 68.8545C43.1769 68.8545 43.6119 68.562 43.7934 68.1135C43.7949 68.1105 43.7949 68.109 43.7964 68.1075C45.4689 63.9705 48.7479 60.69 52.8849 59.0175C52.8864 59.0175 52.8879 59.016 52.8879 59.016Z"
					fill="currentColor"
					fillRule="evenodd"
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M51.6208 57.4785C52.0618 57.2985 52.3513 56.8695 52.3513 56.3925C52.3513 55.9155 52.0618 55.4865 51.6193 55.308C51.6193 55.308 51.6193 55.308 51.6178 55.308C47.5438 53.661 44.3113 50.43 42.6643 46.356C42.6628 46.353 42.6628 46.3515 42.6613 46.3485C42.4828 45.906 42.0538 45.6165 41.5768 45.6165C41.0998 45.6165 40.6708 45.906 40.4923 46.3485L40.4908 46.35C38.8453 50.424 35.6143 53.6565 31.5403 55.3035C31.5373 55.305 31.5358 55.3065 31.5328 55.3065C31.0903 55.4865 30.8008 55.9155 30.8008 56.3925C30.8008 56.871 31.0903 57.3 31.5328 57.4785C31.5358 57.48 31.5388 57.4815 31.5418 57.483C35.6158 59.13 38.8453 62.3625 40.4908 66.4365C40.4923 66.438 40.4923 66.438 40.4923 66.4395C40.6708 66.882 41.0998 67.17 41.5768 67.17C42.0523 67.17 42.4813 66.882 42.6598 66.4395C42.6613 66.438 42.6613 66.4365 42.6628 66.4335C44.3098 62.358 47.5408 59.127 51.6163 57.4785H51.6208Z"
					fill="#EEFEFB"
					fillRule="evenodd"
				></path>
			</svg>
			<h4>Không có kết quả</h4>
			<p className={cx("empty__text")}>Đừng lo, ThinkPro luôn sẵn sàng tư vấn miễn phí nếu bạn cần hỗ trợ thêm</p>
			<Button
				size="large"
				style={{
					color: "#fff",
					background: "#0065ee",
					border: "none",
					fontWeight: 500,
					display: "inline-flex",
					alignItems: "center",
					padding: "0 16px",
					height: "48px",
					borderRadius: 4,
				}}
			>
				Tư vấn miễn phí
			</Button>
		</span>
	),
};

const filters: IFilter[] = [
	{
		name: "Nổi bật nhất",
		value: 1,
		sort: "createdAt",
		order: "asc",
	},
	{
		name: (
			<>
				Giá thấp <MdOutlineArrowRightAlt /> cao
			</>
		),
		value: 2,
		sort: "price",
		order: "asc",
	},
	{
		name: (
			<>
				Giá cao <MdOutlineArrowRightAlt /> thấp
			</>
		),
		value: 3,
		sort: "price",
		order: "desc",
	},
	{
		name: (
			<>
				Tên A <MdOutlineArrowRightAlt /> Z
			</>
		),
		value: 4,
		sort: "name",
		order: "asc",
	},
	{
		name: (
			<>
				Tên Z <MdOutlineArrowRightAlt /> A
			</>
		),
		value: 5,
		sort: "name",
		order: "desc",
	},
];

const Collection = (props: Props) => {
	// router
	const { slug: slugRouter } = useParams();
	const localtion: any = useLocation();
	const {
		state: { slug, isSlug },
	} = localtion;

	// redux
	const dispatch = useDispatch<AppDispatch>();
	const { products, category, brands, brand, loading } = useSelector((state: RootState) => state.collection);
	const [name, setName] = useState<{ value: number; name: string }>({
		value: 1,
		name: "Nổi bật nhất",
	});

	useTitle(`${category?.name || brand?.name} giá rẻ, chính hãng, Trả góp 0% 04/2023| THINKPRO`);

	useEffect(() => {
		if (isSlug) {
			dispatch(
				getBrand({
					slug: slug,
					_limit: "20",
				})
			);
		} else {
			dispatch(
				getCategory({
					slug: slug,
					_limit: "20",
				})
			);
		}
		window.scrollTo(0, 0);
	}, [slug]);

	const handleChange = async (e: RadioChangeEvent, item: IFilter) => {
		setName({
			value: item.value,
			name: item.name as string,
		});
		if (isSlug)
			return dispatch(
				getBrand({
					slug,
					_order: item.order,
					_sort: item.sort,
					_limit: "20",
				})
			);

		dispatch(
			getCategory({
				slug,
				_order: item.order,
				_sort: item.sort,
				_limit: "20",
			})
		);
	};

	return (
		<section className={cx("wrapper")}>
			<section className={cx("collection")}>
				{brand.image && (
					<section className={cx("collection__img")}>
						<img
							src={brand?.image?.path as string}
							alt="brands"
						/>
					</section>
				)}

				<section
					className={cx("collection__desc")}
					style={{ marginLeft: brand.image && "24px" }}
				>
					<h1 className={cx("collection__title")}>{category?.name || brand?.name}</h1>
					<p>{category?.description || brand.description}</p>
					{brands?.length > 0 && <div className={cx("line")}></div>}
					<Row gutter={[8, 8]}>
						{(brand?.children?.length as number) > 0 && (
							<Col>
								<Link
									to={`/${slugRouter}`}
									state={{
										slug: brand?.slug,
										isSlug: true,
									}}
								>
									<Button
										size="large"
										style={{
											fontSize: "12px",
											border: "none",
											fontWeight: 400,
											background: "#f6f9fc",
											color: "#333",
										}}
									>
										Tất Cả
									</Button>
								</Link>
							</Col>
						)}
						{brands?.map((brand: IBrand) => {
							return (
								<Col key={brand?._id}>
									<Link
										to={`/${slugRouter}-${slugify(brand.name)}`}
										state={{
											slug: brand?.slug,
											isSlug: true,
										}}
									>
										<Button
											size="large"
											style={{
												fontSize: "12px",
												border: "none",
												fontWeight: 400,
												background: "#f6f9fc",
												color: "#333",
											}}
										>
											{brand.name}
										</Button>
									</Link>
								</Col>
							);
						})}
					</Row>
				</section>
			</section>

			<section className={cx("filter")}>
				<Swiper
					modules={[Navigation, Pagination, Scrollbar, A11y]}
					spaceBetween={10}
					slidesPerView="auto"
				>
					<SwiperSlide>
						<Tooltip
							title={() => {
								return (
									<Radio.Group value={name.value}>
										<Space direction="vertical">
											{filters.map((item: IFilter, index: number) => {
												return (
													<Radio
														key={index}
														value={item.value}
														onChange={(e) => handleChange(e, item)}
														className={cx("filter__radio")}
													>
														{item.name}
													</Radio>
												);
											})}
										</Space>
									</Radio.Group>
								);
							}}
							trigger={"click"}
							placement="bottom"
							className={cx("filter__tooltip")}
							color="#fff"
						>
							<Button
								size="middle"
								className={cx("filter__btn")}
							>
								Sắp xếp: <span style={{ marginLeft: 4, lineHeight: 1.4 }}>{name.name}</span>
								<MdKeyboardArrowDown size={16} />
							</Button>
						</Tooltip>
					</SwiperSlide>
				</Swiper>
			</section>

			<List
				grid={{ gutter: 12, xs: 1, sm: 2, md: 4, lg: 4, xl: 5, xxl: 5 }}
				dataSource={products}
				locale={locale}
				renderItem={(product: IProduct) => (
					<List.Item style={{ height: "100%" }}>
						<Skeleton
							active
							loading={loading}
							title={{ className: cx("skeleton__img") }}
							paragraph={{
								rows: 3,
								width: ["100%", 160, 100],
							}}
							className={cx("skeleton")}
						>
							<Link
								to={`/${slug}/${product?.slug}`}
								state={{
									slug: product?.slug,
								}}
							>
								<Product product={product} />
							</Link>
						</Skeleton>
					</List.Item>
				)}
				className={cx("products")}
			/>
		</section>
	);
};

export default Collection;
