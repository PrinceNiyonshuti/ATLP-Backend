/** @format */

import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: [true, "Why not email ?"],
	},
	content: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
	articlePost: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Article",
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});
const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
