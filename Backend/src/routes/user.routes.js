import { Router } from "express";
import { changeCurrentPassword, loginUser, logoutUser, refreshAccessToken, registerUser, sendOtp, verifyOtp } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";
const userRouter = Router();
userRouter.route('/register').post(
    upload.fields([
        { 
            name: "avatar",
            maxCount:1
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
userRouter.post("/send-otp", verifyJWT , sendOtp);
userRouter.post("/verify-otp",verifyJWT, verifyOtp);

export default userRouter;
