import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../prismaClient";

const createUpvote = asyncHandler(
	async (request: Request<{ id: string }>, response: Response) => {
		const post = await prisma.post.findUnique({
			where: { id: request.params.id },
		});

		if (post) {
			const existingUpvote = await prisma.upvote.findFirst({
				where: {
					AND: [{ postId: post.id, userId: request.user.id }],
				},
			});

			if (!existingUpvote) {
				const newUpvote = await prisma.upvote.create({
					data: {
						postId: post.id,
						userId: request.user.id,
					},
				});

				response
					.status(201)
					.json({ message: "Upvote added.", data: newUpvote });
			} else {
				response
					.status(200)
					.json({ message: "Upvote already exists.", data: null });
			}
		} else {
			response.status(404);
			throw new Error("Post not found.");
		}
	}
);

const deleteUpvote = asyncHandler(
	async (request: Request<{ id: string }>, response: Response) => {
		const post = await prisma.post.findUnique({
			where: { id: request.params.id },
		});

		if (post) {
			const existingUpvote = await prisma.upvote.findFirst({
				where: {
					AND: [{ postId: post.id, userId: request.user.id }],
				},
			});

			console.log(existingUpvote);

			if (existingUpvote) {
				await prisma.upvote.delete({
					where: {
						id: existingUpvote.id,
					},
				});

				response
					.status(204)
					.json({ message: "Upvote removed.", data: null });
			} else {
				response
					.status(404)
					.json({ message: "Upvote not found.", data: null });
			}
		} else {
			response.status(404);
			throw new Error("Post not found.");
		}
	}
);

export { createUpvote, deleteUpvote };
