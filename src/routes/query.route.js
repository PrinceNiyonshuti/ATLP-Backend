/** @format */

import express from "express";
import {
	saveQuery,
	getAllQueries,
	getById,
	deleteQueryById,
} from "../controllers/query.controller";
import { checkAdminAuth, checkAuth } from "../middleware/check-auth";

const router = express.Router();

router.post("/", saveQuery);
router.get("/", checkAdminAuth, getAllQueries);
router.get("/:id", checkAdminAuth, getById);
router.delete("/:id", checkAdminAuth, deleteQueryById);

export default router;
