import * as httpRequest from "~/utils/httpRequest";

export const getCategory = async (slug: string) => {
	try {
		const response = await httpRequest.get(`/categries?slug=${slug}`);
		return response?.data;
	} catch (error) {
		console.log(error);
	}
};

export const getCategories = async () => {
	try {
		const response = await httpRequest.get("/categories");
		return response?.data;
	} catch (error) {
		console.log(error);
	}
};

export const createCategory = async (category: object = {}) => {
	try {
		const response = await httpRequest.create("/categories", category);
		return response?.data;
	} catch (error) {
		console.log(error);
	}
};

export const updateCategory = async (id: string, category: object = {}) => {
	try {
		const response = await httpRequest.update(`/categories/${id}`, category);
		return response?.data;
	} catch (error) {
		console.log(error);
	}
};

export const removeCategory = async (id: string, force = false) => {
	try {
		const response = await httpRequest.remove(`/categories/${id}?force=${force}`);
		return response?.data;
	} catch (error) {
		console.log(error);
	}
};

export const restoreCategory = async (id: string) => {
	try {
		const response = await httpRequest.patch(`/categories/${id}`);
		return response?.data;
	} catch (error) {
		console.log(error);
	}
};
