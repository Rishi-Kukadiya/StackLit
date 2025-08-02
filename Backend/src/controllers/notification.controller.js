
import { Notification } from "../models/notification.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
export const createNotification = async ({
    type,
    sender,
    receiver,
    question = null,
    answer = null,
}) => {
    if (String(sender) === String(receiver)) return; // avoid self-notifications

    await Notification.create({ type, sender, receiver, question, answer });
};

// Get all notifications for logged-in user
const getNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const notifications = await Notification.find({ receiver: userId })
        .sort({ createdAt: -1 })
        .populate("sender", "fullName avatar")
        .populate("question", "title")
        .populate("answer", "content")
        .lean();

    return res.status(200).json(
        new ApiResponse(200, notifications, "User notifications fetched successfully")
    );
});

// Delete all notifications for user
const markAsRead = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const result = await Notification.deleteMany({ receiver: userId });

    return res.status(200).json(
        new ApiResponse(200, null, `${result.deletedCount} notifications deleted successfully`)
    );
});

export { getNotifications, markAsRead };
