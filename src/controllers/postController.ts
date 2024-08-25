import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../prismaClient";

interface CreatePostRequestDTO {
	title: string;
	body: string;
	userId: string;
}

interface UpdatePostRequestDTO {
	title: string;
	body: string;
}

const getAllPosts = asyncHandler(
	async (request: Request, response: Response) => {
		const posts = await prisma.post.findMany({
			include: {
				user: {
					select: {
						userName: true,
					},
				},
			},
		});
		response.status(200).json(posts);
	}
);

const createPost = asyncHandler(
	async (
		request: Request<{}, {}, CreatePostRequestDTO>,
		response: Response
	) => {
		const { title, body } = request.body;

		const newPost = await prisma.post.create({
			data: {
				title,
				body,
				userId: request.user.id,
			},
		});

		response.status(201).json(newPost);
	}
);

const updatePost = asyncHandler(
	async (
		request: Request<{ id: string }, {}, UpdatePostRequestDTO>,
		response: Response
	) => {
		const { title, body } = request.body;

		const post = await prisma.post.findUnique({
			where: {
				id: request.params.id,
			},
		});

		if (post) {
			if (post.userId === request.user.id) {
				const updatedPost = await prisma.post.update({
					where: {
						id: request.params.id,
					},
					data: {
						title,
						body,
					},
				});

				response.status(200).json(updatedPost);
			} else {
				response.status(403);
				throw new Error("Forbidden");
			}
		} else {
			response.status(404);
			throw new Error("Post not found.");
		}
	}
);

export { createPost, getAllPosts, updatePost };
