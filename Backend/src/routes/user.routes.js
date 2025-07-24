import { Router } from "express";
import { changeCurrentPassword, loginUser, logoutUser, refreshAccessToken, registerUser, sendOtp, verifyOtp, forgetPassword, getUsers } from "../controllers/user.controller.js";
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
userRouter.post("/send-otp", sendOtp);
userRouter.post("/verify-otp", verifyOtp);

userRouter.post("/forget-password", checkOtpVerified, forgetPassword);
userRouter.get("/get-users", getUsers);


export default userRouter;
