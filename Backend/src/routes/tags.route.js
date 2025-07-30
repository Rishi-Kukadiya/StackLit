import { Router } from "express";
import { getTags } from "../controllers/tag,controlller.js";
const tagRouter = Router();
tagRouter.route('/getTags').get(
    getTags
);


export default tagRouter;
