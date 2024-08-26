import express from "express";
import {
	createPost,
	deletePost,
	getAllPosts,
	getSinglePost,
	updatePost,
} from "../controllers/postController";
import { protect } from "../middlewares/authMiddleware";
import { createUpvote, deleteUpvote } from "../controllers/upvoteController";
import {
	createDownvote,
	deleteDownvote,
} from "../controllers/downvoteController";

const router = express.Router();

router.route("/").get(getAllPosts);
router.route("/").post(protect, createPost);
router
	.route("/:id")
	.get(getSinglePost)
	.put(protect, updatePost)
	.delete(protect, deletePost);
router
	.route("/:id/upvotes")
	.post(protect, createUpvote)
	.delete(protect, deleteUpvote);

router
	.route("/:id/downvotes")
	.post(protect, createDownvote)
	.delete(protect, deleteDownvote);

export default router;
