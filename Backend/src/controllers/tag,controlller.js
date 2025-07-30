import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Question } from "../models/question.model.js";
import { Tag } from "../models/tag.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";


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
            .select('tag description questions')
            .lean();

        if (!tags) {
            return res.json(
                new ApiError(500, "Error while fetching tags")
            )
        }
        const formattedTags = tags.map(tag => ({
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
    const { page = 1, limit = 10 } = req.query;

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
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .populate("owner", "fullName avatar") 
        .lean();

    const formattedQuestions = questions.map(q => ({
        _id: q._id,
        title: q.title,
        views: q.views,
        answers: q.answeredBy.length,
        owner: {
            name: q.owner.fullName,
            avatar: q.owner.avatar
        },
        createdAt: q.createdAt
    }));


    return res.json(
        new ApiResponse(200, {
            success: true,
            tagName: tag.name,
            tagDescription: tag.description,
            totalQuestions,
            questions: formattedQuestions,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalQuestions / limit)
        },"Questins fetched for the Tag")
    )
});


export { getTags, getQuestionsByTagId };