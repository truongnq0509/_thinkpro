import { Button, Col, Modal, Row, Space, Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import classNames from "classnames/bind";
import moment from "moment";
import React from "react";
import { AiFillInfoCircle } from "react-icons/ai";
import { BsPatchCheck } from "react-icons/bs";
import { Link, useOutletContext } from "react-router-dom";
import { IProduct } from "~/interfaces";
import { formatNumber } from "~/utils/fc";
import styles from "./Products.module.scss";

const { confirm } = Modal;

type Props = {};
const cx = classNames.bind(styles);

const StoreProductPage: React.FC = (props: Props) => {
	const [{ store: products, handleRemoveProduct, handleRestoreProduct }] = useOutletContext<any>();

	const showDeleteConfirm = (id: string) => {
		confirm({
			title: "Bạn có muốn xóa không?",
			icon: (
				<AiFillInfoCircle
					size="32px"
					color="#ffec99"
				/>
			),
			content: "Hành động này có thể ảnh hưởng đến dữ liệu của bạn",
			okText: "Yes",
			okType: "danger",
			cancelText: "No",
			style: {},
			onOk() {
				handleRemoveProduct(id, true);
			},
		});
	};

	const columns: ColumnsType<IProduct> = [
		{
			title: "#",
			dataIndex: "index",
			key: "#",
			render: (text, record, index) => index + 1,
		},
		{
			title: "Tên sản phẩm",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Giá",
			dataIndex: "price",
			key: "price",
			render: (value) => {
				return `${formatNumber(`${value}`)} VNĐ`;
			},
		},
		{
			title: "Ngày xóa",
			dataIndex: "deletedAt",
			key: "deletedAt",
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
			title: "Trạng thái",
			dataIndex: "status",
			key: "status",
			render: (value: number) => {
				return (
					<Tag
						bordered={false}
						color={!value ? "#0abb871a" : "#fd397a1a"}
						className={cx("tag")}
					>
						<span
							style={{
								color: !value ? "#0abb87" : "#fd397a",
							}}
						>
							{!value ? "active" : "disabled"}
						</span>
					</Tag>
				);
			},
		},
		{
			title: "Action",
			key: "action",
			render: (_, product) => (
				<Space size="middle">
					<Button
						style={{
							color: "#228be6",
							backgroundColor: "#228be61a",
							border: "none",
						}}
						className={cx("btn")}
						onClick={() => handleRestoreProduct(product._id as string, product)}
					>
						Khôi Phục
					</Button>
					<Button
						style={{
							color: "#fd397a",
							backgroundColor: "#fd397a1a",
							border: "none",
						}}
						className={cx("btn")}
						onClick={() => showDeleteConfirm(product._id as string)}
					>
						Xóa vĩnh viễn
					</Button>
				</Space>
			),
		},
	];

	return (
		<>
			<Row gutter={[0, 0]}>
				<Col
					span="12"
					style={{
						display: "flex",
						alignItems: "flex-end",
					}}
				>
					<Space align="end">
						<h2 className={cx("title")}>Thùng Rác</h2>
						<Tag
							bordered={false}
							style={{
								backgroundColor: "#339af01a",
							}}
							icon={<BsPatchCheck color="#339af0" />}
							className={cx("tag")}
						>
							<Link
								to="/admin"
								style={{ color: "#339af0" }}
							>
								thinkpro
							</Link>
						</Tag>
					</Space>
				</Col>
			</Row>
			<Table
				columns={columns}
				dataSource={products}
				rowKey={"_id"}
				style={{
					marginTop: "16px",
				}}
			/>
		</>
	);
};

export default StoreProductPage;
