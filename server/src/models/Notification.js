import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: "User", required: true },
  type: {
     type: String, 
     enum: ["booking", "message"], 
     required: true },
  message: String,
  link: String, // Optional: link to navigate user
  isRead: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
});

 const Notification=mongoose.model("Notification", notificationSchema);
export default Notification;