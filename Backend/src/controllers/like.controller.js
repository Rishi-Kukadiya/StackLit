import { Like } from "../models/like.model.js";
import { Question } from "../models/question.model.js";
import { Answer } from "../models/answer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const likeOrDislike = asyncHandler(async (req, res) => {
    try {
        const { targetId, targetType, isLike } = req.body;
        console.log(targetId , targetType , isLike);
        const userId = req?.user?._id;
    
        if (!targetId || !targetType || typeof isLike !== "boolean") {
            throw new ApiError(400, "targetId, targetType, and isLike are required");
        }
    
        if (!["Question", "Answer"].includes(targetType)) {
            throw new ApiError(400, "targetType must be 'Question' or 'Answer'");
        }
    
        const TargetModel = targetType === "Question" ? Question : Answer;
        const target = await TargetModel.findById(targetId);
        console.log(target);
        
        if (!target || target==null) {
            throw new ApiError(404, `${targetType} not found`);
        }
    
        const existing = await Like.findOne({
            likedBy: userId,
            targetType,
            target: targetId
        });
    
        if (existing) {
            if (existing.isLike === isLike) {
                await existing.deleteOne();
                return res.json(new ApiResponse(200, null, `${isLike ? "Like" : "Dislike"} removed`));
            } else {
                existing.isLike = isLike;
                await existing.save();
                return res.json(new ApiResponse(200, existing, `${isLike ? "Liked" : "Disliked"} updated`));
            }
        }
    
        // New like/dislike
        const newLike = await Like.create({
            likedBy: userId,
            targetType,
            target: targetId,
            isLike
        });
    
        return res.json(new ApiResponse(201, newLike, `${isLike ? "Liked" : "Disliked"} successfully`));
    } catch (error) {
        console.log(error);
        return res.json(new ApiError(500,error.message))
        
        
    }
});

export {likeOrDislike}
