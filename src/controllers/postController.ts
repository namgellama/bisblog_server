import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../prismaClient";

interface PostRequestDTO {
	title: string;
	body: string;
	userId: string;
}

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

export { createPost };
