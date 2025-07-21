import { Question } from "../models/question.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { response } from "express";
const postQuestion = asyncHandler(async (req, res) => {
    try {
        const { title, content } = req.body;
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

        let imageLocalPath = req.files?.image[0]?.path;
        let image = ""
        if (imageLocalPath) {
            image = await uploadOnCloudinary(imageLocalPath);
            if (image != "" && !image) {
                return res.json(new ApiError(500, "Error while uploading on cloudinary"))
            }
        }
        const question = await Question.create({
            title, content, image: image?.secure_url, owner: req?.user?._id
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

// const likeQuestion = asyncHandler(async (req, res) => {
//     const { questionId } = req.body;
//     if (!questionId) {
//         return res.json(new ApiError(400, "QuestionId is required"));
//     }
//     const question = await Question.findById(questionId);
//     if (!question) {
//         return res.json(new ApiError(400, "Question with this id doesn't Exists"));
//     }
//     const response = await Question.findByIdAndUpdate(questionId, { $inc: { like: 1 } });
//     if (!response) {
//         return res.json(new ApiError(500, "Error while adding like to question"));
//     }
//     return res.json(
//         new ApiResponse(200 , [] ,"Question liked")
//     )
// })
// const dislikeQuestion = asyncHandler(async (req, res) => {
//     const { questionId } = req.body;
//     if (!questionId) {
//         return res.json(new ApiError(400, "QuestionId is required"));
//     }
//     const question = await Question.findById(questionId);
//     if (!question) {
//         return res.json(new ApiError(400, "Question with this id doesn't Exists"));
//     }
//     const response = await Question.findByIdAndUpdate(questionId, { $inc: { dislike: 1 } });
//     if (!response) {
//         return res.json(new ApiError(500, "Error while adding like to question"));
//     }
//     return res.json(
//         new ApiResponse(200 , [] ,"Question disliked.")
//     )
// })

export { postQuestion };
