
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { Answer } from "../models/answer.model.js";
import { Question } from "../models/question.model.js";
const postAnswer = asyncHandler(async (req, res) => {
    try {
        const { questionId, content } = req.body;

        if (!questionId) {
            return res.json(new ApiError(400, " Question is required for posting answer!"));
        }
        const question = await Question.findById(questionId);
        if (!question) {
            return res.json(new ApiError(400, " Question with this Id doesn't exists"));
            
        }
        if (!content) {
            return res.json(new ApiError(400, "Content of answer is required!"));
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
        const answer = await Answer.create({
            questionId , content , owner : req.user?._id , image : image.secure_url
        });

        if (!answer) {
            return res.json(new ApiError(500, "Error while posting Answer"))
        }

        return res.json(
            new ApiResponse(201, question, "Answer posted successfully")
        )
    } catch (error) {
        console.log(error.message);
        return res.json(
            new ApiError(500, "Error while posting answer")
        )
    }
})


export { postAnswer };
