import { ErrorMessage } from "@hookform/error-message";
import { Button, Col, Form, Input, Modal, Row, Select, Space, Tag, TreeSelect, Upload, message } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import classNames from "classnames/bind";
import joi from "joi";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiFillInfoCircle } from "react-icons/ai";
import { BsPatchCheck } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import slugify from "react-slugify";
import { useTitle } from "~/hooks";
import { IBrand, ICategory } from "~/interfaces";
import {
	createBrand as apiCreateBrand,
	getBrands as apiGetBrands,
	getParentBrands as apiGetParentBrands,
	removeBrand as apiRemoveBrand,
	updateBrand as apiUpdateBrand,
} from "~/services/brandService";
import { getCategories as apiGetCategories } from "~/services/categoryService";
import { uploadFiles as apiUploadFiles } from "~/services/uploadService";
import styles from "./Brands.module.scss";

type Props = {};
const cx = classNames.bind(styles);

const { TextArea } = Input;
const { confirm } = Modal;
const { Option } = Select;

const categorySchema = joi.object({
	name: joi.string().required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
	}),
	slug: joi.string().required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
	}),
	parentId: joi.any().required().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
	}),
	categoryIds: joi.array().optional().allow({}),
	image: joi.object().optional().allow({}),
	description: joi.string().required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
	}),
	createdAt: joi.string().optional().allow(new Date()),
	updatedAt: joi.string().optional().allow(new Date()),
});

const Brands = (props: Props) => {
	const [image, setImage] = useState<string>("");
	const [loading, setLoading] = useState<any>({
		image: false,
		form: false,
		table: false,
	});
	const [brands, setBrands] = useState<IBrand[]>([]);
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [parentBrands, setParentBrands] = useState<IBrand[]>([]);
	const [paginate, setPaginate] = useState<any>({});
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [id, setId] = useState<string>("");

	useTitle("Thinkpro | Tất cả thương hiệu");

	const { control, handleSubmit, setValue, getValues, reset } = useForm<any>({
		defaultValues: {
			name: "",
			slug: "",
			image: "",
			description: "",
			parentId: null,
			categoryIds: [],
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
		setLoading({
			...loading,
			table: true,
		});
		const { data, paginate } = await apiGetBrands(_limit, _order, _sort, _page);
		setBrands(data);
		setPaginate(paginate);
		setLoading({
			...loading,
			table: false,
		});
	};

	useEffect(() => {
		const callApi = async () => {
			const [res1, res2] = await Promise.all([apiGetCategories(100), apiGetParentBrands()]);
			setCategories(res1?.data);
			setParentBrands(res2?.data);
		};

		fetchApi();
		callApi();
	}, []);

	const showDeleteConfirm = (_id: string) => {
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
				await apiRemoveBrand(_id);
				setBrands((prev) => prev.filter((item) => item?._id != _id));
			},
		});
	};

	const setBrandEdit = (brand: IBrand) => {
		console.log(brand);
		// react-hook-form
		setValue("name", brand?.name);
		setValue("slug", brand?.slug);
		setValue("image", brand?.image);
		setValue("description", brand?.description);
		setValue("createdAt", brand?.createdAt);
		setValue("parentId", brand?.parentId);
		setValue("categoryIds", brand?.categoryIds);
		setValue("updatedAt", `${moment().format()}`);

		// preview image
		setImage(brand?.image?.path as any);
		// is edit
		setIsEdit(true);
		// set id
		setId(brand?._id as any);
	};

	const columns: ColumnsType<IBrand> = [
		{
			title: "#",
			dataIndex: "index",
			key: "#",
			render: (text: any, record: any, index: any) => index + 1,
		},
		{
			title: "Thương hiệu",
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
			render: (_: any, brand: any) => (
				<Space size="middle">
					<Button
						style={{
							color: "#fd397a",
							backgroundColor: "#fd397a1a",
							border: "none",
						}}
						className={cx("btn")}
						onClick={() => showDeleteConfirm(brand._id as string)}
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
						onClick={() => setBrandEdit(brand)}
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
			const { data: response } = await apiCreateBrand(data);
			setLoading({
				...loading,
				form: false,
			});
			setBrands((prev) => [response, ...prev]);
			// reset form
			reset();
			setImage("");

			message.open({
				type: "success",
				content: "Hành động đã được thực hiện thành công",
				duration: 1,
			});
		} else {
			await apiUpdateBrand(id, data);
			setLoading({
				...loading,
				form: false,
			});
			const newCategories: ICategory[] = brands.map((category: ICategory) => {
				return category._id === id ? data : category;
			});
			setBrands(newCategories);
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
							<h2 className={cx("title")}>Tất Cả Thương Hiệu</h2>
						</Space>
					</Col>
				</Row>
				<Row
					gutter={[16, 16]}
					style={{ marginTop: 32 }}
				>
					<Col span={6}>
						<div className={cx("wrapper__left")}>
							<h1>Tạo thương hiệu</h1>
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
										<Form.Item label="Thương hiệu">
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
															placeholder="dell"
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
										<Form.Item label="Danh mục">
											<Controller
												name="categoryIds"
												control={control}
												render={({ field, formState: { errors } }) => {
													const treeData = categories.map((category: any) => {
														return {
															title: category?.name,
															value: category?._id,
														};
													});
													return (
														<>
															<TreeSelect
																style={{ width: "100%" }}
																size="large"
																dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
																treeData={treeData}
																placeholder="-- Danh mục --"
																treeDefaultExpandAll
																status={errors.categoryIds && "error"}
																{...field}
																multiple
																value={field?.value || "-- Danh mục --"}
																className={cx("select")}
																suffixIcon={<IoIosArrowDown size={16} />}
															/>
															<ErrorMessage
																name="categoryIds"
																errors={errors}
																render={({ message }) => {
																	return (
																		<p style={{ color: "#f03e3e" }}>{message}</p>
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
										<Form.Item label="Thương hiệu cha">
											<Controller
												name="parentId"
												control={control}
												render={({ field, formState: { errors } }) => (
													<>
														<Select
															size="large"
															{...field}
															style={{ width: "100%" }}
															value={field?.value || "-- Thương hiệu cha --"}
															status={errors.parentId && "error"}
															className={cx("select")}
															suffixIcon={<IoIosArrowDown size={16} />}
														>
															{parentBrands?.map((brand: any) => (
																<Option key={brand._id}>{brand.name}</Option>
															))}
														</Select>
														<ErrorMessage
															name="parentId"
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
								loading={loading?.table}
								columns={columns}
								dataSource={brands as any}
								pagination={{
									current: paginate?.page,
									defaultPageSize: paginate?.limit,
									pageSize: paginate?.limit,
									total: paginate?.totalDocs,
									hideOnSinglePage: true,
									showSizeChanger: false,
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

export default Brands;
