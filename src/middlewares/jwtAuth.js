import  jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { userSchema } from "../features/user/user.schema.js";
const UserModel=mongoose.model('User',userSchema)
export const jwtAuth=async (req,res,next)=>{
   // console.log(req.headers,"Headers");
   const token=req.headers["authorization"];
   if(!token){
    return res.status(401).send("Unauthorized! Pls login!!")
   }
   const jwtToken=jwt.verify(token,process.env.key,(err)=>{
      if (err) {
         if (err.name === "TokenExpiredError") {
             return res.status(401).json({ success: false, msg: "JWT expired. Please log in again." });
         }
         return res.status(403).json({ success: false, msg: "Invalid token" });
     }

   });
   // console.log(jwtToken,"token");
   const user=await UserModel.findById(jwtToken._id);
   if(!user){
      return res.status(401).send("User not found!");
   }
   const tokenExists=user.loginToken.some(t=>t.token === token);
   if (!tokenExists) {
      return res.status(401).send("Invalid token! Please login again.");
  }
   req.user=user;
   req.token=token;
   req.id=user._id;
   

   next();
}