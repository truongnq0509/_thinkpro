import { CaretRightOutlined } from "@ant-design/icons";
import { ErrorMessage } from "@hookform/error-message";
import { Button, Col, Collapse, Form, Input, Radio, Row, Select } from "antd";
import classNames from "classnames/bind";
import joi from "joi";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { HiOutlineCreditCard } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineLocalShipping } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useTitle } from "~/hooks";
import { getProvinces as apiGetProvinces } from "~/services/appService";
import { createOrder as apiCreateOrder } from "~/services/orderService";
import { AppDispatch, RootState } from "~/store";
import { getQuantity, setCartQuantity, setCart } from "~/store/reducers/cartSlice";
import { formatNumber } from "~/utils/fc";
import styles from "./Checkout.module.scss";

type Props = {};
const cx = classNames.bind(styles);

const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;
const checkoutSchema = joi.object({
	fullname: joi.string().required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc !!!",
	}),
	phone: joi
		.string()
		.regex(/^[0-9]{10}$/)
		.required()
		.trim()
		.messages({
			"string.pattern.base": `Số điện thoại không hợp lệ`,
			"string.empty": "Không được để trống!!!",
			"any.required": "Trường này bắt buộc !!!",
		}),
	email: joi
		.string()
		.email({ tlds: { allow: false } })
		.required()
		.trim()
		.messages({
			"string.email": "Email không hợp lệ!!!",
			"string.empty": "Không được để trống!!!",
			"any.required": "Trường này bắt buộc !!!",
		}),
	city: joi.string().required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc !!!",
	}),
	district: joi.string().required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc !!!",
	}),
	ward: joi.string().required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc !!!",
	}),
	address: joi.string().required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc !!!",
	}),
	note: joi.string().required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc !!!",
	}),
	payment: joi.string().required().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc !!!",
	}),
});

