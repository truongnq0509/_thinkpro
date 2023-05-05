import joi from "joi";

export const siginSchema = joi.object({
	email: joi
		.string()
		.email({ tlds: { allow: false } })
		.required()
		.trim()
		.messages({
			"string.email": "Email không hợp lệ!!!",
			"string.empty": "Không được để trống!!!",
			"any.required": "Trường này bắt buộc phải nhập!!!",
		}),
	password: joi.string().min(6).required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
		"string.min": "Tối thiểu 6 ký tự!!!",
	}),
});

export const sendEmailSchema = joi.object({
	email: joi
		.string()
		.email({ tlds: { allow: false } })
		.required()
		.trim()
		.messages({
			"string.email": "Email không hợp lệ!!!",
			"string.empty": "Không được để trống!!!",
			"any.required": "Trường này bắt buộc phải nhập!!!",
		}),
});

export const signupSchema = joi.object({
	firstName: joi.string().required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
	}),
	lastName: joi.string().required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
	}),
	avatar: joi.any().required().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
	}),
	phone: joi
		.string()
		.regex(/^[0-9]{10}$/)
		.required()
		.trim()
		.messages({
			"string.pattern.base": `Số điện thoại không hợp lệ`,
			"string.empty": "Không được để trống!!!",
			"any.required": "Trường này bắt buộc phải nhập!!!",
		}),
	email: joi
		.string()
		.email({ tlds: { allow: false } })
		.required()
		.trim()
		.messages({
			"string.email": "Email không hợp lệ!!!",
			"string.empty": "Không được để trống!!!",
			"any.required": "Trường này bắt buộc phải nhập!!!",
		}),
	password: joi.string().min(6).required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
		"string.min": "Tối thiểu 6 ký tự!!!",
	}),
	confirmPassword: joi.any().equal(joi.ref("password")).required().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
		"any.only": "Mật khẩu không khớp!!!",
	}),
});

export const resetPasswordSchema = joi.object({
	password: joi.string().min(6).required().trim().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
		"string.min": "Tối thiểu 6 ký tự!!!",
	}),
	confirmPassword: joi.any().equal(joi.ref("password")).required().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
		"any.only": "Mật khẩu không khớp!!!",
	}),
});
