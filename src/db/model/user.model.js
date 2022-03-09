/** @format */

import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
	username: {
		type: String,
		require: true,
	},
	firstName: {
		type: String,
		require: true,
	},
	lastName: {
		type: String,
		require: true,
	},
	role: {
		type: String,
		require: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
});

const User = mongoose.model("User", UserSchema);
export default User;
