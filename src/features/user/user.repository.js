
import mongoose from "mongoose"
import { userSchema } from "./user.schema.js"
import ErrorHandling from "../../error/errorHandling.js";
import bcrypt from 'bcrypt'
import { ObjectId } from "mongodb";

const UserModel = mongoose.model('User', userSchema)
export default class UserRepository {
    async signup(userData) {
        try {
            const{email}=userData;
            const alreadyEmail=await UserModel.findOne({email});
            if(alreadyEmail){
                return {
                    sucess:false,
                    error:{statusCode: 404, msg: "email already registered" }
                }
            }
            const newUser = new UserModel(userData);
            await newUser.save();
            const user = await UserModel.findById(newUser._id).select('-password');
            return {sucess:true,res:user};

        } catch (error) {
            console.log(error);
            
            if(error instanceof mongoose.Error.ValidationError){
                throw error;
            }else{
                throw new ErrorHandling("Something went wrong with database(respo)",500)
            }

        }
       

    }
    async signin(email,password) {
        try {
            const findByEmail=await UserModel.findOne({email});
            if(!findByEmail){
                return {
                    sucess:false,
                    error:{statusCode: 404, msg: "user not found" }
                }
            }
            else{
                const comparingPassword=await bcrypt.compare(password,findByEmail.password)
                if(comparingPassword){
                    return {sucess:true,res:findByEmail};
                }else{
                    return {
                        sucess:false,
                        error:{statusCode: 400, msg: "Invalid credentials" }
                    }
                }
               
            }
        } catch (error) {
            if(error instanceof mongoose.Error.ValidationError){
                throw error;
            }else{
                throw new ErrorHandling("Something went wrong with database(respo)",500)
            }

        }

    }

    async resetPassword() {
        try {

        } catch (error) {
            if(error instanceof mongoose.Error.ValidationError){
                throw error;
            }else{
                throw new ErrorHandling("Something went wrong with database(respo)",500)
            }

        }

    }
    async logout(userId,token) {
        try {
            const userExist=await UserModel.findById(userId);
            if(!userExist){
                return {
                    success: false,
                    error: { statusCode: 404, msg: "User not found" }
                };
            }
            userExist.loginToken=userExist.loginToken.filter(t=>t.token!==token);
            await userExist.save();

            // Send a success response
            return {
                success: true,
                token,
                timestamp: new Date()
            };

        } catch (error) {
            if(error instanceof mongoose.Error.ValidationError){
                throw error;
            }else{
                console.log(error);
                
                throw new ErrorHandling("Something went wrong with database(respo)",500)
            }

        }

    }

    async logoutAll(userId,token) {
        try {
            const userExist=await UserModel.findById(userId);
            if(!userExist){
                return {
                    success: false,
                    error: { statusCode: 404, msg: "User not found" }
                };
            }
            userExist.loginToken=[];
            await userExist.save();

            // Send a success response
            return {
                success: true,
                token,
                timestamp: new Date()
            };


        } catch (error) {
            if(error instanceof mongoose.Error.ValidationError){
                throw error;
            }else{
                throw new ErrorHandling("Something went wrong with database(respo)",500)
            }

        }

    }
    async getById(id) {
        try {
            const user=await UserModel.findById(id).select('-password');
            if(!user){
                return{success:false,error: { msg: `User not found by ${id}`, statusCode: 404 } }
            }
            return { success:true,res:user};

        } catch (error) {
            if(error instanceof mongoose.Error.ValidationError){
                throw error;
            }else{
                throw new ErrorHandling("Something went wrong with database(respo)",500)
            }

        }

    }
    async getAll() {
        try {
         return await UserModel.find().select('-password');
        } catch (error) {
            if(error instanceof mongoose.Error.ValidationError){
                throw error;
            }else{
                console.log(error);
                
                throw new ErrorHandling("Something went wrong with database(respo)",500)
            }

        }

    }
    async updateUser(id,updatedData) {
        try {
            const filter={_id:new ObjectId(id)};
            const update={$set:updatedData};
            const option={new:true,runValidators:true}
            const user=await UserModel.findOneAndUpdate(filter,update,option);
            if(!user){
                return {success:false,error:{msg:`not updated`,statusCode:404}}
            }
            return {success:true,res:user}

        } catch (error) {
            console.log(error);
            
            if(error instanceof mongoose.Error.ValidationError){
                throw error;
            }else{
                throw new ErrorHandling("Something went wrong with database(respo)",500)
            }

        }

    }

}




