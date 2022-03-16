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

	let userMail = await User.findOne({
		email: req.body.email,
	});

	if (user) {
		return res.status(201).json({
			error: true,
			message: "Username is already taken",
		});
	} else if (userMail) {
		return res.status(201).json({
			error: true,
			message: "Email is already taken",
		});
	}
	user = req.body;
	user.password = await hash(user.password);
	const newUser = await new User(user);
	newUser.save();
	const userData = {
		username: newUser.username,
		role: newUser.role,
		email: newUser.email,
		createdAt: newUser.createdAt,
		_id: newUser._id,
	};
	const token = signToken(
		JSON.stringify({
			_id: userData._id,
			username: userData.username,
			role: userData.role,
			email: userData.email,
		})
	);
	res.status(201).json({
		status: "success",
		message: "Account created",
		data: userData,
		token,
	});
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

	const { _id, username, role } = user;
	const token = signToken(
		JSON.stringify({ _id, username, role, email: user.email })
	);
	return res
		.status(200)
		.json({ status: "success", message: "successfully logged in", token });
};

export const userProfile = (req, res) => {
	const bearerToken = req.headers.authorization;
	const token = bearerToken.split(" ")[1];
	const payload = decodeToken(token);
	if (payload)
		return res.status(200).json({ status: "success", data: payload });

	return res.status(401).json({ status: "fail", message: "Not Authorized" });
};

export const updateUserProfile = async (req, res) => {
	const { id } = req.body;
	const updates = req.body;
	const user = await User.findById(id);
	if (!user)
		return res
			.status(404)
			.json({ success: false, message: "User profile not found" });
	await User.findByIdAndUpdate(id, updates);
	res
		.status(200)
		.json({ success: true, message: "User profile updated successfully" });
};
