import React from "react";
import classNames from "classnames/bind";
import styles from "./Product.module.scss";
import { IProduct } from "~/interfaces";
import { formatNumber } from "~/utils/fc";
import { percent } from "~/utils/fc";

type Props = {
	product: IProduct;
};

const cx = classNames.bind(styles);

const colors = ["#495057", "#fa5252", "#22b8cf", "#12b886", "#d3f9d8", "#f783ac"];

const Product = ({ product }: Props) => {
	const { thumbnail, name, price, discount, attributes } = product;

	return (
		<div className={cx("product")}>
			<img
				src={thumbnail?.path as any}
				className={cx("product__img")}
			/>
			<div className={cx("product__desc")}>
				<div className={cx("product__title")}>{name}</div>
				<div className={cx("product__box")}>
					<span>Từ</span>
					<p className={cx("product__price")}>{formatNumber(`${discount || price}`)}</p>
					{discount && <div className={cx("product__tag")}>{percent(price as number, discount)}</div>}
				</div>
				<div className={cx("product__colors")}>
					<span>Màu</span>
					<div className={cx("product__color")}>
						{colors.map((color, index, origin) => {
							if (index < Math.round(Math.random() * 2) + 1) {
								return (
									<span
										key={index}
										style={{
											backgroundColor: colors[Math.ceil(Math.random() * origin.length) - 1],
										}}
									></span>
								);
							}
						})}
					</div>
				</div>
				{(attributes?.length as any) > 0 && <hr className={cx("line")} />}
				<div className={cx("product__specs")}>
					{attributes?.map((item: any, index) => {
						if (index < 4) {
							return (
								<span key={index}>
									{item.k}: {item.v}
									<br />
								</span>
							);
						}
					})}
				</div>
			</div>
		</div>
	);
};

export default Product;
