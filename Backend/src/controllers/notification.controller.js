// [ADDED] Notification controller for fetching and marking notifications (lines 1-30)
import Notification from "../models/notification.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ receiver: req.user._id })
            .sort({ createdAt: -1 })
            .populate("sender", "fullName avatar")
            .populate("question", "title")
            .populate("answer", "_id")
            .lean();
        res.json(new ApiResponse(200, notifications, "Notifications fetched"));
    } catch (err) {
        res.json(new ApiError(500, "Failed to fetch notifications"));
    }
};

export const markAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { receiver: req.user._id, isRead: false },
            { $set: { isRead: true } }
        );
        res.json(new ApiResponse(200, {}, "Notifications marked as read"));
    } catch (err) {
        res.json(new ApiError(500, "Failed to mark notifications as read"));
    }
};