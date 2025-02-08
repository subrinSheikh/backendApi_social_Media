
import mongoose from "mongoose";

export const likeSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likes:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'address'
    },
    address:{
        type:String,
        enum:['Post','Comment']
    }
})
