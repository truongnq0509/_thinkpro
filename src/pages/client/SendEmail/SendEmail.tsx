import { ErrorMessage } from "@hookform/error-message";
import { Button, Form, Input, Spin } from "antd";
import classNames from "classnames/bind";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTitle } from "~/hooks";
import { sendEmail as apiSendEmail } from "~/services/authService";
import { AppDispatch } from "~/store";
import { iconSpin } from "~/utils/icons";
import { sendEmailSchema } from "~/validations/auth";
import styles from "./SendEmail.module.scss";

type Props = {};
const cx = classNames.bind(styles);

const SendEmail = (props: Props) => {
	const [loading, setLoading] = useState<boolean>(false);

	useTitle("Thinkpro - Quên mật khẩu");

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<any>({
		defaultValues: {
			email: "",
		},
		context: "context",
		resolver: async (data, context) => {
			const { error, value: values } = sendEmailSchema.validate(data, {
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
			await apiSendEmail(data);
			setLoading(false);
			const text = `Chúng tôi đã gửi một email có lên kết để đặt lại mật khẩu của bạn. Có thể mất từ 1 đến 2 phút để hoàn thành. Hãy kiểm tra hộp thư đến của bạn ${data.email}.`;
			Swal.fire("Thành công", text, "success");
		} catch (error: any) {
			setLoading(false);
			Swal.fire("Thất bại", error?.response?.data?.error.message || "", "error");
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
						<h1 className={cx("title")}>Quên mật khẩu</h1>
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
								<Button
									size="middle"
									htmlType="submit"
									className={cx("btn")}
								>
									Gửi email cho tôi
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

export default SendEmail;
