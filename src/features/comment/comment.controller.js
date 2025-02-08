import CommentRepository from "./comment.repository.js";
import ErrorHandling from "../../error/errorHandling.js";
export default class CommentController{
    constructor(){
        this.commentRespo=new CommentRepository();
    }

    async add(req,res,next){
        try {
            const postId=req.params.postId;
            const userId=req.id;
            
            const {comment}=req.body;
            const newComment=await this.commentRespo.addComment(postId,userId,comment);
            if(newComment.success){
                return res.status(201).json({msg:`successfully commented on ${postId} by ${userId}`,res:newComment.res})
            }else{
                next(new ErrorHandling(newComment.error.msg,newComment.error.statusCode))
            }   
        } catch (error) {
            console.log(error);
            if(error.name === 'ValidationError'){
                const message=Object.values(error.error).map(e=>e.message);
                return res.status(400).json({success:false,error:message});
            }
            return res.status(400).send(`Something went wrong(controller)`);
            
        }
    }
    async get(req,res,next){
        try {
            const postId=req.params.postId;
            const userId=req.id;
            const comment=await this.commentRespo.getComment(postId,userId);
            if(comment.success){
                return res.status(201).json({msg:`comments of ${postId}`,res:comment.res})
            }else{
                next(new ErrorHandling(comment.error.msg,comment.error.statusCode))
            }   
        } catch (error) {
            console.log(error);
            if(error.name === 'ValidationError'){
                const message=Object.values(error.error).map(e=>e.message);
                return res.status(400).json({success:false,error:message});
            }
            return res.status(400).send(`Something went wrong(controller)`);
            
        }
    }
    async update(req,res,next){
        try {
            const commentId=req.params.commentId;
            const {comment}=req.body;
            const update=await this.commentRespo.updateComment(commentId,req.id,comment);
            if(update.success){
            return res.status(200).json({msg:"update successfully by its owner",res:update.res})
            }else{
                next(new ErrorHandling(update.error.msg,update.error.statusCode))
            }   
            
        } catch (error) {
            console.log(error);
            if(error.name === 'ValidationError'){
                const message=Object.values(error.error).map(e=>e.message);
                return res.status(400).json({success:false,error:message});
            }
            return res.status(400).send(`Something went wrong(controller)`);
            
        }
    }
    async delete(req,res,next){
        try {
            const commentId=req.params.commentId;
            const deleted=await this.commentRespo.delComment(commentId,req.id);
            if(deleted.success){
            return res.status(200).json({msg:"delete successfully by its owner",res:deleted.res})
            }else{
                next(new ErrorHandling(deleted.error.msg,deleted.error.statusCode))
            }   
            
        } catch (error) {
            console.log(error);
            if(error.name === 'ValidationError'){
                const message=Object.values(error.error).map(e=>e.message);
                return res.status(400).json({success:false,error:message});
            }
            return res.status(400).send(`Something went wrong(controller)`);
            
        }
    }
}