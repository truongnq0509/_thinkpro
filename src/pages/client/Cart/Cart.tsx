import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./Cart.module.scss";
import { Row, Col, Button, List, InputNumber } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "~/store";
import { Link } from "react-router-dom";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { formatNumber } from "~/utils/fc";
import { CiCircleRemove } from "react-icons/ci";
import { deleteProductInCart as apiDeleteProductInCart, addToCart as apiUpdateCart } from "~/services/cartService";
import { setCartQuantity, getQuantity } from "~/store/reducers/cartSlice";
import { useTitle, useDebounce } from "~/hooks";

type Props = {};
const cx = classNames.bind(styles);

let locale = {
	emptyText: (
		<span className={cx("empty")}>
			<svg
				fill="none"
				height="128"
				viewBox="0 0 128 128"
				width="128"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					clipRule="evenodd"
					d="M103.933 71.234H23.9326V108.258C23.9326 110.024 25.0906 111.582 26.7826 112.09C34.8206 114.5 57.4246 121.282 62.7826 122.89C63.5326 123.114 64.3326 123.114 65.0826 122.89C70.4406 121.282 93.0446 114.5 101.083 112.09C102.775 111.582 103.933 110.024 103.933 108.258C103.933 98.986 103.933 71.234 103.933 71.234Z"
					fillRule="evenodd"
					style={{ fill: "rgb(0, 101, 238)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M103.933 71.234H63.9327C63.9327 71.234 63.5447 123.058 63.9327 123.058C64.3207 123.058 64.7067 123.002 65.0827 122.89C70.4407 121.282 93.0447 114.5 101.083 112.09C102.775 111.582 103.933 110.024 103.933 108.258C103.933 98.986 103.933 71.234 103.933 71.234Z"
					fillRule="evenodd"
					style={{ fill: "rgb(0, 71, 167)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M63.9326 84.212L23.9326 71.234C23.9326 71.234 16.9186 81.634 13.7826 86.282C13.4306 86.804 13.3446 87.458 13.5486 88.052C13.7546 88.646 14.2246 89.108 14.8226 89.304C22.4206 91.772 44.9126 99.08 50.8126 100.996C51.6586 101.272 52.5866 100.954 53.0866 100.216C55.7686 96.258 63.9326 84.212 63.9326 84.212Z"
					fillRule="evenodd"
					style={{ fill: "rgb(0, 71, 167)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M103.933 71.234L63.9326 84.212C63.9326 84.212 72.0966 96.258 74.7786 100.216C75.2786 100.954 76.2066 101.272 77.0526 100.996C82.9526 99.08 105.445 91.772 113.043 89.304C113.641 89.108 114.111 88.646 114.317 88.052C114.521 87.458 114.435 86.804 114.083 86.282C110.947 81.634 103.933 71.234 103.933 71.234Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M54.2507 43.972C53.7507 43.238 52.8247 42.92 51.9787 43.196C46.0827 45.11 23.5847 52.42 15.9867 54.89C15.3887 55.084 14.9167 55.546 14.7127 56.14C14.5087 56.734 14.5947 57.39 14.9467 57.91C17.8347 62.194 23.9327 71.234 23.9327 71.234L63.9327 58.212C63.9327 58.212 56.7487 47.646 54.2507 43.972Z"
					fillRule="evenodd"
					style={{ fill: "rgb(78, 153, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M112.919 57.91C113.271 57.39 113.357 56.734 113.153 56.14C112.949 55.546 112.477 55.084 111.879 54.89C104.281 52.42 81.7826 45.11 75.8866 43.196C75.0406 42.92 74.1146 43.238 73.6146 43.972C71.1166 47.646 63.9326 58.212 63.9326 58.212L103.933 71.234C103.933 71.234 110.031 62.194 112.919 57.91Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M103.933 71.234L63.9326 58.212L23.9326 71.234L63.9326 84.212L103.933 71.234Z"
					fillRule="evenodd"
					style={{ fill: "rgb(0, 101, 238)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M63.9326 84.212V58.212L23.9326 71.234L63.9326 84.212Z"
					fillRule="evenodd"
					style={{ fill: "rgb(0, 71, 167)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M55.8967 63.956C55.0647 63.412 54.3147 62.83 53.6487 62.22C52.8367 61.474 51.5707 61.528 50.8227 62.342C50.0767 63.154 50.1307 64.42 50.9447 65.166C51.7627 65.918 52.6847 66.634 53.7087 67.304C54.6327 67.908 55.8727 67.648 56.4767 66.724C57.0807 65.8 56.8207 64.56 55.8967 63.956Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M49.6649 57.812C49.0709 57.006 48.5689 56.196 48.1569 55.386C47.6569 54.402 46.4509 54.01 45.4669 54.51C44.4829 55.01 44.0909 56.216 44.5909 57.2C45.0989 58.196 45.7149 59.194 46.4449 60.184C47.0989 61.072 48.3509 61.262 49.2409 60.608C50.1289 59.952 50.3189 58.7 49.6649 57.812Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M46.7408 49.65C46.7608 48.844 46.8788 48.062 47.0948 47.312C47.3988 46.252 46.7848 45.142 45.7228 44.838C44.6628 44.534 43.5528 45.148 43.2488 46.21C42.9428 47.282 42.7708 48.4 42.7408 49.55C42.7148 50.654 43.5868 51.572 44.6908 51.598C45.7948 51.626 46.7128 50.754 46.7408 49.65Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M49.817 42.97C50.331 42.494 50.907 42.054 51.537 41.656C52.471 41.066 52.751 39.83 52.163 38.898C51.573 37.964 50.337 37.684 49.403 38.272C48.557 38.806 47.789 39.396 47.099 40.036C46.289 40.786 46.241 42.052 46.991 42.862C47.741 43.672 49.007 43.72 49.817 42.97Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M57.2546 39.52C58.2606 39.334 59.3266 39.214 60.4506 39.168C61.5546 39.12 62.4106 38.186 62.3646 37.084C62.3186 35.982 61.3846 35.124 60.2806 35.17C58.9606 35.226 57.7086 35.368 56.5266 35.586C55.4426 35.788 54.7226 36.832 54.9246 37.916C55.1246 39.002 56.1686 39.72 57.2546 39.52Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M67.6788 39.402C69.3848 39.422 70.9728 39.362 72.4468 39.232C73.5468 39.134 74.3608 38.162 74.2628 37.062C74.1648 35.964 73.1928 35.15 72.0928 35.248C70.7428 35.366 69.2888 35.422 67.7248 35.402C66.6208 35.39 65.7148 36.276 65.7028 37.378C65.6888 38.482 66.5748 39.39 67.6788 39.402Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M79.0208 38.006C81.0008 37.4 82.6728 36.624 84.0728 35.734C85.0028 35.14 85.2788 33.904 84.6848 32.972C84.0928 32.042 82.8548 31.766 81.9228 32.36C80.7968 33.076 79.4468 33.692 77.8508 34.18C76.7968 34.504 76.2008 35.622 76.5248 36.678C76.8468 37.734 77.9668 38.328 79.0208 38.006Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M89.2009 30.136C90.1449 28.184 90.5069 26.12 90.4149 24.13C90.3629 23.026 89.4249 22.174 88.3229 22.226C87.2209 22.278 86.3669 23.214 86.4189 24.316C86.4829 25.668 86.2389 27.07 85.5989 28.396C85.1189 29.39 85.5349 30.588 86.5289 31.068C87.5229 31.548 88.7209 31.13 89.2009 30.136Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M87.9266 17.058C86.4686 15.088 84.4906 13.716 82.3346 13.274C81.2526 13.054 80.1946 13.75 79.9726 14.832C79.7526 15.914 80.4506 16.972 81.5306 17.194C82.7746 17.448 83.8706 18.302 84.7126 19.44C85.3706 20.326 86.6246 20.512 87.5106 19.856C88.3986 19.198 88.5846 17.944 87.9266 17.058Z"
					fillRule="evenodd"
					style={{ fill: "rgb(126, 181, 255)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M61.7988 13.662C63.9628 1.408 82.7168 2.2 71.7988 13.662H61.7988Z"
					fillRule="evenodd"
					style={{ fill: "rgb(0, 101, 238)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M61.7988 16.766C63.9628 29.018 82.7168 28.228 71.7988 16.766H61.7988Z"
					fillRule="evenodd"
					style={{ fill: "rgb(0, 101, 238)" }}
				></path>{" "}
				<path
					clipRule="evenodd"
					d="M61.6187 17.234H75.0107C76.1147 17.234 77.0107 16.338 77.0107 15.234C77.0107 14.13 76.1147 13.234 75.0107 13.234H61.6187C60.5167 13.234 59.6187 14.13 59.6187 15.234C59.6187 16.338 60.5167 17.234 61.6187 17.234Z"
					fillRule="evenodd"
					style={{ fill: "rgb(0, 71, 167)" }}
				></path>
			</svg>
			<h4>Giỏ hàng trống</h4>
			<p className={cx("empty__text")}>Hãy thoái mãi lựa sản phẩm bạn nhé</p>
			<Button
				size="large"
				style={{
					color: "#fff",
					background: "#0065ee",
					border: "none",
					fontWeight: 500,
					display: "inline-flex",
					alignItems: "center",
					padding: "0 16px",
					height: "48px",
					borderRadius: 4,
				}}
			>
				<Link to="/">Khám phá ngay</Link>
			</Button>
		</span>
	),
};

const Cart = (props: Props) => {
	const [product, setProduct] = useState<any>(null);
	const debounceQuantity = useDebounce(product?.quantity, 700);
	const dispatch = useDispatch<AppDispatch>();
	useTitle("Giỏ Hàng");

	const {
		cart: { products, bill },
		quantity: cartQuantity,
	} = useSelector((state: RootState) => state.cart);

	useEffect(() => {
		dispatch(getQuantity());
	}, [cartQuantity]);

	useEffect(() => {
		const fetchApi = async () => await apiUpdateCart(product);
		if (product) {
			fetchApi();
			dispatch(getQuantity());
		}
	}, [debounceQuantity]);

	const handleDeleteProductInCart = async (id: string, quantity: number) => {
		await apiDeleteProductInCart(id);
		dispatch(setCartQuantity(-quantity));
	};

	return (
		<div className={cx("wrapper")}>
			<h1>{`Giỏ hàng (${cartQuantity})`}</h1>
			<div className={cx("cart")}>
				<Row gutter={[32, 32]}>
					<Col span={16}>
						<div className={cx("cart__left")}>
							<List
								grid={{ gutter: 12, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
								dataSource={products}
								locale={locale}
								renderItem={(product: any) => (
									<List.Item>
										<div className={cx("cart__item")}>
											<div className={cx("cart__img")}>
												<img
													src={product?.productId?.thumbnail?.path}
													alt="thubmnail"
												/>
											</div>
											<div className={cx("cart__box")}>
												<div className={cx("cart__top")}>
													<div className={cx("cart__top--left")}>
														<h1>{product?.productId?.name}</h1>
													</div>
													<div className={cx("cart__top--right")}>
														<span>{formatNumber(`${product?.productId?.price}`)}</span>
														<span>{formatNumber(`${product?.productId?.discount}`)}</span>
													</div>
												</div>
												<div className={cx("cart__bottom")}>
													<div className={cx("cart__bottom--left")}>
														<InputNumber
															min={1}
															max={1000}
															defaultValue={product?.quantity}
															controls={{
																upIcon: <MdKeyboardArrowUp size={16} />,
																downIcon: <MdKeyboardArrowDown size={16} />,
															}}
															onChange={(e) =>
																setProduct({
																	productId: product?.productId?._id,
																	quantity: e,
																})
															}
															style={{
																padding: "2px 0px",
																borderRadius: 4,
																width: 60,
															}}
														/>
													</div>
													<div className={cx("cart__bottom--right")}>
														<span
															onClick={() =>
																handleDeleteProductInCart(
																	product?.productId?._id as string,
																	product?.quantity as number
																)
															}
														>
															Xóa <CiCircleRemove size={14} />
														</span>
													</div>
												</div>
											</div>
										</div>
									</List.Item>
								)}
							/>
						</div>
					</Col>
					<Col span={8}>
						<div className={cx("cart__right")}>
							<h5>Tóm tắt đơn hàng</h5>
							<div className={cx("line")}></div>
							<div className={cx("cart__right--total")}>
								<span>Tổng cộng</span>
								<span>{formatNumber(`${bill}`)}</span>
							</div>
							<Button
								size="middle"
								className={cx("btn")}
							>
								Đặt Hàng
							</Button>
						</div>
					</Col>
				</Row>
			</div>
		</div>
	);
};

export default Cart;
