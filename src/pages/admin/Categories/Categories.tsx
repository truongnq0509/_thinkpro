import React from "react";
import classNames from "classnames/bind";
import styles from "./Categories.module.scss";
import { Button, Col, Row, Space, Tag, Form, Input, Upload, Modal, message } from "antd";
import { BsPatchCheck } from "react-icons/bs";
import { Link } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";
import { AiFillInfoCircle, AiOutlineDelete } from "react-icons/ai";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import joi from "joi";
import { ErrorMessage } from "@hookform/error-message";
import moment from "moment/moment";
import { uploadFiles as apiUploadFiles } from "~/services/uploadService";
import {
	getCategories as apiGetCategories,
	createCategory as apiCreateCategories,
	removeCategory as apiRemoveCategory,
	updateCategory as apiUpdateCategory,
} from "~/services/categoryService";
import { ICategory } from "~/interfaces";
import Table, { ColumnsType } from "antd/es/table";
import slugify from "react-slugify";

type Props = {};
const cx = classNames.bind(styles);

const { TextArea } = Input;
const { confirm } = Modal;

const categorySchema = joi.object({
	name: joi.string().required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
	}),
	slug: joi.string().required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
	}),
	image: joi.object().optional().allow({}),
	description: joi.string().required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
	}),
	createdAt: joi.string().optional().allow(new Date()),
	updatedAt: joi.string().optional().allow(new Date()),
});

