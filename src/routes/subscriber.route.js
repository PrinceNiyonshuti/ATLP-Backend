/** @format */

import express from "express";
import {
	getAllSubscribers,
	subscribeToNewsletter,
	unsubscribeToNewsletter,
} from "../controllers/subscriber.controller";
import { checkAdminAuth } from "../middleware/check-auth";

const router = express.Router();

router.post("/", subscribeToNewsletter);
router.get("/", checkAdminAuth, getAllSubscribers);
router.post("/remove", unsubscribeToNewsletter);

export default router;
