import { Button, Card, Col, List, Row, Space, Statistic } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import classNames from "classnames/bind";
import moment from "moment";
import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { AiOutlineSketch } from "react-icons/ai";
import { BiCategoryAlt } from "react-icons/bi";
import { BsCart2, BsShop } from "react-icons/bs";
import { FaMoneyBillAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTitle } from "~/hooks";
import { getAllOrder as apiGetAllOrder } from "~/services/orderService";
import { getDashboard as apiGetDashboard } from "~/services/productService";
import { formatNumber } from "~/utils/fc";
import styles from "./Dashboard.module.scss";

type Props = {};
const cx = classNames.bind(styles);

interface IDashboard {
	title: string;
	statistic: number;
	icon: React.ReactNode;
	color: string;
}

const Dashboard = (props: Props) => {
	const [orders, setOrders] = useState<any>([]);
	const [dashboard, setDashboard] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);

	useTitle("Thinkpro | Trang chủ");

	useEffect(() => {
		const fetchApi = async () => {
			setLoading(true);
			const [res1, res2] = await Promise.all([apiGetAllOrder(), apiGetDashboard()]);
			setOrders(res1?.data);
			setDashboard(res2?.data);
			setLoading(false);
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

	const columns: ColumnsType<any> = [
		{
			title: "#",
			dataIndex: "index",
			key: "#",
			render: (text, record, index) => `#000${index + 1}`,
		},
		{
			title: "Khác hàng",
			dataIndex: ["shipping", "fullname"],
			key: "shipping",
		},
		{
			title: "Hóa đơn",
			dataIndex: "bill",
			key: "bill",
			render: (value) => {
				return `${formatNumber(`${value}`)} VNĐ`;
			},
		},
		{
			title: "Ngày tạo",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (value: string) => {
				return moment(value).format("DD/MM/YYYY HH:ss:mm");
			},
		},
		{
			title: "Ngày cập nhật",
			dataIndex: "updatedAt",
			key: "updatedAt",
			render: (value: string) => {
				return moment(value).format("DD/MM/YYYY HH:ss:mm");
			},
		},
		{
			title: "Phương thức thanh toán",
			dataIndex: ["payment", "methods"],
			key: "payment",
		},
		{
			title: "Trạng thái",
			dataIndex: "status",
			key: "status",
			render: (status: string) => {
				return (
					<Button
						className={cx("btn--small")}
						style={{
							color: checkOrderStatus(status as string)?.color,
							backgroundColor: checkOrderStatus(status as string)?.background,
							cursor: "default",
						}}
					>
						{checkOrderStatus(status as string)?.status}
					</Button>
				);
			},
		},
		{
			title: "Action",
			key: "action",
			render: (_, order) => (
				<Space size="middle">
					<Button
						style={{
							color: "#228be6",
							backgroundColor: "#228be61a",
							border: "none",
						}}
						className={cx("btn")}
					>
						<Link to={`/admin/orders/${order?._id}`}>Xem</Link>
					</Button>
				</Space>
			),
		},
	];

	const data: IDashboard[] = [
		{
			title: "Đơn Hàng",
			statistic: dashboard?.orders,
			icon: <BsCart2 size={20} />,
			color: "#ffa8a8",
		},
		{
			title: "Doanh Thu",
			statistic: dashboard?.money,
			icon: <FaMoneyBillAlt size={20} />,
			color: "#ffa8a8",
		},
		{
			title: "Sản Phẩm",
			statistic: dashboard?.products,
			icon: <AiOutlineSketch size={20} />,
			color: "#ffa8a8",
		},
		{
			title: "Danh Mục",
			statistic: dashboard?.categories,
			icon: <BiCategoryAlt size={20} />,
			color: "#ffa8a8",
		},
		{
			title: "Thương Hiệu",
			statistic: dashboard?.brands,
			icon: <BsShop size={20} />,
			color: "#ffa8a8",
		},
	];

	return (
		<div className={cx("wrapper")}>
			<List
				grid={{ gutter: 16, column: 5 }}
				dataSource={data}
				renderItem={(item) => (
					<List.Item>
						<Card bordered={false}>
							<Statistic
								title={item.title}
								value={item.statistic}
								precision={2}
								valueStyle={{ color: item.color }}
								prefix={item.icon}
								formatter={() => (
									<CountUp
										end={item.statistic}
										separator="."
									/>
								)}
							/>
						</Card>
					</List.Item>
				)}
				style={{
					margin: "16px 0",
				}}
			/>
			<Row gutter={[0, 0]}>
				<Col
					span="12"
					style={{
						display: "flex",
						alignItems: "flex-end",
					}}
				>
					<Space align="end">
						<h2 className={cx("title")}>Đơn hàng mới nhất</h2>
					</Space>
				</Col>
			</Row>
			<Table
				loading={loading}
				columns={columns}
				dataSource={orders as any}
				pagination={false}
				rowKey={"_id"}
				style={{
					marginTop: "16px",
				}}
			/>
		</div>
	);
};

export default Dashboard;
