/** @format */

import User from "../db/model/user.model";
import { hash, verify } from "../middleware/hash-password";
import { decodeToken, signToken } from "../middleware/jwt";
import { registerValidation } from "../validation/index";

export const signup = async (req, res) => {
	const { error } = registerValidation(req.body);
	// validate incoming request
	if (error) return res.status(400).json({ message: error.details[0].message });

	let user = await User.findOne({
		username: req.body.username,
	});
	if (user) {
		return res.status(400).json({
			error: true,
			message: "Username is already taken",
		});
	}
	user = req.body;
	user.password = await hash(user.password);
	const newUser = await new User(user);
	newUser.save();
	res
		.status(201)
		.json({ status: "success", message: "User created", data: newUser });
};

export const login = async (req, res) => {
	const { password, email } = req.body;

	let user = await User.findOne({ email });
	if (!user)
		return res
			.status(401)
			.json({ status: false, message: "Invalid email or password" });
	const isPasswordValid = await verify(user.password, password);
	if (!isPasswordValid)
		return res
			.status(401)
			.json({ status: false, message: "Invalid email or password" });

	const { _id, username } = user;
	const token = signToken(JSON.stringify({ _id, username, email: user.email }));
	return res
		.status(200)
		.json({ status: "success", message: "successfully logged in", token });
};

export const userProfile = (req, res) => {
	const bearerToken = req.headers.authorization;
	const token = bearerToken.split(" ")[1];
	const payload = decodeToken(token);
	if (payload) return res.status(200).json({ status: "success", data: payload });

	return res.status(401).json({ status: "fail", message: "Not Authorized" });
};
