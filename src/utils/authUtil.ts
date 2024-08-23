import bcrypt from "bcryptjs";

const hashPassword = async (password: string) => {
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
};

export { hashPassword };
