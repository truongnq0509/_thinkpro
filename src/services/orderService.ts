import * as httpRequest from "~/utils/httpRequest";

export const getOrder = async (id: string) => {
	const response = await httpRequest.get("/order/" + id);
	return response?.data;
};

export const getOrderByUser = async () => {
	const response = await httpRequest.get("/order/me");
	return response?.data;
};

export const createOrder = async (data: any) => {
	const response = await httpRequest.create("/order", data);
	return response?.data;
};

export const cancelOrder = async (data: any, id: string) => {
	const response = await httpRequest.remove("/order/" + id, data);
	return response?.data;
};

export const payMomo = async (data: any) => {
	const response = await httpRequest.create("/order/pay-momo", data);
	return response?.data;
};

export const payVnpay = async (data: any) => {
	const response = await httpRequest.create("/order/pay-vnpay", data);
	return response?.data;
};

export const updateOrder = async (data: any, id: string) => {
	const response = await httpRequest.update("/order/" + id, data);
	return response?.data;
};
