import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import uploadOnCloudinary from "../utils/cloudinary";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import { User } from "../models/user.model";

const registerUser = asyncHandler(async (req, res) => {
    // const {}
    
})
const loginUser = asyncHandler(async (req, res) => {
    // const {}
    
})

export {
    registerUser,
    loginUser
}