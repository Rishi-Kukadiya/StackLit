import { Question } from "../models/question.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { parse } from "dotenv";
import { Answer } from "../models/answer.model.js";
import { Like } from "../models/like.model.js";

const postQuestion = asyncHandler(async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        console.log(title, content, req?.user);

        if (!title) {
            return res.json(new ApiError(400, "Title of question is required!"));
        }
        if (!content) {
            return res.json(new ApiError(400, "Content of question is required!"));
        }
        if (!req.user) {
            return res.json(new ApiError(403, "Unauthorized request"));
        }

        let imageLocalPath = "";
        if (req.files && req.files.image && req.files.image.length > 0) {
            imageLocalPath = req.files.image[0].path;
        }

        let image = "";
        if (imageLocalPath) {
            image = await uploadOnCloudinary(imageLocalPath);
            if (!image) {
                return res.json(new ApiError(500, "Error while uploading on Cloudinary"));
            }
        }

        let parsedTags = [];
        parsedTags = tags.split(',')




        const question = await Question.create({
            title, content, image: image?.secure_url || "", owner: req?.user?._id, tags: parsedTags.length > 0 ? parsedTags : []
        });
        if (!question) {
            return res.json(new ApiError(500, "Error while posting Question"))
        }

        return res.json(
            new ApiResponse(201, question, "Question posted successfully")
        )
    } catch (error) {
        console.log(error.message);
        return res.json(
            new ApiError(500, "Error while posting question")
        )
    }
})


const deleteQuestion = asyncHandler(async (req, res) => {

    const { questionId } = req.params;
    if (!questionId) {
        return res.json(new ApiError(400, "Question ID is required."));
    }
    const question = await Question.findById(questionId);
    if (!question) {
        return res.json(new ApiError(404, "Question not found"));
    }
    if (question.owner.toString() !== req?.user?._id.toString()) {
        return res.json(new ApiError(403, "You are not authorized to delete this question."));
    }

    // Delete All Answers related to the question
    const answers = await Answer.find({ questionId });
    const answerIds = answers.map(ans => ans._id);
    await Answer.deleteMany({ questionId })

    // Delete likes and dislikes on this question
    await Like.deleteMany({ target: questionId, targetType: "Question" });

    // Delete all likes and dislikes on its answers
    if (answerIds.length > 0) {
        await Like.deleteMany({ targetType: "Answer", target: { $in: answerIds } })
    }

    // Delete the question
    await question.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, "Question, its answers, and related likes/dislikes deleted.")
    );


})


export { postQuestion,deleteQuestion };
