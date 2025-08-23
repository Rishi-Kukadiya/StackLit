import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const checkOtpVerified = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // console.log(user);
    
    if (!user || !user.isOtpVerified) {
        return res.json(new ApiError(403, "OTP not verified"));
    }

    user.isOtpVerified = false;
    req.user = user;
    next();
});

export default checkOtpVerified;
