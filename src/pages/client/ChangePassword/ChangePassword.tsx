import { ErrorMessage } from "@hookform/error-message";
import { Button, Col, Form, Input, Row } from "antd";
import classNames from "classnames/bind";
import joi from "joi";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { changePassword as apiChangePassword } from "~/services/authService";
import styles from "./ChangePassword.module.scss";
import { useState } from "react";

type Props = {};
const cx = classNames.bind(styles);

const changePasswordSchema = joi.object({
	password: joi.string().min(6).required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
		"string.min": "Tối thiểu 6 ký tự!!!",
	}),
	confirmPassword: joi.any().equal(joi.ref("password")).required().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
		"any.only": "Mật khẩu không khớp!!!",
	}),
});

const ChangePasswordPage = (props: Props) => {
	const [loading, setLoading] = useState<boolean>(false);

	const { control, handleSubmit } = useForm<any>({
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		context: "context",
		resolver: async (data, context) => {
			const { error, value: values } = changePasswordSchema.validate(data, {
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

	const onSubmit = async (data: any) => {
		setLoading(true);
		try {
			await apiChangePassword({
				password: data.password,
			});
			setLoading(false);
			Swal.fire("Thay đổi mật khẩu", "", "success");
		} catch (error) {
			setLoading(false);
			Swal.fire("Thất bại", "", "error");
		}
	};

	return (
		<div className={cx("wrapper")}>
			<div className={cx("header")}>
				<h1>Đổi Mật Khẩu</h1>
				<p>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</p>
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
								<Button
									size="middle"
									htmlType="submit"
									className={cx("btn")}
									loading={loading}
								>
									Xác Nhận
								</Button>
							</Form.Item>
						</Form>
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default ChangePasswordPage;
