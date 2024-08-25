import express from "express";
import { createPost } from "../controllers/postController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/").post(protect, createPost);

export default router;
