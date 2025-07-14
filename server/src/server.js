import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from "http"
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import messageRoutes from './routes/messageRoutes.js'
import userRoutes from './routes/userRoutes.js'
import testlistingRoutes from './routes/testlistingRoutes.js';


dotenv.config();

connectDB()


const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use("/api/messages", messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/users',userRoutes);
app.use('/api/testlistings', testlistingRoutes);




io.on("connection", (socket) => {
  console.log("User connected: " + socket.id);

  socket.on("sendMessage", (data) => {
    console.log(` Message from ${data.senderId} to ${data.receiverId}: ${data.content}`);
   io.to(data.receiverId).emit("receiveMessage", data);
  });

  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log(` User ${userId} joined their chat room`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });

});






server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});