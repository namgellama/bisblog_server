import { NextFunction, Request, Response } from "express";
import asyncHandler from "./asyncHandler";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient";

const protect = asyncHandler(
	async (request: Request, response: Response, next: NextFunction) => {
		let token = request.cookies.jwt;

		if (token) {
			try {
				const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
					userId: string;
				};

				const user = await prisma.user.findUnique({
					where: { id: decoded.userId },
				});

				request.user = user!;

				next();
			} catch (error) {
				response.status(401);
				throw new Error("Not authorized, token failed");
			}
		} else {
			response.status(401);
			throw new Error("Not authroized, no token");
		}
	}
);

export { protect };
