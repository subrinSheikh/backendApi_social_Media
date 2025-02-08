import ErrorHandling from "../../error/errorHandling.js";
import OtpRepository from "./otp.repository.js";
export default class OtpController{
    constructor(){
        this.otpRespo=new OtpRepository();
    }

    async sendingOtp(req,res,next){
        try {
            const user=req.user;
            const email=user.email;
            const otpUser=await this.otpRespo.sending(email);
            if(otpUser.success){
                res.status(404).json({msg:`See your email to validate otp at ${email}`});
            }else{
            next(new ErrorHandling(otpUser.error.msg,otpUser.error.statusCode))

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
    async verifyingOtp(req,res,next){
        try {
            const {email,otp}=req.body;
            const validates=await this.otpRespo.verifying(email,otp);
            if(validates.success){
                return res.status(200).json({msg:'Verify successfully'});
            }else{
            next(new ErrorHandling(validates.error.msg,validates.error.statusCode))
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
    async resetting(req,res,next){
        try {
            const {email,otp,newPassword}=req.body;
            const reset=await this.otpRespo.resetPassword(email,otp,newPassword);
            if(reset.success){
                return res.status(200).json({msg:'Password reset successfully.'});
            }else{
                next(new ErrorHandling(reset.error.msg,reset.error.statusCode))
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