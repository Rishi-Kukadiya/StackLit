import { Router } from "express";
import { searchQuestions, searchQuestionsByTag, searchUsers } from "../controllers/search.controller.js";

const searchRouter = Router();
searchRouter.route("/questions").get(searchQuestions);
searchRouter.route("/users").get(searchUsers);
searchRouter.route("/tags").get(searchQuestionsByTag);

export default searchRouter;