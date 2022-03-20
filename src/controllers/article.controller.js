/** @format */

import Article from "../db/model/article.model";
import { fileUpload } from "../helpers/multer";
import { articleValidation } from "../validation/index";

export const saveArticle = async (req, res, next) => {
	const { error } = articleValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	let findArticle = await Article.findOne({
		slug: req.body.slug,
	});

	if (findArticle)
		return res.status(400).json({
			error: true,
			message: "Slug is already in use",
		});

	if (req.file) {
		req.body.image = await fileUpload(req);
	} else {
		req.body.image =
			"https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260";
	}
	const article = {
		cover: req.body.image,
		title: req.body.title,
		slug: req.body.slug,
		author: req.body.author,
		content: req.body.content,
		status: false,
	};
	const newArticle = new Article(article);
	await newArticle.save();
	res.status(201).json({ success: true, data: newArticle });
};

export const getAllArticles = async (req, res) => {
	const articles = await Article.find();
	res.status(200).json({ success: true, data: articles });
};

export const getById = async (req, res) => {
	const { id } = req.params;
	const article = await Article.findById(id);
	if (!article)
		return res
			.status(404)
			.json({ success: false, message: "Article not found" });
	res.status(200).json({ success: true, data: article });
};

export const updateArticle = async (req, res) => {
	const { id } = req.params;
	const { error } = articleValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	const updates = req.body;
	const article = await Article.findById(id);
	if (!article)
		return res
			.status(404)
			.json({ success: false, message: "Article not found" });
	await Article.findByIdAndUpdate(id, updates);
	res
		.status(200)
		.json({ success: true, message: "Article updated successfully" });
};

export const deleteArticleById = async (req, res) => {
	const { id } = req.params;
	const article = await Article.findById(id);
	if (!article)
		return res
			.status(404)
			.json({ success: false, message: "Article not found" });
	await Article.findByIdAndDelete(id);
	res
		.status(200)
		.json({ success: true, message: "Article deleted", data: Null });
};
