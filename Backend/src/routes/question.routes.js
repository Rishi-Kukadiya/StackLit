import { Router } from "express";
import { postQuestion } from "../controllers/question.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";
const questionRouter = Router();
questionRouter.route('/post-question').post(
    verifyJWT,
    upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    postQuestion
);


export default questionRouter;
