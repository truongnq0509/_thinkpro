import * as httpRequest from "~/utils/httpRequest";
import { IQuery } from "~/interfaces/query";

export const getCategory = async (query: IQuery) => {
	const { slug, _page = 1, _order = "asc", _sort = "createdAt", _limit = 15 } = query;
	const response = await httpRequest.get(
		`/categories?slug=${slug}&_page=${_page}&_limit=${_limit}&_order=${_order}&_sort=${_sort}`
	);
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
