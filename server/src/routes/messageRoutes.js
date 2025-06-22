import express from "express";
import { createMessage, getConversation ,getInbox} from "../controllers/messageController.js";

const router = express.Router();

router.get("/inbox/:userId", getInbox);
router.get("/:userId1/:userId2", getConversation);
router.post("/", createMessage);

export default router;
