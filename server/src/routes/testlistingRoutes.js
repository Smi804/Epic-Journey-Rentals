import express from "express";
import { createTestListing } from "../controllers/testlistingController.js";
import upload from "../utils/multer.js"; // configure multer
import verifyToken from "../middleware/auth.js";

const router = express.Router();

router.post("/", upload.single("image"), createTestListing);

export default router;
