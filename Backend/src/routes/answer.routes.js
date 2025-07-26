import { Router } from "express";
import { addTag, deleteAnswer, deleteTag, editImages, getAnswerDetails, postAnswer ,editContent } from "../controllers/answer.controller.js";
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


answerRouter.route("/add-tag/:answerId").patch(verifyJWT, addTag);
answerRouter.route("/delete-tag/:answerId").patch(verifyJWT, deleteTag);
answerRouter.route("/edit-content/:answerId").patch(verifyJWT, editContent); 
answerRouter.route("/edit-images/:answerId").patch(verifyJWT, upload.fields([
    {
        name: "image",
        maxCount:5
    }
]) ,editImages); 

export default answerRouter;
