import mongoose from "mongoose";
const tagSchema = new mongoose.Schema({
    tag: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    questions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question",
            default: []
        }

    ]


}, { timestamps: true })



export const Tag = mongoose.model("Tag", tagSchema);