/** @format */

import express from "express";
import {
	getAllSubscribers,
	getSubscriber,
	subscribeToNewsletter,
	unsubscribeToNewsletter,
} from "../controllers/subscriber.controller";
import { checkAdminAuth, checkAuth } from "../middleware/check-auth";

const router = express.Router();

router.post("/", subscribeToNewsletter);
router.get("/", checkAdminAuth, getAllSubscribers);
router.get("/mine/:id", getSubscriber);
router.post("/remove", unsubscribeToNewsletter);

export default router;
