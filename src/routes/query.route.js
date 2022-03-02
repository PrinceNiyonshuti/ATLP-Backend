/** @format */

import express from "express";
import {
	saveQuery,
	getAllQueries,
	getById,
	deleteQueryById,
} from "../controllers/query.controller";

const router = express.Router();

router.post("/", saveQuery);
router.get("/", getAllQueries);
router.get("/:id", getById);
router.delete("/:id", deleteQueryById);

export default router;
