import * as httpRequest from "~/utils/httpRequest";

export const getCart = async () => {
	const response = await httpRequest.get("/cart");
	return response?.data;
};

export const addToCart = async (data: { productId: string; quantity: number }) => {
	const response = await httpRequest.update("/cart", data);
	return response?.data;
};

export const deleteCart = async () => {
	const response = await httpRequest.remove(`/cart`);
	return response?.data;
};

export const deleteProductInCart = async (id: string) => {
	const response = await httpRequest.remove(`/cart/${id}`);
	return response?.data;
};
