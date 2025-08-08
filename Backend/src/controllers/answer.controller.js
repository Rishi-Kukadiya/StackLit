// import { asyncHandler } from "../utils/asyncHandler.js";
// import { ApiError } from "../utils/ApiError.js";
// import { ApiResponse } from "../utils/ApiResponse.js";
// import uploadOnCloudinary, { deleteImageFromCloudinary } from "../utils/cloudinary.js";
// import { Answer } from "../models/answer.model.js";
// import { Question } from "../models/question.model.js";
// import { Like } from "../models/like.model.js";



// const postAnswer = asyncHandler(async (req, res) => {
//     try {
//         const { questionId, content, tags } = req.body;

//         if (!questionId) {
//             return res.json(new ApiError(400, " Question is required for posting answer!"));
//         }

//         const question = await Question.findById(questionId);
//         if (!question) {
//             return res.json(new ApiError(400, " Question with this Id doesn't exists"));
//         }

//         const avatar = req.user?.avatar;
//         if (!question.answeredBy.includes(avatar)) {
//             question.answeredBy.push(avatar);
//             await question.save();
//         }

//         if (!content) {
//             return res.json(new ApiError(400, "Content of answer is required!"));
//         }
//         if (!req.user) {
//             return res.json(new ApiError(403, "Unauthorized request"));
//         }

//         let imageUrls = [];

//         if (req.files && req.files.image && req.files.image.length > 0) {
//             const files = req.files.image.slice(0, 5);

//             for (const file of files) {
//                 const uploadedImage = await uploadOnCloudinary(file.path);
//                 if (uploadedImage?.secure_url) {
//                     imageUrls.push(uploadedImage.secure_url);
//                 }
//             }

//             if (imageUrls.length === 0) {
//                 return res.json(new ApiError(500, "Error while uploading images on Cloudinary"));
//             }
//         }

//         let parsedTags = [];
//         if (tags) {
//             parsedTags = tags.split(',').map(t => t.trim());
//         }

//         const answer = await Answer.create({
//             questionId,
//             content,
//             owner: req.user?._id,
//             images: imageUrls,
//             tags: parsedTags
//         });

//         if (!answer) {
//             return res.json(new ApiError(500, "Error while posting Answer"));
//         }

//         return res.json(
//             new ApiResponse(201, answer, "Answer posted successfully")
//         );
//     } catch (error) {
//         console.log(error.message);
//         return res.json(
//             new ApiError(500, "Error while posting answer")
//         );
//     }
// });





// [CHANGED BY GITHUB COPILOT]
// Added real-time notification emission for answer actions
// - Notifies question owner when someone answers their question
// - Notifies all users who previously answered the question (except current user and question owner)
// - Changes made: lines 49-81

// filepath: e:\MERN-projects\stacklt\StackLit\Backend\src\controllers\answer.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary, { deleteImageFromCloudinary } from "../utils/cloudinary.js";
import { Answer } from "../models/answer.model.js";
import { Question } from "../models/question.model.js";
import { Like } from "../models/like.model.js";
import { Notification } from "../models/notification.model.js"; // Added for notification

// const postAnswer = asyncHandler(async (req, res) => {
//     try {
//         const { questionId, content, tags } = req.body;

//         if (!questionId) {
//             return res.json(new ApiError(400, " Question is required for posting answer!"));
//         }

//         const question = await Question.findById(questionId);
//         if (!question) {
//             return res.json(new ApiError(400, " Question with this Id doesn't exists"));
//         }

//         const avatar = req.user?.avatar;
//         if (!question.answeredBy.includes(avatar)) {
//             question.answeredBy.push(avatar);
//             await question.save();
//         }

//         if (!content) {
//             return res.json(new ApiError(400, "Content of answer is required!"));
//         }
//         if (!req.user) {
//             return res.json(new ApiError(403, "Unauthorized request"));
//         }

//         let imageUrls = [];

//         if (req.files && req.files.image && req.files.image.length > 0) {
//             const files = req.files.image.slice(0, 5);

//             for (const file of files) {
//                 const uploadedImage = await uploadOnCloudinary(file.path);
//                 if (uploadedImage?.secure_url) {
//                     imageUrls.push(uploadedImage.secure_url);
//                 }
//             }

