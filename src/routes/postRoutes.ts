import express from "express";
import { createPost, getAllPosts } from "../controllers/postController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/").get(getAllPosts);
router.route("/").post(protect, createPost);

export default router;
