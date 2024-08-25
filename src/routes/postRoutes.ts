import express from "express";
import {
	createPost,
	getAllPosts,
	updatePost,
} from "../controllers/postController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/").get(getAllPosts);
router.route("/").post(protect, createPost);
router.route("/:id").put(protect, updatePost);

export default router;
