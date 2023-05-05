import axios from "axios";
import store from "~/store";
import { login } from "~/store/reducers/authSlice";

const httpRequest = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
	headers: { "Content-Type": "application/json" },
});

httpRequest.interceptors.request.use(
	function (request) {
		const accessToken = store.getState().auth.accessToken;
		if (!request.headers["Authorization"]) {
			request.headers.Authorization = `Bearer ${accessToken}`;
		}
		return request;
	},
	function (error) {
		return Promise.reject(error);
	}
);

httpRequest.interceptors.response.use(
	function (response) {
		return response;
	},
	async function (error) {
		const prevRequest = error?.config;
		const { status } = error?.response;

		if ((status === 401 || status === 403) && !prevRequest?.sent) {
			prevRequest.sent = true;
			const {
				data: { accessToken: newAccessToken },
			} = await axios.get(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {
				withCredentials: true,
			});
			prevRequest.headers.Authorization = `Bearer ${newAccessToken}`;
			store.dispatch(
				login({
					loggedIn: true,
					accessToken: newAccessToken,
				})
			);
			return httpRequest(prevRequest);
		}
		return Promise.reject(error);
	}
);

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
