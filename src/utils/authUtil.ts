import bcrypt from "bcryptjs";
import { Response } from "express";
import jwt from "jsonwebtoken";
import ms from "ms";

const hashPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};

const verifyPassword = async (password: string, hashedPassword: string) => {
	return await bcrypt.compare(password, hashedPassword);
};

const generateToken = (response: Response, userId: string) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
		expiresIn: "1d",
	});

	response.cookie("jwt", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV !== "development",
		sameSite: "strict",
		maxAge: ms("1d"),
	});
};

export { hashPassword, verifyPassword, generateToken };
