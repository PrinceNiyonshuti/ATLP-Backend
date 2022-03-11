/** @format */

import express from "express";
import {
	login,
	signup,
	updateUserProfile,
	userProfile,
} from "../controllers/auth.controller";
import { checkAuth } from "../middleware/check-auth";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user-profile", userProfile);
router.put("/update-profile", checkAuth, updateUserProfile);
export default router;
