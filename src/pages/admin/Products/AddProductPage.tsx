import { ErrorMessage } from "@hookform/error-message";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button, Col, Form, Input, Modal, Radio, Row, Select, Space, Tag, TreeSelect, Upload } from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import classNames from "classnames/bind";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BsPatchCheck } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { IoAddOutline, IoAddSharp, IoClose } from "react-icons/io5";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import slugify from "react-slugify";
import MenuBar from "~/components/MenuBar/MenuBar";
import { IBrand, ICategory, IProduct } from "~/interfaces";
import { getBrands as apiGetBrands } from "~/services/brandService";
import { getCategories as apiGetCategories } from "~/services/categoryService";
import productSchema from "~/validations/products";
import "./Products.module.scss";
import styles from "./Products.module.scss";

const { Option } = Select;

type Props = {};

const cx = classNames.bind(styles);

const getBase64 = (file: RcFile): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});

const AddProductPage = (props: Props) => {
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [brands, setBrands] = useState<IBrand[]>([]);
	const [files, setFiles] = useState<UploadFile[]>([]);
	const [previewOpen, setPreviewOpen] = useState<boolean>(false);
	const [previewImage, setPreviewImage] = useState<string>("");
	const [previewTitle, setPreviewTitle] = useState<string>("");
	const handleCancel = () => setPreviewOpen(false);

	// router
	const navigate = useNavigate();
	const [{ handleCreateProduct, loading }] = useOutletContext<any>();

	const {
		control,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<IProduct>({
		defaultValues: {
			name: "",
			price: "",
			slug: "",
			discount: 0,
			thumbnail: {},
			description: "",
			attributes: [],
			assets: [],
			status: 0,
			brandId: "",
			stock: "",
			createdAt: `${moment().format()}`,
			updatedAt: `${moment().format()}`,
		},
		context: "context",
		resolver: async (data, context) => {
			const { error, value: values } = productSchema.validate(data, {
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

	// tiptap
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				history: false,
			}),
			Highlight,
			TaskList,
			TaskItem,
			Image,
		],
		onUpdate: ({ editor }) => {
			setValue("description", editor.getHTML());
		},
	});

	useEffect(() => {
		const fetchApi = async () => {
			const [{ data: categories }, { data: brands }] = await Promise.all([apiGetCategories(), apiGetBrands()]);
			setCategories(categories);
			setBrands(brands);
		};
		fetchApi();
	}, []);

	const onSubmit = async (data: IProduct) => {
		await handleCreateProduct(files, data);
		navigate("/admin/products");
	};

	// handle preview image
	const handlePreview = async (file: UploadFile) => {
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj as RcFile);
		}

		setPreviewImage(file.url || (file.preview as string));
		setPreviewOpen(true);
		setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1));
	};

	// handle onchange file
	const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => setFiles(newFileList);

	return (
		<div className={cx("wrapper")}>
			<Row gutter={[0, 0]}>
				<Col
					span="24"
					style={{
						display: "flex",
						alignItems: "flex-end",
					}}
				>
					<Space align="end">
						<h2 className={cx("title")}>Tạo Mới Sản Phẩm</h2>
					</Space>
				</Col>
			</Row>

			<Form
				layout="vertical"
				autoComplete="off"
				size="small"
				onFinish={handleSubmit(onSubmit)}
			>
				<Row
					gutter={[48, 48]}
					style={{
						marginTop: "32px",
					}}
				>
					<Col span="14">
						<div className={cx("form__left")}>
							<h1>Thông tin cơ bản</h1>
							<Row gutter={[16, 16]}>
								<Col span={24}>
									<Form.Item label="Tên sản phẩm">
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
														placeholder="laptop-abc"
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
														status={errors.name && "error"}
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
								<Col span={12}>
									<Form.Item label="Giá">
										<Controller
											name="price"
											defaultValue=""
											control={control}
											render={({ field, formState: { errors } }) => (
												<>
													<Input
														size="large"
														{...field}
														status={errors.price && "error"}
														placeholder="20.000.000"
														className={cx("input")}
													/>
													<ErrorMessage
														name="price"
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
								<Col span={12}>
									<Form.Item label="Giảm giá">
										<Controller
											name="discount"
											defaultValue={0}
											control={control}
											render={({ field, formState: { errors } }) => (
												<>
													<Input
														size="large"
														{...field}
														status={errors.discount && "error"}
														placeholder="18.990.000"
														className={cx("input")}
													/>
													<ErrorMessage
														name="discount"
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
								<Col span={12}>
									<Form.Item label="Thương hiệu">
										<Controller
											name="brandId"
											control={control}
											render={({ field, formState: { errors } }) => {
												const treeData = brands.map((brand) => {
													return {
														title: brand?.name,
														value: brand?._id,
														children: brand?.children?.map((item) => ({
															title: item?.name,
															value: item._id,
														})),
													};
												});
												return (
													<>
														<TreeSelect
															style={{ width: "100%" }}
															size="large"
															dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
															treeData={treeData}
															placeholder="Thương hiệu"
															treeDefaultExpandAll
															status={errors.brandId && "error"}
															{...field}
															value={field?.value || "-- Thương hiệu --"}
															className={cx("select")}
															suffixIcon={<IoIosArrowDown size={16} />}
														/>
														<ErrorMessage
															name="brandId"
															errors={errors}
															render={({ message }) => {
																return <p style={{ color: "#f03e3e" }}>{message}</p>;
															}}
														/>
													</>
												);
											}}
										/>
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item label="Danh mục">
										<Controller
											name="categoryId"
											defaultValue={categories[0]?._id as string}
											control={control}
											render={({ field, formState: { errors } }) => (
												<>
													<Select
														size="large"
														{...field}
														style={{ width: "100%" }}
														value={field?.value || "-- Danh mục --"}
														status={errors.categoryId && "error"}
														className={cx("select")}
														suffixIcon={<IoIosArrowDown size={16} />}
													>
														{categories.map((category: ICategory) => (
															<Option key={category._id}>{category.name}</Option>
														))}
													</Select>
													<ErrorMessage
														name="categoryId"
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
									<Form.Item label="Tồn kho">
										<Controller
											name="stock"
											control={control}
											render={({ field, formState: { errors } }) => (
												<>
													<Input
														size="large"
														{...field}
														status={errors.stock && "error"}
														placeholder="999"
														className={cx("input")}
													/>
													<ErrorMessage
														name="stock"
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
									<Form.Item label="Trạng thái">
										<Controller
											control={control}
											name="status"
											render={({ field, formState: { errors } }) => {
												return (
													<>
														<Radio.Group
															{...field}
															defaultValue={0}
															style={{
																display: "flex",
																flexDirection: "column",
																gap: 16,
															}}
														>
															<Radio value={0}>
																<p>Bán</p>
															</Radio>
															<Radio value={1}>
																<p>Ngừng bán</p>
															</Radio>
														</Radio.Group>
														<ErrorMessage
															name="status"
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
									<Form.Item
										label="Bài viết mô tả"
										style={{
											width: "100%",
										}}
									>
										<Controller
											name="description"
											control={control}
											render={({ field, formState: { errors } }) => {
												return (
													<div className={cx("editor")}>
														{editor && <MenuBar editor={editor} />}
														<EditorContent
															className={cx("editor__content")}
															editor={editor}
															{...field}
														/>
														<ErrorMessage
															name="description"
															errors={errors}
															render={({ message }) => {
																return <p style={{ color: "#f03e3e" }}>{message}</p>;
															}}
														/>
													</div>
												);
											}}
										/>
									</Form.Item>
								</Col>
							</Row>
						</div>
					</Col>

					<Col span="10">
						<div className={cx("form__right")}>
							<h1>Thuộc tính | Media</h1>
							<Row gutter={[16, 16]}>
								<Col span={24}>
									<Form.List name="attributes">
										{(fields, { add, remove }) => (
											<>
												{fields.map(({ key, name, fieldKey, ...restField }, index) => (
													<Row
														key={key}
														gutter={[16, 16]}
														style={{ marginTop: 16 }}
													>
														<Col span={11}>
															<Controller
																control={control}
																name={`attributes[${index}].k` as any}
																render={({ field }) => (
																	<Input
																		{...field}
																		placeholder="Thuộc tính"
																		className={cx("input")}
																	/>
																)}
															/>
														</Col>
														<Col span={11}>
															<Controller
																control={control}
																name={`attributes[${index}].v` as any}
																render={({ field }) => (
																	<Input
																		{...field}
																		placeholder="Giá trị"
																		className={cx("input")}
																	/>
																)}
															/>
														</Col>
														<Col
															span={2}
															style={{ display: "flex", alignItems: "center" }}
														>
															<IoClose
																size={16}
																onClick={() => remove(index)}
															/>
														</Col>
													</Row>
												))}
												<Form.Item>
													<Button
														type="default"
														onClick={() => add()}
														block
														icon={<IoAddSharp size={16} />}
														style={{
															color: "rgb(34, 139, 230)",
															backgroundColor: "rgba(34, 139, 230, 0.1)",
															height: 48,
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															marginTop: 16,
														}}
														className={cx("btn")}
													>
														Thêm thuộc tính
													</Button>
												</Form.Item>
											</>
										)}
									</Form.List>
								</Col>
								<Col span={24}>
									<Form.Item label="Thư viện ảnh">
										<Upload
											listType="picture-card"
											fileList={files}
											onPreview={handlePreview}
											onChange={handleChange}
											beforeUpload={() => {
												return false;
											}}
											multiple
										>
											<div>
												<IoAddOutline />
												<div style={{ marginTop: 8 }}>Upload</div>
											</div>
										</Upload>
									</Form.Item>
								</Col>
							</Row>
							<Modal
								open={previewOpen}
								title={previewTitle}
								footer={null}
								onCancel={handleCancel}
							>
								<img
									alt="example"
									style={{ width: "100%" }}
									src={previewImage}
								/>
							</Modal>
						</div>
					</Col>
				</Row>
				<Row
					gutter={[48, 48]}
					style={{
						marginTop: 32,
					}}
				>
					<Col span={14}>
						<Form.Item>
							<Button
								style={{
									color: "#228be6",
									backgroundColor: "#228be61a",
									border: "none",
									height: 48,
									padding: "0 16px",
								}}
								htmlType="submit"
								size="middle"
								loading={loading}
								className={cx("btn")}
							>
								Thêm Mới
							</Button>
						</Form.Item>
					</Col>
					<Col span={10}>
						<Form.Item style={{ float: "right" }}>
							<Button
								style={{
									color: "rgb(253, 57, 122)",
									backgroundColor: "rgba(253, 57, 122, 0.1)",
									border: "none",
									height: 48,
									padding: "0 16px",
								}}
								size="middle"
								className={cx("btn")}
							>
								Hủy
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</div>
	);
};

export default AddProductPage;
