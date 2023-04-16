import * as httpRequest from "~/utils/httpRequest";

export const login = async (data: { email: string; password: string }) => {
	const response = await httpRequest.create("/auth/signin", data);
	return response?.data;
};

export const register = async (data: { email: string; password: string; confirmPassword: string }) => {
	const response = await httpRequest.create("/auth/signup", data);
	return response?.data;
};
