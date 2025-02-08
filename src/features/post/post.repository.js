import mongoose from "mongoose";
import { postSchema } from "./post.schema.js";
import ErrorHandling from "../../error/errorHandling.js";
import { ObjectId } from "mongodb";
import { userSchema } from "../user/user.schema.js";


const postModel=mongoose.model('Post',postSchema)
const userModel=mongoose.model('User',userSchema);
export default class PostRepository{

    async post(postData){
        try {
            const createPost=new postModel({
                user:new ObjectId(postData.id),
                caption:postData.caption,
                imgUrl:postData.img
            });
            const user=await userModel.updateOne({_id:postData.id},
                {
                    $push:{posts:createPost._id}
                }
            );
            
            await createPost.save();
            return {success:true,post:createPost};
            
        } catch (error) {
            console.log(error);
            if(error instanceof mongoose.Error.ValidationError){
                throw error;
            }else{
                throw new ErrorHandling("something went wrong with database(post)",500)
            }
            
        }
    }
    async postById(postId){
        try {
            const post=await postModel.findById(postId);
            if(!post){
                return{success:false,error:{msg:`Post not found ${postId}`,statusCode:404}}
            }
            return {success:true,post:post};
        } catch (error) {
            console.log(error);
            if(error instanceof mongoose.Error.ValidationError){
                throw error;
            }else{
                throw new ErrorHandling("something went wrong with database(post)",500)
            }
            
        }
    }
    async getPostByUserId(userId){
        try {
            const user=await userModel.findById(userId).select('-password -loginToken').populate('posts');
            console.log(user);
            
            if(!user){
                return{success:false,error:{msg:`User not found ${userId}`,statusCode:404}}
            }
            return {success:true,user};
        } catch (error) {
            console.log(error);
            if(error instanceof mongoose.Error.ValidationError){
                throw error;
            }else{
                throw new ErrorHandling("something went wrong with database(post)",500)
            }
            
        }
    }
    async retreive(){
        try {
            return await postModel.find();
            
        } catch (error) {
            console.log(error);
            if(error instanceof mongoose.Error.ValidationError){
                throw error;
            }else{
                throw new ErrorHandling("something went wrong with database(post)",500)
            }
            
        }
    }
    async updatePost(id,updated){
        try {
            // const filter={_id:new ObjectId(id)};
            const update={$set:updated};
            const option={new:true,runValidators:true}
            const post=await postModel.findByIdAndUpdate(id,update,option);
            if(!post){
                return {success:false,error:{msg:"Unable to update",statusCode:404}}
            }
            return {success:true,post:post};
            
        } catch (error) {
            console.log(error);
            if(error instanceof mongoose.Error.ValidationError){
                throw error;
            }else{
                throw new ErrorHandling("something went wrong with database(post)",500)
            }
            
        }
    }
    async delPost(id){
        try {
            const delPost=await postModel.findByIdAndDelete(id);
            if(!delPost){
                return {success:false,error:{msg:"Unable to delete",statusCode:404}}
            } 
            return {success:true,post:delPost};

            
        } catch (error) {
            console.log(error);
            if(error instanceof mongoose.Error.ValidationError){
                throw error;
            }else{
                throw new ErrorHandling("something went wrong with database(post)",500)
            }
            
        }
    }
    
}