import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../prismaClient";
import { generateToken, hashPassword, verifyPassword } from "../utils/authUtil";

interface RegisterRequestDTO {
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	password: string;
}

interface LoginRequestDTO {
	emailOrUsername: string;
	password: string;
}

const register = asyncHandler(
	async (
		request: Request<{}, {}, RegisterRequestDTO>,
		response: Response
	) => {
		const { email, username, firstName, lastName, password } = request.body;

		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			const newUser = await prisma.user.create({
				data: {
					email,
					username,
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

const login = asyncHandler(
	async (request: Request<{}, {}, LoginRequestDTO>, response: Response) => {
		const { emailOrUsername, password } = request.body;

		const user = await prisma.user.findFirst({
			where: {
				OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
			},
		});

		if (user && (await verifyPassword(password, user.password))) {
			generateToken(response, user.id);
			const { id, email, username, firstName, lastName } = user;

			response
				.status(200)
				.json({ id, email, username, firstName, lastName });
		} else {
			response.status(401);
			throw new Error("Invalid email/username or password.");
		}
	}
);

const logout = asyncHandler(async (request: Request, response: Response) => {
	response.cookie("jwt", "", {
		httpOnly: true,
		expires: new Date(0),
	});

	response.status(200).json({ message: "Logged out successfully" });
});

const currentUser = asyncHandler(
	async (request: Request, response: Response) => {
		const user = await prisma.user.findUnique({
			where: {
				id: request.user.id,
			},
			select: {
				id: true,
				username: true,
				email: true,
				firstName: true,
				lastName: true,
			},
		});

		response.status(200).json(user);
	}
);

export { register, login, logout, currentUser };
