// [ADDED] Notification routes for fetching and marking notifications (lines 1-30)
import express from "express";
import { getNotifications, markAsRead } from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyJWT, getNotifications);
router.post("/mark-as-read", verifyJWT, markAsRead);

export default router;