import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary, { deleteImageFromCloudinary } from "../utils/cloudinary.js";
import jwt, { decode } from "jsonwebtoken"
import { User } from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";
import { Question } from "../models/question.model.js";
import { Like } from "../models/like.model.js";
import { Answer } from "../models/answer.model.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken };

    } catch (error) {
        return res.json(new ApiError(500, error?.message || "something went wrong while generating refresh and access tokens"))
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    if ([fullName, email, password].some(
        (field) => {
            field?.trim() || "" === ""
        })
    ) {
        return res.json(new ApiError(400, "fullName ,email and password are required."))
    }

    const isUserExist = await User.findOne({
        email
    })

    if (isUserExist) {
        return res.json(new ApiError(400, "User with email already Exists"));
    }
    console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath) {
        return res.json(new ApiError(400, "Avatar file is required."))
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        return res.json(new ApiError(500, "Error while uploading on cloudinary"))
    }

    const user = await User.create({
        fullName,
        email, avatar: avatar?.secure_url,
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        return res.json(new ApiError(500, "Something went wrong while registering user "))

    }

    return res.status(201).json(
        new ApiResponse(200, { user: createdUser }, "User registered successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.json(new ApiError(404, "User does not exist!"));
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        return res.json(new ApiError(401, "Password is incorrect"))
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshTokens");

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken
                },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User loggedOut sucessfully")
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incommingRefreshToken) {
        return res.json(new ApiError(401, "Unauthorized request"))
    }
    try {
        const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);
        if (!user) {
            return res.json(new ApiError(401, "Invalid refreshToken"));
        }
        // console.log(user.refreshToken);

        if (incommingRefreshToken != user.refreshToken) {
            console.log(incommingRefreshToken);
            return res.json(new ApiError(401, "Refresh token is expired or used"));
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);


        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(200,
                    {
                        accessToken,
                        refreshToken: newRefreshToken
                    },
                    "Access token refreshed Successfully"
                )
            );


    } catch (error) {
        return res.json(new ApiError(401, error?.message || "invalid refresh token"))

    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        return res.json(new ApiError(400, "Invalid old password , try forget password if needed"))
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Password changed successfully")
        )
})



const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    return { otp, expiry };
};


const sendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) return res.json(new ApiError(400, "Email is required"));

    const user = await User.findOne({ email });
    if (!user) return res.json(new ApiError(404, "User not found"));

    const { otp, expiry } = generateOtp();
    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save({ validateBeforeSave: false });

    await sendEmail({
        to: user.email,
        subject: "StackLit OTP Verification",
        otp: otp
    });



    return res.status(200).json(new ApiResponse(200, {}, "OTP sent successfully"));
});


const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.json(new ApiError(400, "Email and OTP are required"));

    const user = await User.findOne({ email });
    if (!user) return res.json(new ApiError(404, "User not found"));

    const now = new Date();
    if (!user.otp || user.otp !== otp || !user.otpExpiry || user.otpExpiry < now) {
        // Optionally clear OTP to prevent brute-force
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save({ validateBeforeSave: false });

        return res.json(new ApiError(400, "Invalid or expired OTP"));
    }

    // Valid OTP
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.isOtpVerified = true;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "OTP verified successfully"));
});

const forgetPassword = asyncHandler(async (req, res) => {
    const { newPassword, email } = req.body;
    const user = await User.findOne({ email });

    // console.log(user);

    if (!newPassword) {
        user.isOtpVerified = false;
        await user.save();
        return res.json(new ApiError(400, "Please provide new password"))
    }
    const isSamePassword = await user?.isPasswordCorrect(newPassword);
    if (isSamePassword) {
        user.isOtpVerified = false;
        await user.save();
        return res.json(new ApiError(400, "Old and New Password cannot be same."))
    }

    user.password = newPassword;
    user.isOtpVerified = false;

    await user.save();
    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Password changed successfully")
        )
})


const getUsers = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find().select("fullName avatar").skip(skip).limit(limit);

        const totalUsers = await User.countDocuments();

        const result = await Promise.all(
            users.map(async (user) => {
                const [questionCount, answerCount] = await Promise.all([
                    Question.countDocuments({ owner: user._id }),
                    Answer.countDocuments({ owner: user._id }),
                ]);

                const userQuestions = await Question.find({ owner: user._id }).select("_id views");
                const userAnswers = await Answer.find({ owner: user._id }).select("_id");

                const questionIds = userQuestions.map(q => q._id);
                const answerIds = userAnswers.map(a => a._id);
                const totalViews = userQuestions.reduce((sum, q) => sum + (q.views || 0), 0);

                const likeCount = await Like.countDocuments({
                    isLike: true,
                    $or: [
                        { targetType: "Question", target: { $in: questionIds } },
                        { targetType: "Answer", target: { $in: answerIds } },
                    ],
                });

                const popularity =
                    questionCount * 1 +
                    answerCount * 2 +
                    likeCount * 1.5 +
                    totalViews * 2;

                return {
                    _id: user._id,
                    fullName: user.fullName,
                    avatar: user.avatar,
                    questionCount,
                    answerCount,
                    likeCount,
                    totalViews,
                    popularity: Math.round(popularity),
                };
            })
        );

        result.sort((a, b) => b.popularity - a.popularity);

        res.status(200).json({
            success: true,
            totalUsers,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            users: result
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json(
            new ApiError(500, "Error while fetching Users.")
        )


    }
});


const editFullName = asyncHandler(async (req, res) => {
    const userId = req?.user?._id;
    const { fullName } = req.body;
    if (!fullName) {
        res.json(new ApiError(400, "Full name is required"));
    }
    const user = await User.findByIdAndUpdate(userId, { fullName }, { new: true, runValidators: true }).select("fullName email avatar");
    return res.status(200).json(
        new ApiResponse(200, user, "Full name updated successfully")
    )
})

const editEmail = asyncHandler(async (req, res) => {
    const userId = req?.user?._id;
    const { email } = req.body;
    if (!email) {
        return res.json(new ApiError(400, "Email is required"));
    }

    const user = await User.findByIdAndUpdate(
        userId,
        { email },
        { new: true }
    ).select("fullName email avatar")


    return res.status(200).json(
        new ApiResponse(200, user, "Email updated successfully")
    )
})

const removeAvatar = asyncHandler(async (req, res) => {
    try {
        const userId = req.user?._id;
        const user = await User.findById(userId).select("-password -refreshToken");
        deleteImageFromCloudinary(user.avatar);
        user.avatar = "";
        const updatedUser = await user.save();
        return res.json(
            new ApiResponse(200, updatedUser,"Avatar removed Successfully")
        )
    } catch (error) {
        console.log(error.message);
        return res.json(
            new ApiError(500,"Error while removing Avatar of User.")
        )
        
    }
})













export {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    refreshAccessToken,
    sendOtp,
    verifyOtp,
    forgetPassword,
    getUsers,
    removeAvatar,
    editEmail,
    editFullName
};
