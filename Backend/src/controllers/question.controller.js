import { Question } from "../models/question.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
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

        let imageUrls = [];

        if (req.files && req.files.image && req.files.image.length > 0) {
            const images = req.files.image.slice(0, 5); 
            for (const file of images) {
                const cloudinaryImage = await uploadOnCloudinary(file.path);
                if (!cloudinaryImage) {
                    return res.json(new ApiError(500, "Error while uploading images to Cloudinary"));
                }
                imageUrls.push(cloudinaryImage.secure_url);
            }
        }

        const parsedTags = tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

        const question = await Question.create({
            title,
            content,
            images: imageUrls, 
            owner: req.user._id,
            tags: parsedTags
        });

        if (!question) {
            return res.json(new ApiError(500, "Error while posting question"));
        }

        return res.json(
            new ApiResponse(201, question, "Question posted successfully")
        );
    } catch (error) {
        console.log(error.message);
        return res.json(
            new ApiError(500, "Error while posting question")
        );
    }
});


const getQuestionDetails = asyncHandler(async (req, res) => {
    const { questionId } = req.params;
    console.log(questionId);
    

    if (!questionId) {
        return res.json(new ApiError(400, "Question ID is required"));
    }

    const question = await Question.findById(questionId)
        .populate("owner", "username email avatar") 
        .lean();

    if (!question) {
        return res.json(new ApiError(404, "Question not found"));
    }

    const questionLikes = await Like.find({ target: questionId, targetType: "Question" }).lean();
    const totalLikes = questionLikes.filter(like => like.isLike).length;
    const totalDislikes = questionLikes.filter(like => !like.isLike).length;

    
    const answers = await Answer.find({ questionId })
        .populate("owner", "username fullName avatar")
        .lean();

    
    const answerIds = answers.map(a => a._id);
    const answerLikes = await Like.find({ target: { $in: answerIds }, targetType: "Answer" }).lean();

    const answerMap = {};
    answers.forEach(ans => {
        const likesForAnswer = answerLikes.filter(l => String(l.target) === String(ans._id));
        answerMap[ans._id] = {
            ...ans,
            likes: likesForAnswer.filter(l => l.isLike).length,
            dislikes: likesForAnswer.filter(l => !l.isLike).length
        };
    });

    const finalAnswers = Object.values(answerMap);

    return res.json(
        new ApiResponse(200, {
            question: {
                ...question,
                likes: totalLikes,
                dislikes: totalDislikes
            },
            answers: finalAnswers
        }, "Question details fetched successfully")
    );
});


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


export { postQuestion, deleteQuestion, getQuestionDetails };
