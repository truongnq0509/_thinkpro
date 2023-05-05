import { IUser } from "~/interfaces/auth";
import * as httpRequest from "~/utils/httpRequest";

export const login = async (data: { email: string; password: string }) => {
	const response = await httpRequest.create("/auth/signin", data);
	return response?.data;
};

export const register = async (data: IUser) => {
	const response = await httpRequest.create("/auth/signup", data);
	return response?.data;
};

export const me = async () => {
	const response = await httpRequest.get("/auth/me");
	return response?.data;
};

export const sendEmail = async (data: { email: string }) => {
	const response = await httpRequest.create("/auth/send-email", data);
	return response?.data;
};

export const resetPassword = async (data: { token: string; password: string; userId: string }) => {
	const response = await httpRequest.create("/auth/reset-password", data);
	return response?.data;
};
