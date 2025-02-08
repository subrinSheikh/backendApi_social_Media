import ErrorHandling from "../../error/errorHandling.js";
import RequestRepository from "./request.repository.js";

export default class ReqController {
    constructor() {
        this.reqRespo = new RequestRepository();
    }

    async getFriends(req, res, next) {
        try {
            const id=req.params.userId;
            const friends=await this.reqRespo.getFrnd(id);
            if(friends.success){
                return res.status(201).json({msg:"Following are the friends",res:friends.res})
            }else{
                next(new ErrorHandling(friends.error.msg, friends.error.statusCode));
            }
        } catch (error) {
            console.log(error);
            if (error.name === 'ValidationError') {
                const message = Object.values(error.error).map(e => e.message);
                return res.status(400).json({ success: false, error: message });
            }
            return res.status(400).send(`Something went wrong(controller)`);
        }
    }
    async pendingReq(req, res, next) {
        try {
            const id=req.id;
            const pending=await this.reqRespo.getPendingReq(id);
            if(pending.success){
                return res.status(201).json({msg:"Following are the pending requests",res:pending.res})
            }else{
                next(new ErrorHandling(pending.error.msg, pending.error.statusCode));
            }

        } catch (error) {
            console.log(error);
            if (error.name === 'ValidationError') {
                const message = Object.values(error.error).map(e => e.message);
                return res.status(400).json({ success: false, error: message });
            }
            return res.status(400).send(`Something went wrong(controller)`);
        }
    }
    async toggleFriendship(req, res, next) {
        try {
            const userId = req.id;
            const friendId = req.params.friendId;
            const togglingBetReqs = await this.reqRespo.postToggleFriendship(userId, friendId);
            if (togglingBetReqs.status) {
                return res.status(200).json({ success: true, msg: `Request Sent!`, res: togglingBetReqs.res })
            } else {
                return res.status(201).json({ success: true, msg: `Request Removed`, res: togglingBetReqs.res })
            }

        } catch (error) {
            console.log(error);
            if (error.name === 'ValidationError') {
                const message = Object.values(error.error).map(e => e.message);
                return res.status(400).json({ success: false, error: message });
            }
            return res.status(400).send(`Something went wrong(controller)`);
        }
    }
    async responseToReq(req, res, next) {
        try {
            const userId = req.id;
            const friendId = req.params.friendId;
            const { action } = req.body;
            if(action!=='accepted' && action !=='rejected'){
                return res.status(400).json({success:false,msg:`Invalid action ${action}`})
            }
            const response = await this.reqRespo.postResToReq(userId, friendId, action);
            if (response.success) {
                return res.status(200).json({ success: true, msg: `Request ${action}`, res: response.res })
            }
            else {
                next(new ErrorHandling(response.error.msg, response.error.statusCode));
            }
        } catch (error) {
            console.log(error);
            if (error.name === 'ValidationError') {
                const message = Object.values(error.error).map(e => e.message);
                return res.status(400).json({ success: false, error: message });
            }
            return res.status(400).send(`Something went wrong(controller)`);
        }
    }
}