import { Router } from "express";
import { deleteAnswer, getAnswerDetails, postAnswer } from "../controllers/answer.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";
const answerRouter = Router();
answerRouter.route('/post-answer').post(
    verifyJWT,
    upload.fields([
        {
            name: "image",
            maxCount: 5
        }
    ]),
    postAnswer
);

answerRouter.route("/get-answer/:answerId").get(
    verifyJWT,
    getAnswerDetails
)
answerRouter.route("/delete-answer/:answerId").delete(
    verifyJWT,
    deleteAnswer
)

export default answerRouter;
