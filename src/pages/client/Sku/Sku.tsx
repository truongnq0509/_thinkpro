import { Color } from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button, Col, InputNumber, Modal, Row, Space } from "antd";
import classNames from "classnames/bind";
import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { AiFillPhone } from "react-icons/ai";
import { BiSupport } from "react-icons/bi";
import { FaSyncAlt } from "react-icons/fa";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { HiCheckCircle } from "react-icons/hi";
import {
	MdDashboardCustomize,
	MdDiscount,
	MdEmail,
	MdKeyboardArrowDown,
	MdKeyboardArrowUp,
	MdOutlineClose,
	MdOutlineKeyboardArrowRight,
	MdTouchApp,
} from "react-icons/md";
import { TbClockHour5, TbDiscountCheckFilled } from "react-icons/tb";
import { Link, useLocation, useParams } from "react-router-dom";
import { A11y, FreeMode, Mousewheel, Navigation, Pagination, Scrollbar, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Swiper, SwiperSlide } from "swiper/react";
import { IProduct } from "~/interfaces";
import { getProduct as apiGetProduct } from "~/services/productService";
import { formatNumber, percent } from "~/utils/fc";
import styles from "./Sku.module.scss";
import { useTitle } from "~/hooks";

type Props = {};
const cx = classNames.bind(styles);

type TConfidence = {
	title: string;
	icon: React.ReactNode;
};

type TList = {
	title: string;
	content: string;
	icon: React.ReactNode;
};

const confidences: TConfidence[] = [
	{
		title: "Trải nghiệm",
		icon: <MdTouchApp size={12} />,
	},
	{
		title: "Tận tình tư vấn",
		icon: <BiSupport size={12} />,
	},
	{
		title: "Trung tâm bảo vệ quyền lợi khách hàng",
		icon: <MdEmail size={12} />,
	},
	{
		title: "Phục vụ 24/7",
		icon: <TbClockHour5 size={12} />,
	},
];

const lists: TList[] = [
	{
		title: "Được trải nghiệm thực tế sản phẩm, lựa chọn đúng hơn.",
		content: "Không còn bọc nilon, hạn chế quyền được trải nghiệm trước mua hàng của người dùng",
		icon: <MdTouchApp size={20} />,
	},
	{
		title: "Bạn lo lắng khi không biết sản phẩm nào phù hợp? ThinkPro có đội ngũ tư vấn tận tâm và có chuyên môn.",
		content:
			"Giúp khách hàng lựa chọn sản phẩm đúng nhu cầu là trách nhiệm đầu tiên của Nhân viên tư vấn tại ThinkPro.",
		icon: <BiSupport size={20} />,
	},
	{
		title: "Bạn gặp khó khi gặp lỗi hỏng, ThinkPro có Trung tâm bảo vệ quyền lợi khách hàng",
		content:
			"Để không bỏ sót bất kỳ một trải nghiệm không tốt nào của khách hàng, Ban Lãnh Đạo Tập đoàn có chuyên trang bảo vệ quyền lợi khách hàng.",
		icon: <MdEmail size={20} />,
	},
	{
		title: "Bạn bận, ThinkPro phục vụ từ sáng tới khuya.",
		content:
			"Khách hàng bận bịu. Cán bộ, nhân viên ThinkPro càng phải phục vụ ngoài giờ để trải nghiệm của khách hàng được thông suốt.",
		icon: <TbClockHour5 size={20} />,
	},
];

const authenticities: TList[] = [
	{
		title: "Cam kết giá tốt nhất với Laptop chính hãng",
		content:
			"Được thành lập vào cuối năm 2022, ThinkPro đã và đang dần trở thành thương hiệu cung cấp hệ sinh thái không gian làm việc thông minh đầu tiên tại Việt Nam với các sản phẩm nội/ngoại thất.",
		icon: <TbDiscountCheckFilled size={20} />,
	},
	{
		title: "Bảo hành nhanh gọn nhất thị trường",
		content:
			"Với đội ngũ nhân sự trẻ trung, tràn đầy năng lượng, nhiệt huyết và dày dặn kinh nghiệm trên thương trường, ThinkPro hướng đến mục tiêu trở thành Chuỗi cửa hàng cung cấp các sản phẩm nội ngoại thất cao cấp hàng đầu Việt Nam.",
		icon: <FaSyncAlt size={20} />,
	},
	{
		title: "Xem thêm 4 yếu tố cốt lõi của chúng tôi - Chỉ chúng tôi có.",
		content:
			"ThinkPro chú trọng về chất lượng sản phẩm, dịch vụ và trải nghiệm khách hàng, chúng tôi coi sự hài lòng của khách hàng chính là thước đo cho sự lớn mạnh và thành công.",
		icon: <MdDashboardCustomize size={20} />,
	},
];

