// [ADDED] Notification routes for fetching and marking notifications (lines 1-30)
import express from "express";
import { getNotifications, markAsRead } from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const notificationRouter = express.Router();

notificationRouter.get("/", verifyJWT, getNotifications);
notificationRouter.delete("/mark-as-read", verifyJWT, markAsRead);

export default notificationRouter;