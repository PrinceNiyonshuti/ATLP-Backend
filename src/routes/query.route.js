/** @format */

import express from "express";
import {
	saveQuery,
	getAllQueries,
	getById,
	deleteQueryById,
} from "../controllers/query.controller";
import { checkAuth } from "../middleware/check-auth";

const router = express.Router();

router.post("/", saveQuery);
router.get("/", checkAuth, getAllQueries);
router.get("/:id", checkAuth, getById);
router.delete("/:id", checkAuth, deleteQueryById);

export default router;
