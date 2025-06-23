
import Notification from "../models/Notification.js";

export const createNotification = async ({ userId, type, message, link }) => {
  return await Notification.create({ userId, type, message, link });
};
