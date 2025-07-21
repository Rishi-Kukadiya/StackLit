import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express();
import dotenv from "dotenv";
dotenv.config();

app.use(cors({
    origin: process.env.CORS_ORIGIN ,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./src/routes/user.routes.js";
app.use("/api/v1/users", userRouter);

import questionRouter from "./src/routes/question.routes.js";
app.use("/api/v1/questions", questionRouter);

import answerRouter from "./src/routes/answer.routes.js";
app.use("/api/v1/answers", answerRouter);

export { app }