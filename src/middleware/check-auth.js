/** @format */

import { decodeToken } from "./jwt";

export const checkAuth = (req, res, next) => {
	const bearerToken = req.headers.authorization;
	if (bearerToken) {
		const token = bearerToken.split(" ")[1];
		const payload = decodeToken(token);
		if (payload) return next();

		return res.status(401).json({ status: "fail", message: "Not Authorized" });
	}
	return res
		.status(401)
		.json({ status: "fail", message: "Not Authorized , please login" });
};
