import React from "react";
import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import { IProduct } from "~/interfaces";
import { formatNumber } from "~/utils/fc";

type Props = {
	product: IProduct;
};

const cx = classNames.bind(styles);

const Product = ({ product }: Props) => {
	return (
		<div className={cx("product")}>
			<img
				src={product?.thumbnail?.path as string}
				className={cx("product__img")}
			/>
			<div className={cx("product__desc")}>
				<div className={cx("product__title")}>{product?.name}</div>
				<div className={cx("product__box")}>
					<span>Từ</span>
					<p className={cx("product__price")}>{formatNumber(`${product.price}`)}</p>
					<div className={cx("product__tag")}>14%</div>
				</div>
				<div className={cx("product__colors")}>
					<span>Màu</span>
					<div className={cx("product__color")}>
						<span></span>
					</div>
				</div>
				<hr className={cx("line")} />
				<div className={cx("product__specs")}>
					Màn hình: 14", WVA, 60Hz
					<br />
					CPU: Ryzen 5 5625U
					<br />
					Pin: 54Wh
					<br />
					Khối lượng: 1.54 kg
				</div>
			</div>
		</div>
	);
};

export default Product;
