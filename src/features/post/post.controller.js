import ErrorHandling from "../../error/errorHandling.js";
import PostRepository from "./post.repository.js";
export default class PostController{
    constructor(){
        this.postRespo=new PostRepository();
    }
    async post(req,res,next){
        try {
            const id=req.id;
            const img=req.file.filename;
            const post=await this.postRespo.post({id,...req.body,img});
            console.log(post);
            return res.status(201).json({success:true,post:post.post});    
        } catch (error) {
            console.log(error);
            if(error.name === 'ValidationError'){
                const message=Object.values(error.error).map(e=>e.message);
                return res.status(400).json({success:false,error:message});
            }
            return res.status(400).send(`Something went wrong(controller)`)
            
            
        }
    }
    async retreivingPost(req,res,next){
        try {
            const post =await this.postRespo.retreive();
            return res.status(201).json({success:true,post});    
            
        } catch (error) {
            console.log(error);
            if(error.name === 'ValidationError'){
                const message=Object.values(error.error).map(e=>e.message);
                return res.status(400).json({success:false,error:message});
            }
            return res.status(400).send(`Something went wrong(controller)`)
            
            
        }
    }

    async postByID(req,res,next){
        try {
            const postId=req.params.postId;
            const post=await this.postRespo.postById(postId);
            if(post.success){
                return res.status(200).json({success:true,post:post.post});
            }else{                
                next(new ErrorHandling(post.error.msg,post.error.statusCode))
            }
            
        } catch (error) {
            console.log(error);
            if(error.name === 'ValidationError'){
                const message=Object.values(error.error).map(e=>e.message);
                return res.status(400).json({success:false,error:message});
            }
            return res.status(400).send(`Something went wrong(controller)`)
            
            
        }
    }
    async postByuserID(req,res,next){
        try {
            const userId=req.params.userId
            ;
            const post=await this.postRespo.getPostByUserId(userId);
            if(post.success){
                return res.status(200).json({success:true,post});
            }else{                
                next(new ErrorHandling(post.error.msg,post.error.statusCode))
            }
            
        } catch (error) {
            console.log(error);
            if(error.name === 'ValidationError'){
                const message=Object.values(error.error).map(e=>e.message);
                return res.status(400).json({success:false,error:message});
            }
            return res.status(400).send(`Something went wrong(controller)`)
            
            
        }
    }
    async updatePost(req,res,next){
        try {
            const postId=req.params.postId;
            const img=req.file.filename;
            const updatedPost=await this.postRespo.updatePost(postId,{...req.body,img});
            if(updatedPost.success){
                return res.status(200).json({msg:`updated successfully`,updatedPost:updatedPost.post})
            }else{
             next(new ErrorHandling(updatedPost.error.msg,updatedPost.error.statusCode))
            }   
        } catch (error) {
            console.log(error);
            if(error.name === 'ValidationError'){
                const message=Object.values(error.error).map(e=>e.message);
                return res.status(400).json({success:false,error:message});
            }
            return res.status(400).send(`Something went wrong(controller)`)
            
            
        }
    }
    async deletePost(req,res,next){
        try {
            const postId=req.params.postId;
            const delPost=await this.postRespo.delPost(postId);
            if(delPost.success){
                return res.status(200).json({msg:`deleted successfully`,deletedPost:delPost.post})
            }else{
                next(new ErrorHandling(updatedPost.error.msg,updatedPost.error.statusCode))

            }


            
        } catch (error) {
            console.log(error);
            if(error.name === 'ValidationError'){
                const message=Object.values(error.error).map(e=>e.message);
                return res.status(400).json({success:false,error:message});
            }
            return res.status(400).send(`Something went wrong(controller)`)
            
            
        }
    }

}