/** @format */

import express from "express";
import {
	getAllUsers,
	login,
	signup,
	updateUserProfile,
	userProfile,
} from "../controllers/auth.controller";
import { checkAdminAuth, checkAuth } from "../middleware/check-auth";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user-profile", checkAuth, userProfile);
router.get("/list-users", checkAdminAuth, getAllUsers);
router.put("/update-profile", checkAuth, updateUserProfile);
export default router;
