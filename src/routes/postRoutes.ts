import express from "express";
import {
	createPost,
	deletePost,
	getAllPosts,
	getSinglePost,
	updatePost,
} from "../controllers/postController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/").get(getAllPosts);
router.route("/").post(protect, createPost);
router
	.route("/:id")
	.get(getSinglePost)
	.put(protect, updatePost)
	.delete(protect, deletePost);

export default router;