const Sku = (props: Props) => {
	const { slug } = useParams();
	const { pathname } = useLocation();
	const [product, setProduct] = useState<IProduct>({});
	const [content, setContent] = useState<string>("");
	const [thumbsSwiper, setThumbsSwiper] = useState(null);
	const [modalOpen, setModalOpen] = useState({
		confidence: false,
		attribute: false,
		retail: false,
		description: false,
		authenticity: false,
	});

	useTitle(`${product.name}, Trả góp 0% | THINKPRO`);

	const editor1 = useEditor({
		extensions: [
			Color.configure({ types: [TextStyle.name, ListItem.name] }),
			StarterKit.configure({
				bulletList: {
					keepMarks: true,
					keepAttributes: false,
				},
				orderedList: {
					keepMarks: true,
					keepAttributes: false,
				},
			}),
			Image.configure({ inline: true }),
		],
		content: content,
		editable: false,
	});

	const editor2 = useEditor({
		extensions: [
			Color.configure({ types: [TextStyle.name, ListItem.name] }),
			StarterKit.configure({
				bulletList: {
					keepMarks: true,
					keepAttributes: false,
				},
				orderedList: {
					keepMarks: true,
					keepAttributes: false,
				},
			}),
			Image.configure({ inline: true }),
		],
		content: content,
		editable: false,
	});

	useEffect(() => {
		const fetchApi = async () => {
			const response = await apiGetProduct(slug as string);
			setProduct(response?.data);
			setContent(response?.data.description as string);
		};
		fetchApi();
	}, [slug]);

	useEffect(() => {
		if (editor1 && editor2 && content) {
			editor1.commands.setContent(content.replace(/data-src=/g, "src="));
			editor2.commands.setContent(content.replace(/data-src=/g, "src="));
		}
	}, [editor1, editor2, content]);

	return (
		<section className={cx("wrapper")}>
			<Space
				split="/"
				size={4}
				style={{
					fontSize: 12,
					color: "#1677ff",
					paddingBottom: "16px",
				}}
			>
				<Link to="/">Home</Link>
				<Link to={pathname}>{product?.name}</Link>
			</Space>

			<section className={cx("sku")}>
				<Row gutter={[16, 16]}>
					<Col
						xs={24}
						sm={24}
						lg={14}
					>
						<div className={cx("sku__media")}>
							<Row gutter={[8, 8]}>
								<Col
									xs={0}
									sm={0}
									md={0}
									lg={0}
									xl={5}
									xxl={5}
								>
									<Swiper
										modules={[
											Navigation,
											Pagination,
											Scrollbar,
											A11y,
											Mousewheel,
											FreeMode,
											Thumbs,
										]}
										onSwiper={(e) => setThumbsSwiper(e as any)}
										direction="vertical"
										mousewheel={true}
										slidesPerView={4}
										watchSlidesProgress={true}
										spaceBetween={8}
										style={{
											maxHeight: 510,
										}}
									>
										{product?.assets?.map((item: any) => {
											return (
												<SwiperSlide
													key={item.filename}
													className={cx("sku__box")}
												>
													<img
														src={item.path}
														alt={product.name}
													/>
												</SwiperSlide>
											);
										})}
									</Swiper>
								</Col>
								<Col
									xs={24}
									sm={24}
									md={24}
									lg={24}
									xl={19}
									xxl={19}
								>
									<Swiper
										spaceBetween={10}
										slidesPerView={1}
										freeMode={true}
										thumbs={{ swiper: thumbsSwiper, slideThumbActiveClass: cx("sku__active") }}
										watchSlidesProgress={true}
										modules={[Navigation, FreeMode, Thumbs]}
										navigation={{
											nextEl: `.${cx("next")}`,
											prevEl: `.${cx("prev")}`,
										}}
									>
										{product?.assets?.map((item: any) => {
											return (
												<SwiperSlide key={item.filename}>
													<img
														src={item.path}
														alt={product.name}
														className={cx("sku__wrapper")}
													/>
												</SwiperSlide>
											);
										})}
									</Swiper>
									<Space
										wrap
										style={{
											width: "100%",
											display: "flex",
											justifyContent: "flex-end",
											position: "absolute",
											right: 4,
											bottom: 4,
											zIndex: 2,
										}}
									>
										<Button
											type="primary"
											shape="circle"
											icon={<GrFormPrevious style={{ fontSize: "16px" }} />}
											size="middle"
											className={cx("prev")}
										/>
										<Button
											type="primary"
											shape="circle"
											icon={<GrFormNext style={{ fontSize: "16px" }} />}
											size="middle"
											className={cx("next")}
										/>
									</Space>
								</Col>
							</Row>
						</div>
						<div className={cx("sku__confidence")}>
							<div className={cx("sku__thinkpro")}>
								<span>Thinkpro</span>
								<span>Là nơi để bạn và người thân tin tưởng lựa chọn</span>
							</div>
							<div
								className={cx("sku__marquee")}
								onClick={() =>
									setModalOpen({
										...modalOpen,
										confidence: true,
									})
								}
							>
								<Marquee gradient={false}>
									{confidences.map((item: TConfidence, index: number) => {
										return (
											<div
												key={index}
												className={cx("sku__item")}
											>
												<div>{item.icon}</div>
												<span>{item.title}</span>
											</div>
										);
									})}
								</Marquee>
								<div className={cx("sku__arow")}>
									<MdOutlineKeyboardArrowRight size={16} />
								</div>
							</div>
							<Modal
								open={modalOpen.confidence}
								centered
								closeIcon={<MdOutlineClose size={24} />}
								onOk={() =>
									setModalOpen({
										...modalOpen,
										confidence: false,
									})
								}
								onCancel={() =>
									setModalOpen({
										...modalOpen,
										confidence: false,
									})
								}
								width={600}
								title={
									<div style={{ fontSize: 20, fontWeight: 600 }}>Tự tin mua sắm cùng ThinkPro</div>
								}
								footer={[
									<Button
										key={1}
										size="large"
										className={cx("modal__btn")}
										onClick={() =>
											setModalOpen({
												...modalOpen,
												confidence: false,
											})
										}
									>
										Đóng
									</Button>,
								]}
							>
								<div className={cx("modal__body")}>
									<div className={cx("modal__brand")}>
										<span>Một thành viên của</span>
										<svg
											fill="#00d4ff"
											height="13"
											viewBox="0 0 203 13"
											width="203"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M5.68 12.24C4.86933 12.24 4.144 12.112 3.504 11.856C2.87467 11.6 2.34133 11.2267 1.904 10.736C1.46667 10.2347 1.13067 9.62667 0.896 8.912C0.661333 8.18667 0.544 7.36533 0.544 6.448C0.544 5.52 0.661333 4.69333 0.896 3.968C1.13067 3.24267 1.46667 2.62933 1.904 2.128C2.34133 1.616 2.87467 1.22667 3.504 0.959999C4.144 0.693333 4.86933 0.559999 5.68 0.559999C6.49067 0.559999 7.21067 0.693333 7.84 0.959999C8.48 1.22667 9.01867 1.616 9.456 2.128C9.904 2.62933 10.24 3.24267 10.464 3.968C10.6987 4.69333 10.816 5.52 10.816 6.448C10.816 7.36533 10.6987 8.18667 10.464 8.912C10.24 9.62667 9.904 10.2347 9.456 10.736C9.01867 11.2267 8.48 11.6 7.84 11.856C7.21067 12.112 6.49067 12.24 5.68 12.24ZM2.512 6.448C2.512 7.70667 2.78933 8.688 3.344 9.392C3.89867 10.0853 4.67733 10.432 5.68 10.432C6.68267 10.432 7.46133 10.0853 8.016 9.392C8.57067 8.688 8.848 7.70667 8.848 6.448C8.848 5.17867 8.57067 4.192 8.016 3.488C7.46133 2.784 6.68267 2.432 5.68 2.432C4.67733 2.432 3.89867 2.784 3.344 3.488C2.78933 4.192 2.512 5.17867 2.512 6.448ZM16.0954 0.799999L20.0154 11.776H20.0634V0.799999H21.8714V12H18.1594L14.2394 0.976H14.1914V12H12.3994V0.799999H16.0954ZM22.9356 0.799999H24.9356L27.1596 11.728H27.2396L29.3356 0.799999H32.5996L34.7116 11.728H34.7756L36.9836 0.799999H38.9996L36.5036 12H33.0796L30.9836 1.072H30.9356L28.8556 12H25.4156L22.9356 0.799999ZM41.6413 0.799999H45.2093L48.6493 12H46.6333L45.8973 9.44H40.9693L40.2333 12H38.2012L41.6413 0.799999ZM45.4653 7.984L43.4493 1.008H43.4013L41.3853 7.984H45.4653ZM49.6025 0.799999L53.3785 0.783999C54.0398 0.783999 54.6318 0.869333 55.1545 1.04C55.6878 1.2 56.1358 1.43467 56.4985 1.744C56.8718 2.04267 57.1545 2.41067 57.3465 2.848C57.5492 3.28533 57.6505 3.776 57.6505 4.32C57.6505 5.184 57.3892 5.90933 56.8665 6.496C56.3438 7.072 55.6345 7.46133 54.7385 7.664L57.9705 12H55.8425L51.6825 6.384H53.3785C54.1038 6.384 54.6692 6.21333 55.0745 5.872C55.4905 5.52 55.6985 5.03467 55.6985 4.416C55.6985 3.776 55.4905 3.28533 55.0745 2.944C54.6692 2.592 54.1038 2.416 53.3785 2.416H51.5225V12H49.6025V0.799999ZM62.9711 0.799999C63.8458 0.799999 64.6245 0.927999 65.3071 1.184C66.0005 1.44 66.5871 1.808 67.0671 2.288C67.5471 2.768 67.9151 3.35467 68.1711 4.048C68.4271 4.74133 68.5551 5.52533 68.5551 6.4C68.5551 7.27467 68.4271 8.05867 68.1711 8.752C67.9151 9.44533 67.5471 10.032 67.0671 10.512C66.5871 10.992 66.0005 11.36 65.3071 11.616C64.6245 11.872 63.8458 12 62.9711 12H59.2431V0.799999H62.9711ZM62.9551 10.256C64.1178 10.256 65.0138 9.92 65.6431 9.248C66.2831 8.56533 66.6031 7.616 66.6031 6.4C66.6031 5.184 66.2831 4.24 65.6431 3.568C65.0138 2.88533 64.1178 2.544 62.9551 2.544H61.1631V10.256H62.9551ZM75.5289 2.544H72.3929V0.799999H80.6169V2.544H77.4489V12H75.5289V2.544ZM85.9456 12.24C85.135 12.24 84.4096 12.112 83.7696 11.856C83.1403 11.6 82.607 11.2267 82.1696 10.736C81.7323 10.2347 81.3963 9.62667 81.1616 8.912C80.927 8.18667 80.8096 7.36533 80.8096 6.448C80.8096 5.52 80.927 4.69333 81.1616 3.968C81.3963 3.24267 81.7323 2.62933 82.1696 2.128C82.607 1.616 83.1403 1.22667 83.7696 0.959999C84.4096 0.693333 85.135 0.559999 85.9456 0.559999C86.7563 0.559999 87.4763 0.693333 88.1056 0.959999C88.7456 1.22667 89.2843 1.616 89.7216 2.128C90.1696 2.62933 90.5056 3.24267 90.7296 3.968C90.9643 4.69333 91.0816 5.52 91.0816 6.448C91.0816 7.36533 90.9643 8.18667 90.7296 8.912C90.5056 9.62667 90.1696 10.2347 89.7216 10.736C89.2843 11.2267 88.7456 11.6 88.1056 11.856C87.4763 12.112 86.7563 12.24 85.9456 12.24ZM82.7776 6.448C82.7776 7.70667 83.055 8.688 83.6096 9.392C84.1643 10.0853 84.943 10.432 85.9456 10.432C86.9483 10.432 87.727 10.0853 88.2816 9.392C88.8363 8.688 89.1136 7.70667 89.1136 6.448C89.1136 5.17867 88.8363 4.192 88.2816 3.488C87.727 2.784 86.9483 2.432 85.9456 2.432C84.943 2.432 84.1643 2.784 83.6096 3.488C83.055 4.192 82.7776 5.17867 82.7776 6.448ZM94.137 6.544C94.137 7.74933 94.3557 8.69333 94.793 9.376C95.2303 10.0587 95.849 10.4 96.649 10.4C97.3423 10.4 97.8917 10.1653 98.297 9.696C98.7023 9.22667 98.937 8.56 99.001 7.696H97.001V6.064H101.049V12H100.025L99.257 7.696H99.225C99.2037 9.15733 98.9103 10.2827 98.345 11.072C97.7797 11.8507 96.9957 12.24 95.993 12.24C95.417 12.24 94.889 12.112 94.409 11.856C93.9397 11.5893 93.5397 11.2107 93.209 10.72C92.8783 10.2293 92.6223 9.632 92.441 8.928C92.2597 8.224 92.169 7.42933 92.169 6.544C92.169 5.59467 92.297 4.752 92.553 4.016C92.809 3.26933 93.1717 2.64533 93.641 2.144C94.121 1.632 94.6917 1.248 95.353 0.992C96.025 0.725333 96.777 0.591999 97.609 0.591999C98.1743 0.591999 98.729 0.655999 99.273 0.783999C99.8277 0.912 100.329 1.09333 100.777 1.328L100.665 3.328C100.217 3.05067 99.721 2.832 99.177 2.672C98.633 2.512 98.0943 2.432 97.561 2.432C96.473 2.432 95.6303 2.784 95.033 3.488C94.4357 4.192 94.137 5.21067 94.137 6.544ZM110.12 0.799999V2.544H104.632V5.552H108.984V7.168H104.632V10.256H110.28V12H102.712V0.799999H110.12ZM113.873 2.544H110.737V0.799999H118.961V2.544H115.793V12H113.873V2.544ZM128.919 0.799999V12H126.999V7.264H122.023V12H120.103V0.799999H122.023V5.52H126.999V0.799999H128.919ZM138.385 0.799999V2.544H132.898V5.552H137.25V7.168H132.898V10.256H138.546V12H130.978V0.799999H138.385ZM139.743 0.799999L143.519 0.783999C144.18 0.783999 144.772 0.869333 145.295 1.04C145.828 1.2 146.276 1.43467 146.639 1.744C147.012 2.04267 147.295 2.41067 147.487 2.848C147.69 3.28533 147.791 3.776 147.791 4.32C147.791 5.184 147.53 5.90933 147.007 6.496C146.484 7.072 145.775 7.46133 144.879 7.664L148.111 12H145.983L141.823 6.384H143.519C144.244 6.384 144.81 6.21333 145.215 5.872C145.631 5.52 145.839 5.03467 145.839 4.416C145.839 3.776 145.631 3.28533 145.215 2.944C144.81 2.592 144.244 2.416 143.519 2.416H141.663V12H139.743V0.799999ZM154.059 6.544C154.059 7.74933 154.278 8.69333 154.715 9.376C155.152 10.0587 155.771 10.4 156.571 10.4C157.264 10.4 157.814 10.1653 158.219 9.696C158.624 9.22667 158.859 8.56 158.923 7.696H156.923V6.064H160.971V12H159.947L159.179 7.696H159.147C159.126 9.15733 158.832 10.2827 158.267 11.072C157.702 11.8507 156.918 12.24 155.915 12.24C155.339 12.24 154.811 12.112 154.331 11.856C153.862 11.5893 153.462 11.2107 153.131 10.72C152.8 10.2293 152.544 9.632 152.363 8.928C152.182 8.224 152.091 7.42933 152.091 6.544C152.091 5.59467 152.219 4.752 152.475 4.016C152.731 3.26933 153.094 2.64533 153.563 2.144C154.043 1.632 154.614 1.248 155.275 0.992C155.947 0.725333 156.699 0.591999 157.531 0.591999C158.096 0.591999 158.651 0.655999 159.195 0.783999C159.75 0.912 160.251 1.09333 160.699 1.328L160.587 3.328C160.139 3.05067 159.643 2.832 159.099 2.672C158.555 2.512 158.016 2.432 157.483 2.432C156.395 2.432 155.552 2.784 154.955 3.488C154.358 4.192 154.059 5.21067 154.059 6.544ZM162.634 0.799999L166.41 0.783999C167.071 0.783999 167.663 0.869333 168.186 1.04C168.719 1.2 169.167 1.43467 169.53 1.744C169.903 2.04267 170.186 2.41067 170.378 2.848C170.58 3.28533 170.682 3.776 170.682 4.32C170.682 5.184 170.42 5.90933 169.898 6.496C169.375 7.072 168.666 7.46133 167.77 7.664L171.002 12H168.874L164.714 6.384H166.41C167.135 6.384 167.7 6.21333 168.106 5.872C168.522 5.52 168.73 5.03467 168.73 4.416C168.73 3.776 168.522 3.28533 168.106 2.944C167.7 2.592 167.135 2.416 166.41 2.416H164.554V12H162.634V0.799999ZM176.914 12.24C176.104 12.24 175.378 12.112 174.738 11.856C174.109 11.6 173.576 11.2267 173.138 10.736C172.701 10.2347 172.365 9.62667 172.13 8.912C171.896 8.18667 171.778 7.36533 171.778 6.448C171.778 5.52 171.896 4.69333 172.13 3.968C172.365 3.24267 172.701 2.62933 173.138 2.128C173.576 1.616 174.109 1.22667 174.738 0.959999C175.378 0.693333 176.104 0.559999 176.914 0.559999C177.725 0.559999 178.445 0.693333 179.074 0.959999C179.714 1.22667 180.253 1.616 180.69 2.128C181.138 2.62933 181.474 3.24267 181.698 3.968C181.933 4.69333 182.05 5.52 182.05 6.448C182.05 7.36533 181.933 8.18667 181.698 8.912C181.474 9.62667 181.138 10.2347 180.69 10.736C180.253 11.2267 179.714 11.6 179.074 11.856C178.445 12.112 177.725 12.24 176.914 12.24ZM173.746 6.448C173.746 7.70667 174.024 8.688 174.578 9.392C175.133 10.0853 175.912 10.432 176.914 10.432C177.917 10.432 178.696 10.0853 179.25 9.392C179.805 8.688 180.082 7.70667 180.082 6.448C180.082 5.17867 179.805 4.192 179.25 3.488C178.696 2.784 177.917 2.432 176.914 2.432C175.912 2.432 175.133 2.784 174.578 3.488C174.024 4.192 173.746 5.17867 173.746 6.448ZM192.402 7.36C192.402 8.11733 192.295 8.8 192.082 9.408C191.879 10.0053 191.58 10.5173 191.186 10.944C190.791 11.36 190.306 11.68 189.73 11.904C189.164 12.128 188.524 12.24 187.81 12.24C187.095 12.24 186.45 12.128 185.874 11.904C185.308 11.68 184.828 11.36 184.434 10.944C184.039 10.5173 183.735 10.0053 183.522 9.408C183.319 8.8 183.218 8.11733 183.218 7.36V0.799999H185.138V7.36C185.138 8.37333 185.372 9.168 185.842 9.744C186.322 10.3093 186.978 10.592 187.81 10.592C188.642 10.592 189.292 10.3093 189.762 9.744C190.242 9.168 190.482 8.37333 190.482 7.36V0.799999H192.402V7.36ZM197.767 6.8C198.567 6.8 199.186 6.608 199.623 6.224C200.061 5.84 200.279 5.30133 200.279 4.608C200.279 3.91467 200.061 3.38133 199.623 3.008C199.186 2.624 198.567 2.432 197.767 2.432H195.991V6.8H197.767ZM194.071 0.799999H197.767C199.186 0.799999 200.285 1.13067 201.063 1.792C201.853 2.45333 202.247 3.392 202.247 4.608C202.247 5.824 201.853 6.76267 201.063 7.424C200.285 8.08533 199.186 8.416 197.767 8.416H195.991V12H194.071V0.799999Z"
												fill="#00d4ff"
											></path>
										</svg>
										<span>Tập đoàn bán lẻ Công nghệ - Nội thất phục vụ khách hàng tốt nhất.</span>
									</div>
									<div className={cx("modal__list")}>
										{lists.map((list: TList, index: number) => {
											return (
												<div
													key={index}
													className={cx("modal__item")}
												>
													<div className={cx("modal__icon")}>{list.icon}</div>
													<div className={cx("modal__text")}>
														<span>{list.title}</span>
														<p>{list.content}</p>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</Modal>
						</div>
						<div className={cx("sku__cart")}>
							<section className={cx("sku__attribute")}>
								<Row>
									<Col span={12}>
										<h2>Cấu hình đặc điểm</h2>
									</Col>
									<Col span={12}>
										<Button
											onClick={() =>
												setModalOpen({
													...modalOpen,
													attribute: true,
												})
											}
											style={{
												display: "flex",
												alignItems: "center",
												border: "none",
												overflow: "hidden",
												float: "right",
												boxShadow: "none",
												fontSize: 14,
												padding: 0,
											}}
										>
											Xem chi tiết cấu hình <MdOutlineKeyboardArrowRight />
										</Button>
									</Col>
								</Row>
								<Row
									gutter={[16, 16]}
									style={{ marginTop: 16 }}
								>
									<Col span={12}>
										<span style={{ fontWeight: 600, marginBottom: 4, display: "block" }}>
											Thông tin hàng hóa
										</span>
										<div>{product.name}</div>
									</Col>
									<Col span={12}>
										<span style={{ fontWeight: 600, marginBottom: 4, display: "block" }}>
											Đặc điểm
										</span>
										{product.attributes?.map((attribute: any, index: number) => {
											return (
												<div
													key={index}
													style={{ marginTop: 4 }}
												>
													<span>{attribute.k}: </span>
													<span>{attribute.v}</span>
												</div>
											);
										})}
									</Col>
								</Row>
								<Modal
									open={modalOpen.attribute}
									centered
									closeIcon={<MdOutlineClose size={24} />}
									onOk={() =>
										setModalOpen({
											...modalOpen,
											attribute: false,
										})
									}
									onCancel={() =>
										setModalOpen({
											...modalOpen,
											attribute: false,
										})
									}
									width={600}
									title={<div style={{ fontSize: 20, fontWeight: 600 }}>Cấu hình chi tiết</div>}
									footer={[]}
								>
									<Row
										gutter={[16, 16]}
										style={{ marginTop: 16 }}
									>
										<Col
											xs={24}
											sm={12}
										>
											<span style={{ fontWeight: 600, marginBottom: 4, display: "block" }}>
												Thông tin hàng hóa
											</span>
											<div>{product.name}</div>
										</Col>
										<Col
											xs={24}
											sm={12}
										>
											<span style={{ fontWeight: 600, marginBottom: 4, display: "block" }}>
												Đặc điểm
											</span>
											{product.attributes?.map((attribute: any, index: number) => {
												return (
													<div
														key={index}
														style={{ marginTop: 4 }}
													>
														<span>{attribute.k}: </span>
														<span>{attribute.v}</span>
													</div>
												);
											})}
										</Col>
									</Row>
								</Modal>
							</section>
							<section className={cx("sku__retail")}>
								<h2>Sẵn hàng & Trưng bày</h2>
								<Button
									onClick={() =>
										setModalOpen({
											...modalOpen,
											retail: true,
										})
									}
									style={{
										display: "flex",
										alignItems: "center",
										border: "none",
										overflow: "hidden",
										float: "right",
										boxShadow: "none",
										fontSize: 14,
									}}
								>
									2 chi nhánh <MdOutlineKeyboardArrowRight />
								</Button>
								<Modal
									open={modalOpen.retail}
									centered
									closeIcon={<MdOutlineClose size={24} />}
									onOk={() =>
										setModalOpen({
											...modalOpen,
											retail: false,
										})
									}
									onCancel={() =>
										setModalOpen({
											...modalOpen,
											retail: false,
										})
									}
									width={600}
									title={<div style={{ fontSize: 20, fontWeight: 600 }}>Sẵn hàng và Trưng bày</div>}
									footer={[]}
								>
									<Row>
										<Col span={24}>
											<span style={{ fontWeight: 700 }}>Thành phố Hồ Chí Minh</span>
											<div>
												<div
													style={{ display: "flex", flexDirection: "column", marginTop: 12 }}
												>
													<div style={{ fontSize: 14 }}>
														Số 5 - 7 Nguyễn Huy Tưởng, Phường 6, Quận Bình Thạnh, Hồ Chí
														Minh
													</div>
													<div
														style={{
															display: "flex",
															alignContent: "center",
															gap: 4,
															fontSize: 12,
															marginTop: 4,
														}}
													>
														<HiCheckCircle
															size={16}
															color="#3bb346"
														/>
														<span style={{ color: "#3bb346" }}>Còn hàng</span>
													</div>
													<div style={{ marginTop: 12 }}>
														<Button
															style={{
																display: "flex",
																alignItems: "center",
																gap: 8,
																padding: "12px",
																height: "auto",
																border: "none",
																borderRadius: 40,
																fontWeight: 600,
																boxShadow: "none",
																backgroundColor: "#f6f9fc",
															}}
														>
															<AiFillPhone size={20} />
															1900.63.3579
														</Button>
													</div>
												</div>
												<div
													style={{ display: "flex", flexDirection: "column", marginTop: 20 }}
												>
													<div style={{ fontSize: 14 }}>
														95 Trần Thiện Chánh, F12, Q10, HCM
													</div>
													<div
														style={{
															display: "flex",
															alignContent: "center",
															gap: 4,
															fontSize: 12,
															marginTop: 4,
														}}
													>
														<HiCheckCircle
															size={16}
															color="#3bb346"
														/>
														<span style={{ color: "#3bb346" }}>Còn hàng</span>
													</div>
													<div style={{ marginTop: 12 }}>
														<Button
															style={{
																display: "flex",
																alignItems: "center",
																gap: 8,
																padding: "12px",
																height: "auto",
																border: "none",
																borderRadius: 40,
																fontWeight: 600,
																boxShadow: "none",
																backgroundColor: "#f6f9fc",
															}}
														>
															<AiFillPhone size={20} />
															1900.63.3579
														</Button>
													</div>
												</div>
											</div>
										</Col>
										<Col
											span={24}
											style={{
												paddingTop: 20,
											}}
										>
											<span style={{ fontWeight: 700 }}>Hà Nội</span>
											<div>
												<div
													style={{ display: "flex", flexDirection: "column", marginTop: 12 }}
												>
													<div style={{ fontSize: 14 }}>
														53 Thái Hà, Trung Liệt, Đống Đa, Hà Nội
													</div>
													<div
														style={{
															display: "flex",
															alignContent: "center",
															gap: 4,
															fontSize: 12,
															marginTop: 4,
														}}
													>
														<HiCheckCircle
															size={16}
															color="#3bb346"
														/>
														<span style={{ color: "#3bb346" }}>Còn hàng</span>
													</div>
													<div style={{ marginTop: 12 }}>
														<Button
															style={{
																display: "flex",
																alignItems: "center",
																gap: 8,
																padding: "12px",
																height: "auto",
																border: "none",
																borderRadius: 40,
																fontWeight: 600,
																boxShadow: "none",
																backgroundColor: "#f6f9fc",
															}}
														>
															<AiFillPhone size={20} />
															1900.63.3579
														</Button>
													</div>
												</div>
											</div>
										</Col>
									</Row>
								</Modal>
							</section>
							<section className={cx("sku__transport")}>
								<h2>Vận chuyển</h2>
								<p>Miễn phí HN, TP HCM</p>
							</section>
							<section className={cx("sku__guarantee")}>
								<h2>Bảo hành & đổi trả</h2>
								<ul>
									<li>
										Bảo hành <span style={{ fontWeight: 700 }}>12 tháng chính hãng</span>
									</li>
									<li>Đổi mới trong 15 ngày đầu tiên</li>
								</ul>
							</section>
							{product.description && (
								<section className={cx("sku__article")}>
									<h2>Bài viết mô tả</h2>
									<EditorContent editor={editor1} />
									<div className={cx("mask")}>
										<Button
											style={{
												position: "absolute",
												left: "50%",
												top: "50%",
												translate: "-50% 0",
												padding: "8px 16px",
												border: "none",
												boxShadow: "none",
												color: "#0065ee",
												height: "auto",
												fontWeight: 600,
												backgroundColor: "transparent",
												overflow: "hidden",
												fontSize: 16,
											}}
											onClick={() =>
												setModalOpen({
													...modalOpen,
													description: true,
												})
											}
										>
											Xem Thêm
										</Button>
									</div>
									<Modal
										open={modalOpen.description}
										centered
										closeIcon={<MdOutlineClose size={24} />}
										onOk={() =>
											setModalOpen({
												...modalOpen,
												description: false,
											})
										}
										onCancel={() =>
											setModalOpen({
												...modalOpen,
												description: false,
											})
										}
										width={1000}
										title={<div style={{ fontSize: 20, fontWeight: 600 }}>Bài viết mô tả</div>}
										footer={[]}
									>
										<div className={cx("dialog")}>
											<EditorContent editor={editor2} />
										</div>
									</Modal>
								</section>
							)}
						</div>
					</Col>
					<Col
						xs={24}
						sm={24}
						lg={10}
					>
						<div className={cx("sku__discount")}>
							<MdDiscount
								size={16}
								color="#fff"
							/>
							<span>HOT DEAL LAPTOP THÁNG 4</span>
						</div>
						<section className={cx("sku__information")}>
							<div
								className={cx("sku__authenticity")}
								onClick={() =>
									setModalOpen({
										...modalOpen,
										authenticity: true,
									})
								}
							>
								<div>
									<TbDiscountCheckFilled color="#00d4ff" />
									Hàng chính hãng - Giá rẻ nhất thị trường
								</div>
								<MdOutlineKeyboardArrowRight style={{ float: "right" }} />
							</div>
							<div className={cx("sku__product")}>
								<h1>{product.name}</h1>
								<div className={cx("sku__number")}>
									<p>Số Lượng</p>
									<InputNumber
										min={1}
										defaultValue={1}
										controls={{
											upIcon: <MdKeyboardArrowUp size={16} />,
											downIcon: <MdKeyboardArrowDown size={16} />,
										}}
										style={{
											padding: "2px 0px",
											borderRadius: 4,
										}}
									/>
								</div>
								<div className={cx("sku__price")}>
									<div>
										<span className={cx("sku__active")}>
											{product.discount
												? formatNumber(`${product.discount}` as string)
												: formatNumber(`${product.price}` as string)}
										</span>
										{product.discount && (
											<div>
												<span>{formatNumber(`${product.price}` as string)}</span>
												<span>
													{percent(product.price as number, product.discount as number)}
												</span>
											</div>
										)}
									</div>
									<div>
										<Button
											style={{
												fontSize: 14,
												fontWeight: 500,
												padding: "8px 12px",
												height: "auto",
												border: "none",
												borderRadius: 4,
												color: "#fff",
												backgroundColor: "#fe3464",
											}}
										>
											Thêm vào giỏ
										</Button>
										<Button
											style={{
												fontSize: 14,
												fontWeight: 500,
												padding: "8px 12px",
												height: "auto",
												border: "none",
												borderRadius: 4,
												color: "#fff",
												backgroundColor: "#fe3464",
												marginLeft: 8,
											}}
										>
											Mua ngay
										</Button>
									</div>
								</div>
							</div>
							<Modal
								open={modalOpen.authenticity}
								centered
								closeIcon={<MdOutlineClose size={24} />}
								onOk={() =>
									setModalOpen({
										...modalOpen,
										authenticity: false,
									})
								}
								onCancel={() =>
									setModalOpen({
										...modalOpen,
										authenticity: false,
									})
								}
								width={600}
								title={
									<div style={{ fontSize: 20, fontWeight: 600 }}>Cam Kết Giá Chính Hãng Tốt Nhất</div>
								}
								footer={[
									<Button
										key={1}
										size="large"
										className={cx("modal__btn")}
										onClick={() =>
											setModalOpen({
												...modalOpen,
												authenticity: false,
											})
										}
									>
										Đóng
									</Button>,
								]}
							>
								<div className={cx("modal__body")}>
									<div className={cx("modal__brand")}>
										<span>Một thành viên của</span>
										<svg
											fill="#00d4ff"
											height="13"
											viewBox="0 0 203 13"
											width="203"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M5.68 12.24C4.86933 12.24 4.144 12.112 3.504 11.856C2.87467 11.6 2.34133 11.2267 1.904 10.736C1.46667 10.2347 1.13067 9.62667 0.896 8.912C0.661333 8.18667 0.544 7.36533 0.544 6.448C0.544 5.52 0.661333 4.69333 0.896 3.968C1.13067 3.24267 1.46667 2.62933 1.904 2.128C2.34133 1.616 2.87467 1.22667 3.504 0.959999C4.144 0.693333 4.86933 0.559999 5.68 0.559999C6.49067 0.559999 7.21067 0.693333 7.84 0.959999C8.48 1.22667 9.01867 1.616 9.456 2.128C9.904 2.62933 10.24 3.24267 10.464 3.968C10.6987 4.69333 10.816 5.52 10.816 6.448C10.816 7.36533 10.6987 8.18667 10.464 8.912C10.24 9.62667 9.904 10.2347 9.456 10.736C9.01867 11.2267 8.48 11.6 7.84 11.856C7.21067 12.112 6.49067 12.24 5.68 12.24ZM2.512 6.448C2.512 7.70667 2.78933 8.688 3.344 9.392C3.89867 10.0853 4.67733 10.432 5.68 10.432C6.68267 10.432 7.46133 10.0853 8.016 9.392C8.57067 8.688 8.848 7.70667 8.848 6.448C8.848 5.17867 8.57067 4.192 8.016 3.488C7.46133 2.784 6.68267 2.432 5.68 2.432C4.67733 2.432 3.89867 2.784 3.344 3.488C2.78933 4.192 2.512 5.17867 2.512 6.448ZM16.0954 0.799999L20.0154 11.776H20.0634V0.799999H21.8714V12H18.1594L14.2394 0.976H14.1914V12H12.3994V0.799999H16.0954ZM22.9356 0.799999H24.9356L27.1596 11.728H27.2396L29.3356 0.799999H32.5996L34.7116 11.728H34.7756L36.9836 0.799999H38.9996L36.5036 12H33.0796L30.9836 1.072H30.9356L28.8556 12H25.4156L22.9356 0.799999ZM41.6413 0.799999H45.2093L48.6493 12H46.6333L45.8973 9.44H40.9693L40.2333 12H38.2012L41.6413 0.799999ZM45.4653 7.984L43.4493 1.008H43.4013L41.3853 7.984H45.4653ZM49.6025 0.799999L53.3785 0.783999C54.0398 0.783999 54.6318 0.869333 55.1545 1.04C55.6878 1.2 56.1358 1.43467 56.4985 1.744C56.8718 2.04267 57.1545 2.41067 57.3465 2.848C57.5492 3.28533 57.6505 3.776 57.6505 4.32C57.6505 5.184 57.3892 5.90933 56.8665 6.496C56.3438 7.072 55.6345 7.46133 54.7385 7.664L57.9705 12H55.8425L51.6825 6.384H53.3785C54.1038 6.384 54.6692 6.21333 55.0745 5.872C55.4905 5.52 55.6985 5.03467 55.6985 4.416C55.6985 3.776 55.4905 3.28533 55.0745 2.944C54.6692 2.592 54.1038 2.416 53.3785 2.416H51.5225V12H49.6025V0.799999ZM62.9711 0.799999C63.8458 0.799999 64.6245 0.927999 65.3071 1.184C66.0005 1.44 66.5871 1.808 67.0671 2.288C67.5471 2.768 67.9151 3.35467 68.1711 4.048C68.4271 4.74133 68.5551 5.52533 68.5551 6.4C68.5551 7.27467 68.4271 8.05867 68.1711 8.752C67.9151 9.44533 67.5471 10.032 67.0671 10.512C66.5871 10.992 66.0005 11.36 65.3071 11.616C64.6245 11.872 63.8458 12 62.9711 12H59.2431V0.799999H62.9711ZM62.9551 10.256C64.1178 10.256 65.0138 9.92 65.6431 9.248C66.2831 8.56533 66.6031 7.616 66.6031 6.4C66.6031 5.184 66.2831 4.24 65.6431 3.568C65.0138 2.88533 64.1178 2.544 62.9551 2.544H61.1631V10.256H62.9551ZM75.5289 2.544H72.3929V0.799999H80.6169V2.544H77.4489V12H75.5289V2.544ZM85.9456 12.24C85.135 12.24 84.4096 12.112 83.7696 11.856C83.1403 11.6 82.607 11.2267 82.1696 10.736C81.7323 10.2347 81.3963 9.62667 81.1616 8.912C80.927 8.18667 80.8096 7.36533 80.8096 6.448C80.8096 5.52 80.927 4.69333 81.1616 3.968C81.3963 3.24267 81.7323 2.62933 82.1696 2.128C82.607 1.616 83.1403 1.22667 83.7696 0.959999C84.4096 0.693333 85.135 0.559999 85.9456 0.559999C86.7563 0.559999 87.4763 0.693333 88.1056 0.959999C88.7456 1.22667 89.2843 1.616 89.7216 2.128C90.1696 2.62933 90.5056 3.24267 90.7296 3.968C90.9643 4.69333 91.0816 5.52 91.0816 6.448C91.0816 7.36533 90.9643 8.18667 90.7296 8.912C90.5056 9.62667 90.1696 10.2347 89.7216 10.736C89.2843 11.2267 88.7456 11.6 88.1056 11.856C87.4763 12.112 86.7563 12.24 85.9456 12.24ZM82.7776 6.448C82.7776 7.70667 83.055 8.688 83.6096 9.392C84.1643 10.0853 84.943 10.432 85.9456 10.432C86.9483 10.432 87.727 10.0853 88.2816 9.392C88.8363 8.688 89.1136 7.70667 89.1136 6.448C89.1136 5.17867 88.8363 4.192 88.2816 3.488C87.727 2.784 86.9483 2.432 85.9456 2.432C84.943 2.432 84.1643 2.784 83.6096 3.488C83.055 4.192 82.7776 5.17867 82.7776 6.448ZM94.137 6.544C94.137 7.74933 94.3557 8.69333 94.793 9.376C95.2303 10.0587 95.849 10.4 96.649 10.4C97.3423 10.4 97.8917 10.1653 98.297 9.696C98.7023 9.22667 98.937 8.56 99.001 7.696H97.001V6.064H101.049V12H100.025L99.257 7.696H99.225C99.2037 9.15733 98.9103 10.2827 98.345 11.072C97.7797 11.8507 96.9957 12.24 95.993 12.24C95.417 12.24 94.889 12.112 94.409 11.856C93.9397 11.5893 93.5397 11.2107 93.209 10.72C92.8783 10.2293 92.6223 9.632 92.441 8.928C92.2597 8.224 92.169 7.42933 92.169 6.544C92.169 5.59467 92.297 4.752 92.553 4.016C92.809 3.26933 93.1717 2.64533 93.641 2.144C94.121 1.632 94.6917 1.248 95.353 0.992C96.025 0.725333 96.777 0.591999 97.609 0.591999C98.1743 0.591999 98.729 0.655999 99.273 0.783999C99.8277 0.912 100.329 1.09333 100.777 1.328L100.665 3.328C100.217 3.05067 99.721 2.832 99.177 2.672C98.633 2.512 98.0943 2.432 97.561 2.432C96.473 2.432 95.6303 2.784 95.033 3.488C94.4357 4.192 94.137 5.21067 94.137 6.544ZM110.12 0.799999V2.544H104.632V5.552H108.984V7.168H104.632V10.256H110.28V12H102.712V0.799999H110.12ZM113.873 2.544H110.737V0.799999H118.961V2.544H115.793V12H113.873V2.544ZM128.919 0.799999V12H126.999V7.264H122.023V12H120.103V0.799999H122.023V5.52H126.999V0.799999H128.919ZM138.385 0.799999V2.544H132.898V5.552H137.25V7.168H132.898V10.256H138.546V12H130.978V0.799999H138.385ZM139.743 0.799999L143.519 0.783999C144.18 0.783999 144.772 0.869333 145.295 1.04C145.828 1.2 146.276 1.43467 146.639 1.744C147.012 2.04267 147.295 2.41067 147.487 2.848C147.69 3.28533 147.791 3.776 147.791 4.32C147.791 5.184 147.53 5.90933 147.007 6.496C146.484 7.072 145.775 7.46133 144.879 7.664L148.111 12H145.983L141.823 6.384H143.519C144.244 6.384 144.81 6.21333 145.215 5.872C145.631 5.52 145.839 5.03467 145.839 4.416C145.839 3.776 145.631 3.28533 145.215 2.944C144.81 2.592 144.244 2.416 143.519 2.416H141.663V12H139.743V0.799999ZM154.059 6.544C154.059 7.74933 154.278 8.69333 154.715 9.376C155.152 10.0587 155.771 10.4 156.571 10.4C157.264 10.4 157.814 10.1653 158.219 9.696C158.624 9.22667 158.859 8.56 158.923 7.696H156.923V6.064H160.971V12H159.947L159.179 7.696H159.147C159.126 9.15733 158.832 10.2827 158.267 11.072C157.702 11.8507 156.918 12.24 155.915 12.24C155.339 12.24 154.811 12.112 154.331 11.856C153.862 11.5893 153.462 11.2107 153.131 10.72C152.8 10.2293 152.544 9.632 152.363 8.928C152.182 8.224 152.091 7.42933 152.091 6.544C152.091 5.59467 152.219 4.752 152.475 4.016C152.731 3.26933 153.094 2.64533 153.563 2.144C154.043 1.632 154.614 1.248 155.275 0.992C155.947 0.725333 156.699 0.591999 157.531 0.591999C158.096 0.591999 158.651 0.655999 159.195 0.783999C159.75 0.912 160.251 1.09333 160.699 1.328L160.587 3.328C160.139 3.05067 159.643 2.832 159.099 2.672C158.555 2.512 158.016 2.432 157.483 2.432C156.395 2.432 155.552 2.784 154.955 3.488C154.358 4.192 154.059 5.21067 154.059 6.544ZM162.634 0.799999L166.41 0.783999C167.071 0.783999 167.663 0.869333 168.186 1.04C168.719 1.2 169.167 1.43467 169.53 1.744C169.903 2.04267 170.186 2.41067 170.378 2.848C170.58 3.28533 170.682 3.776 170.682 4.32C170.682 5.184 170.42 5.90933 169.898 6.496C169.375 7.072 168.666 7.46133 167.77 7.664L171.002 12H168.874L164.714 6.384H166.41C167.135 6.384 167.7 6.21333 168.106 5.872C168.522 5.52 168.73 5.03467 168.73 4.416C168.73 3.776 168.522 3.28533 168.106 2.944C167.7 2.592 167.135 2.416 166.41 2.416H164.554V12H162.634V0.799999ZM176.914 12.24C176.104 12.24 175.378 12.112 174.738 11.856C174.109 11.6 173.576 11.2267 173.138 10.736C172.701 10.2347 172.365 9.62667 172.13 8.912C171.896 8.18667 171.778 7.36533 171.778 6.448C171.778 5.52 171.896 4.69333 172.13 3.968C172.365 3.24267 172.701 2.62933 173.138 2.128C173.576 1.616 174.109 1.22667 174.738 0.959999C175.378 0.693333 176.104 0.559999 176.914 0.559999C177.725 0.559999 178.445 0.693333 179.074 0.959999C179.714 1.22667 180.253 1.616 180.69 2.128C181.138 2.62933 181.474 3.24267 181.698 3.968C181.933 4.69333 182.05 5.52 182.05 6.448C182.05 7.36533 181.933 8.18667 181.698 8.912C181.474 9.62667 181.138 10.2347 180.69 10.736C180.253 11.2267 179.714 11.6 179.074 11.856C178.445 12.112 177.725 12.24 176.914 12.24ZM173.746 6.448C173.746 7.70667 174.024 8.688 174.578 9.392C175.133 10.0853 175.912 10.432 176.914 10.432C177.917 10.432 178.696 10.0853 179.25 9.392C179.805 8.688 180.082 7.70667 180.082 6.448C180.082 5.17867 179.805 4.192 179.25 3.488C178.696 2.784 177.917 2.432 176.914 2.432C175.912 2.432 175.133 2.784 174.578 3.488C174.024 4.192 173.746 5.17867 173.746 6.448ZM192.402 7.36C192.402 8.11733 192.295 8.8 192.082 9.408C191.879 10.0053 191.58 10.5173 191.186 10.944C190.791 11.36 190.306 11.68 189.73 11.904C189.164 12.128 188.524 12.24 187.81 12.24C187.095 12.24 186.45 12.128 185.874 11.904C185.308 11.68 184.828 11.36 184.434 10.944C184.039 10.5173 183.735 10.0053 183.522 9.408C183.319 8.8 183.218 8.11733 183.218 7.36V0.799999H185.138V7.36C185.138 8.37333 185.372 9.168 185.842 9.744C186.322 10.3093 186.978 10.592 187.81 10.592C188.642 10.592 189.292 10.3093 189.762 9.744C190.242 9.168 190.482 8.37333 190.482 7.36V0.799999H192.402V7.36ZM197.767 6.8C198.567 6.8 199.186 6.608 199.623 6.224C200.061 5.84 200.279 5.30133 200.279 4.608C200.279 3.91467 200.061 3.38133 199.623 3.008C199.186 2.624 198.567 2.432 197.767 2.432H195.991V6.8H197.767ZM194.071 0.799999H197.767C199.186 0.799999 200.285 1.13067 201.063 1.792C201.853 2.45333 202.247 3.392 202.247 4.608C202.247 5.824 201.853 6.76267 201.063 7.424C200.285 8.08533 199.186 8.416 197.767 8.416H195.991V12H194.071V0.799999Z"
												fill="#00d4ff"
											></path>
										</svg>
										<span>Tập đoàn bán lẻ Công nghệ - Nội thất phục vụ khách hàng tốt nhất.</span>
									</div>
									<div className={cx("modal__list")}>
										{authenticities.map((item: TList, index: number) => {
											return (
												<div
													key={index}
													className={cx("modal__item")}
												>
													<div className={cx("modal__icon")}>{item.icon}</div>
													<div className={cx("modal__text")}>
														<span>{item.title}</span>
														<p>{item.content}</p>
													</div>
												</div>
											);
										})}
									</div>
								</div>
							</Modal>
						</section>
						<section className={cx("sku__brand")}>
							<img
								src={product?.category?.image?.path}
								alt="brand"
							/>
							<div>
								<div>
									<span>{product?.category?.name}</span>
									<Link
										to={`/${product?.category?.slug}`}
										state={{
											slug: product?.category?.slug,
										}}
									>
										Xem tất cả <MdOutlineKeyboardArrowRight size={12} />
									</Link>
								</div>
								<p>
									<TbDiscountCheckFilled
										size={16}
										color="#0065ee"
									/>
									ThinkPro là nhà bán lẻ chính thức
								</p>
							</div>
						</section>
					</Col>
				</Row>
			</section>
		</section>
	);
};

export default Sku;
