import { ErrorMessage } from "@hookform/error-message";
import { Button, Col, Form, Input, Row, Upload } from "antd";
import classNames from "classnames/bind";
import joi from "joi";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { me as apiGetCurrentUser, updateUser as apiUpdateUser } from "~/services/authService";
import { uploadFiles as apiUploadFiles } from "~/services/uploadService";
import { AppDispatch } from "~/store";
import { setCurrentUser } from "~/store/reducers/authSlice";
import styles from "./Profile.module.scss";

type Props = {};
const cx = classNames.bind(styles);

const editSchema = joi.object({
	firstName: joi.string().required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
	}),
	lastName: joi.string().required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
	}),
	avatar: joi.any().required().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
	}),
	role: joi.any().required().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
	}),
	phone: joi
		.string()
		.regex(/^[0-9]{10}$/)
		.required()
		.trim()
		.messages({
			"string.pattern.base": `Số điện thoại không hợp lệ`,
			"string.empty": "Không được để trống!!!",
			"any.required": "Trường này bắt buộc phải nhập!!!",
		}),
	email: joi
		.string()
		.email({ tlds: { allow: false } })
		.required()
		.trim()
		.messages({
			"string.email": "Email không hợp lệ!!!",
			"string.empty": "Không được để trống!!!",
			"any.required": "Trường này bắt buộc phải nhập!!!",
		}),
});

const Profile = (props: Props) => {
	const [user, setUser] = useState<any>({});
	const [avatar, setAvatar] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const dispatch = useDispatch<AppDispatch>();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<any>({
		defaultValues: {
			firstName: user.firstName,
			lastName: user.lastName,
			phone: user.phone,
			avatar,
			email: user.email,
		},
		context: "context",
		resolver: async (data, context) => {
			const { error, value: values } = editSchema.validate(data, {
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
			const { data } = await apiGetCurrentUser();
			setUser(data);
			setAvatar(data.avatar);
		};
		fetchApi();
	}, []);

	useEffect(() => {
		reset(user);
	}, [user]);

	const onSubmit = async (data: any) => {
		data = {
			...data,
			avatar,
		};
		const { data: userEdit } = await apiUpdateUser(data);
		Swal.fire("Cập nhật hồ sơ", "", "success");
		dispatch(
			setCurrentUser({
				firstName: userEdit.firstName,
				lastName: userEdit.lastName,
				avatar: userEdit.avatar,
				role: userEdit.role,
			})
		);
	};

	const handleUploadFile = async (info: any) => {
		const formData = new FormData();
		formData.append("assets", info.file);
		setLoading(true);
		const { data } = await apiUploadFiles(formData);
		setAvatar(data[0].path);
		setLoading(false);
	};

	return (
		<div className={cx("wrapper")}>
			<div className={cx("header")}>
				<h1>Hồ Sơ Của Tôi</h1>
				<p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
			</div>
			<div className={cx("body")}>
				<Row gutter={[32, 32]}>
					<Col
						xs={24}
						sm={24}
						md={14}
					>
						<Form
							onFinish={handleSubmit(onSubmit)}
							className={cx("form")}
							layout="vertical"
							autoComplete="off"
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
													disabled
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
								<Button
									size="middle"
									htmlType="submit"
									className={cx("btn")}
								>
									Lưu
								</Button>
							</Form.Item>
						</Form>
					</Col>
					<Col
						xs={24}
						sm={24}
						md={10}
					>
						<div className={cx("avatar")}>
							<img
								src={
									avatar ||
									"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSIsmpJQm0OTBcGyY-Y3ECq4UMpN2lAcagoQ&usqp=CAU"
								}
								alt="avatar"
							/>
							<Upload
								onChange={handleUploadFile}
								beforeUpload={() => false}
								showUploadList={false}
							>
								<Button
									className={cx("btn")}
									loading={loading}
								>
									Chọn ảnh
								</Button>
							</Upload>
						</div>
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default Profile;
