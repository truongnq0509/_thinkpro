import { ErrorMessage } from "@hookform/error-message";
import {
	Button,
	Col,
	Form,
	Input,
	Modal,
	Row,
	Select,
	Space,
	Tag,
	TreeSelect,
	Upload,
	message,
	Image,
	List,
	Radio,
} from "antd";
import type { RcFile, UploadProps } from "antd/es/upload";
import type { UploadFile } from "antd/es/upload/interface";
import classNames from "classnames/bind";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import { BsPatchCheck } from "react-icons/bs";
import { IoAddOutline } from "react-icons/io5";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { TiDeleteOutline } from "react-icons/ti";
import slugify from "react-slugify";
import { IBrand, ICategory, IProduct } from "~/interfaces";
import { getBrands as apiGetBrands } from "~/services/brandService";
import { getCategories as apiGetCategories } from "~/services/categoryService";
import { getProduct as apiGetProduct, getStock as apiGetStock } from "~/services/productService";
import { removeFile as apiRemoveFile } from "~/services/uploadService";
import productSchema from "~/validations/products";
import styles from "./Products.module.scss";
import { IoIosArrowDown } from "react-icons/io";
import Highlight from "@tiptap/extension-highlight";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import ImageTiptap from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import MenuBar from "~/components/MenuBar/MenuBar";
import "./Products.module.scss";
import { IoClose, IoAddSharp } from "react-icons/io5";

const { Option } = Select;

type Props = {};
interface IImage {
	filename: string;
	path: string;
}

const cx = classNames.bind(styles);

const getBase64 = (file: RcFile): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});

const UpdateProductPage = (props: Props) => {
	const [categories, setCategories] = useState<ICategory[]>([]);
	const [brands, setBrands] = useState<IBrand[]>([]);
	const [files, setFiles] = useState<UploadFile[]>([]);
	const [images, setImages] = useState<IImage[]>([]);
	const [id, setId] = useState<string>("");
	const [previewOpen, setPreviewOpen] = useState<boolean>(false);
	const [previewImage, setPreviewImage] = useState<string>("");
	const [previewTitle, setPreviewTitle] = useState<string>("");
	const handleCancel = () => setPreviewOpen(false);

	// router
	const { slug } = useParams();
	const navigate = useNavigate();

	// state outlet
	const [{ handleUpdateProduct, loading }] = useOutletContext<any>();

	const {
		control,
		handleSubmit,
		getValues,
		setValue,
		formState: { errors },
	} = useForm<IProduct>({
		defaultValues: async () => {
			const { data } = await apiGetProduct(slug as string);
			const {
				data: { stock },
			} = await apiGetStock(data?._id);

			// set id product
			setId(data._id);

			// preview image
			const images = data.assets?.map((img: any) => {
				return {
					filename: img.filename,
					path: img.path,
				};
			});
			setImages(images);

			// set default react-form-hooks
			const defaultValue: IProduct = {
				name: data.name,
				price: data.price,
				slug: data.slug,
				discount: data.discount,
				thumbnail: data.thumbnail,
				description: data.description,
				attributes: data.attributes,
				assets: data.assets,
				status: data.status,
				categoryId: data.category?._id,
				brandId: data.brand?._id,
				stock,
				createdAt: data.createdAt,
				updatedAt: `${moment().format()}`,
			};
			return defaultValue;
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
			ImageTiptap,
		],
		onUpdate: ({ editor }) => {
			setValue("description", editor.getHTML());
		},
		content: "",
	});

	useEffect(() => {
		const fetchApi = async () => {
			const [{ data: categories }, { data: brands }] = await Promise.all([apiGetCategories(), apiGetBrands()]);
			setCategories(categories);
			setBrands(brands);
		};
		fetchApi();
	}, []);

	useEffect(() => {
		editor?.commands.setContent(getValues("description")?.replace(/data-src=/g, "src=") as string);
	}, [editor, getValues("description")]);

	const onSubmit = async (data: IProduct) => {
		const newData = {
			...data,
			assets: images,
		};
		await handleUpdateProduct(files, newData, id);

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

	// xóa ảnh trên cloudinary
	const handleRemoveFile = async (file: IImage): Promise<any> => {
		try {
			const { filename } = file;
			await apiRemoveFile(filename);

			// cập nhật lại ảnh
			const newImages = images.filter((img) => img.filename !== filename);
			setImages(newImages);
			message.open({
				type: "success",
				content: "Xóa ảnh thành công",
			});
		} catch (error) {
			message.open({
				type: "error",
				content: "Xóa ảnh thất bại",
			});
		}
	};

	return (
		<>
			<Row gutter={[0, 0]}>
				<Col
					span="24"
					style={{
						display: "flex",
						alignItems: "flex-end",
					}}
				>
					<Space align="end">
						<h2 className={cx("title")}>Cập Nhật Sản Phẩm</h2>
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
															defaultValue={getValues("status")}
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
									{getValues("attributes")?.length > 0 && (
										<Form.List
											name="attributes"
											initialValue={getValues("attributes")}
										>
											{(fields, { add, remove }) => (
												<>
													{fields.map(({ key, name, fieldKey, ...restField }, index) => (
														<Row
															key={index}
															gutter={[16, 16]}
															style={{ marginTop: 16 }}
														>
															<Col span={11}>
																<Controller
																	control={control}
																	name={`attributes[${index}].k`}
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
																	name={`attributes[${index}].v`}
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
																	onClick={() => {
																		remove(index);
																		setValue(
																			"attributes",
																			getValues("attributes").filter(
																				(item: any, i: any) => i != index
																			)
																		);
																	}}
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
									)}
								</Col>
								<Col span={24}>
									<Form.Item label="Thư viện ảnh">
										<List
											grid={{ gutter: 8, column: 4 }}
											dataSource={images}
											renderItem={(img: IImage) => (
												<List.Item>
													<Button
														shape="circle"
														size="small"
														icon={
															<TiDeleteOutline
																size={20}
																color="#f03e3e"
															/>
														}
														style={{
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															border: "none",
															backgroundColor: "#f03e3e1a",
															position: "absolute",
															zIndex: 1,
															right: -8,
															top: -12,
														}}
														onClick={() => handleRemoveFile(img)}
													/>
													<Image
														src={img.path}
														style={{
															borderRadius: 6,
														}}
														preview={false}
													/>
												</List.Item>
											)}
										/>
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
									fontSize: 14,
									padding: "0 16px",
								}}
								htmlType="submit"
								size="middle"
								className={cx("btn")}
								loading={loading}
							>
								Cập Nhật
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
									fontSize: 14,
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
		</>
	);
};

export default UpdateProductPage;
