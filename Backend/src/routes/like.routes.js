import { Router } from "express";
import { postQuestion } from "../controllers/question.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";
import { likeOrDislike } from "../controllers/like.controller.js";
const likeRouter = Router();
likeRouter.route('/toggle-like').post(
    verifyJWT,
    likeOrDislike
);


export default likeRouter;
