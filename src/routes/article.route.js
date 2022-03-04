/** @format */

import express from "express";
import {
	deleteArticleById,
	getAllArticles,
	getById,
	saveArticle,
	updateArticle,
} from "../controllers/article.controller";

const router = express.Router();

router.post("/", saveArticle);
router.get("/", getAllArticles);
router.get("/:id", getById);
router.put("/:id", updateArticle);
router.delete("/:id", deleteArticleById);

export default router;
