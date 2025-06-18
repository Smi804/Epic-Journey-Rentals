import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js'; 
import authRoutes from './routes/authRoutes.js'; 
import listingRoutes from './routes/listingRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';


import verifyToken from './middleware/auth.js';

dotenv.config();

connectDB()


const app = express();
app.use(cors());

app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/bookings', bookingRoutes);

const PORT = process.env.PORT || 5000;

 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});