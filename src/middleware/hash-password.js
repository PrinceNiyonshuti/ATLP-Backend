/** @format */

import argon from "argon2";

export const hash = async (password) => {
	return await argon.hash(password);
};

export const verify = async (hashedPassword, plainPassword) => {
	return await argon.verify(hashedPassword, plainPassword);
};