const Checkout = (props: Props) => {
	const dispatch = useDispatch<AppDispatch>();
	const {
		cart: { products, bill, _id },
		quantity: cartQuantity,
	} = useSelector((state: RootState) => state.cart);
	const [provinces, setProvinces] = useState<any>([]);
	const [districts, setDistricts] = useState<any>([]);
	const [wards, setWards] = useState<any>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const navigate = useNavigate();

	useTitle("ThinkPro - Laptop, Phím cơ, Bàn nâng hạ, Ghế công thái học, PS5, Nintendo - Dịch vụ Tận tâm");

	useEffect(() => {
		if (cartQuantity) dispatch(getQuantity());
	}, [cartQuantity]);

	useEffect(() => {
		const fetchApi = async () => {
			const response = await apiGetProvinces("/p");
			setProvinces(response);
		};
		fetchApi();
	}, []);

	const { control, handleSubmit, setValue } = useForm<any>({
		defaultValues: {
			fullname: "",
			phone: "",
			email: "",
			city: "",
			district: "",
			ward: "",
			address: "",
			note: "",
			payment: "",
		},
		context: "context",
		resolver: async (data, context) => {
			const { error, value: values } = checkoutSchema.validate(data, {
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

	const handleDistricts = async (name: string) => {
		const province = provinces.find((item: any) => item.name == name);
		const response = await apiGetProvinces(`/p/${province?.code}?depth=2`);
		setValue("district", "");
		setValue("ward", "");
		setDistricts(response?.districts);
	};

	const handleWards = async (name: string) => {
		const district = districts.find((item: any) => item.name == name);
		const response = await apiGetProvinces(`/d/${district?.code}?depth=2`);
		setValue("ward", "");
		setWards(response?.wards);
	};

	const onSubmit = async (data: any) => {
		setLoading(true);
		try {
			const { fullname, phone, email, city, district, ward, address, payment, note } = data;
			await apiCreateOrder({
				cartId: _id,
				shipping: {
					fullname,
					phone,
					email,
					address: `${city}, ${district}, ${ward} | ${address}`,
					note,
				},
				payment: {
					methods: payment,
					status: false,
				},
			});
			dispatch(setCartQuantity(-cartQuantity));
			dispatch(
				setCart({
					_id: "",
					products: [],
					bill: 0,
				})
			);
			setLoading(false);
			Swal.fire("Đặt Hàng Thành Công", "", "success");
			navigate("/tai-khoan/don-mua");
		} catch (error) {
			setLoading(false);
			Swal.fire("Đặt Hàng Không Thành Công", "", "error");
		}
	};

	return (
		<div className={cx("wrapper")}>
			<h1>Đặt Hàng</h1>
			<div className={cx("cart")}>
				<Form
					onFinish={handleSubmit(onSubmit)}
					layout="vertical"
				>
					<Row gutter={[32, 32]}>
						<Col
							xs={24}
							md={16}
						>
							<div className={cx("cart__wrapper")}>
								<div className={cx("cart__line")}></div>
								<div className={cx("cart__left")}>
									<h3>Thông Tin Giao Hàng</h3>
									<Form.Item>
										<Controller
											control={control}
											name="fullname"
											render={({ field, formState: { errors } }) => {
												return (
													<>
														<Input
															{...field}
															size="large"
															placeholder="Họ và tên"
															status={errors.fullname && "error"}
															className={cx("input")}
														/>
														<ErrorMessage
															name="fullname"
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
									<Row gutter={{ xs: 16, sm: 16, md: 64 }}>
										<Col
											xs={24}
											sm={24}
											md={8}
										>
											<Form.Item>
												<Controller
													control={control}
													name="city"
													render={({ field, formState: { errors } }) => {
														return (
															<>
																<Select
																	{...field}
																	value={field.value || "-- Thành Phố --"}
																	size="large"
																	className={cx("select", {
																		"select--error": errors.city ? true : false,
																	})}
																	onChange={(e) => {
																		field.onChange(e);
																		handleDistricts(e);
																	}}
																	suffixIcon={<IoIosArrowDown size={16} />}
																>
																	{provinces?.map((province: any, index: number) => {
																		return (
																			<Option
																				key={province?.code}
																				value={province?.name}
																			>
																				{province?.name}
																			</Option>
																		);
																	})}
																</Select>
																<ErrorMessage
																	name="city"
																	errors={errors}
																	render={({ message }) => {
																		return (
																			<p
																				style={{
																					color: "#f03e3e",
																					marginTop: 4,
																				}}
																			>
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
										<Col
											xs={24}
											sm={24}
											md={8}
										>
											<Form.Item>
												<Controller
													control={control}
													name="district"
													render={({ field, formState: { errors } }) => {
														return (
															<>
																<Select
																	{...field}
																	value={field.value || "-- Quận/Huyện --"}
																	size="large"
																	className={cx("select", {
																		"select--error": errors.city ? true : false,
																	})}
																	onChange={(e) => {
																		field.onChange(e);
																		handleWards(e);
																	}}
																	suffixIcon={<IoIosArrowDown size={16} />}
																>
																	{districts?.map((district: any, index: number) => {
																		return (
																			<Option
																				key={district?.code}
																				value={district?.name}
																			>
																				{district?.name}
																			</Option>
																		);
																	})}
																</Select>
																<ErrorMessage
																	name="district"
																	errors={errors}
																	render={({ message }) => {
																		return (
																			<p
																				style={{
																					color: "#f03e3e",
																					marginTop: 4,
																				}}
																			>
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
										<Col
											xs={24}
											sm={24}
											md={8}
										>
											<Form.Item>
												<Controller
													control={control}
													name="ward"
													render={({ field, formState: { errors } }) => {
														return (
															<>
																<Select
																	{...field}
																	value={field.value || "-- Phường/Xã --"}
																	size="large"
																	className={cx("select", {
																		"select--error": errors.city ? true : false,
																	})}
																	suffixIcon={<IoIosArrowDown size={16} />}
																>
																	{wards?.map((ward: any, index: number) => {
																		return (
																			<Option
																				key={ward?.name}
																				value={ward?.name}
																			>
																				{ward?.name}
																			</Option>
																		);
																	})}
																</Select>
																<ErrorMessage
																	name="ward"
																	errors={errors}
																	render={({ message }) => {
																		return (
																			<p
																				style={{
																					color: "#f03e3e",
																					marginTop: 4,
																				}}
																			>
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
									</Row>
									<Form.Item>
										<Controller
											control={control}
											name="address"
											render={({ field, formState: { errors } }) => {
												return (
													<>
														<Input
															{...field}
															size="large"
															placeholder="Địa chỉ cụ thể"
															status={errors.address && "error"}
															className={cx("input")}
														/>
														<ErrorMessage
															name="address"
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
									<Form.Item>
										<Controller
											control={control}
											name="note"
											render={({ field, formState: { errors } }) => {
												return (
													<>
														<TextArea
															{...field}
															rows={3}
															placeholder="Thông tin ghi chú"
															status={errors.note && "error"}
															className={cx("input")}
															style={{
																paddingTop: 12,
															}}
														/>
														<ErrorMessage
															name="note"
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
								</div>

								<div
									className={cx("cart__left")}
									style={{ marginTop: 32 }}
								>
									<h3>Phương Thức Thanh Toán</h3>
									<Form.Item>
										<Controller
											control={control}
											name="payment"
											render={({ field, formState: { errors } }) => {
												return (
													<>
														<Radio.Group
															{...field}
															style={{
																display: "flex",
																flexDirection: "column",
																gap: 16,
															}}
														>
															<Radio
																value={"VNPAY"}
																className={cx("payment")}
															>
																<div className={cx("payment__box")}>
																	<HiOutlineCreditCard size={18} />
																	<p>Thanh toán VNPAY</p>
																</div>
															</Radio>
															<Radio
																value={"MOMO"}
																className={cx("payment")}
															>
																<div className={cx("payment__box")}>
																	<HiOutlineCreditCard size={18} />
																	<p>Thanh toán MOMO</p>
																</div>
															</Radio>
															<Radio
																value={"COD"}
																className={cx("payment")}
															>
																<div className={cx("payment__box")}>
																	<MdOutlineLocalShipping size={18} />
																	<p>Thanh toán khi nhận hàng (COD)</p>
																</div>
															</Radio>
														</Radio.Group>
														<ErrorMessage
															name="payment"
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
								</div>
							</div>
						</Col>
						<Col
							xs={24}
							md={8}
						>
							<div className={cx("cart__right")}>
								<h5>Tóm tắt đơn hàng</h5>
								<div className={cx("line")}></div>
								<div className={cx("cart__right--total")}>
									<span>Tạm tính</span>
									<span
										style={{
											color: "#333",
											fontSize: 12,
										}}
									>
										{formatNumber(`${bill}`)}
									</span>
								</div>
								<div className={cx("cart__right--total")}>
									<span>Phí vận chuyển</span>
									<span
										style={{
											color: "#333",
											fontSize: 12,
										}}
									>
										0
									</span>
								</div>
								<div className={cx("line")}></div>
								<div className={cx("cart__right--total")}>
									<span>Tổng cộng</span>
									<span>{formatNumber(`${bill}`)}</span>
								</div>
								<Button
									size="middle"
									htmlType="submit"
									disabled={cartQuantity ? false : true}
									className={cx("btn")}
									loading={loading}
								>
									Đặt Hàng
								</Button>
							</div>
							{cartQuantity ? (
								<div className={cx("cart__bottom")}>
									<Collapse
										bordered={false}
										defaultActiveKey={["1"]}
										expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
										style={{
											width: "100%",
											borderRadius: 6,
											backgroundColor: "#fff",
											marginTop: 16,
											padding: "12px 8px",
										}}
									>
										{
											<Panel
												header={<h1>{`Sản phẩm trong đơn (${cartQuantity})`}</h1>}
												key="1"
											>
												{products?.map((product: any, index: number) => {
													return (
														<div
															key={index}
															className={cx("cart__item")}
														>
															<img
																src={product?.productId?.thumbnail?.path}
																alt="thumbnail"
																className={cx("cart__img")}
															/>
															<div className={cx("cart__info")}>
																<h4>{product?.productId?.name}</h4>
																<div className={cx("cart__box")}>
																	<span>
																		{formatNumber(
																			`${
																				product?.productId?.discount ||
																				product?.productId?.price
																			}`
																		)}
																	</span>
																	X<span>{product?.quantity}</span>
																</div>
															</div>
														</div>
													);
												})}
											</Panel>
										}
									</Collapse>
								</div>
							) : (
								""
							)}
						</Col>
					</Row>
				</Form>
			</div>
		</div>
	);
};

export default Checkout;
