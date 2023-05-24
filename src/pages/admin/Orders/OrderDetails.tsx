import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Orders.module.scss";
import { Button, Col, Row, Select, Space, Steps, Tag } from "antd";
import { BsPatchCheck, BsPersonFillCheck } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getOrder as apiGetOrder } from "~/services/orderService";
import { useTitle } from "~/hooks";
import { HiCheckCircle } from "react-icons/hi";
import { MdOutlineLocalShipping } from "react-icons/md";
import { BiStar } from "react-icons/bi";
import moment from "moment";
import { formatNumber } from "~/utils/fc";
import { IoIosArrowDown } from "react-icons/io";
import { changerOrderStatus as apiChangeOrderStatus } from "~/services/orderService";
import Swal from "sweetalert2";

type Props = {};
const cx = classNames.bind(styles);
const { Option } = Select;

const OrderDetails = (props: Props) => {
	const { id } = useParams();
	const [order, setOrder] = useState<any>(null);
	const [status, setStatus] = useState<any>([
		{
			code: "processing",
			name: "Đang xử lý",
			isActive: true,
		},
		{
			code: "confirmed",
			name: "Đã xác nhận",
			isActive: true,
		},
		{
			code: "delivering",
			name: "Đang vận chuyển",
			isActive: false,
		},
		{
			code: "cancelled",
			name: "Hủy",
			isActive: false,
		},
		{
			code: "delivered",
			name: "Hoàn thành",
		},
	]);

	useTitle("Thinkpro | Chi tiết đơn hàng");

	useEffect(() => {
		const fetchApi = async () => {
			const { data } = await apiGetOrder(id as string);
			setOrder(data);
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
					code: 0,
				};
			case "confirmed":
				return {
					status: "Đã xác nhận",
					color: "#0abb87",
					background: "#0abb871a",
					code: 1,
				};
			case "delivering":
				return {
					status: "Đang vận chuyển",
					color: "#0abb87",
					background: "#0abb871a",
					code: 2,
				};
			case "cancelled":
				return {
					status: "Đã hủy",
					color: "#fe3464",
					background: "#fe34641a",
					code: 4,
				};
			case "delivered":
				return {
					status: "Hoàn thành",
					color: "#0abb87",
					background: "#0abb871a",
					code: 3,
				};
		}
	};

	const handleChangeOrderStatus = async (status: string) => {
		try {
			const { data } = await apiChangeOrderStatus({ status }, id as string);
			setOrder(data);
			Swal.fire("Cập nhập đơn hàng thành công", "", "success");
		} catch (error) {
			Swal.fire("Thất bại thảm hại", "", "error");
		}
	};

	return (
		<Row gutter={[0, 0]}>
			<div className={cx("wrapper")}>
				<Col span={24}>
					<div className={cx("header")}>
						<div className={cx("header__left")}>
							<h1>Chi tiết đơn hàng</h1>
							<p>Mã đơn hàng: #{id}</p>
							<Button
								className={cx("btn--small")}
								style={{
									color: checkOrderStatus(order?.status as string)?.color,
									backgroundColor: checkOrderStatus(order?.status as string)?.background,
									cursor: "default",
									margin: "8px 0",
								}}
							>
								{checkOrderStatus(order?.status as string)?.status}
							</Button>
						</div>
						{order?.status !== "cancelled" && (
							<div className={cx("header__right")}>
								<Select
									size="large"
									style={{ width: "100%" }}
									className={cx("select")}
									value={order?.status}
									suffixIcon={<IoIosArrowDown size={16} />}
									onChange={(e) => handleChangeOrderStatus(e)}
								>
									{status.map((item: any, index: number) => (
										<Option
											key={index}
											value={item?.code}
										>
											{item.name}
										</Option>
									))}
								</Select>
							</div>
						)}
					</div>
					<div className={cx("body")}>
						<div className={cx("order")}>
							{order?.status !== "cancelled" ? (
								<Steps
									current={checkOrderStatus(order?.status)?.code as any}
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
				</Col>
			</div>
		</Row>
	);
};

export default OrderDetails;
