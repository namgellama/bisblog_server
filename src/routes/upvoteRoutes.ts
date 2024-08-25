import express from "express";
import { protect } from "../middlewares/authMiddleware";
import { createUpvote } from "../controllers/upvoteController";

const router = express.Router();

router.route("/:id").post(protect, createUpvote);

export default router;
