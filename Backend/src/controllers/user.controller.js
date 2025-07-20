import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import jwt, { decode } from "jsonwebtoken"
import mongoose from "mongoose";
import { User } from "../models/user.model.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, error?.message ||  "something went wrong while generating refresh and access tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password } = req.body;

    if ([fullName, email, password].some(
        (field) => {
            field?.trim() || "" === ""
        })
    ) {
        throw new ApiError(400, "fullName ,email,username and password are required.")
    }

    const isUserExist = await User.findOne({
        email
    })

    if (isUserExist) {
        throw new ApiError(400, "User with email or username already Exists");
    }
    console.log(req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required.")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
        throw new ApiError(500,"Error while uploading on cloudinary")
    }

    const user = await User.create({
        fullName,
        email, avatar:avatar?.secure_url,
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user ")

    }

    return res.status(201).json(
        new ApiResponse(200, { user: createdUser }, "User registered successfully")
    )

})
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({email});
    if (!user) {
        throw new ApiError(404, "User does not exist!");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Password is incorrect")
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
            new ApiResponse(200,{} , "User loggedOut sucessfully")
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incommingRefreshToken) {
        throw new ApiError(401,"Unauthorized request")
    }
    try {
        const decodedToken = jwt.verify(incommingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, "Invalid refreshToken");
        }
        if (incommingRefreshToken !== user.refreshToken) {
            console.log(incommingRefreshToken);
            throw new ApiError(401, "Refresh token is expired or used");
        }
        const options = {
            httpOnly: true,
            secure : true
        }
        const { accessToken, newRefreshToken } = await User.generateAccessAndRefreshTokens(user._id);

        return res
            .status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(200,
                    {
                        accessToken,
                        refreshToken:newRefreshToken
                    },
                    "Access token refreshed Successfully"
                )
            )
        
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
        
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400 , "Invalid old password , try forget password if needed")
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Password changed successfully")
        )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    refreshAccessToken
}