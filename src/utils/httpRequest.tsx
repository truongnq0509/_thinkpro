import axios from "axios";

const httpRequest = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	headers: {
		Authorization: `Bearer ${JSON.parse(localStorage.getItem("user") as any).accessToken}`,
	},
});

export const get = async (path: string, options = {}) => {
	const response = await httpRequest.get(path, options);
	return response;
};

export const create = async (path: string, data: object = {}, options: object = {}) => {
	const response = await httpRequest.post(path, data, options);
	return response;
};

export const update = async (path: string, data: object = {}, options: object = {}) => {
	const response = await httpRequest.put(path, data, options);
	return response;
};

export const remove = async (path: string, options: object = {}) => {
	const response = await httpRequest.delete(path, options);
	return response;
};

export const patch = async (path: string, data: object = {}, options: object = {}) => {
	const repsonse = await httpRequest.patch(path, data, options);
	return repsonse;
};
