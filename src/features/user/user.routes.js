import express from 'express'
import UserController from './user.controller.js';
import { uploadAvatar } from '../../middlewares/multer.uploads.middleware.js';
import { jwtAuth } from '../../middlewares/jwtAuth.js';
export  const userRoutes=express.Router();
const userController=new UserController();
userRoutes.post('/signup',uploadAvatar.single('avatar'),(req,res,next)=>{
    userController.register(req,res,next)
})
userRoutes.post('/signin',(req,res,next)=>{
    userController.login(req,res,next)
});
userRoutes.post('/logout',jwtAuth,(req,res,next)=>{
    userController.logout(req,res,next)
})
userRoutes.post('/logout-all-devices',jwtAuth,(req,res,next)=>{
    userController.logoutAll(req,res,next)
})
userRoutes.get('/get-details/:userId',jwtAuth,(req,res,next)=>{
    userController.getUserById(req,res,next)
})
userRoutes.get('/get-all-details',jwtAuth,(req,res,next)=>{
    userController.getAllUser(req,res,next)
})
userRoutes.put('/update-details/:userId',jwtAuth,uploadAvatar.single('avatar'),(req,res,next)=>{
    userController.updateUser(req,res,next)
})
