import express from "express";
import verifyToken from "../middleware/auth.js";
import { getNotifications } from "../controllers/notificationsController.js";


const router = express.Router();
router.get("/", verifyToken, getNotifications);
export default router;