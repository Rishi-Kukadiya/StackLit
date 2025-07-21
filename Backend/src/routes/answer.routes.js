import { Router } from "express";
import { deleteAnswer, postAnswer } from "../controllers/answer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";
const answerRouter = Router();
answerRouter.route('/post-answer').post(
    verifyJWT,
    upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]),
    postAnswer
);
answerRouter.route("/delete-answer/:answerId").delete(
    verifyJWT,
    deleteAnswer
)

export default answerRouter;
