/** @format */

import express from "express";
import { login, signup, userProfile } from "../controllers/auth.controller";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/user-profile", userProfile);
export default router;
