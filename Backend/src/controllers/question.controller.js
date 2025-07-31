import { Question } from "../models/question.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary, { deleteImageFromCloudinary } from "../utils/cloudinary.js";
import { Answer } from "../models/answer.model.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import { Tag } from "../models/tag.model.js";

import dotenv from "dotenv";
import { createTag } from "./tag,controlller.js";
dotenv.config();



const postQuestion = asyncHandler(async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        console.log(title, content, req?.user);

        if (!title) {
            return res.json(new ApiError(400, "Title of question is required!"));
        }
        if (!content) {
            return res.json(new ApiError(400, "Content of question is required!"));
        }
        if (!req.user) {
            return res.json(new ApiError(403, "Unauthorized request"));
        }

        let imageUrls = [];

        if (req.files && req.files.image && req.files.image.length > 0) {
            const images = req.files.image.slice(0, 5);
            for (const file of images) {
                const cloudinaryImage = await uploadOnCloudinary(file.path);
                if (!cloudinaryImage) {
                    return res.json(new ApiError(500, "Error while uploading images to Cloudinary"));
                }
                imageUrls.push(cloudinaryImage.secure_url);
            }
        }

        const parsedTags = tags ? tags.split(',').map(tag => tag.trim()).filter(Boolean) : [];



        const question = await Question.create({
            title,
            content,
            images: imageUrls,
            owner: req.user._id,
            tags: parsedTags
        });

        if (!question) {
            return res.json(new ApiError(500, "Error while posting question"));
        }

        for (const t of parsedTags) {
            const tagName = t.toLowerCase().trim();
            const existingTag = await Tag.findOne({ tag: tagName });
            if (existingTag) {
                if (!existingTag.questions.includes(question._id)) {
                    existingTag.questions.push(question._id);
                    await existingTag.save();
                }
            } else {
                createTag(question._id, tagName);
            }
        }
        return res.json(
            new ApiResponse(201, question, "Question posted successfully")
        );
    } catch (error) {
        console.log(error.message);
        return res.json(
            new ApiError(500, "Error while posting question")
        );
    }
});


const getQuestionDetails = asyncHandler(async (req, res) => {
    const { questionId } = req.params;
    console.log(questionId);


    if (!questionId) {
        return res.json(new ApiError(400, "Question ID is required"));
    }

    const question = await Question.findById(questionId)
        .populate("owner", "fullName  avatar")
        .lean();

    if (!question) {
        return res.json(new ApiError(404, "Question not found"));
    }
    const q = await Question.findById(questionId);
    q.views = q.views + 1;
    await q.save({ validateBeforeSave: true });

    const questionLikes = await Like.find({ target: questionId, targetType: "Question" }).lean();
    const totalLikes = questionLikes.filter(like => like.isLike).length;
    const totalDislikes = questionLikes.filter(like => !like.isLike).length;


    const answers = await Answer.find({ questionId })
        .sort({ createdAt: -1 })
        .populate("owner", "fullName avatar")
        .lean();


    const answerIds = answers.map(a => a._id);
    const answerLikes = await Like.find({ target: { $in: answerIds }, targetType: "Answer" }).lean();

    const answerMap = {};
    answers.forEach(ans => {
        const likesForAnswer = answerLikes.filter(l => String(l.target) === String(ans._id));
        answerMap[ans._id] = {
            ...ans,
            likes: likesForAnswer.filter(l => l.isLike).length,
            dislikes: likesForAnswer.filter(l => !l.isLike).length
        };
    });

    const finalAnswers = Object.values(answerMap);


    return res.json(
        new ApiResponse(200, {
            question: {
                ...question,
                answers: finalAnswers,
                likes: totalLikes,
                dislikes: totalDislikes
            }
        }, "Question details fetched successfully")
    );
});


// const deleteQuestion = asyncHandler(async (req, res) => {

//     const { questionId } = req.params;
//     if (!questionId) {
//         return res.json(new ApiError(400, "Question ID is required."));
//     }
//     const question = await Question.findById(questionId);
//     if (!question) {
//         return res.json(new ApiError(404, "Question not found"));
//     }
//     if (question.owner.toString() !== req?.user?._id.toString()) {
//         return res.json(new ApiError(403, "You are not authorized to delete this question."));
//     }

//     // Delete All Answers related to the question
//     const answers = await Answer.find({ questionId });
//     const answerIds = answers.map(ans => ans._id);
//     await Answer.deleteMany({ questionId })

//     // Delete likes and dislikes on this question
//     await Like.deleteMany({ target: questionId, targetType: "Question" });

//     // Delete all likes and dislikes on its answers
//     if (answerIds.length > 0) {
//         await Like.deleteMany({ targetType: "Answer", target: { $in: answerIds } })
//     }

