import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const checkOtpVerified = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id); 
    if (!user || !user.isOtpVerified) {
        return res.json(new ApiError(403, "OTP not verified"));
    }

    user.isOtpVerified = false;
    await user.save();
    next();
});

export default checkOtpVerified;
