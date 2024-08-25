import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../prismaClient";

interface PostRequestDTO {
	title: string;
	body: string;
	userId: string;
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
	async (request: Request<{}, {}, PostRequestDTO>, response: Response) => {
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

export { createPost, getAllPosts };
