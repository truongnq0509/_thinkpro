import { ErrorMessage } from "@hookform/error-message";
import { Button, Form, Input, Spin } from "antd";
import classNames from "classnames/bind";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTitle } from "~/hooks";
import { login as apiLogin } from "~/services/authService";
import { AppDispatch } from "~/store";
import { login } from "~/store/reducers/authSlice";
import { iconSpin } from "~/utils/icons";
import { siginSchema } from "~/validations/auth";
import styles from "./Login.module.scss";

type Props = {};
const cx = classNames.bind(styles);

const Login = (props: Props) => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const [loading, setLoading] = useState<boolean>(false);

	useTitle("Thinkpro - Đăng nhập");

	const { control, handleSubmit } = useForm<any>({
		defaultValues: {
			email: "",
			password: "",
		},
		context: "context",
		resolver: async (data, context) => {
			const { error, value: values } = siginSchema.validate(data, {
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
			const { accessToken } = await apiLogin(data);
			dispatch(
				login({
					loggedIn: true,
					accessToken,
				})
			);
			setLoading(false);
			navigate("/admin");
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
			delay={200}
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
						<h1 className={cx("title")}>Đăng nhập vào ThinkPro</h1>
					</div>
					<div className={cx("body")}>
						<Form
							onFinish={handleSubmit(onSubmit)}
							layout="vertical"
							className={cx("form")}
						>
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
							<Link
								to="/quen-mat-khau"
								className={cx("forgot-password")}
							>
								Quên mật khẩu?
							</Link>
							<Form.Item>
								<Button
									size="middle"
									htmlType="submit"
									className={cx("btn")}
								>
									Đăng Nhập
								</Button>
							</Form.Item>
						</Form>
						<div className={cx("body__bottom")}>
							<p className={cx("acc")}>
								<span>Bạn chưa có tài khoản? </span>
								<Link
									to={"/dang-ky"}
									className={cx("link")}
								>
									Đăng ký
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

export default Login;
