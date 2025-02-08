import mongoose from "mongoose";
export const postSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    caption:{
        type:String
    },
    imgUrl:{
        type:String
 
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Like'
        }
    ]
})