import express from "express"
import { jwtAuth } from "../../middlewares/jwtAuth.js";
import LikeController from "./like.controller.js";
const likeController=new LikeController();
export const likeRoutes=express.Router();
likeRoutes.post('/toggle/:id',jwtAuth,(req,res,next)=>{
    likeController.toggleLikes(req,res,next);
})
likeRoutes.get('/:id',jwtAuth,(req,res,next)=>{
    likeController.getLikes(req,res,next);
    })
