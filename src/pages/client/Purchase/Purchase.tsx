import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Purchase.module.scss";
import { getOrderByUser as apiGetOrderByUser } from "~/services/orderService";
import { List, Button, Space, Tabs } from "antd";
import { formatNumber } from "~/utils/fc";
import moment from "moment/moment";
import type { TabsProps } from "antd";
import Swal from "sweetalert2";
import { cancelOrder as apiChangeOrderStatus } from "~/services/orderService";
import { Link } from "react-router-dom";

type Props = {};
const cx = classNames.bind(styles);

let locale = {
	emptyText: (
		<span className={cx("empty")}>
			<svg
				fill="none"
				height="128"
				viewBox="0 0 128 128"
				width="128"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					clipRule="evenodd"
					d="M103.933 71.234H23.9326V108.258C23.9326 110.024 25.0906 111.582 26.7826 112.09C34.8206 114.5 57.4246 121.282 62.7826 122.89C63.5326 123.114 64.3326 123.114 65.0826 122.89C70.4406 121.282 93.0446 114.5 101.083 112.09C102.775 111.582 103.933 110.024 103.933 108.258C103.933 98.986 103.933 71.234 103.933 71.234Z"
					fillRule="evenodd"
					style={{ fill: "rgb(0, 101, 238)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M103.933 71.234H63.9327C63.9327 71.234 63.5447 123.058 63.9327 123.058C64.3207 123.058 64.7067 123.002 65.0827 122.89C70.4407 121.282 93.0447 114.5 101.083 112.09C102.775 111.582 103.933 110.024 103.933 108.258C103.933 98.986 103.933 71.234 103.933 71.234Z"
					fillRule="evenodd"
					style={{ fill: "rgb(0, 71, 167)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M63.9326 84.212L23.9326 71.234C23.9326 71.234 16.9186 81.634 13.7826 86.282C13.4306 86.804 13.3446 87.458 13.5486 88.052C13.7546 88.646 14.2246 89.108 14.8226 89.304C22.4206 91.772 44.9126 99.08 50.8126 100.996C51.6586 101.272 52.5866 100.954 53.0866 100.216C55.7686 96.258 63.9326 84.212 63.9326 84.212Z"
					fillRule="evenodd"
					style={{ fill: "rgb(0, 71, 167)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M103.933 71.234L63.9326 84.212C63.9326 84.212 72.0966 96.258 74.7786 100.216C75.2786 100.954 76.2066 101.272 77.0526 100.996C82.9526 99.08 105.445 91.772 113.043 89.304C113.641 89.108 114.111 88.646 114.317 88.052C114.521 87.458 114.435 86.804 114.083 86.282C110.947 81.634 103.933 71.234 103.933 71.234Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M54.2507 43.972C53.7507 43.238 52.8247 42.92 51.9787 43.196C46.0827 45.11 23.5847 52.42 15.9867 54.89C15.3887 55.084 14.9167 55.546 14.7127 56.14C14.5087 56.734 14.5947 57.39 14.9467 57.91C17.8347 62.194 23.9327 71.234 23.9327 71.234L63.9327 58.212C63.9327 58.212 56.7487 47.646 54.2507 43.972Z"
					fillRule="evenodd"
					style={{ fill: "rgb(78, 153, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M112.919 57.91C113.271 57.39 113.357 56.734 113.153 56.14C112.949 55.546 112.477 55.084 111.879 54.89C104.281 52.42 81.7826 45.11 75.8866 43.196C75.0406 42.92 74.1146 43.238 73.6146 43.972C71.1166 47.646 63.9326 58.212 63.9326 58.212L103.933 71.234C103.933 71.234 110.031 62.194 112.919 57.91Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M103.933 71.234L63.9326 58.212L23.9326 71.234L63.9326 84.212L103.933 71.234Z"
					fillRule="evenodd"
					style={{ fill: "rgb(0, 101, 238)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M63.9326 84.212V58.212L23.9326 71.234L63.9326 84.212Z"
					fillRule="evenodd"
					style={{ fill: "rgb(0, 71, 167)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M55.8967 63.956C55.0647 63.412 54.3147 62.83 53.6487 62.22C52.8367 61.474 51.5707 61.528 50.8227 62.342C50.0767 63.154 50.1307 64.42 50.9447 65.166C51.7627 65.918 52.6847 66.634 53.7087 67.304C54.6327 67.908 55.8727 67.648 56.4767 66.724C57.0807 65.8 56.8207 64.56 55.8967 63.956Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M49.6649 57.812C49.0709 57.006 48.5689 56.196 48.1569 55.386C47.6569 54.402 46.4509 54.01 45.4669 54.51C44.4829 55.01 44.0909 56.216 44.5909 57.2C45.0989 58.196 45.7149 59.194 46.4449 60.184C47.0989 61.072 48.3509 61.262 49.2409 60.608C50.1289 59.952 50.3189 58.7 49.6649 57.812Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M46.7408 49.65C46.7608 48.844 46.8788 48.062 47.0948 47.312C47.3988 46.252 46.7848 45.142 45.7228 44.838C44.6628 44.534 43.5528 45.148 43.2488 46.21C42.9428 47.282 42.7708 48.4 42.7408 49.55C42.7148 50.654 43.5868 51.572 44.6908 51.598C45.7948 51.626 46.7128 50.754 46.7408 49.65Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M49.817 42.97C50.331 42.494 50.907 42.054 51.537 41.656C52.471 41.066 52.751 39.83 52.163 38.898C51.573 37.964 50.337 37.684 49.403 38.272C48.557 38.806 47.789 39.396 47.099 40.036C46.289 40.786 46.241 42.052 46.991 42.862C47.741 43.672 49.007 43.72 49.817 42.97Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M57.2546 39.52C58.2606 39.334 59.3266 39.214 60.4506 39.168C61.5546 39.12 62.4106 38.186 62.3646 37.084C62.3186 35.982 61.3846 35.124 60.2806 35.17C58.9606 35.226 57.7086 35.368 56.5266 35.586C55.4426 35.788 54.7226 36.832 54.9246 37.916C55.1246 39.002 56.1686 39.72 57.2546 39.52Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M67.6788 39.402C69.3848 39.422 70.9728 39.362 72.4468 39.232C73.5468 39.134 74.3608 38.162 74.2628 37.062C74.1648 35.964 73.1928 35.15 72.0928 35.248C70.7428 35.366 69.2888 35.422 67.7248 35.402C66.6208 35.39 65.7148 36.276 65.7028 37.378C65.6888 38.482 66.5748 39.39 67.6788 39.402Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M79.0208 38.006C81.0008 37.4 82.6728 36.624 84.0728 35.734C85.0028 35.14 85.2788 33.904 84.6848 32.972C84.0928 32.042 82.8548 31.766 81.9228 32.36C80.7968 33.076 79.4468 33.692 77.8508 34.18C76.7968 34.504 76.2008 35.622 76.5248 36.678C76.8468 37.734 77.9668 38.328 79.0208 38.006Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M89.2009 30.136C90.1449 28.184 90.5069 26.12 90.4149 24.13C90.3629 23.026 89.4249 22.174 88.3229 22.226C87.2209 22.278 86.3669 23.214 86.4189 24.316C86.4829 25.668 86.2389 27.07 85.5989 28.396C85.1189 29.39 85.5349 30.588 86.5289 31.068C87.5229 31.548 88.7209 31.13 89.2009 30.136Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M87.9266 17.058C86.4686 15.088 84.4906 13.716 82.3346 13.274C81.2526 13.054 80.1946 13.75 79.9726 14.832C79.7526 15.914 80.4506 16.972 81.5306 17.194C82.7746 17.448 83.8706 18.302 84.7126 19.44C85.3706 20.326 86.6246 20.512 87.5106 19.856C88.3986 19.198 88.5846 17.944 87.9266 17.058Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M61.7988 13.662C63.9628 1.408 82.7168 2.2 71.7988 13.662H61.7988Z"
					fillRule="evenodd"
					style={{ fill: "rgb(0, 101, 238)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M61.7988 16.766C63.9628 29.018 82.7168 28.228 71.7988 16.766H61.7988Z"
					fillRule="evenodd"
					style={{ fill: "rgb(0, 101, 238)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M61.6187 17.234H75.0107C76.1147 17.234 77.0107 16.338 77.0107 15.234C77.0107 14.13 76.1147 13.234 75.0107 13.234H61.6187C60.5167 13.234 59.6187 14.13 59.6187 15.234C59.6187 16.338 60.5167 17.234 61.6187 17.234Z"
					fillRule="evenodd"
					style={{ fill: "rgb(0, 71, 167)" }}
				></path>
			</svg>
			<h4>Không có đơn hàng nào</h4>
			<p className={cx("empty__text")}>Hãy thoái mãi lựa sản phẩm bạn nhé</p>
		</span>
	),
};

const Purchase = (props: Props) => {
	const [orders, setOrders] = useState<any>([]);
	const [filter, setFilter] = useState<any>(orders);
	const [key, setKey] = useState<any>(1);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchApi = async () => {
			const { data } = await apiGetOrderByUser();
			setOrders(data);
			setFilter(data);
		};
		fetchApi();
	}, []);

	const checkOrderStatus = (status: string) => {
		switch (status) {
			case "processing":
				return {
					status: "Đang xử lý",
					color: "#ffe066",
					background: "#ffe0661a",
				};
			case "confirmed":
				return {
					status: "Đã xác nhận",
					color: "#0abb87",
					background: "#0abb871a",
				};
			case "delivering":
				return {
					status: "Đang vận chuyển",
					color: "#0abb87",
					background: "#0abb871a",
				};
			case "cancelled":
				return {
					status: "Đã hủy",
					color: "#fe3464",
					background: "#fe34641a",
				};
			case "delivered":
				return {
					status: "Hoàn thành",
					color: "#0abb87",
					background: "#0abb871a",
				};
		}
	};

	const filterOrderStatus = (key: any) => {
		let arr = [];
		setKey(key);
		switch (key) {
			case "1":
				arr = orders;
				break;
			case "2":
				arr = orders.filter((order: any) => !order?.payment?.status && order?.status !== "cancelled");
				break;
			case "3":
				arr = orders.filter((order: any) => order?.status === "delivering");
				break;
			case "4":
				arr = orders.filter((order: any) => order?.status === "delivered" && order?.payment?.status);
				break;
			case "5":
				arr = orders.filter((order: any) => order?.status === "cancelled");
				break;
		}
		setFilter(arr);
	};

	const handleOrderCancel = async (id: string) => {
		try {
			await apiChangeOrderStatus(
				{
					status: "cancelled",
				},
				id
			);
			const newOrders = filter.map((order: any) => {
				if (order?._id == id) {
					order.status = "cancelled";
				}
				return order;
			});
			setFilter(newOrders);
			Swal.fire("Đã hủy", "", "success");
		} catch (error) {
			Swal.fire("Thất bại", "", "error");
		}
	};

	const children = (
		<List
			grid={{ gutter: 12, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
			dataSource={filter}
			locale={locale}
			renderItem={(order: any) => {
				let showButton = true;
				const currentTime = new Date(); // Thời gian hiện tại
				const pastTime = new Date(order?.createdAt); // Thời gian cần so sánh
				// Thêm 15 phút vào thời gian đã trôi qua
				const fifteenMinutesLater = new Date(pastTime.getTime() + 15 * 60 * 1000);

				// Vượt quá thời gian 15 phút
				if (currentTime > fifteenMinutesLater || order?.payment?.status) {
					showButton = false;
				}

				return (
					<List.Item>
						<div className={cx("order__container")}>
							<div className="order__title">
								<h1>Mã đơn hàng #{order?._id}</h1>
								<p>Ngày đặt hàng: {moment(order?.createdAt).format("DD-MM-YYYY HH:mm:ss")}</p>
								<Link
									to={`/tai-khoan/don-mua/${order?._id}`}
									style={{
										fontSize: 12,
										fontWeight: 500,
									}}
								>
									Xem chi tiết
								</Link>
							</div>
							<Space
								size="small"
								split={"|"}
							>
								{key != "2" && (
									<Button
										className={cx("btn")}
										style={{
											color: checkOrderStatus(order?.status as string)?.color,
											backgroundColor: checkOrderStatus(order?.status as string)?.background,
											cursor: "default",
										}}
									>
										{checkOrderStatus(order?.status as string)?.status}
									</Button>
								)}

								{(key == "2" || key == "3" || key == "4") && (
									<Button
										className={cx("btn")}
										style={{
											color: order?.payment?.status ? "#0abb87" : "#fe3464",
											backgroundColor: order?.payment?.status ? "#0abb871a" : "#fe34641a",
											cursor: "default",
										}}
									>
										{order?.payment?.status ? "Đã thanh toán" : "Chưa thanh toán"}
									</Button>
								)}
								{((key == "1" && order?.status == "processing" && showButton) ||
									(key == "1" && order?.status == "confirmed" && showButton)) && (
									<Button
										className={cx("btn")}
										style={{
											color: "#fe3464",
											backgroundColor: "#fe34641a",
										}}
										loading={loading}
										onClick={() => handleOrderCancel(order?._id)}
									>
										Hủy
									</Button>
								)}
							</Space>
						</div>
						{order?.products?.map((product: any, index: number) => (
							<div
								key={index}
								className={cx("order__item")}
							>
								<div className={cx("order__img")}>
									<img
										src={product?.thumbnail?.path}
										alt="thubmnail"
									/>
								</div>
								<div className={cx("order__box")}>
									<div className={cx("order__top")}>
										<div className={cx("order__top--left")}>
											<h1>{product?.name}</h1>
											<p>x {product?.quantity}</p>
										</div>
										<div className={cx("order__top--right")}>
											<span>{formatNumber(`${product?.price}`)}</span>
											<span>{formatNumber(`${product?.discount}`)}</span>
										</div>
									</div>
								</div>
							</div>
						))}
						<div className={cx("order__bill")}>
							<span>
								Thành Tiền: <span>{formatNumber(`${order?.bill}`)}</span>
							</span>
						</div>
					</List.Item>
				);
			}}
		/>
	);

	const items: TabsProps["items"] = [
		{
			key: "1",
			label: `Tất Cả`,
			children,
		},
		{
			key: "2",
			label: `Chờ thanh toán`,
			children,
		},
		{
			key: "3",
			label: `Vận chuyển`,
			children,
		},
		{
			key: "4",
			label: `Hoàn thành`,
			children,
		},
		{
			key: "5",
			label: `Đã hủy`,
			children,
		},
	];

	return (
		<div className={cx("wrapper")}>
			<div className={cx("header")}>
				<h1>Đơn Hàng Của Tôi</h1>
				<p>Mọi thông tin cơ bản về đơn hàng của bạn</p>
			</div>
			<div className={cx("body")}>
				<Tabs
					defaultActiveKey="1"
					items={items}
					onChange={filterOrderStatus}
				/>
			</div>
		</div>
	);
};

export default Purchase;
