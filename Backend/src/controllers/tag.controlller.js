import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Question } from "../models/question.model.js";
import { Tag } from "../models/tag.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import axios from "axios"
import { Like } from "../models/like.model.js";
import { Answer } from "../models/answer.model.js";


const getTags = asyncHandler(async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        const skip = (page - 1) * limit;

        // Total number of tags
        const totalTags = await Tag.countDocuments();

        // Fetch paginated tags
        const tags = await Tag.find({})
            .skip(skip)
            .limit(limit)
            .select('tag description questions _id')
            .lean();

        if (!tags) {
            return res.json(
                new ApiError(500, "Error while fetching tags")
            )
        }
        const formattedTags = tags.map(tag => ({
            _id: tag._id,
            tagName: tag.tag,
            description: tag.description,
            totalQuestionsAsked: tag.questions.length
        }));

        return res.status(200).json(
            new ApiResponse(200, {
                success: true,
                totalTags,
                currentPage: page,
                totalPages: Math.ceil(totalTags / limit),
                tags: formattedTags
            }, "Tags Fetched successfully")
        )

    } catch (error) {
        console.error("Error fetching tags:", error);
        return res.status(500).json(new ApiError(500, "Failed to fetch tags"));
    }
});

const getQuestionsByTagId = asyncHandler(async (req, res) => {
    const { tagId } = req.params;
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(tagId)) {
        return res.json(new ApiError(400, "Invalid tag ID"));
    }

    const tag = await Tag.findById(tagId);
    if (!tag) {
        return res.json(new ApiError(404, "Tag not found"));
    }

    const totalQuestions = tag.questions.length;

    const questions = await Question.find({ _id: { $in: tag.questions } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("owner", "fullName avatar")
        .select("-answeredBy -images")
        .lean();

    const questionIds = questions.map(q => q._id);

    const [likes, answers] = await Promise.all([
        Like.find({ target: { $in: questionIds }, targetType: "Question" }).lean(),
        Answer.find({ questionId: { $in: questionIds } })
            .populate("owner", "avatar")
            .lean()
    ]);

    const likeMap = {};
    for (const like of likes) {
        const qId = String(like.target);
        if (!likeMap[qId]) likeMap[qId] = { likes: 0, dislikes: 0 };
        if (like.isLike) likeMap[qId].likes++;
        else likeMap[qId].dislikes++;
    }

    const answerMap = {};
    for (const ans of answers) {
        const qId = String(ans.questionId);
        if (!answerMap[qId]) answerMap[qId] = [];
        answerMap[qId].push(ans.owner?.avatar);
    }

    const enriched = questions.map(q => {
        const qId = String(q._id);
        return {
            ...q,
            likes: likeMap[qId]?.likes || 0,
            dislikes: likeMap[qId]?.dislikes || 0,
            answerCount: (answerMap[qId]?.length || 0),
            answerAvatars: answerMap[qId] || []
        };
    });

    return res.json(
        new ApiResponse(200, {
            success: true,
            tagName: tag.name,
            tagDescription: tag.description,
            totalQuestions,
            questions: enriched,
            currentPage: page,
            totalPages: Math.ceil(totalQuestions / limit)
        }, "Questions fetched for the Tag")
    );
});



const createTag = async (questioId, tag) => {
    const prompt = `
        You are writing documentation for a programming tag used on            a developer Q&A website like Stack Overflow.

                Write a high-quality description for the programming tag "${tag}" and it should be simple in one paragraph and contains below information : 

                summary of what this tag refers to.
                 describing what it is, where it's used, and why it's important.

               
                > Describe common use cases, implementation patterns, challenges, or variations related to this topic.

                Make sure it's concise, developer-friendly, and informative. Avoid giving irrelevant or vague descriptions.`;

    let response;
    try {
        response = await axios.post(`${process.env.BACKEND_SERVER}/chat`, {
            text: prompt,
        });

    } catch (err) {
        console.error(`Error generating description for tag "${tag}":`, err.message);
    }
    // console.log("response of tag generated:" , response);
    

    await Tag.create({
        tag: tag,
        description: response?.data.text || "",
        questions: [questioId]
    })
}




export { getTags, getQuestionsByTagId, createTag };