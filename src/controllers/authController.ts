import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../prismaClient";
import { hashPassword } from "../utils/authUtil";

interface RegisterRequestDTO {
	email: string;
	firstName: string;
	lastName: string;
	password: string;
}

const register = asyncHandler(
	async (
		request: Request<{}, {}, RegisterRequestDTO>,
		response: Response
	) => {
		const { email, firstName, lastName, password } = request.body;

		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			const newUser = await prisma.user.create({
				data: {
					email,
					firstName,
					lastName,
					password: await hashPassword(password),
				},
			});

			response.status(201).json(newUser);
		} else {
			response.status(400);
			throw new Error("User already exists.");
		}
	}
);

export { register };