//     // Delete the question
//     await question.deleteOne();

//     return res.status(200).json(
//         new ApiResponse(200, null, "Question, its answers, and related likes/dislikes deleted.")
//     );


// })





const deleteQuestion = asyncHandler(async (req, res) => {
    const { questionId } = req.params;

    if (!questionId) {
        return res.json(new ApiError(400, "Question ID is required."));
    }

    const question = await Question.findById(questionId);

    if (!question) {
        return res.json(new ApiError(404, "Question not found"));
    }

    if (question.owner.toString() !== req?.user?._id.toString()) {
        return res.json(new ApiError(403, "You are not authorized to delete this question."));
    }


    if (question.images && question.images.length > 0) {
        for (const img of question.images) {
            await deleteImageFromCloudinary(img);
        }
    }

    const answers = await Answer.find({ questionId });
    const answerIds = answers.map(ans => ans._id);


    for (const ans of answers) {
        if (ans.images && ans.images.length > 0) {
            for (const img of ans.images) {
                await deleteImageFromCloudinary(img);
            }
        }
    }


    await Answer.deleteMany({ questionId });


    await Like.deleteMany({ target: questionId, targetType: "Question" });

    const tags = question.tags;

    for (const tag of tags) {
        const t = await Tag.findOne({ tag: tag.toLowerCase().trim() });

        if (!t) continue;

        if (t.questions.length === 1) {
            await Tag.deleteOne({ _id: t._id });
        } else {
            t.questions = t.questions.filter(
                (qId) => qId.toString() !== question._id.toString()
            );
            await t.save();
        }
    }

    if (answerIds.length > 0) {
        await Like.deleteMany({ targetType: "Answer", target: { $in: answerIds } });
    }

    await question.deleteOne();

    return res.status(200).json(
        new ApiResponse(200, null, "Question, its answers, images, and related likes/dislikes deleted.")
    );
});



const editTitle = asyncHandler(async (req, res) => {
    const { questionId } = req.params;
    const { title } = req.body;
    if (!questionId) {
        return res.json(new ApiError(400, "Question ID is required."));
    }
    const question = await Question.findById(questionId);
    if (!question) {
        return res.json(new ApiError(404, "Question not found."));
    }
    if (question.owner.toString() != req.user._id.toString()) {
        return res.json(new ApiError(403, "Unauthorized to edit this question."));
    }
    question.title = title || question.title;
    await question.save();
    return res.json(new ApiResponse(200, question, "Question title updated successfully."));
})

const editContent = asyncHandler(async (req, res) => {
    const { questionId } = req.params;
    const { content } = req.body;
    if (!questionId) {
        return res.json(new ApiError(400, "Question ID is required."));
    }
    const question = await Question.findById(questionId);
    if (!question) {
        return res.json(new ApiError(404, "Question not found."));
    }
    if (question.owner.toString() != req.user._id.toString()) {
        return res.json(new ApiError(403, "Unauthorized to edit this question."));
    }
    question.content = content || question.content;
    await question.save();
    return res.json(new ApiResponse(200, question, "Question content updated successfully."));
})


// const addTag = asyncHandler(async (req, res) => {
//     try {
//         const { questionId } = req.params;
//         const { tag } = req.body;

//         if (!questionId || !tag?.trim()) {
//             return res.json(new ApiError(400, "Question ID and tag are required."));
//         }

//         const question = await Question.findById(questionId);
//         if (!question) {
//             return res.json(new ApiError(404, "Question not found."));
//         }

//         if (question.owner.toString() !== req.user._id.toString()) {
//             return res.json(new ApiError(403, "Unauthorized to edit this question."));
//         }


//         const t = await Tag.findOne({ tag: tag.toLowerCase().trim() });
//         if (t) {
//             t.questions.push(question._id);
//             await t.save();
//         } else {

//         }




//         if (!question.tags.includes(tag)) {
//             question.tags.push(tag.trim());
//             await question.save();
//         }

//         return res.json(new ApiResponse(200, question.tags, "Tag added successfully."));

//     } catch (error) {
//         console.log(error);
//         return res.json(
//             new ApiError(500, "Internal server Error")
//         )


//     }
// });


const addTag = asyncHandler(async (req, res) => {
    try {
        const { questionId } = req.params;
        const { tag } = req.body;

        if (!questionId || !tag?.trim()) {
            return res.json(new ApiError(400, "Question ID and tag are required."));
        }

        const formattedTag = tag.toLowerCase().trim();

        const question = await Question.findById(questionId);
        if (!question) {
            return res.json(new ApiError(404, "Question not found."));
        }

        if (question.owner.toString() !== req.user._id.toString()) {
            return res.json(new ApiError(403, "Unauthorized to edit this question."));
        }

        let existingTag = await Tag.findOne({ tag: formattedTag });

        if (existingTag) {
            if (!existingTag.questions.includes(question._id)) {
                existingTag.questions.push(question._id);
                await existingTag.save();
            }
        } else {
            createTag(question._id, formattedTag);
        }

        if (!question.tags.includes(formattedTag)) {
            question.tags.push(formattedTag);
            await question.save();
        }

        return res.json(new ApiResponse(200, question.tags, "Tag added successfully."));
    } catch (error) {
        console.log(error);
        return res.json(new ApiError(500, "Internal server error"));
    }
});

