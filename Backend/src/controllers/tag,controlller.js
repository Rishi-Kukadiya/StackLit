import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tag } from "../models/tag.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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


export { getTags }