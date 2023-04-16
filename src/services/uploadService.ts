import * as httpRequest from "~/utils/httpRequest";

export const uploadFiles = async (data: any) => {
	const response = await httpRequest.create("/upload/multiple", data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	return response?.data;
};

export const removeFile = async (filename: any) => {
	const response = await httpRequest.remove(`/upload/?filename=${filename}`);
	return response?.data;
};
