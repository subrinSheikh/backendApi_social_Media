import express from "express"
import { jwtAuth } from "../../middlewares/jwtAuth.js";
import OtpController from "./otp.controller.js";
const otpController = new OtpController();
export const otpRoutes = express.Router();
otpRoutes.post('/send', jwtAuth, (req, res, next) => {
    otpController.sendingOtp(req, res, next);
})
otpRoutes.post('/verify', jwtAuth, (req, res, next) => {
    otpController.verifyingOtp(req, res, next);
})
otpRoutes.post('/reset-password', jwtAuth, (req, res, next) => {
    otpController.resetting(req, res, next);
})
