/** @format */

import express from "express";
import {
	deleteArticleById,
	getAllArticles,
	getById,
	saveArticle,
	updateArticle,
} from "../controllers/article.controller";
import { checkAuth } from "../middleware/check-auth";

const router = express.Router();

router.post("/", checkAuth, saveArticle);
router.get("/", getAllArticles);
router.get("/:id", getById);
router.put("/:id", checkAuth, updateArticle);
router.delete("/:id", checkAuth, deleteArticleById);

export default router;
