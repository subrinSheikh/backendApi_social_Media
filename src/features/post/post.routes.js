
import express from 'express'
import { uploadImg } from '../../middlewares/multer.uploads.middleware.js';
import { jwtAuth } from '../../middlewares/jwtAuth.js';
import PostController from './post.controller.js';


export const postRoutes=express.Router();
const postController=new PostController();

postRoutes.post('/',uploadImg.single('imgUrl'),jwtAuth,(req,res,next)=>{
    postController.post(req,res,next);
})
postRoutes.get('/all',jwtAuth,(req,res,next)=>{
    postController.retreivingPost(req,res,next);
})
postRoutes.get('/:postId',jwtAuth,(req,res,next)=>{
    postController.postByID(req,res,next);
})
postRoutes.get('/user/:userId',jwtAuth,(req,res,next)=>{
    postController.postByuserID(req,res,next);
})
postRoutes.put('/:postId',uploadImg.single('imgUrl'),jwtAuth,(req,res,next)=>{
    postController.updatePost(req,res,next);
})
postRoutes.delete('/:postId',jwtAuth,(req,res,next)=>{
    postController.deletePost(req,res,next);
})
