import express from "express";
import verifyToken from "../middleware/auth.js";
import {getNotifications,
        markNotificationAsRead, 
        deleteNotification } from "../controllers/notificationController.js";




const router = express.Router();
router.get("/", verifyToken, getNotifications);
router.put("/:notificationId/read", verifyToken, markNotificationAsRead);
router.delete("/:notificationId", verifyToken, deleteNotification);
export default router;