// const deleteTag = asyncHandler(async (req, res) => {
//     try {
//         const { questionId } = req.params;
//         const { tag } = req.body;

//         if (!questionId || !tag?.trim()) {
//             return res.json(new ApiError(400, "Question ID and tag are required."));
//         }

//         const question = await Question.findById(questionId);
//         if (!question) {
//             return res.json(new ApiError(404, "Question not found."));
//         }

//         if (question.owner.toString() !== req.user._id.toString()) {
//             return res.json(new ApiError(403, "Unauthorized to edit this question."));
//         }

//         const originalLength = question.tags.length;
//         question.tags = question.tags.filter(t => t !== tag.trim());

//         if (question.tags.length === originalLength) {
//             return res.json(new ApiError(404, "Tag not found in question."));
//         }

//         await question.save();
//         return res.json(new ApiResponse(200, question.tags, "Tag removed successfully."));
//     } catch (error) {
//         console.log(error);
//         return res.json(
//             new ApiError(500, "Internal server Error")
//         )
//     }
// });

const deleteTag = asyncHandler(async (req, res) => {
    try {
        const { questionId } = req.params;
        const { tag } = req.body;

        if (!questionId || !tag?.trim()) {
            return res.json(new ApiError(400, "Question ID and tag are required."));
        }

        const question = await Question.findById(questionId);
        if (!question) {
            return res.json(new ApiError(404, "Question not found."));
        }

        if (question.owner.toString() !== req.user._id.toString()) {
            return res.json(new ApiError(403, "Unauthorized to edit this question."));
        }

        const cleanedTag = tag.toLowerCase().trim();
        const originalLength = question.tags.length;


        question.tags = question.tags.filter(t => t.toLowerCase().trim() !== cleanedTag);

        if (question.tags.length === originalLength) {
            return res.json(new ApiError(404, "Tag not found in question."));
        }

        await question.save();


        const tagDoc = await Tag.findOne({ tag: cleanedTag });
        if (tagDoc) {
            tagDoc.questions = tagDoc.questions.filter(qId => qId.toString() !== question._id.toString());
            if (tagDoc.questions.length === 0) {
                await tagDoc.deleteOne();
            } else {
                await tagDoc.save();
            }
        }

        return res.json(new ApiResponse(200, question.tags, "Tag removed successfully."));
    } catch (error) {
        console.log(error);
        return res.json(new ApiError(500, "Internal server Error"));
    }
});


const editImages = asyncHandler(async (req, res) => {
    const { questionId } = req.params;
    let { retainImages = [] } = req.body;

    let retainImagesParsed = [];
    try {
        if (typeof retainImages === "string") {
            retainImagesParsed = JSON.parse(retainImages);
        } else if (Array.isArray(retainImages)) {
            retainImagesParsed = retainImages;
        }
    } catch (err) {
        return res.json(new ApiError(400, "Invalid retainImages format."));
    }

    const question = await Question.findById(questionId);
    if (!question) {
        return res.json(new ApiError(404, "Question not found"));
    }

    const imagesToDelete = question.images.filter(
        (img) => !retainImagesParsed.includes(img)
    );

    for (const imgUrl of imagesToDelete) {
        await deleteImageFromCloudinary(imgUrl);
    }

    let updatedImages = retainImagesParsed;
    if (req.files?.image?.length > 0) {
        const newImages = req.files.image.slice(0, 5 - updatedImages.length);
        for (const file of newImages) {
            const uploaded = await uploadOnCloudinary(file.path);
            if (uploaded?.secure_url) {
                updatedImages.push(uploaded.secure_url);
            }
        }
    }

    updatedImages = updatedImages.filter(
        (url) => typeof url === "string" && url.startsWith("http")
    );

    question.images = updatedImages;
    await question.save();

    return res.status(200).json({
        success: true,
        message: "Question images updated successfully.",
        data: question,
    });
});



// const editImages = asyncHandler(async (req, res) => {
//     const { questionId } = req.params;
//     // Correctly handle the already-parsed array from the request body.
//     const retainImages = Array.isArray(req.body?.retainImages) ? req.body.retainImages : [];

