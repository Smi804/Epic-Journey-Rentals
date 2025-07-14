import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully");
        
    }
    catch(error){
        console.log("error connecting",error);
        process.exit(1); // Exit the process with failure
    }
}

