
import express from "express"
import { jwtAuth } from "../../middlewares/jwtAuth.js";
import ReqController from "./request.controller.js";
const reqController = new ReqController();
export const reqRoutes = express.Router();
reqRoutes.get('/get-friends/:userId', jwtAuth, (req, res, next) => {
    reqController.getFriends(req, res, next);
})
reqRoutes.get('/get-pending-requests', jwtAuth, (req, res, next) => {
    reqController.pendingReq(req, res, next);
})
reqRoutes.post('/toggle-friendship/:friendId', jwtAuth, (req, res, next) => {
    reqController.toggleFriendship(req, res, next);
})
reqRoutes.post('/response-to-request/:friendId', jwtAuth, (req, res, next) => {
    reqController.responseToReq(req, res, next);
})
