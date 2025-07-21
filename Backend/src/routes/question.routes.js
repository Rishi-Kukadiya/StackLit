import { Router } from "express";
import { deleteQuestion, postQuestion } from "../controllers/question.controller.js";
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
questionRouter.route("/delete-question/:questionId").delete(
    verifyJWT,
    deleteQuestion
)

export default questionRouter;
