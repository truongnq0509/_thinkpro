import { message } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { IProduct } from "~/interfaces";
import {
	createProduct as apiCreateProduct,
	getProducts as apiGetProducts,
	getStore as apiGetStore,
	removeProduct as apiRemoveProduct,
	updateProduct as apiUpdateProduct,
	restoreProduct as apiRestoreProduct,
	addStock as apiAddStock,
	updateStock as apiUpdateStock,
} from "~/services/productService";
import { uploadFiles as apiUploadFiles } from "~/services/uploadService";
import { useTitle } from "~/hooks";

type Props = {};

const DefaultProductPage: React.FC = (props: Props): JSX.Element => {
	const [products, setProducts] = useState<IProduct[]>([]);
	const [store, setStore] = useState<IProduct[]>([]);
	const [count, setCount] = useState<number>(0);
	const [paginate, setPaginate] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(false);

	useTitle("Thinkpro | Tất cả sản phẩm");

	useEffect(() => {
		const fetchApi = async (): Promise<void> => {
			const [{ data: res1, paginate }, { data: res2 }] = await Promise.all([apiGetProducts(), apiGetStore()]);
			// sản phẩm chưa bị xóa mềm
			setProducts(res1);
			setPaginate(paginate);
			// sản phẩm đã bị xóa mềm
			setStore(res2);
			setCount(res2?.length);
		};
		fetchApi();
	}, []);

	// xử lý xóa sản phẩm
	const handleRemoveProduct = async (id: string, force: boolean = false) => {
		try {
			const { data: product } = await apiRemoveProduct(id, force);
			// cập nhật lại sản phẩm - thùng rác
			if (force) {
				const newStore = store?.filter((item) => item._id !== id);
				setStore(newStore);
			} else {
				const newProducts = products?.filter((product) => product._id !== id);
				setProducts(newProducts);
				// cập nhật thùng rác
				setCount(count + 1);
				setStore([product, ...store]);
			}
			message.open({
				type: "success",
				content: "Hành động đã được thực hiện thành công",
				duration: 1,
			});
		} catch (error) {
			message.open({
				type: "error",
				content: "Hành động thực hiện đã thất bại",
				duration: 1,
			});
		}
	};

	// xử lý thêm sản phẩm
	const handleCreateProduct = async (files: UploadFile[], product: IProduct) => {
		setLoading(true);
		try {
			const formData = new FormData();
			for (let i = 0; i < files.length; i++) {
				formData.append(`assets`, files[i].originFileObj as any);
			}
			const { data: links } = await apiUploadFiles(formData);

			product = {
				...product,
				thumbnail: {
					...links?.[0],
				},
				assets: links,
			};

			const { stock, ...ass } = product;

			const { data } = await apiCreateProduct(ass);
			// add stock
			await apiAddStock({
				quantity: stock,
				productId: data?._id,
			});

			setLoading(false);

			const newProducts: IProduct[] = [data, ...products];
			setProducts(newProducts);
			message.open({
				type: "success",
				content: "Hành động đã được thực hiện thành công",
				duration: 1,
			});
		} catch (error) {
			setLoading(false);
			message.open({
				type: "error",
				content: "Hành động thực hiện đã thất bại",
				duration: 1,
			});
		}
	};

	// xử lý cập nhật sản phẩm
	const handleUpdateProduct = async (files: UploadFile[], data: IProduct, id: string) => {
		setLoading(true);
		try {
			let dataChange: IProduct = data;

			// chống cháy =))
			if (files?.length !== 0) {
				const formData = new FormData();
				for (let i = 0; i < files.length; i++) {
					formData.append(`assets`, files[i].originFileObj as any);
				}
				const { data: links } = await apiUploadFiles(formData);

				dataChange = {
					...dataChange,
					thumbnail: {
						...links?.[0],
					},
					assets: links,
				};
			}

			const { stock, ...ass } = dataChange;

			// update product
			await apiUpdateProduct(id, ass);
			// upadate stock
			await apiUpdateStock({
				quantity: stock,
				productId: id,
			});

			setLoading(false);

			// cập nhật lại UI
			const newProducts: IProduct[] = products.map((product: IProduct) => {
				return product._id === id ? data : product;
			});
			setProducts(newProducts);
			message.open({
				type: "success",
				content: "Hành động đã được thực hiện thành công",
				duration: 1,
			});
		} catch (error) {
			setLoading(false);
			message.open({
				type: "error",
				content: "Hành động thực hiện đã thất bại",
				duration: 1,
			});
		}
	};

	// xử lý khôi phục sản phẩm
	const handleRestoreProduct = async (id: string, product: IProduct) => {
		try {
			await apiRestoreProduct(id);

			// xóa khỏi store
			const newStore = store?.filter((item) => item._id !== id);
			setStore(newStore);

			// thêm vào products
			const newProducts = [...products, product];
			setProducts(newProducts);

			// cập nhật lại thùng rác
			setCount(count - 1);

			message.open({
				type: "success",
				content: "Hành động đã thực hiện thành công",
				duration: 1,
			});
		} catch (error) {
			message.open({
				type: "error",
				content: "Hành động thực hiện đã thất bại",
				duration: 1,
			});
		}
	};

	// truyền dữ lên
	const emitData = (data: any) => setProducts(data);

	return (
		<Outlet
			context={[
				{
					products,
					count,
					store,
					paginate,
					loading,
					handleRemoveProduct,
					handleCreateProduct,
					handleUpdateProduct,
					handleRestoreProduct,
					emitData,
				},
			]}
		/>
	);
};

export default DefaultProductPage;
