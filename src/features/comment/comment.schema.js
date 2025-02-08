import mongoose from "mongoose";
export const commentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },//commenter
    postOwner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    comment:{
        type:String
    },
    likes:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Like'
            }
    ]
})