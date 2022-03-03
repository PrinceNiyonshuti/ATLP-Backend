/** @format */

import User from "../db/model/user.model";
import { hash, verify } from "../middleware/hash-password";
import { decodeToken, signToken } from "../";

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
			message: "Username is already in use",
		});
	}
	user = req.body;
	user.password = await hash(user.password);
	const newUser = await new User(user);
	newUser.save();
	res
		.status(201)
		.json({ success: true, message: "User created", data: newUser });
};
