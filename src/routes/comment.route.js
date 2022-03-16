/** @format */

import express from "express";
import {
	saveComment,
	getAllComments,
	deleteComment,
	getSingleComment,
} from "../controllers/comment.controller";

import { checkAdminAuth, checkAuth } from "../middleware/check-auth";

const router = express.Router();

router.post("/:id/comment", checkAuth, saveComment);
router.get("/:id/comment", getAllComments);
router.get("/comment/:id", getSingleComment);
router.delete("/comment/:id", checkAdminAuth, deleteComment);

export default router;
