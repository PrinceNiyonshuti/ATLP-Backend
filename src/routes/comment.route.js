/** @format */

import express from "express";
import {
	saveComment,
	getAllComments,
	deleteComment,
} from "../controllers/comment.controller";

import { checkAuth } from "../middleware/check-auth";

const router = express.Router();

router.post("/:id/comment", saveComment);
router.get("/:id/comment", getAllComments);
router.delete("/:id", checkAuth, deleteComment);

export default router;
