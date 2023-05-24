import { Button, Col, Modal, Row, Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import classNames from "classnames/bind";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { AiFillInfoCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useTitle } from "~/hooks";
import { IProduct } from "~/interfaces";
import { getAllOrder as apiGetAllOrder } from "~/services/orderService";
import { formatNumber } from "~/utils/fc";
import styles from "./Orders.module.scss";

const { confirm } = Modal;

type Props = {};
const cx = classNames.bind(styles);

const OrdersPage: React.FC = (props: Props) => {
	const [paginate, setPaginate] = useState<any>(null);
	const [orders, setOrders] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useTitle("Thinkpro | Tất cả đơn hàng");

	const fetchApi = async (
		_limit: number = 10,
		_order: string = "desc",
		_sort: string = "createdAt",
		_page: number = 1
	) => {
		setLoading(true);
		const { data, paginate } = await apiGetAllOrder();
		setOrders(data);
		setPaginate(paginate);
		setLoading(false);
	};

	useEffect(() => {
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

	const showDeleteConfirm = (id: string) => {
		confirm({
			title: "Bạn có muốn xóa không?",
			icon: (
				<AiFillInfoCircle
					size="32px"
					color="#ffec99"
				/>
			),
			content: "Hành động này không ảnh hưởng đến ...",
			okText: "Yes",
			okType: "danger",
			cancelText: "No",
			style: {},
			onOk() {
				// handleRemoveProduct(id);
			},
		});
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

	return (
		<div className={cx("wrapper")}>
			<Row gutter={[0, 0]}>
				<Col
					span="12"
					style={{
						display: "flex",
						alignItems: "flex-end",
					}}
				>
					<Space align="end">
						<h2 className={cx("title")}>Tất Cả Đơn Hàng</h2>
					</Space>
				</Col>
			</Row>
			<Table
				loading={loading}
				columns={columns}
				dataSource={orders as any[]}
				pagination={{
					pageSize: paginate?.limit,
					total: paginate?.totalDocs,
					showSizeChanger: false,
					onChange: async (page) => {
						await fetchApi(page);
					},
				}}
				rowKey={"_id"}
				style={{
					marginTop: "16px",
				}}
			/>
		</div>
	);
};

export default OrdersPage;
