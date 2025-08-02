import { Question } from "../models/question.model.js";
import { User } from "../models/user.model.js";
import { Tag } from "../models/tag.model.js";


const searchQuestions = async (req, res) => {
    const query = req.query.q?.trim(); // sanitize
    console.log("Search Query:", query);

    if (!query) {
        return res
            .status(400)
            .json({ success: false, message: "Search query is required" });
    }

    try {
        const regex = new RegExp(query, "i");

        const questions = await Question.find({
            $or: [
                { title: { $regex: regex } },
                { content: { $regex: regex } },
            ],
        }).populate("owner", "fullName avatar");

        console.log("Results found:", questions.length);
        return res.status(200).json({ success: true, questions });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};


const searchUsers = async (req, res) => {
    const q = req.query.q?.trim() || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const regex = new RegExp(q, "i");

    try {
        const [users, total] = await Promise.all([
            User.find({ $or: [{ fullName: regex }, { email: regex }] })
                .select("_id fullName email avatar")
                .skip(skip)
                .limit(limit),

            User.countDocuments({ $or: [{ fullName: regex }, { email: regex }] }),
        ]);

        res.status(200).json({
            success: true,
            data: users,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Search failed", error: err.message });
    }
};

// Search Questions by Tag
const searchQuestionsByTag = async (req, res) => {
    const q = req.query.q?.trim() || "";
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const regex = new RegExp(`^${q}$`, "i");
    try {
        const tag = await Tag.findOne({ tag: regex }).populate({
            path: "questions",
            populate: { path: "owner", select: "fullName avatar" },
            options: {
                sort: { createdAt: -1 },
                skip,
                limit,
            },
        });

        if (!tag) {
            return res.status(200).json({
                success: true,
                data: [],
                total: 0,
                page,
                totalPages: 0,
            });
        }

        const total = await Question.countDocuments({ tags: tag._id });

        res.status(200).json({
            success: true,
            data: tag.questions,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Search failed", error: err.message });
    }
};



export { searchQuestions, searchQuestionsByTag, searchUsers };