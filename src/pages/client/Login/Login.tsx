import { ErrorMessage } from "@hookform/error-message";
import { Button, Form, Input, message } from "antd";
import classNames from "classnames/bind";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { login as apiLogin } from "~/services/authService";
import { siginSchema } from "~/validations/auth";
import styles from "./Login.module.scss";

type Props = {};
const cx = classNames.bind(styles);

const Login = (props: Props) => {
	const navigate = useNavigate();

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
		try {
			const response = await apiLogin(data);
			// lưu user vào localstorage
			localStorage.setItem("user", JSON.stringify(response));
			navigate("/admin");
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
					<h1 className={cx("title")}>Đăng nhập vào ThinkPro</h1>
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
								Đăng Nhập
							</Button>
						</Form.Item>
					</Form>
					<div className={cx("body__bottom")}>
						<p className={cx("acc")}>
							<span>Bạn chưa có tài khoản? </span>
							<Link
								to={"/register"}
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
	);
};

export default Login;
