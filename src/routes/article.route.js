/** @format */

import express from "express";
import {
	deleteArticleById,
	getAllArticles,
	getById,
	saveArticle,
	updateArticle,
} from "../controllers/article.controller";
import { checkAdminAuth } from "../middleware/check-auth";

const router = express.Router();

router.post("/", checkAdminAuth, saveArticle);
router.get("/",getAllArticles);
router.get("/:id", getById);
router.put("/:id", checkAdminAuth, updateArticle);
router.delete("/:id", checkAdminAuth, deleteArticleById);

export default router;
