import User from "../models/User.js";

export const getUserInfo=async(req,res)=>{
    try{
        const user=await User.findById(req.params.id).select('fullname email phone role');
        if(!user) return res.status(404).json({error:"User not found"});
        res.json(user);
        console.log("User info fetched successfully:", user);
    }
    catch(err){
        res.status(500).json({message:"error:",error:err.message});
    }
}
