/** @format */

import Article from "../db/model/article.model";
import { articleValidation } from "../validation/index";

export const saveArticle = async (req, res) => {
	const { error } = articleValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });
	const article = req.body;
	const newArticle = new Article(article);
	await newArticle.save();
	res.status(201).json({ success: true, data: newArticle });
};

export const getAllArticles = async (req, res) => {
	const articles = await Query.find();
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
		.json({ success: true, message: "Article deleted", data: article });
};
