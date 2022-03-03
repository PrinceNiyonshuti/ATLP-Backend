/** @format */

import Joi from "joi";

// New query validation
export const queryValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(3).required(),
		email: Joi.string().required().email(),
		subject: Joi.string().min(6).required(),
		content: Joi.string().min(6).required(),
	});

	return schema.validate(data);
};

//New User validation
export const registerValidation = (data) => {
	const schema = Joi.object({
		username: Joi.string().min(6),
		email: Joi.string().min(6).required().email(),
		password: Joi.string().min(6).required(),
	});

	return schema.validate(data);
};
