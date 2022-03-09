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
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb("invalid image file!", false);
	}
};
const uploads = multer({ storage, fileFilter });

router.post("/", checkAdminAuth, uploads.single("image"), saveArticle);
router.get("/", getAllArticles);
router.get("/:id", getById);
router.put("/:id", checkAdminAuth, updateArticle);
router.delete("/:id", checkAdminAuth, deleteArticleById);

export default router;
