
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { Answer } from "../models/answer.model.js";
import { Question } from "../models/question.model.js";
import { Like } from "../models/like.model.js";
const postAnswer = asyncHandler(async (req, res) => {
    try {
        const { questionId, content, tags } = req.body;

        if (!questionId) {
            return res.json(new ApiError(400, " Question is required for posting answer!"));
        }
        const question = await Question.findById(questionId);
        if (!question) {
            return res.json(new ApiError(400, " Question with this Id doesn't exists"));
        }
        const avatar = req.user?.avatar;

        if (!question.answeredBy.includes(avatar)) {
            question.answeredBy.push(avatar);
            await question.save();
        }

        await question.save();
        if (!content) {
            return res.json(new ApiError(400, "Content of answer is required!"));
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


        const answer = await Answer.create({
            questionId, content, owner: req.user?._id, image: image?.secure_url || "", tags: parsedTags.length > 0 ? parsedTags : []
        });

        if (!answer) {
            return res.json(new ApiError(500, "Error while posting Answer"))
        }

        return res.json(
            new ApiResponse(201, answer, "Answer posted successfully")
        )
    } catch (error) {
        console.log(error.message);
        return res.json(
            new ApiError(500, "Error while posting answer")
        )
    }
})

const deleteAnswer = asyncHandler(async (req, res) => {

    const { answerId } = req.params;
    if (!answerId) {
        return res.json(new ApiError(400, "Answer ID is required."));
    }
    const answer = await Answer.findById(answerId);
    if (!answer) {
        return res.json(new ApiError(404, "Answer not found"));
    }
    if (answer.owner.toString() !== req?.user?._id.toString()) {
        return res.json(new ApiError(403, "You are not authorized to delete this question."));
    }

    const response = await Answer.findByIdAndDelete(answer._id);
    await Like.deleteMany({ target: answerId, targetType: "Answer" });
    if (!response) {
        return res.json(new ApiError(500, "Error while deleting Answer"));
    }

    return res.status(200).json(
        new ApiResponse(200, null, "Answer and related likes/dislikes deleted.")
    );


})

export { postAnswer, deleteAnswer };
