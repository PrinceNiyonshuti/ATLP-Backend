/** @format */

import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	slug: {
		type: String,
		required: true,
	},
	author: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	cover: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
});
const Article = mongoose.model("Article", ArticleSchema);
export default Article;
