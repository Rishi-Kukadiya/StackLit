import mongoose from "mongoose"
import { User } from "./user.model.js";
const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    images: [
        {
        type: String
        }
    ],
    answeredBy: [
        {
            type: String
        }
    ],
    tags: [
        {
            type: String
        }
    ],
    views: {
        type: Number,
        default : 0
    }
}, { timestamps: true });

export const Question = mongoose.model("Question", questionSchema);