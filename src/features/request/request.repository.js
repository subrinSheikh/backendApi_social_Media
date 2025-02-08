import ErrorHandling from "../../error/errorHandling.js";
import { userSchema } from "../user/user.schema.js";
import { reqSchema } from "./request.schema.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";


const reqModel = mongoose.model('Request', reqSchema);
export default class RequestRepository {
    async getFrnd(userId) {
        try {
            const friends=await reqModel.find({
                $or:[
                    {requester:userId,action:'accepted'},
                    {accepter:userId,action:'accepted'}
                ]
            }).populate('requester', 'name email') // Populate requester details
            .populate('accepter', 'name email'); // Populate recipient details
            if(!friends){
                return { success: false, error: { msg: `There are no friends for this user ${userId} `, statusCode: 404 } }
            }
            return {success:true,res:friends};


        } catch (error) {
            console.log(error);
            if (error instanceof mongoose.Error.ValidationError) {
                throw error;
            } else {
                throw new ErrorHandling("something went wrong with database(post)", 500)
            }

        }
    }
    async getPendingReq(userId) {
        try {
            const pendingStatus=await reqModel.find({accepter:userId,action:'pending'}).populate('requester','name email');
            if(!pendingStatus){
                return {success:false,error:{msg:`User has no pendind requests`,statusCode:404}}
            }
            return {success:true,res:pendingStatus};


        } catch (error) {
            console.log(error);
            if (error instanceof mongoose.Error.ValidationError) {
                throw error;
            } else {
                throw new ErrorHandling("something went wrong with database(post)", 500)
            }

        }
    }
    async postToggleFriendship(userId, friendId) {
        try {
            const existingFriend = await reqModel.findOne({
                $or: [
                    { requester: userId, accepter: friendId },
                    { requester: friendId, accepter: userId },
                ]
            });
            if (existingFriend) {
                const reject = await reqModel.deleteOne({ _id: existingFriend._id })
                return { success: true, status: false, res: reject }
            } else {
                const newFriend = new reqModel({
                    requester: userId,
                    accepter: friendId  //another user
                });
                await newFriend.save();
                return { success: true, status: true, res: newFriend };

            }

        } catch (error) {
            console.log(error);
            if (error instanceof mongoose.Error.ValidationError) {
                throw error;
            } else {
                throw new ErrorHandling("something went wrong with database(post)", 500)
            }

        }
    }
    async postResToReq(userId, friendId, action) {
        try {
            const friendShip = await reqModel.findById(friendId);
            if (!friendShip) {
                return { success: false, error: { msg: "friend req not found", statusCode: 404 } }
            }
            if (action === 'accepted') {
                friendShip.action = 'accepted';
                friendShip.createdAt = Date.now();
                const result = await friendShip.save();
                console.log(result);
                return { success: true, res: result }
            } else {
                friendShip.action = 'rejected'
                const deletedFriendShip = await reqModel.deleteOne({ _id: friendShip._id });
                return { success: true, res: deletedFriendShip }

            }


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