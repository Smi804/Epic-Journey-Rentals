import Message from "../models/Message.js";
import User from "../models/User.js";
import {createNotification} from "./notificationController.js";


export const createMessage = async (req, res) => {
  try {
    const msg = await Message.create(req.body);
    const {senderId,receiverId}=req.body;
    const sender = await User.findById(senderId).select("fullname email");
    
    res.status(201).json(msg);
      await createNotification({
      userId: receiverId,
      type: "message",
      message: `New message from ${sender?.fullname || "a user"}`, 
      link: `/chat/${senderId}`, 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getConversation = async (req, res) => {
  const { userId1, userId2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getInbox = async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ timestamp: -1 }).lean();

    const conversationsMap = new Map();

    messages.forEach((msg) => {
      const senderId = msg.senderId?.toString?.();
      const receiverId = msg.receiverId?.toString?.();

      const otherUser =
        senderId === userId ? receiverId : senderId;

      if (otherUser && !conversationsMap.has(otherUser)) {
        conversationsMap.set(otherUser, msg);
      }
    });

    const inbox = Array.from(conversationsMap.values());
    res.json(inbox);
  } catch (err) {
    console.error(" Inbox Error:", err);   
    res.status(500).json({ error: err.message });
  }
};

