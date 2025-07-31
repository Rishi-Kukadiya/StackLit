import { Router } from "express";
import { getQuestionsByTagId, getTags } from "../controllers/tag,controlller.js";
const tagRouter = Router();
tagRouter.route('/getTags').get(
    getTags
);
tagRouter.route('/get-questions/:tagId').get(getQuestionsByTagId);

export default tagRouter;
