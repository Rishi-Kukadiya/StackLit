
import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
    {
        likedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        targetType: {
            type: String,
            required: true,
            enum: ["Question", "Answer"],
        },
        target: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "targetType", 
        },
        isLike: {
            type: Boolean, 
            required: true,
        },
    },
    {
        timestamps: true
    }
);

export const Like = mongoose.model("Like", likeSchema);
