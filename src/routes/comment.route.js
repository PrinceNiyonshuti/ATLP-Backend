/** @format */

import express from "express";
import {
	saveComment,
	getAllComments,
	deleteComment,
} from "../controllers/comment.controller";

import { checkAdminAuth } from "../middleware/check-auth";

const router = express.Router();

router.post("/:id/comment", saveComment);
router.get("/:id/comment", getAllComments);
router.delete("/:id", checkAdminAuth, deleteComment);

export default router;
