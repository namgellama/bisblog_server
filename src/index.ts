import dotenv from "dotenv";
import express, { Request, Response } from "express";
import { errorHandler, notFound } from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(express.json());

app.get("/", (request: Request, response: Response) => {
	response.json("Welcome to Bisblog API");
});

app.use("/api/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => console.log(`Running on PORT ${PORT}`));
