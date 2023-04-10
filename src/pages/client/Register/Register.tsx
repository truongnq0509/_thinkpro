import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.scss";
import { ErrorMessage } from "@hookform/error-message";
import { Button, Form, Input, message } from "antd";
import classNames from "classnames/bind";
import { Controller, useForm } from "react-hook-form";
import { register as apiRegister } from "~/services/authService";
import { signupSchema } from "~/validations/auth";
const cx = classNames.bind(styles);

type Props = {};
interface IUser {
	email: string;
	password: string;
	confirmPassword: string;
}

const Login = (props: Props) => {
	const navigate = useNavigate();

	const { control, handleSubmit } = useForm<any>({
		defaultValues: {
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
		try {
			await apiRegister(data);
			navigate("/login");
			message.open({
				type: "success",
				content: "Bạn đã đăng ký thành công, bây giờ thì chiến thôi!!!",
			});
		} catch (error: any) {
			message.open({
				type: "error",
				content: error.response.data.error.message,
			});
		}
	};
	return (
		<div className={cx("wrapper")}>
			<div className={cx("container")}>
				<div className={cx("header")}>
					<Link
						to={"/"}
						className={cx("logo")}
					></Link>
					<h1 className={cx("title")}>Đăng ký tại ThinkPro</h1>
				</div>
				<div className={cx("body")}>
					<Form
						onFinish={handleSubmit(onSubmit)}
						style={{
							width: 400,
						}}
						layout="vertical"
					>
						<Form.Item label="Email">
							<Controller
								control={control}
								name="email"
								render={({ field, formState: { errors } }) => {
									return (
										<>
											<Input
												{...field}
												size="large"
												placeholder="truong@gmail.com ..."
												status={errors.email && "error"}
												style={{
													border: "none",
													padding: 10,
												}}
											/>
											<ErrorMessage
												name="email"
												errors={errors}
												render={({ message }) => {
													return <p style={{ color: "#f03e3e", marginTop: 4 }}>{message}</p>;
												}}
											/>
										</>
									);
								}}
							/>
						</Form.Item>
						<Form.Item label="Mật khẩu">
							<Controller
								control={control}
								name="password"
								render={({ field, formState: { errors } }) => {
									return (
										<>
											<Input.Password
												{...field}
												size="large"
												placeholder="xxxxxxxx"
												status={errors.email && "error"}
												style={{
													border: "none",
													padding: 10,
												}}
											/>
											<ErrorMessage
												name="password"
												errors={errors}
												render={({ message }) => {
													return <p style={{ color: "#f03e3e", marginTop: 4 }}>{message}</p>;
												}}
											/>
										</>
									);
								}}
							/>
						</Form.Item>
						<Form.Item label="Nhập Lại Mật khẩu">
							<Controller
								control={control}
								name="confirmPassword"
								render={({ field, formState: { errors } }) => {
									return (
										<>
											<Input.Password
												{...field}
												size="large"
												placeholder="xxxxxxxx"
												status={errors.confirmPassword && "error"}
												style={{
													border: "none",
													padding: 10,
												}}
											/>
											<ErrorMessage
												name="confirmPassword"
												errors={errors}
												render={({ message }) => {
													return <p style={{ color: "#f03e3e", marginTop: 4 }}>{message}</p>;
												}}
											/>
										</>
									);
								}}
							/>
						</Form.Item>
						<Form.Item>
							<Button
								size="large"
								htmlType="submit"
								style={{
									color: "#228be6",
									backgroundColor: "#228be61a",
									border: "none",
								}}
							>
								Đăng Ký
							</Button>
						</Form.Item>
					</Form>
					<div className={cx("body__bottom")}>
						<p className={cx("acc")}>
							<span>Bạn đã có tài khoản? </span>
							<Link
								to={"/login"}
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
	);
};

export default Login;
