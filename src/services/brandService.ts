import { IQuery } from "~/interfaces/query";
import * as httpRequest from "~/utils/httpRequest";

export const getBrand = async (query: IQuery) => {
	const { slug, _page = 1, _order = "asc", _sort = "createdAt", _limit = 15 } = query;
	const response = await httpRequest.get(
		`/brands?slug=${slug}&_page=${_page}&_limit=${_limit}&_order=${_order}&_sort=${_sort}`
	);
	return response?.data;
};

export const getBrands = async () => {
	const response = await httpRequest.get("/brands");
	return response?.data;
};

export const createBrand = async (brand: object = {}) => {
	const response = await httpRequest.create("/brands", brand);
	return response?.data;
};

export const updateBrand = async (id: string, brand: object = {}) => {
	const response = await httpRequest.update(`/brands/${id}`, brand);
	return response?.data;
};

export const removeBrand = async (id: string, force = false) => {
	const response = await httpRequest.remove(`/brands/${id}?force=${force}`);
	return response?.data;
};

export const restoreBrand = async (id: string) => {
	const response = await httpRequest.patch(`/brands/${id}`);
	return response?.data;
};
