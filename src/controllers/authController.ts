import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../prismaClient";
import { generateToken, hashPassword, verifyPassword } from "../utils/authUtil";

interface RegisterRequestDTO {
	email: string;
	firstName: string;
	lastName: string;
	password: string;
}

interface LoginRequestDTO {
	email: string;
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

const login = asyncHandler(
	async (request: Request<{}, {}, LoginRequestDTO>, response: Response) => {
		const { email, password } = request.body;

		const user = await prisma.user.findUnique({ where: { email } });

		if (user && (await verifyPassword(password, user.password))) {
			generateToken(response, user.id);
			const { id, email, firstName, lastName } = user;

			response.status(200).json({ id, firstName, lastName, email });
		} else {
			response.status(401);
			throw new Error("Invalid email or password.");
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

export { register, login, logout };
