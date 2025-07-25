import { Router } from "express";
import { changeCurrentPassword, loginUser, logoutUser, refreshAccessToken, registerUser, sendOtp, verifyOtp, forgetPassword, getUsers, removeAvatar, updateAvatar } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";
import checkOtpVerified from "../middlewares/checkOtpVerified.js";
const userRouter = Router();
userRouter.route('/register').post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(
    verifyJWT,
    logoutUser
)
userRouter.route("/refresh-token").post(refreshAccessToken)
userRouter.route("/change-password").post(verifyJWT, changeCurrentPassword)
userRouter.route("/send-otp").post(sendOtp);
userRouter.route("/verify-otp").post(verifyOtp);

userRouter.route("forget-password").post(checkOtpVerified, forgetPassword);
userRouter.route("/get-users").get(getUsers);
userRouter.route("/update-avatar").patch(upload.fields([
    {
        name: "image",
        maxCount: 1
    }
]), verifyJWT, updateAvatar);
userRouter.route("/remove-avatar").patch(verifyJWT, removeAvatar);

export default userRouter;
