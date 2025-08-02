import { Router } from "express";
import { changeCurrentPassword, loginUser, logoutUser, refreshAccessToken, registerUser, sendOtp, verifyOtp, forgetPassword, getUsers, removeAvatar, updateAvatar, getUserProfileDetails, deleteUserProfile, editFullName, editEmail } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js";
import checkOtpVerified from "../middlewares/checkOtpVerified.js";
// import { getNotifications } from "../controllers/notification.controller.js";
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
        name: "avatar",
        maxCount: 1
    }
]), verifyJWT, updateAvatar);
userRouter.route("/remove-avatar").patch(verifyJWT, removeAvatar);
userRouter.route('/update-fullName').patch(verifyJWT, editFullName);
userRouter.route('/update-email').patch(verifyJWT, editEmail);

userRouter.route("/get-userProfile/:userId").get(getUserProfileDetails);

userRouter.route("/delete-userProfile").delete(verifyJWT, deleteUserProfile);

export default userRouter;
