import express from "express";
import verifyToken from "../middleware/auth.js";    
import { requireRole } from "../middleware/role.js";
import {
  createBooking,
  getBookingsByRenter,
  getBookingByOwner,
  updateBookingStatus
} from "../controllers/bookingController.js";

const router = express.Router();
router.post("/", verifyToken, createBooking);
router.get("/", verifyToken, requireRole("renter"), getBookingsByRenter);
router.get("/:ownerId", verifyToken, requireRole("owner"), getBookingByOwner);
router.patch("/:id/status",verifyToken, requireRole("owner"),updateBookingStatus);


export default router;