// [CHANGED BY GITHUB COPILOT]
// Added real-time notification emission for like/dislike actions on questions
// - Added notification creation and socket emission for like/dislike on questions
// - Changes made: lines 44-61

// filepath: e:\MERN-projects\stacklt\StackLit\Backend\src\controllers\like.controller.js
import { Like } from "../models/like.model.js";
import { Question } from "../models/question.model.js";
import { Answer } from "../models/answer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import Notification from "../models/notification.model.js"; // Added for notification

const likeOrDislike = asyncHandler(async (req, res) => {
    try {
        const { targetId, targetType, isLike } = req.body;
        console.log(targetId, targetType, isLike);
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

        if (!target || target == null) {
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

        // --- Copilot: Notification logic for like/dislike on Question ---
        if (targetType === "Question" && target.owner.toString() !== userId.toString()) {
            const notifType = isLike ? "like" : "dislike";
            const notification = await Notification.create({
                sender: userId,
                receiver: target.owner,
                type: notifType,
                question: targetId
            });

            // Emit real-time notification via socket.io
            const io = req.app.get("io");
            const connectedUsers = req.app.get("connectedUsers");
            if (io && connectedUsers) {
                const receiverSocketId = connectedUsers.get(target.owner.toString());
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("new_notification", {
                        ...notification.toObject(),
                        sender: { _id: req.user._id, fullName: req.user.fullName }
                    });
                }
            }
        }
        // --- Copilot: End notification logic ---

        return res.json(new ApiResponse(201, newLike, `${isLike ? "Liked" : "Disliked"} successfully`));
    } catch (error) {
        console.log(error);
        return res.json(new ApiError(500, error.message))
    }
});

export { likeOrDislike }