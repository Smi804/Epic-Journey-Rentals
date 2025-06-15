import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js'; 
import authRoutes from './routes/authRoutes.js'; 
import listingRoutes from './routes/listingRoutes.js';


import verifyToken from './middleware/auth.js';

dotenv.config();

connectDB()


const app = express();
app.use(cors());

app.use(express.json());
 app.use(verifyToken)

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);


const PORT = process.env.PORT || 5000;

 // Use the auth routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});