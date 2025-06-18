import express from "express";
import verifyToken from "../middleware/auth.js";    
import { requireRole } from "../middleware/role.js";
import {
  createBooking,
  getBookingsByRenter
 /*  getBookingById
   */
} from "../controllers/bookingController.js";

const router = express.Router();
router.post("/", verifyToken, requireRole("renter"), createBooking);
router.get("/", verifyToken, requireRole("renter"), getBookingsByRenter);
/* router.get("/:id", verifyToken, getBookingById); */

export default router;