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
		role: Joi.string().min(3),
		email: Joi.string().min(6).required().email(),
		password: Joi.string().min(6).required(),
	});
	return schema.validate(data);
};

//New article validation
export const articleValidation = (data) => {
	const schema = Joi.object({
		title: Joi.string().min(6),
		slug: Joi.string().min(6),
		author: Joi.string().min(6),
		content: Joi.string().min(6),
	});
	return schema.validate(data);
};

// New Comment validation
export const commentValidation = (data) => {
	const schema = Joi.object({
		name: Joi.string().min(3).required(),
		email: Joi.string().required().email(),
		content: Joi.string().min(6).required(),
	});

	return schema.validate(data);
};

// New Comment subscriber
export const subscriberValidation = (data) => {
	const schema = Joi.object({
		email: Joi.string().required().email(),
	});

	return schema.validate(data);
};