//             if (imageUrls.length === 0) {
//                 return res.json(new ApiError(500, "Error while uploading images on Cloudinary"));
//             }
//         }

//         let parsedTags = [];
//         if (tags) {
//             parsedTags = tags.split(',').map(t => t.trim());
//         }

//         const answer = await Answer.create({
//             questionId,
//             content,
//             owner: req.user?._id,
//             images: imageUrls,
//             tags: parsedTags
//         });

//         if (!answer) {
//             return res.json(new ApiError(500, "Error while posting Answer"));
//         }

//         // --- Copilot: Notification logic for answer posting ---
//         const io = req.app.get("io");
//         const connectedUsers = req.app.get("connectedUsers");

//         // Notify question owner if not the same as answer owner
//         if (question.owner.toString() !== req.user._id.toString()) {
//             const notification = await Notification.create({
//                 sender: req.user._id,
//                 receiver: question.owner,
//                 type: "answer",
//                 question: question._id,
//                 answer: answer._id
//             });
//             if (io && connectedUsers) {
//                 const receiverSocketId = connectedUsers.get(question.owner.toString());
//                 if (receiverSocketId) {
//                     io.to(receiverSocketId).emit("new_notification", {
//                         ...notification.toObject(),
//                         sender: { _id: req.user._id, fullName: req.user.fullName }
//                     });
//                 }
//             }
//         }

//         // Notify previous answerers (excluding current user and question owner)
//         const previousAnswers = await Answer.find({ questionId: question._id }).distinct("owner");
//         for (const userId of previousAnswers) {
//             if (
//                 userId.toString() !== req.user._id.toString() &&
//                 userId.toString() !== question.owner.toString()
//             ) {
//                 const notification = await Notification.create({
//                     sender: req.user._id,
//                     receiver: userId,
//                     type: "answer_on_answer",
//                     question: question._id,
//                     answer: answer._id
//                 });
//                 if (io && connectedUsers) {
//                     const receiverSocketId = connectedUsers.get(userId.toString());
//                     if (receiverSocketId) {
//                         io.to(receiverSocketId).emit("new_notification", {
//                             ...notification.toObject(),
//                             sender: { _id: req.user._id, fullName: req.user.fullName }
//                         });
//                         console.log("Emitted notification to previous answerer:", userId.toString(), receiverSocketId);
//                     }
//                 }
//             }
//         }
//         // --- Copilot: End notification logic ---

//         return res.json(
//             new ApiResponse(201, answer, "Answer posted successfully")
//         );
//     } catch (error) {
//         console.log(error.message);
//         return res.json(
//             new ApiError(500, "Error while posting answer")
//         );
//     }
// });

