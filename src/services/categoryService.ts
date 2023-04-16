import * as httpRequest from "~/utils/httpRequest";

export const getCategory = async (slug: string) => {
	const response = await httpRequest.get(`/categories?slug=${slug}`);
	return response?.data;
};

export const getCategories = async () => {
	const response = await httpRequest.get("/categories");
	return response?.data;
};

export const createCategory = async (category: object = {}) => {
	const response = await httpRequest.create("/categories", category);
	return response?.data;
};

export const updateCategory = async (id: string, category: object = {}) => {
	const response = await httpRequest.update(`/categories/${id}`, category);
	return response?.data;
};

export const removeCategory = async (id: string, force = false) => {
	const response = await httpRequest.remove(`/categories/${id}?force=${force}`);
	return response?.data;
};

export const restoreCategory = async (id: string) => {
	const response = await httpRequest.patch(`/categories/${id}`);
	return response?.data;
};
