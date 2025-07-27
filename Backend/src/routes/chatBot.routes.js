import express from "express";
import { chatWithGemini } from "../controllers/chatbot.controller.js";


const chatRouter = express.Router();

chatRouter.route("/chat").post(chatWithGemini);

export default chatRouter;