const postAnswer = asyncHandler(async (req, res) => {
    try {
        const { questionId, content, tags } = req.body;

        if (!questionId || !content || !req.user) {
            return res.json(new ApiError(400, "Question ID, content, and authentication required."));
        }

        const question = await Question.findById(questionId);
        if (!question) {
            return res.json(new ApiError(400, "Question not found."));
        }

        const avatar = req.user?.avatar;
        if (!question.answeredBy.includes(avatar)) {
            question.answeredBy.push(avatar);
            await question.save();
        }

        let imageUrls = [];
        if (req.files?.image?.length > 0) {
            const files = req.files.image.slice(0, 5);
            for (const file of files) {
                const uploaded = await uploadOnCloudinary(file.path);
                if (uploaded?.secure_url) imageUrls.push(uploaded.secure_url);
            }
            if (imageUrls.length === 0) {
                return res.json(new ApiError(500, "Image upload failed."));
            }
        }

        const parsedTags = tags ? tags.split(',').map(tag => tag.trim()) : [];

        const answer = await Answer.create({
            questionId,
            content,
            owner: req.user._id,
            images: imageUrls,
            tags: parsedTags
        });

        if (!answer) return res.json(new ApiError(500, "Failed to post answer."));

        // --- Notification Logic Starts Here ---
        const io = req.app.get("io");
        const connectedUsers = req.app.get("connectedUsers");

        // 1. Notify the question owner if not the one answering
        if (question.owner.toString() !== req.user._id.toString()) {
            const notifyQuestionOwner = await Notification.create({
                sender: req.user._id,
                receiver: question.owner,
                type: "answer",
                question: question._id,
                answer: answer._id
            });

            const socketId = connectedUsers.get(question.owner.toString());
            if (socketId) {
                io.to(socketId).emit("new_notification", {
                    ...notifyQuestionOwner.toObject(),
                    sender: {
                        _id: req.user._id,
                        fullName: req.user.fullName,
                        avatar: req.user.avatar
                    }
                });
            }
        }

        // 2. Notify previous answerers (excluding current user and question owner)
        const previousAnswererIds = await Answer.find({ questionId })
            .distinct("owner");

        const notifiedSet = new Set();
        for (const userId of previousAnswererIds) {
            const idStr = userId.toString();
            if (
                idStr !== req.user._id.toString() &&
                idStr !== question.owner.toString() &&
                !notifiedSet.has(idStr)
            ) {
                notifiedSet.add(idStr);

                const notifyPrevAnswerer = await Notification.create({
                    sender: req.user._id,
                    receiver: userId,
                    type: "relatedAnswer",
                    question: question._id,
                    answer: answer._id
                });

                const socketId = connectedUsers.get(idStr);
                if (socketId) {
                    io.to(socketId).emit("new_notification", {
                        ...notifyPrevAnswerer.toObject(),
                        sender: {
                            _id: req.user._id,
                            fullName: req.user.fullName,
                            avatar: req.user.avatar
                        }
                    });
                }
            }
        }

        // --- End Notification Logic ---

        return res.json(
            new ApiResponse(201, answer, "Answer posted successfully")
        );

    } catch (error) {
        console.log("Post answer error:", error.message);
        return res.json(new ApiError(500, "Internal server error."));
    }
});


const getAnswerDetails = asyncHandler(async (req, res) => {
    const { answerId } = req.params;

    if (!answerId) {
        return res.json(new ApiError(400, "Answer ID is required"));
    }


    const answer = await Answer.findById(answerId).lean();

    if (!answer) {
        return res.json(new ApiError(404, "Answer not found"));
    }

    const answerLikes = await Like.find({ target: answerId, targetType: "Answer" }).lean();
    const likes = answerLikes.filter(l => l.isLike).length;
    const dislikes = answerLikes.filter(l => !l.isLike).length;

    const question = await Question.findById(answer.questionId).lean();
    const questionLikes = await Like.find({ target: answer.questionId, targetType: "Question" }).lean();
    const likesForQuestion = questionLikes.filter(l => l.isLike).length;
    const dislikesForQuestion = questionLikes.filter(l => !l.isLike).length;

    if (!question) {
        return res.json(new ApiError(404, "Related question not found"));
    }

    return res.json(
        new ApiResponse(200, {
            answer: {
                ...answer,
                likes,
                dislikes
            },
            question: {
                ...question,
                likes: likesForQuestion,
                dislikes: dislikesForQuestion
            }
        }, "Answer and related question fetched successfully")
    );
});




// const deleteAnswer = asyncHandler(async (req, res) => {

//     const { answerId } = req.params;
//     if (!answerId) {
//         return res.json(new ApiError(400, "Answer ID is required."));
//     }
//     const answer = await Answer.findById(answerId);
//     if (!answer) {
//         return res.json(new ApiError(404, "Answer not found"));
//     }
//     if (answer.owner.toString() !== req?.user?._id.toString()) {
//         return res.json(new ApiError(403, "You are not authorized to delete this question."));
//     }

//     const response = await Answer.findByIdAndDelete(answer._id);
//     await Like.deleteMany({ target: answerId, targetType: "Answer" });
//     if (!response) {
//         return res.json(new ApiError(500, "Error while deleting Answer"));
//     }

//     return res.status(200).json(
//         new ApiResponse(200, null, "Answer and related likes/dislikes deleted.")
//     );


// })


