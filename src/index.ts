import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.get("/", (request: Request, response: Response) => {
	response.json("Welcome to Bisblog API");
});

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => console.log(`Running on PORT ${PORT}`));
