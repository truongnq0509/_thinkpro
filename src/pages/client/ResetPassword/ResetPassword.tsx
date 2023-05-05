import { ErrorMessage } from "@hookform/error-message";
import { Button, Form, Input, Spin } from "antd";
import classNames from "classnames/bind";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { IUser } from "~/interfaces/auth";
import { iconSpin } from "~/utils/icons";
import { resetPasswordSchema } from "~/validations/auth";
import styles from "./ResetPassword.module.scss";
import { useTitle } from "~/hooks";
import { resetPassword as apiResetPassword } from "~/services/authService";

const cx = classNames.bind(styles);
type Props = {};

const Register = (props: Props) => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token") as string;
	const userId = searchParams.get("id") as string;
	const [loading, setLoading] = useState(false);

	useTitle("Thinkpro - Reset mật khẩu");

	const { control, handleSubmit } = useForm<any>({
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
		context: "context",
		resolver: async (data, context) => {
			const { error, value: values } = resetPasswordSchema.validate(data, {
				abortEarly: false,
			});

			if (!error) return { values: values, errors: {} };

			return {
				values: {},
				errors: error.details.reduce((previous, currentError) => ({
					...previous,
					[currentError.path[0]]: currentError,
				})),
			};
		},
	});

	const onSubmit = async (data: IUser) => {
		setLoading(true);
		try {
			await apiResetPassword({
				token,
				userId,
				password: data.password,
			});
			setLoading(false);
			Swal.fire("Thành công", "Reset mật khẩu thành công", "success").then(() => navigate("/dang-nhap"));
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
						<h1 className={cx("title")}>Reset Mật Khẩu</h1>
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
									name="password"
									render={({ field, formState: { errors } }) => {
										return (
											<>
												<Input.Password
													{...field}
													size="large"
													placeholder="Mật khẩu Mới"
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
													placeholder="Nhập lại mật khẩu mới"
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
								>
									Thay Đổi Mật Khẩu
								</Button>
							</Form.Item>
						</Form>
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
