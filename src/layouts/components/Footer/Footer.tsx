import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Footer.module.scss";
import { List, Button } from "antd";
import { MdVerified } from "react-icons/md";
import { IoSyncOutline, IoScan, IoLogoTiktok } from "react-icons/io5";
import { TbTruckDelivery } from "react-icons/tb";
import { BsShieldShaded, BsCreditCardFill, BsFillInfoCircleFill } from "react-icons/bs";
import { AiFillShopping, AiFillFacebook, AiFillYoutube } from "react-icons/ai";
import { FaTelegramPlane } from "react-icons/fa";
import { BsArrowUpRight } from "react-icons/bs";

const cx = classNames.bind(styles);

const stores = [
	{
		title: "HCM",
		color: "#fc8800",
		address: "Số 5 - 7 Nguyễn Huy Tưởng, Phường 6, Quận Bình Thạnh, Hồ Chí Minh",
	},
	{
		title: "HCM",
		color: "#fc8800",
		address: "95 Trần Thiện Chánh, F12, Q10, HCM",
	},
	{
		title: "HN",
		color: "#41b346",
		address: "53 Thái Hà, Trung Liệt, Đống Đa, Hà Nội",
	},
];

const socials = [
	{
		icon: (
			<MdVerified
				color="#0065ee"
				size="24px"
			/>
		),
		title: "Chính sách bảo hành",
		link: "/",
	},
	{
		icon: (
			<IoSyncOutline
				color="#0065ee"
				size="24px"
			/>
		),
		title: "Chính xác đổi trả",
		link: "/",
	},
	{
		icon: (
			<TbTruckDelivery
				color="#0065ee"
				size="24px"
			/>
		),
		title: "Chính sách vận chuyển",
		link: "/",
	},
	{
		icon: (
			<BsShieldShaded
				color="#0065ee"
				size="24px"
			/>
		),
		title: "Chính sách bảo mật",
		link: "/",
	},
	{
		icon: (
			<BsCreditCardFill
				color="#0065ee"
				size="24px"
			/>
		),
		title: "Chính sách thanh toán",
		link: "/",
	},
	{
		icon: (
			<IoScan
				color="#0065ee"
				size="24px"
			/>
		),
		title: "Chính sách kiểm hàng",
		link: "/",
	},
	{
		icon: (
			<AiFillShopping
				color="#0065ee"
				size="24px"
			/>
		),
		title: "Chính sách mua hàng",
		link: "/",
	},
	{
		icon: (
			<BsFillInfoCircleFill
				color="#0065ee"
				size="24px"
			/>
		),
		title: "Về chúng tôi",
		link: "/",
	},
];

const networks = [
	{
		icon: (
			<AiFillFacebook
				color="#0065ee"
				size="24px"
			/>
		),
		title: "Facebook",
		link: "https://facebook.com",
	},
	{
		icon: (
			<AiFillYoutube
				color="#0065ee"
				size="24px"
			/>
		),
		title: "Youtube",
		link: "https://youtube.com",
	},
	{
		icon: (
			<IoLogoTiktok
				color="#0065ee"
				size="24px"
			/>
		),
		title: "Tiktok",
		link: "https://tiktok.com",
	},
	{
		icon: (
			<FaTelegramPlane
				color="#0065ee"
				size="24px"
			/>
		),
		title: "Telegram",
		link: "https://telegram.com",
	},
];

const Footer: React.FC = () => {
	return (
		<footer className={cx("wrapper")}>
			<div className={cx("content")}>
				<img
					src="https://media-api-beta.thinkpro.vn/media/core/site-configs/2023/3/16/logo-thinkpro.svg"
					className={cx("logo")}
				/>
				<section className={cx("store", "section")}>
					<h3>Hệ thống cửa hàng</h3>
					<List
						grid={{ gutter: 16, column: 3 }}
						dataSource={stores}
						style={{ height: "100%" }}
						renderItem={(store) => (
							<List.Item style={{ margin: 0, height: "100%" }}>
								<div className={cx("store__item")}>
									<div
										className={cx("store__title")}
										style={{ color: store.color }}
									>
										{store.title}
									</div>
									<div className={cx("store__box")}>
										<p>{store.address}</p>
										<div className={cx("store__content")}>
											<span>
												<span className={cx("store__active")}>Mở cửa</span>
												<span className={cx("store__hour")}>09:00 - 21:00</span>
											</span>
											<a
												className={cx("store__link")}
												href="https://github.com"
											>
												<span>Chỉ đường</span>
												<span>
													<BsArrowUpRight
														size="12px"
														color="#0065ee"
													/>
												</span>
											</a>
										</div>
									</div>
								</div>
							</List.Item>
						)}
					/>
				</section>

				<section className={cx("social", "section")}>
					<h3>Thông tin hữu ích</h3>
					<List
						grid={{ gutter: 8, column: 4 }}
						dataSource={socials}
						style={{ height: "100%" }}
						renderItem={(social) => (
							<List.Item style={{ marginBottom: "8px", height: "100%" }}>
								<Link
									to={social.link}
									className={cx("social__link")}
								>
									{social.icon}
									<span className={cx("social__title")}>{social.title}</span>
								</Link>
							</List.Item>
						)}
					/>
				</section>
				<section className={cx("network", "section")}>
					<h3>ThinkPro trên social networks</h3>
					<List
						grid={{ gutter: 8, column: 7 }}
						dataSource={networks}
						style={{ height: "100%" }}
						renderItem={(network) => (
							<List.Item style={{ margin: 0, height: "100%" }}>
								<Link
									to={network.link}
									className={cx("network__link")}
								>
									{network.icon}
									<span className={cx("network__title")}>{network.title}</span>
								</Link>
							</List.Item>
						)}
					/>
				</section>
			</div>
		</footer>
	);
};

export default Footer;
