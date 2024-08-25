import express from "express";
import {
	currentUser,
	login,
	logout,
	register,
} from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/currentUser").get(protect, currentUser);

export default router;