const Categories = (props: Props) => {
	const [image, setImage] = useState<string>("");
	const [loading, setLoading] = useState<any>({
		image: false,
		form: false,
	});
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [paginate, setPaginate] = useState<any>({});
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [id, setId] = useState<string>("");

	const { control, handleSubmit, setValue, reset } = useForm<any>({
		defaultValues: {
			name: "",
			slug: "",
			image: "",
			description: "",
			createdAt: `${moment().format()}`,
			updatedAt: `${moment().format()}`,
		},
		context: "context",
		resolver: async (data, context) => {
			const { error, value: values } = categorySchema.validate(data, {
				abortEarly: false,
			});

			if (!error) return { values: values, errors: {} };

			return {
				values: {},
				errors: error.details.reduce(
					(previous, currentError) => ({
						...previous,
						[currentError.path[0]]: currentError,
					}),
					{}
				),
			};
		},
	});

	const fetchApi = async (
		_limit: number = 8,
		_order: string = "desc",
		_sort: string = "createdAt",
		_page: number = 1
	) => {
		const { data, paginate } = await apiGetCategories(_limit, _order, _sort, _page);
		setCategories(data);
		setPaginate(paginate);
	};

	useEffect(() => {
		fetchApi();
	}, []);

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
			async onOk() {
				await apiRemoveCategory(id);
				setCategories((prev) => prev.filter((item) => item?._id != id));
			},
		});
	};

	const setCategoryEdit = (category: ICategory) => {
		// react-hook-form
		setValue("name", category?.name);
		setValue("slug", category?.slug);
		setValue("image", category?.image);
		setValue("description", category?.description);
		setValue("createdAt", category?.createdAt);
		setValue("updatedAt", `${moment().format()}`);

		// preview image
		setImage(category?.image?.path as any);
		// is edit
		setIsEdit(!isEdit);
		// set id
		setId(category?._id as any);
	};

	const columns: ColumnsType<ICategory> = [
		{
			title: "#",
			dataIndex: "index",
			key: "#",
			render: (text: any, record: any, index: any) => index + 1,
		},
		{
			title: "Tiêu đề",
			dataIndex: "name",
			key: "name",
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
			title: "Action",
			key: "action",
			render: (_: any, category: any) => (
				<Space size="middle">
					<Button
						style={{
							color: "#fd397a",
							backgroundColor: "#fd397a1a",
							border: "none",
						}}
						className={cx("btn")}
						onClick={() => showDeleteConfirm(category._id as string)}
					>
						Xóa
					</Button>
					<Button
						style={{
							color: "#228be6",
							backgroundColor: "#228be61a",
							border: "none",
						}}
						className={cx("btn")}
						onClick={() => setCategoryEdit(category)}
					>
						Cập Nhật
					</Button>
				</Space>
			),
		},
	];

	const handleUploadFile = async (info: any) => {
		const formData = new FormData();
		formData.append("assets", info.file);
		setLoading({
			...loading,
			image: true,
		});
		const { data } = await apiUploadFiles(formData);
		setImage(data[0].path);
		setValue("image", data[0]);
		setLoading({
			...loading,
			image: false,
		});
	};

	const onSubmit = async (data: any) => {
		setLoading({
			...loading,
			form: true,
		});

		if (!isEdit) {
			const { data: response } = await apiCreateCategories(data);
			setLoading({
				...loading,
				form: false,
			});
			setCategories((prev) => [response, ...prev]);
			// reset form
			reset();
			setImage("");

			message.open({
				type: "success",
				content: "Hành động đã được thực hiện thành công",
				duration: 1,
			});
		} else {
			await apiUpdateCategory(id, data);
			setLoading({
				...loading,
				form: false,
			});
			const newCategories: ICategory[] = categories.map((category: ICategory) => {
				return category._id === id ? data : category;
			});
			setCategories(newCategories);
			// reset form
			reset();
			setImage("");

			message.open({
				type: "success",
				content: "Hành động đã được thực hiện thành công",
				duration: 1,
			});
		}
	};

	return (
		<>
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
							<h2 className={cx("title")}>Tất Cả Danh Mục</h2>
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
				<Row
					gutter={[16, 16]}
					style={{ marginTop: 32 }}
				>
					<Col span={6}>
						<div className={cx("wrapper__left")}>
							<h1>Tạo danh mục</h1>
							<Form
								layout="vertical"
								autoComplete="off"
								size="small"
								onFinish={handleSubmit(onSubmit)}
								style={{
									marginTop: 16,
								}}
							>
								<Row gutter={[16, 16]}>
									<Col span={24}>
										<Form.Item label="Tiêu đề">
											<Controller
												name="name"
												control={control}
												render={({
													field: { onChange, value, name, ref },
													formState: { errors },
												}) => (
													<>
														<Input
															size="large"
															name={name}
															value={value}
															ref={ref}
															onChange={(e) => {
																const slug = slugify(e.target.value);
																setValue("slug", slug);
																onChange(e);
															}}
															status={errors.name && "error"}
															placeholder="laptop"
															className={cx("input")}
														/>
														<ErrorMessage
															name="name"
															errors={errors}
															render={({ message }) => {
																return <p style={{ color: "#f03e3e" }}>{message}</p>;
															}}
														/>
													</>
												)}
											/>
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item label="Slug">
											<Controller
												name="slug"
												control={control}
												render={({ field, formState: { errors } }) => (
													<>
														<Input
															size="large"
															{...field}
															status={errors.slug && "error"}
															placeholder="laptop-abc"
															disabled
															className={cx("input")}
														/>
														<ErrorMessage
															name="slug"
															errors={errors}
															render={({ message }) => {
																return <p style={{ color: "#f03e3e" }}>{message}</p>;
															}}
														/>
													</>
												)}
											/>
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item label="Ảnh">
											<Controller
												name="image"
												control={control}
												render={({ field, formState: { errors } }) => (
													<>
														<div className={cx("image")}>
															<img
																src={
																	image ||
																	"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSIsmpJQm0OTBcGyY-Y3ECq4UMpN2lAcagoQ&usqp=CAU"
																}
																alt="image"
															/>
															<Upload
																// {...field}
																onChange={handleUploadFile}
																beforeUpload={() => false}
																showUploadList={false}
															>
																<Button
																	className={cx("btn")}
																	loading={loading.image}
																>
																	Chọn ảnh
																</Button>
															</Upload>
														</div>
														<ErrorMessage
															name="image"
															errors={errors}
															render={({ message }) => {
																return <p style={{ color: "#f03e3e" }}>{message}</p>;
															}}
														/>
													</>
												)}
											/>
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item label="Mô tả">
											<Controller
												control={control}
												name="description"
												render={({ field, formState: { errors } }) => {
													return (
														<>
															<TextArea
																{...field}
																rows={3}
																placeholder="Mô tả"
																status={errors.description && "error"}
																className={cx("input")}
																style={{
																	paddingTop: 12,
																}}
															/>
															<ErrorMessage
																name="description"
																errors={errors}
																render={({ message }) => {
																	return (
																		<p style={{ color: "#f03e3e", marginTop: 4 }}>
																			{message}
																		</p>
																	);
																}}
															/>
														</>
													);
												}}
											/>
										</Form.Item>
									</Col>
									<Col span={24}>
										<Form.Item>
											<Button
												style={{
													color: "#228be6",
													backgroundColor: "#228be61a",
													border: "none",
												}}
												htmlType="submit"
												size="middle"
												loading={loading}
												className={cx("btn")}
											>
												{!isEdit ? "Thêm mới" : "Cập nhật"}
											</Button>
										</Form.Item>
									</Col>
								</Row>
							</Form>
						</div>
					</Col>
					<Col span={18}>
						<div className={cx("wrapper__right")}>
							<h1>Danh sách</h1>
							<Table
								columns={columns}
								dataSource={categories as any}
								pagination={{
									current: paginate?.page,
									pageSize: paginate?.limit,
									total: paginate?.totalDocs,
									hideOnSinglePage: true,
									onChange: async (page) => {
										fetchApi(8, "desc", "createdAt", page);
									},
								}}
								rowKey={"slug"}
								style={{
									marginTop: "16px",
								}}
							/>
						</div>
					</Col>
				</Row>
			</div>
		</>
	);
};

export default Categories;
