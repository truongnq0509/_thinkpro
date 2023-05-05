import { ErrorMessage } from "@hookform/error-message";
import { Button, Form, Input, Spin, Upload } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import classNames from "classnames/bind";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTitle } from "~/hooks";
import { IUser } from "~/interfaces/auth";
import { register as apiRegister } from "~/services/authService";
import { uploadFiles as apiUploadFiles } from "~/services/uploadService";
import { iconSpin } from "~/utils/icons";
import { signupSchema } from "~/validations/auth";
import styles from "./Register.module.scss";

const cx = classNames.bind(styles);
type Props = {};

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
	const reader = new FileReader();
	reader.onload = () => callback(reader.result as string);
	reader.readAsDataURL(img);
};

const Register = (props: Props) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [imageUrl, setImageUrl] = useState<string>();

	useTitle("Thinkpro - Đăng ký tài khoản");

	const handleChange: UploadProps["onChange"] = (info: UploadChangeParam<UploadFile>) => {
		getBase64(info.file as RcFile, (url) => {
			setLoading(false);
			setImageUrl(url);
		});
	};

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<any>({
		defaultValues: {
			firstName: "",
			lastName: "",
			phone: "",
			avatar: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
		context: "context",
		resolver: async (data, context) => {
			const { error, value: values } = signupSchema.validate(data, {
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

	const onSubmit = async (data: IUser) => {
		setLoading(true);
		try {
			let response;
			if (data.avatar) {
				const formData = new FormData();
				formData.append("assets", data.avatar);
				response = await apiUploadFiles(formData);
			}
			await apiRegister({
				...data,
				avatar: response ? response?.data[0].path : "",
			});
			setLoading(false);
			Swal.fire("Thành công", "Kiểm tra hộp thư email để xác minh tài khoản", "success").then(() =>
				navigate("/dang-nhap")
			);
		} catch (error: any) {
			setLoading(false);
			Swal.fire("Thất bại", error.response?.data?.error.message || "", "error");
		}
	};

	return (
		<Spin
			spinning={loading}
			indicator={iconSpin}
			size="large"
			wrapperClassName={cx("wrapper")}
		>
			<div className={cx("wrapper")}>
				<div className={cx("container")}>
					<div className={cx("header")}>
						<Link
							to={"/"}
							className={cx("logo")}
						>
							<img
								src="https://res.cloudinary.com/dgpzzy5sg/image/upload/v1683102987/thinkpro/products/btzgln0jou7fdoxtiohc.jpg"
								alt=""
							/>
						</Link>
						<h1 className={cx("title")}>Đăng ký tại ThinkPro</h1>
					</div>
					<div className={cx("body")}>
						<Form
							onFinish={handleSubmit(onSubmit)}
							className={cx("form")}
							layout="vertical"
						>
							<Form.Item>
								<Controller
									control={control}
									name="firstName"
									render={({ field, formState: { errors } }) => {
										return (
											<>
												<Input
													{...field}
													size="large"
													placeholder="Họ"
													status={errors.firstName && "error"}
													className={cx("input")}
												/>
												<ErrorMessage
													name="firstName"
													errors={errors}
													render={({ message }) => {
														return (
															<p style={{ color: "#f03e3e", marginTop: 4 }}>{message}</p>
														);
													}}
												/>
											</>
										);
									}}
								/>
							</Form.Item>
							<Form.Item>
								<Controller
									control={control}
									name="lastName"
									render={({ field, formState: { errors } }) => {
										return (
											<>
												<Input
													{...field}
													size="large"
													placeholder="Tên đệm"
													status={errors.lastName && "error"}
													className={cx("input")}
												/>
												<ErrorMessage
													name="lastName"
													errors={errors}
													render={({ message }) => {
														return (
															<p style={{ color: "#f03e3e", marginTop: 4 }}>{message}</p>
														);
													}}
												/>
											</>
										);
									}}
								/>
							</Form.Item>
							<Form.Item>
								<Controller
									control={control}
									name="phone"
									render={({ field, formState: { errors } }) => {
										return (
											<>
												<Input
													{...field}
													size="large"
													placeholder="Số điện thoại"
													status={errors.phone && "error"}
													className={cx("input")}
												/>
												<ErrorMessage
													name="phone"
													errors={errors}
													render={({ message }) => {
														return (
															<p style={{ color: "#f03e3e", marginTop: 4 }}>{message}</p>
														);
													}}
												/>
											</>
										);
									}}
								/>
							</Form.Item>
							<Form.Item>
								<Controller
									control={control}
									name="email"
									render={({ field, formState: { errors } }) => {
										return (
											<>
												<Input
													{...field}
													size="large"
													placeholder="Email"
													status={errors.email && "error"}
													className={cx("input")}
												/>
												<ErrorMessage
													name="email"
													errors={errors}
													render={({ message }) => {
														return (
															<p style={{ color: "#f03e3e", marginTop: 4 }}>{message}</p>
														);
													}}
												/>
											</>
										);
									}}
								/>
							</Form.Item>
							<Form.Item>
								<Controller
									control={control}
									name="password"
									render={({ field, formState: { errors } }) => {
										return (
											<>
												<Input.Password
													{...field}
													size="large"
													placeholder="Mật khẩu"
													status={errors.email && "error"}
													className={cx("input")}
												/>
												<ErrorMessage
													name="password"
													errors={errors}
													render={({ message }) => {
														return (
															<p style={{ color: "#f03e3e", marginTop: 4 }}>{message}</p>
														);
													}}
												/>
											</>
										);
									}}
								/>
							</Form.Item>
							<Form.Item>
								<Controller
									control={control}
									name="confirmPassword"
									render={({ field, formState: { errors } }) => {
										return (
											<>
												<Input.Password
													{...field}
													size="large"
													placeholder="Nhập lại mật khẩu"
													status={errors.confirmPassword && "error"}
													className={cx("input")}
												/>
												<ErrorMessage
													name="confirmPassword"
													errors={errors}
													render={({ message }) => {
														return (
															<p style={{ color: "#f03e3e", marginTop: 4 }}>{message}</p>
														);
													}}
												/>
											</>
										);
									}}
								/>
							</Form.Item>
							<Form.Item>
								<Controller
									control={control}
									name="avatar"
									render={({ field: { onChange, name }, formState: { errors } }) => {
										return (
											<>
												<Upload.Dragger
													name={name}
													listType="picture-circle"
													className="avatar-uploader"
													showUploadList={false}
													beforeUpload={() => {
														return false;
													}}
													onChange={(info: any) => {
														onChange(info.file);
														handleChange(info);
													}}
												>
													{imageUrl ? (
														<img
															src={imageUrl}
															alt="avatar"
															style={{
																width: 78,
																height: 78,
																borderRadius: "50%",
																border: "none",
															}}
														/>
													) : (
														<AiOutlineCloudUpload
															size={32}
															color="#ccc"
														/>
													)}
												</Upload.Dragger>
												<ErrorMessage
													name="avatar"
													errors={errors}
													render={({ message }) => {
														return (
															<p style={{ color: "#f03e3e", marginTop: 4 }}>{message}</p>
														);
													}}
												/>
											</>
										);
									}}
								/>
							</Form.Item>
							<Form.Item>
								<Button
									size="middle"
									htmlType="submit"
									className={cx("btn")}
								>
									Đăng Ký
								</Button>
							</Form.Item>
						</Form>
						<div className={cx("body__bottom")}>
							<p className={cx("acc")}>
								<span>Bạn đã có tài khoản? </span>
								<Link
									to={"/dang-nhap"}
									className={cx("link")}
								>
									Đăng nhập
								</Link>
							</p>
						</div>
					</div>
					<div className={cx("footer")}>
						<span>
							Việc mà bạn sử dụng trang web này đồng nghĩa bạn đồng ý với
							<Link
								to={"/"}
								className={cx("footer__link")}
							>
								{" "}
								Điều khoản sử dụng{" "}
							</Link>
							của chúng tôi
						</span>
					</div>
				</div>
			</div>
		</Spin>
	);
};

export default Register;
