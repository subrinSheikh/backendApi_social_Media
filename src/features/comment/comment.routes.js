import express from "express"
import { jwtAuth } from "../../middlewares/jwtAuth.js";
import CommentController from "./comment.controller.js";
const commentController=new CommentController();
export const commentRoutes=express.Router();
commentRoutes.post('/:postId',jwtAuth,(req,res,next)=>{
commentController.add(req,res,next);
})
commentRoutes.get('/:postId',jwtAuth,(req,res,next)=>{
    commentController.get(req,res,next);
    })
commentRoutes.put('/:commentId',jwtAuth,(req,res,next)=>{
    commentController.update(req,res,next);
})
commentRoutes.delete('/:commentId',jwtAuth,(req,res,next)=>{
    commentController.delete(req,res,next);
})


