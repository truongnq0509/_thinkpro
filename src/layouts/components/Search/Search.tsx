import React, { useState, useEffect } from "react";
import classNames from "classnames/bind";
import { Input, Popover } from "antd";
import styles from "./Search.module.scss";
import { FiSearch } from "react-icons/fi";
import { IoCloseCircleSharp } from "react-icons/io5";
import { RiLoader4Line } from "react-icons/ri";
import { search as apiSearch } from "~/services/productService";
import { useDebounce } from "~/hooks";
import { Link, useNavigate } from "react-router-dom";
import { IProduct } from "~/interfaces";
import { formatNumber, percent } from "~/utils/fc";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "~/store";
import { setResults, setLoading } from "~/store/reducers/appSlice";

const cx = classNames.bind(styles);

const Search: React.FC = () => {
	const navigate = useNavigate();
	const [keyword, setKeyword] = useState<string>("");
	const { results, loading } = useSelector((state: RootState) => state.app);
	const dispatch = useDispatch<AppDispatch>();

	const debounceKeyword = useDebounce(keyword, 700);

	useEffect(() => {
		if (!debounceKeyword.trim()) {
			dispatch(setResults([]));
			return;
		}

		const fetchApi = async () => {
			dispatch(setLoading(true));
			const response = await apiSearch(debounceKeyword);
			dispatch(setResults(response?.data));
			dispatch(setLoading(false));
		};

		fetchApi();
	}, [debounceKeyword]);

	const search = () => {
		return (
			<div className={cx("result")}>
				<h4>Sản phẩm</h4>
				<div className={cx("list")}>
					{results?.map((product: IProduct, index: number) => {
						if (index < 5) {
							return (
								<Link
									to={`/${product?.categoryId?.slug}/${product.slug}`}
									key={product._id}
									style={{
										width: "100%",
										display: "inline-flex",
									}}
								>
									<div className={cx("item")}>
										<img
											src={product.thumbnail?.path}
											alt={product.name}
										/>
										<div className={cx("item__desc")}>
											<div className={cx("item__name")}>{product.name}</div>
											<div className={cx("item__box")}>
												<span className={cx("item__price")}>
													{formatNumber(`${product.price}`)}
												</span>
												<span className={cx("item__discount")}>
													{formatNumber(`${product.discount}`)}
												</span>
												<span className={cx("item__persent")}>
													{percent(product.price as number, product.discount as number)}
												</span>
											</div>
										</div>
									</div>
								</Link>
							);
						}
					})}
				</div>
			</div>
		);
	};

	const goToSearchAll = () => {
		if (debounceKeyword.trim()) {
			navigate({
				pathname: `/tim-kiem`,
				search: `?keyword=${keyword}`,
			});
		}
	};

	return (
		<div className={cx("wrapper")}>
			<span className={cx("icon")}>
				<FiSearch onClick={goToSearchAll} />
			</span>
			<Popover
				trigger="click"
				content={search}
				arrow={false}
				overlayStyle={{
					width: 360,
					borderRadius: 4,
				}}
			>
				<Input
					placeholder="Tên sản phẩm, nhu cầu, hãng"
					onChange={(e) => setKeyword(e.target.value)}
					value={keyword}
					className={cx("input")}
					onKeyUp={(e) => e.keyCode === 13 && goToSearchAll()}
				/>
			</Popover>
			<span className={cx("close")}>
				{loading ? (
					<RiLoader4Line className={cx("run")} />
				) : (
					<IoCloseCircleSharp onClick={() => setKeyword("")} />
				)}
			</span>
		</div>
	);
};

export default Search;
