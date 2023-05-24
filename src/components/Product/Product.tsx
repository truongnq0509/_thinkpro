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
						<span
							style={{
								backgroundColor: "#495057",
							}}
						></span>
					</div>
				</div>
				{(attributes?.length as any) > 0 && <hr className={cx("line")} />}
				<div className={cx("product__specs")}>
					{attributes?.map((item: any, index: number) => {
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