//     if (!questionId) {
//         return req.json(
//             new ApiError(400, "Question ID is required.")
//         )
//     }

//     const question = await Question.findById(questionId);
//     if (!question) {
//         return res.json(
//             new ApiError(404, "Question not found.")
//         )
//     }

//     if (question.owner.toString() !== req.user?._id.toString()) {
//         return res.json(
//             new ApiError(403, "Unauthorized to edit this question.")
//         )
//     }

//     const existingImages = question.images || [];
//     const imagesToDelete = existingImages.filter(img => !retainImages.includes(img));

//     // Efficiently delete images in parallel
//     if (imagesToDelete.length > 0) {
//         await Promise.all(imagesToDelete.map(url => deleteImageFromCloudinary(url)));
//     }

//     let updatedImages = [...retainImages];
//     const maxNewUploads = 5 - updatedImages.length;

//     if (req.files?.images && req.files.images.length > 0 && maxNewUploads > 0) {
//         const filesToUpload = req.files.images.slice(0, maxNewUploads);

//         const uploadPromises = filesToUpload.map(file => uploadOnCloudinary(file.path));
//         const uploadResults = await Promise.all(uploadPromises);

//         uploadResults.forEach(uploaded => {
//             if (uploaded?.secure_url) {
//                 updatedImages.push(uploaded.secure_url);
//             }
//         });
//     }

//     if (updatedImages.length > 5) {
//         return res.json(new ApiError(400, "Cannot have more than 5 images per question."));
//     }

//     question.images = updatedImages;
//     await question.save({ validateBeforeSave: false });

//     return res
//         .status(200)
//         .json(new ApiResponse(200, question, "Question images updated successfully."));
// });




const getAllQuestions = asyncHandler(async (req, res) => {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    const questions = await Question.find({})
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("owner", "fullName avatar")
        .select("-answeredBy -images")
        .lean();

    const questionIds = questions.map(q => q._id);

    const [likes, answers] = await Promise.all([
        Like.find({ target: { $in: questionIds }, targetType: "Question" }).lean(),
        Answer.find({ questionId: { $in: questionIds } })
            .populate("owner", "avatar")
            .lean()
    ]);

    const answerMap = {};
    for (const ans of answers) {
        const qId = String(ans.questionId);
        if (!answerMap[qId]) {
            answerMap[qId] = [];
        }
        answerMap[qId].push(ans.owner?.avatar);
    }

    const likeMap = {};
    for (const like of likes) {
        const qId = String(like.target);
        if (!likeMap[qId]) likeMap[qId] = { likes: 0, dislikes: 0 };
        if (like.isLike) likeMap[qId].likes++;
        else likeMap[qId].dislikes++;
    }

    const enriched = questions.map(q => {
        const qId = String(q._id);
        return {
            ...q,
            likes: likeMap[qId]?.likes || 0,
            dislikes: likeMap[qId]?.dislikes || 0,
            answerCount: (answerMap[qId]?.length || 0),
            answerAvatars: answerMap[qId] || []
        };
    });

    return res.json(new ApiResponse(200, enriched, "Questions fetched"));
});

const getUnansweredQuestions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;


        const answeredQuestionIds = await Answer.distinct("questionId");




        const unansweredQuestions = await Question.find({
            _id: { $nin: answeredQuestionIds },
        })
            .sort({ views: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const questionsWithStats = await Promise.all(
            unansweredQuestions.map(async (question) => {
                const [likeCount, dislikeCount, owner] = await Promise.all([
                    Like.countDocuments({
                        target: question._id,
                        targetType: "Question",
                        isLike: true,
                    }),
                    Like.countDocuments({
                        target: question._id,
                        targetType: "Question",
                        isLike: false,
                    }),
                    User.findById(question.owner).select("fullName avatar").lean(),
                ]);

                return {
                    _id: question._id,
                    title: question.title,
                    content: question.content,
                    tags: question.tags,
                    views: question.views || 0,
                    createdAt: question.createdAt,
                    likeCount,
                    dislikeCount,
                    owner: {
                        _id: owner._id,
                        fullName: owner.fullName,
                        avatar: owner.avatar,
                    },
                };
            })
        );

        const totalUnanswered = await Question.countDocuments({
            _id: { $nin: answeredQuestionIds },
        });

        res.status(200).json({
            success: true,
            currentPage: page,
            totalPages: Math.ceil(totalUnanswered / limit),
            totalUnanswered,
            questions: questionsWithStats,
        });
    } catch (error) {
        console.error("Error fetching unanswered questions:", error);
        res.status(500).json(
            new ApiError(500, "Internal Server Error")
        );
    }
};



export { postQuestion, deleteQuestion, getQuestionDetails, editContent, editImages, deleteTag, addTag, editTitle, getAllQuestions, getUnansweredQuestions };
