import { Router } from "express";
import { addTag, deleteQuestion, deleteTag, editContent, editImages, editTitle, getAllQuestions, getQuestionDetails, getUnansweredQuestions, postQuestion } from "../controllers/question.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";
const questionRouter = Router();
questionRouter.route('/post-question').post(
    verifyJWT,
    upload.fields([
        {
            name: "image",
            maxCount: 5
        }
    ]),
    postQuestion
);

questionRouter.route("/get-question/:questionId").get(
    getQuestionDetails
)
questionRouter.route("/delete-question/:questionId").delete(
    verifyJWT,
    deleteQuestion
)
questionRouter.route("/get-questions").get(getAllQuestions);
questionRouter.route("/get-unansweredQuestions").get(getUnansweredQuestions);
questionRouter.route("/edit-title/:questionId").patch(verifyJWT, editTitle);
questionRouter.route("/edit-content/:questionId").patch(verifyJWT, editContent);
questionRouter.route("/add-tag/:questionId").patch(verifyJWT, addTag);
questionRouter.route("/delete-tag/:questionId").patch(verifyJWT, deleteTag);
questionRouter.route("/edit-images/:questionId").patch(
    verifyJWT,
    upload.fields([
        {
            name: "image",
            maxCount: 5
        }
    ])
    , editImages);

export default questionRouter;
