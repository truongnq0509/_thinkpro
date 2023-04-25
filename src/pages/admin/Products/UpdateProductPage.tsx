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
import { getProduct as apiGetProduct } from "~/services/productService";
import { removeFile as apiRemoveFile } from "~/services/uploadService";
import productSchema from "~/validations/products";
import styles from "./Products.module.scss";

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
	const [{ handleUpdateProduct }] = useOutletContext<any>();

	const {
		control,
		handleSubmit,
		getValues,
		setValue,
		formState: { errors },
	} = useForm<IProduct>({
		defaultValues: async () => {
			const { data } = await apiGetProduct(slug as string);

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
				categoryId: data.category._id,
				brandId: data.brand._id,
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

	useEffect(() => {
		const fetchApi = async () => {
			const [{ data: categories }, { data: brands }] = await Promise.all([apiGetCategories(), apiGetBrands()]);
			setCategories(categories);
			setBrands(brands);
		};
		fetchApi();
	}, []);

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
				onFinish={handleSubmit(onSubmit)}
			>
				<Row
					gutter={[48, 48]}
					style={{
						marginTop: "32px",
					}}
				>
					<Col span="8">
						<Form.Item label="Tên">
							<Controller
								name="name"
								control={control}
								render={({ field: { onChange, value, name, ref }, formState: { errors } }) => (
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
											placeholder="Lapttop-XYZ"
											style={{
												border: "none",
												padding: 10,
											}}
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
											placeholder="laptop-xyz"
											disabled
											style={{
												border: "none",
												padding: 10,
											}}
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
											style={{
												border: "none",
												padding: 10,
											}}
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
											style={{
												border: "none",
												padding: 10,
											}}
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
						<Form.Item label="Danh mục">
							<Controller
								name="categoryId"
								control={control}
								render={({ field, formState: { errors } }) => (
									<>
										<Select
											{...field}
											size="large"
											style={{ width: "100%" }}
											defaultActiveFirstOption={true}
											status={errors.categoryId && "error"}
											placeholder="Laptop, ..."
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
												defaultValue={getValues("brandId")}
												placeholder="Dell, ..."
												treeDefaultExpandAll
												status={errors.brandId && "error"}
												{...field}
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
						<Form.Item label="Upload">
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
						<Form.Item>
							<Button
								style={{
									color: "#228be6",
									backgroundColor: "#228be61a",
									border: "none",
								}}
								htmlType="submit"
								size="middle"
							>
								Cập Nhật
							</Button>
						</Form.Item>
					</Col>

					<Col span="16">
						<Form.Item
							label="Bài viết mô tả"
							style={{
								width: "100%",
							}}
						>
							<Controller
								name="description"
								control={control}
								render={({ field: { onChange, name, value, ref, onBlur } }) => {
									return <Input />;
								}}
							/>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</>
	);
};

export default UpdateProductPage;
