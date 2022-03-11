/** @format */

import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
	user_id: {
		type: String,
		required: true,
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
