import { Button, Col, Row, Steps } from "antd";
import classNames from "classnames/bind";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { BiStar } from "react-icons/bi";
import { BsPersonFillCheck } from "react-icons/bs";
import { HiCheckCircle } from "react-icons/hi";
import { MdOutlineLocalShipping } from "react-icons/md";
import { useParams } from "react-router";
import { getOrder as apiGetOrder, payMomo as apiPayMomo, payVnpay as apiPayVnpay } from "~/services/orderService";
import { formatNumber } from "~/utils/fc";
import styles from "./Order.module.scss";

type Props = {};
const cx = classNames.bind(styles);

const OrderPage = (props: Props) => {
	const { id } = useParams();
	const [order, setOrder] = useState<any>({});

	useEffect(() => {
		const fetchApi = async () => {
			const { data } = await apiGetOrder(id as string);
			setOrder(data);
		};
		fetchApi();
	}, [id]);

	const checkOrderStatus = (status: string) => {
		switch (status) {
			case "processing":
				return 0;
			case "confirmed":
				return 1;
			case "delivering":
				return 2;
			case "delivered":
				return 3;
		}
	};

	const handlePayment = async () => {
		switch (order?.payment?.methods) {
			case "VNPAY":
				const { data: vnpay } = await apiPayVnpay({
					bill: order?.bill,
					orderId: id,
				});
				return (window.location.href = vnpay?.url);
			case "MOMO":
				const { data: momo } = await apiPayMomo({
					bill: order?.bill,
					orderId: id,
				});
				return (window.location.href = momo?.url);
		}
	};

	return (
		<div className={cx("wrapper")}>
			<div className={cx("header")}>
				<div className={cx("header__left")}>
					<h1>Chi tiết đơn hàng</h1>
					<p>Mã đơn hàng: #{id}</p>
				</div>
				<div className={cx("header__right")}>
					{!order?.payment?.status && order?.status != "cancelled" && (
						<Button
							className={cx("btn")}
							style={{
								color: "#fe3464",
								backgroundColor: "#fe34641a",
								cursor: order?.payment?.methods == "COD" ? "default" : "",
							}}
							onClick={handlePayment}
						>
							{order?.payment?.methods == "COD" ? "Thanh toán khi nhận hàng" : "Thanh toán"}
						</Button>
					)}
					{order?.payment?.status && (
						<Button
							className={cx("btn")}
							style={{
								color: "#0abb87",
								backgroundColor: "#0abb871a",
								cursor: "default",
							}}
						>
							{order?.payment?.methods == "COD" ? "Thanh toán khi nhận hàng" : ""}
						</Button>
					)}
				</div>
			</div>
			<div className={cx("body")}>
				<div className={cx("order")}>
					{order?.status !== "cancelled" ? (
						<Steps
							current={checkOrderStatus(order?.status)}
							status="process"
							labelPlacement="vertical"
							style={{
								color: "red",
							}}
							items={[
								{
									icon: <HiCheckCircle />,
									description: <span style={{ fontSize: 12 }}>Đang xử lý</span>,
								},
								{
									icon: <BsPersonFillCheck />,
									description: <span style={{ fontSize: 12 }}>Đã xác nhận</span>,
								},
								{
									icon: <MdOutlineLocalShipping />,
									description: <span style={{ fontSize: 12 }}>Đang giao hàng</span>,
								},
								{
									icon: <BiStar />,
									description: <span style={{ fontSize: 12 }}>Đã hoàn thành</span>,
								},
							]}
						/>
					) : (
						<h1 className={cx("title")}>
							Đã hủy đơn hàng vào: {moment(order?.updatedAt).format("DD-MM-YYYY HH:mm:ss")}
						</h1>
					)}
				</div>
				<div className={cx("line")}></div>
				<Row
					gutter={[32, 32]}
					className={cx("address")}
				>
					<Col
						xs={24}
						sm={24}
						md={16}
					>
						<h1>Địa chỉ nhận hàng</h1>
						<div className={cx("address__name")}>
							<h4>Người nhận: {order?.shipping?.fullname}</h4>
							<p>SĐT: {order?.shipping?.phone}</p>
							<p>Địa chỉ: {order?.shipping?.address}</p>
							<p>Ghỉ chú: {order?.shipping?.note}</p>
						</div>
					</Col>
					<Col
						xs={24}
						sm={24}
						md={8}
					>
						<h1>Phương thức thanh toán</h1>
						<div className={cx("address__name")}>
							<h4>Phương thức: {order?.payment?.methods}</h4>
							<p>Trạng thái thanh toán: {order?.payment?.status ? "Ok" : "Chưa"}</p>
							<p>Đơn vị vận chuyển: giaohangtietkiem</p>
						</div>
					</Col>
				</Row>
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
			</div>
		</div>
	);
};

export default OrderPage;
