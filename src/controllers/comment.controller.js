/** @format */

import Comment from "../db/model/comment.model";
import Article from "../db/model/article.model";
import { commentValidation } from "../validation/index";

export const saveComment = async (req, res) => {
	const articleId = req.params.id;
	const { error } = commentValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	const newComment = await Comment.create({
		name: req.body.name,
		email: req.body.email,
		content: req.body.content,
		blogPost: articleId,
	});
	const articlePost = await Article.findById(articleId);
	articlePost.comments.push(newComment);
	await articlePost.save(function (error) {
		res.status(201).json({ status: "success", data: newComment });
	});
};

export const getAllComments = async (req, res) => {
	const articleId = req.params.id;
	const getComment = await Article.findById(articleId).populate("comments");
	res.status(200).json({ status: "success", data: getComment.comments });
};

export const deleteComment = async (req, res) => {
	const { id } = req.params;
	const comment = await Comment.findById(id);
	if (!comment)
		return res
			.status(204)
			.json({ status: false, message: "Comment not found" });
	await Comment.findByIdAndDelete(id);
	res
		.status(201)
		.json({ status: "success", message: "Comment deleted", data: comment });
};
