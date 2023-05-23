import joi from "joi";

const productSchema = joi.object({
	name: joi.string().required().trim().messages({
		"string.empty": "Trường này không được đển trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
	}),
	slug: joi.string().optional().allow("").trim(),
	price: joi.number().required().messages({
		"string.empty": "Trường này không được đển trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
		"number.base": "Vui lòng nhập số!!!",
	}),
	stock: joi.number().required().messages({
		"string.empty": "Trường này không được đển trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
		"number.base": "Vui lòng nhập số!!!",
	}),
	discount: joi.number().optional().allow(0),
	thumbnail: joi.object().optional().allow({}),
	assets: joi.array().default([]),
	description: joi.string().optional().allow("").trim(),
	attributes: joi.array().default([]),
	status: joi.number().default(0),
	brandId: joi.string().trim().allow(null).required().trim().messages({
		"string.empty": "Trường này không được đển trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
	}),
	categoryId: joi.string().trim().allow(null).required().trim().messages({
		"string.empty": "Trường này không được đển trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
	}),
	createdAt: joi.string().optional().allow(new Date()),
	updatedAt: joi.string().optional().allow(new Date()),
});

export default productSchema;
