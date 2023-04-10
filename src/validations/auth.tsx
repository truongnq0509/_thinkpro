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
	password: joi.string().min(6).required().messages({
		"string.empty": "Không được để trống!!!",
		"any.required": "Trường này bắt buộc phải nhập!!!",
		"string.min": "Tối thiểu 6 ký tự!!!",
	}),
});

export const signupSchema = joi.object({
	email: joi
		.string()
		.email({ tlds: { allow: false } })
		.required()
		.trim()
		.messages({
			"any.invalid": "Email không hợp lệ!!!",
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
