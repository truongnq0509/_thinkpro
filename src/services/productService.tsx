import * as httpRequest from "~/utils/httpRequest";

export const getProduct = async (slug: string) => {
	const response = await httpRequest.get(`/products?slug=${slug}`);
	return response?.data;
};

export const getProducts = async () => {
	const response = await httpRequest.get(`/products`);
	return response?.data;
};

// lấy ra cách sản phẩm đã bị xóa mềm
export const getStore = async () => {
	const response = await httpRequest.get(`/products/store`);
	return response?.data;
};

export const createProduct = async (product: object = {}) => {
	const response = await httpRequest.create("/products", product);
	return response?.data;
};

export const updateProduct = async (id: string, product: object = {}) => {
	const response = await httpRequest.update(`/products/${id}`, product);
	return response?.data;
};

export const removeProduct = async (id: string, force = false) => {
	const response = await httpRequest.remove(`/products/${id}?force=${force}`);
	return response?.data;
};

export const restoreProduct = async (id: string) => {
	const response = await httpRequest.patch(`/products/${id}`);
	return response?.data;
};
