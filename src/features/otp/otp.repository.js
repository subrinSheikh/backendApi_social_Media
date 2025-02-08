import mongoose from "mongoose";
import { otpSchema } from "./otp.schema.js";
import { userSchema } from "../user/user.schema.js";
import { generateOtp, sendEmail } from "./nodemailer.js";
import ErrorHandling from "../../error/errorHandling.js";

const optModel=mongoose.model('Otp',otpSchema);
const userModel=mongoose.model('User',userSchema);
export default class OtpRepository {
    async sending(email) {
        try {
            const user=await userModel.findOne({email});
            if(!user){
                return{success:false,error:{msg:`${email} is not registered`,statusCode:404}}
            }
            const otp=generateOtp();
            const savingOtp=new optModel({email,otp})
            // await optModel.create({email,otp});
            await savingOtp.save();
            await sendEmail(email,otp);
            if(!savingOtp){
                return {success:false,error:{msg:`Cant send top`,statusCode:404}};
            }
            return {success:true,res:savingOtp};
        } catch (error) {
            console.log(error);
            if (error instanceof mongoose.Error.ValidationError) {
                throw error;
            } else {
                throw new ErrorHandling("something went wrong with database(post)", 500)
            }

        }
    }
    async verifying(email,otp) {
        try {
            const verify=await optModel.findOne({email,otp});
            if(!verify){
                return {success:false,error:{msg:'Invalid or expired OTP.',statusCode:404}}; 
            }
            return {success:true,res:verify};
        } catch (error) {
            console.log(error);
            if (error instanceof mongoose.Error.ValidationError) {
                throw error;
            } else {
                throw new ErrorHandling("something went wrong with database(post)", 500)
            }

        }
    }
    async resetPassword(email,otp,newPassword) {
        try {
            const otpRecord=await optModel.findOne({email,otp});
            if(!otpRecord){
                return {success:false,error:{msg:'Invalid or expired OTP.',statusCode:400}};
            }
            const user=await userModel.findOne({email});
            if (!user) return {success:false,error:{msg:'user not found',statusCode:404}};
            user.password=newPassword;
            await user.save();
            const result=await optModel.deleteOne({ email, otp });
            return {success:true,res:result}
        } catch (error) {
            console.log(error);
            if (error instanceof mongoose.Error.ValidationError) {
                throw error;
            } else {
                throw new ErrorHandling("something went wrong with database(post)", 500)
            }

        }
    }
}