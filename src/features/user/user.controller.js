import ErrorHandling from "../../error/errorHandling.js";
import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt'


export default class UserController{
    constructor(){
        this.userRespo=new UserRepository();
    }
    async register(req,res,next){
        try {
           const avatar=req.file.filename;
           let {password}=req.body;
            // password=await bcrypt.hash(password,12);
           
           
            const respo=await this.userRespo.signup({...req.body,password,avatar})
            if(respo.sucess){
            return res.status(201).json({success:true,msg:"User registered successfully!",res:respo.res})
            }else{
             next(new ErrorHandling(respo.error.msg,respo.error.statusCode))
            }
            
        } catch (error) {
            console.log(error);
            if (error.name === "ValidationError") {
                // Extract the validation message
                const messages = Object.values(error.errors).map(err => err.message);
                return res.status(400).json({ success: false, error: messages });
            }
            next(error);
            return res.status(400).send("Something went wrong(controller)")
            
            
        }
    }
    async login(req,res,next){
        try {
            console.log(req.body);
            
            const {email,password}=req.body;
            const user=await this.userRespo.signin(email,password);
            if(user.sucess){
                // const token=jwt.sign({userId:user._id,email:user.email},process.env.key,{expiresIn:'1h'});
                const token=await user.res.generateToken();
                return res.status(200).json({sucess:true,msg:"Login Successfully",token,timestamp: new Date() })

            }else{
                next(new ErrorHandling(user.error.msg,user.error.statusCode))
            }

            
        } catch (error) {
            console.log(error);
            next(error);
            return res.status(400).send("Something went wrong(controller)")
            
        }
    }
    async logout(req,res,next){
        try {
            const userId=req.id;
            const token=req.token;
            const logout=await this.userRespo.logout(userId,token);
            if(logout.success){
                return res.status(200).json({sucess:true,msg:"Logout Successfully from single device",token:logout.token,timestamp:logout.timestamp })
            }
            else{
                next(new ErrorHandling(logout.error.msg,logout.error.statusCode))
            }

            
        } catch (error) {
            console.log(error);
            next(error);
            return res.status(400).send("Something went wrong(controller)")
            
        }
    }
    async logoutAll(req,res,next){
        try {
            const userId=req.id;
            const token=req.token;
            const logout=await this.userRespo.logoutAll(userId,token);
            if(logout.success){
                return res.status(200).json({sucess:true,msg:"Logout Successfully from all devices",token:logout.token,timestamp:logout.timestamp })
            }
            else{
                next(new ErrorHandling(logout.error.msg,logout.error.statusCode))
            }

            
        } catch (error) {
            console.log(error);
            next(error);
            return res.status(400).send("Something went wrong(controller)")
            
        }
    }  
    async getUserById(req,res,next){
        try {
            const id=req.params.userId;
            const user=await this.userRespo.getById(id);
            if(user.success){
                return res.status(200).json({success:true,msg:`user found`,user:user.res});
            }else{
                next(new ErrorHandling(user.error.msg,user.error.statusCode))                
            }
            
        } catch (error) {
            console.log(error);
            next(error);
            return res.status(400).send("Something went wrong(controller)")
            
        }
    }
    async getAllUser(req,res,next){
        try {
            const all= await this.userRespo.getAll();
            return res.status(200).json({success:true,msg:`here we go!!All users are:`,all});

            
        } catch (error) {
            console.log(error);
            next(error);
            return res.status(400).send("Something went wrong(controller)")
            
        }
    }
    async updateUser(req,res,next){
        try {
            const id=req.params.userId;
            let {password}=req.body;
             password=await bcrypt.hash(password,12);
            const avatar=req.file.filename;
            const updated=await this.userRespo.updateUser(id,{...req.body,password,avatar});
            console.log(req.body,req.file.filename);
            
            if(updated.success){
             return res.status(200).json({msg:`update successfully`,updatedUser:updated.res})
            }else{
                next(new ErrorHandling(updated.error.msg,updated.error.statusCode))
            }   
        } catch (error) {
            console.log(error);
            next(error);
            return res.status(400).send("Something went wrong(controller)")
            
        }
    }
    async resetPassword(req,res,next){
        try {
            
        } catch (error) {
            console.log(error);
            next(error);
            return res.status(400).send("Something went wrong(controller)")
            
        }
    }

}