const deleteAnswer = asyncHandler(async (req, res) => {
    try {
        const { answerId } = req.params;

        if (!answerId) {
            return res.json(new ApiError(400, "Answer ID is required."))
        }

        const answer = await Answer.findById(answerId);

        if (!answer) {
            return res.json(new ApiError(404, "Answer not found"))
        }

        if (answer.owner.toString() !== req?.user?._id.toString()) {
            return res.json(new ApiError(403, "You are not authorized to delete this answer."))
        }

        if (answer.images && answer.images.length > 0) {
            const deletionPromises = answer.images.map((imageUrl) =>
                deleteImageFromCloudinary(imageUrl)
            );
            await Promise.all(deletionPromises);
        }

        await Answer.findByIdAndDelete(answerId);


        await Like.deleteMany({ target: answerId, targetType: "Answer" });

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Answer and all associated data deleted successfully."
                )
            );
    } catch (error) {
        console.log(error);
        return res.json(
            new ApiError(500, "Error while deleting answer")
        )


    }
});


const editContent = asyncHandler(async (req, res) => {
    try {
        const { answerId } = req.params;
        const { content } = req.body;
        if (!answerId) {
            return res.json(new ApiError(400, "Answer ID is required."));
        }
        const answer = await Answer.findById(answerId);
        if (!answer) {
            return res.json(new ApiError(404, "Answer not found."));
        }
        if (answer.owner.toString() != req.user._id.toString()) {
            return res.json(new ApiError(403, "Unauthorized to edit this answer."));
        }
        answer.content = content || answer.content;
        await answer.save();
        return res.json(new ApiResponse(200, answer, "Answer content updated successfully."));
    } catch (error) {
        console.log(error);
        return res.json(
            new ApiError(500, "Error while updating content of Answer.")
        )

    }
})

const addTag = asyncHandler(async (req, res) => {
    try {
        const { answerId } = req.params;
        const { tag } = req.body;

        if (!answerId || !tag?.trim()) {
            return res.json(new ApiError(400, "Answer ID and tag are required."));
        }

        const answer = await Answer.findById(answerId);
        if (!answer) {
            return res.json(new ApiError(404, "Answer not found."));
        }

        if (answer.owner.toString() !== req.user._id.toString()) {
            return res.json(new ApiError(403, "Unauthorized to edit this answer."));
        }

        if (!answer.tags.includes(tag.trim())) {
            answer.tags.push(tag.trim());
        }
        await answer.save();

        return res.json(new ApiResponse(200, answer.tags, "Tag added successfully."));
    } catch (error) {
        console.log(error);
        return res.json(
            new ApiError(500, "Internal server error")
        )


    }
});


const deleteTag = asyncHandler(async (req, res) => {
    try {
        const { answerId } = req.params;
        const { tag } = req.body;

        if (!answerId || !tag?.trim()) {
            return res.json(new ApiError(400, "Answer ID and tag are required."));
        }

        const answer = await Answer.findById(answerId);
        if (!answer) {
            return res.json(new ApiError(404, "Answer not found."));
        }

        if (answer.owner.toString() !== req.user._id.toString()) {
            return res.json(new ApiError(403, "Unauthorized to edit this answer."));
        }

        const tagToRemove = tag.trim();
        const originalLength = answer.tags.length;
        answer.tags = answer.tags.filter(t => t !== tagToRemove);

        if (answer.tags.length === originalLength) {
            return res.json(new ApiError(404, "Tag not found in answer."));
        }

        await answer.save();
        return res.json(new ApiResponse(200, answer.tags, "Tag removed successfully."));
    } catch (error) {
        console.log(error);
        return res.json(new ApiError(500, "Internal server error"));
    }
});

const editImages = asyncHandler(async (req, res) => {
    const { answerId } = req.params;
    let { retainImages = [] } = req?.body;

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

    const answer = await Answer.findById(answerId);
    if (!answer) {
        return res.json(new ApiError(404, "Answer not found"));
    }

    const imagesToDelete = answer.images.filter(
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

    answer.images = updatedImages;
    await answer.save();

    return res.status(200).json({
        success: true,
        message: "Question images updated successfully.",
        data: answer,
    });
});

export { postAnswer, deleteAnswer, getAnswerDetails, editContent, addTag, deleteTag, editImages };
