import mongoose from "mongoose"
import { User } from "./user.model.js";
const answerSchema = new mongoose.Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
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
    image: {
        type: String
    },
    tags: [
        {
            type: String
        }
    ]
}, { timestamps: true });

export const Answer = mongoose.model("Answer", answerSchema);