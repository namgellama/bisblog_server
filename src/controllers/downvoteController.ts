import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../prismaClient";

const createDownvote = asyncHandler(
	async (request: Request<{ id: string }>, response: Response) => {
		const post = await prisma.post.findUnique({
			where: { id: request.params.id },
		});

		if (post) {
			const existingDownvote = await prisma.downvote.findFirst({
				where: {
					AND: [{ postId: post.id, userId: request.user.id }],
				},
			});

			if (!existingDownvote) {
				const newDownvote = await prisma.downvote.create({
					data: {
						postId: post.id,
						userId: request.user.id,
					},
				});

				response
					.status(201)
					.json({ message: "Downvote added.", data: newDownvote });
			} else {
				response
					.status(200)
					.json({ message: "Downvote already exists.", data: null });
			}
		} else {
			response.status(404);
			throw new Error("Post not found.");
		}
	}
);

const deleteDownvote = asyncHandler(
	async (request: Request<{ id: string }>, response: Response) => {
		const post = await prisma.post.findUnique({
			where: { id: request.params.id },
		});

		if (post) {
			const existingDownvote = await prisma.downvote.findFirst({
				where: {
					AND: [{ postId: post.id, userId: request.user.id }],
				},
			});

			if (existingDownvote) {
				await prisma.downvote.delete({
					where: {
						id: existingDownvote.id,
					},
				});

				response
					.status(204)
					.json({ message: "Downvote removed.", data: null });
			} else {
				response
					.status(404)
					.json({ message: "Downvote not found.", data: null });
			}
		} else {
			response.status(404);
			throw new Error("Post not found.");
		}
	}
);

export { createDownvote, deleteDownvote };
