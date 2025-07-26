import { Tag, Clock, ThumbsUp, MessageCircle, ThumbsDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import avtart from "../assets/avtart.jpg";
import { useState } from "react";
import ErrorPopup from "./ErrorPopup";
import { useUser } from "./UserContext";
import axios from "axios";
export default function QuestionCard({ question }) {
  const [liked, setLiked] = useState(question.userReaction === "like");
  const [disliked, setDisliked] = useState(question.userReaction === "dislike");
  const [likesCount, setLikesCount] = useState(question.likes || 0);
  const [dislikesCount, setDislikesCount] = useState(question.dislikes || 0);
  const [loadingReaction, setLoadingReaction] = useState(false);
  const { user } = useUser();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleLike = async (e) => {
    e.stopPropagation();
    // Check if user is logged in
    if (!user) {
      setError("You must be logged in to ask a question.");
      setTimeout(() => {
        setError("");
        navigate("/signin");
      }, 2000);
      return;
    }

    if (loadingReaction) return;

    setLoadingReaction(true);
    try {
      if (liked) {
        setLiked(false);
        setLikesCount((prev) => prev - 1);

        const formdata = new FormData();
        formdata.append("targetId", question._id);
        formdata.append("targetType", "Question");
        formdata.append("isLike", false);

        await axios.post(
          `${import.meta.env.VITE_SERVER}/likes/toggle-like`,
          formdata,
          { withCredentials: true }
        );
      } else {
        setLiked(true);
        setDisliked(false);
        setLikesCount((prev) => prev + 1);
        if (disliked) setDislikesCount((prev) => prev - 1);

        const formdata = new FormData();
        formdata.append("targetId", question._id);
        formdata.append("targetType", "Question");
        formdata.append("isLike", true);

        await axios.post(
          `${import.meta.env.VITE_SERVER}/likes/toggle-like`,
          formdata,
          { withCredentials: true }
        );
      }
    } catch (err) {
      setError("Failed to react:", err);
    } finally {
      setLoadingReaction(false);
    }
  };

  const handleDislike = async (e) => {
    e.stopPropagation();
    // Check if user is logged in
    if (!user) {
      setError("You must be logged in to ask a question.");
      setTimeout(() => {
        setError("");
        navigate("/signin");
      }, 2000);
      return;
    }

    if (loadingReaction) return;

    setLoadingReaction(true);
    try {
      if (disliked) {
        setDisliked(false);
        setDislikesCount((prev) => prev - 1);

        const formdata = new FormData();
        formdata.append("targetId", question._id);
        formdata.append("targetType", "Question");
        formdata.append("isLike", true);

        await axios.post(
          `${import.meta.env.VITE_SERVER}/likes/toggle-like`,
          formdata,
          { withCredentials: true }
        );
      } else {
        setDisliked(true);
        setLiked(false);
        setDislikesCount((prev) => prev + 1);
        if (liked) setLikesCount((prev) => prev - 1);

        const formdata = new FormData();
        formdata.append("targetId", question._id);
        formdata.append("targetType", "Question");
        formdata.append("isLike", false);

        await axios.post(
          `${import.meta.env.VITE_SERVER}/likes/toggle-like`,
          formdata,
          { withCredentials: true }
        );
      }
    } catch (err) {
      console.error("Failed to react:", err);
    } finally {
      setLoadingReaction(false);
    }
  };

  if (!question) {
    console.error("Question prop is undefined");
    return null;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncatedContent = question.content
    ? question.content.split("```")[0].slice(0, 200) + "..."
    : "";

  const cardVariants = {
    initial: {
      scale: 1,
      opacity: 1,
    },
    exit: {
      scale: 1.05,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const handleClick = () => {
    navigate(`/question/${question._id}`);
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      exit="exit"
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
      className="relative bg-transparent rounded-lg p-4 sm:p-6 cursor-pointer 
                transform transition-all duration-300 ease-in-out hover:scale-101
                border-2 border-[#C8ACD6]/30 hover:border-[#C8ACD6]/50
                flex flex-col w-full group overflow-hidden
                shadow-[0_0_15px_rgba(200,172,214,0.2)]"
    >
      {/* Author Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <img
            // src={question.author.profilePhoto}
            src={question.owner?.avatar || avtart}
            alt={question.owner?.owner}
            className="w-8 h-8 rounded-full border-2 border-[#C8ACD6] hover:border-white transition-colors"
          />
          <span className="text-white font-medium">
            {question.owner?.fullName}
          </span>
        </div>
        <div className="flex justify-start gap-4">
          <span className="text-[#C8ACD6] text-sm flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {formatDate(question.createdAt)}
          </span>
        </div>
        {/* Post Answer Button */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 bg-[#2E236C]/40 
                    hover:bg-[#2E236C]/60 text-[#C8ACD6] hover:text-white 
                    transition-all duration-300 rounded-lg
                    border border-[#433D8B]/30 hover:border-[#C8ACD6]/50
                    shadow-sm hover:shadow-[0_0_10px_rgba(200,172,214,0.2)]"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Answer</span>
        </button>
      </div>

      {/* Question Title */}
      <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
        {question.title}
      </h2>

      {/* Truncated Content */}
      <p className="text-[#C8ACD6] mb-4 line-clamp-2">{truncatedContent}</p>

      {/* Footer Section */}
      <div className="pt-4 border-t border-[#433D8B]/50">
        {/* Interaction Section */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Votes */}

            <div
              className="flex items-center gap-3 bg-[#2E236C]/30 p-2 rounded-lg 
    border border-[#433D8B]/20 group-hover:border-[#C8ACD6]/30"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                whileTap={{ scale: 1.2 }}
                className={`p-1.5 rounded-full transition-colors duration-300 ${
                  liked
                    ? "bg-green-500/20 text-green-300"
                    : "text-[#C8ACD6] hover:text-white hover:bg-green-400/10"
                }`}
                onClick={handleLike}
              >
                <motion.div
                  animate={
                    loadingReaction && liked ? { scale: [1, 1.3, 1] } : {}
                  }
                  transition={{ duration: 0.3 }}
                >
                  <ThumbsUp className="w-5 h-5" />
                </motion.div>
              </motion.button>

              <span className="text-white text-center font-medium min-w-[2rem]">
                {likesCount}
              </span>

              <motion.button
                whileTap={{ scale: 1.2 }}
                className={`p-1.5 rounded-full transition-colors duration-300 ${
                  disliked
                    ? "bg-red-500/20 text-red-300"
                    : "text-[#C8ACD6] hover:text-white hover:bg-red-400/10"
                }`}
                onClick={handleDislike}
              >
                <motion.div
                  animate={
                    loadingReaction && disliked ? { scale: [1, 1.3, 1] } : {}
                  }
                  transition={{ duration: 0.3 }}
                >
                  <ThumbsDown className="w-5 h-5" />
                </motion.div>
              </motion.button>

              <span className="text-white text-center font-medium min-w-[2rem]">
                {dislikesCount}
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {question.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-2 px-3 py-2 bg-[#2E236C]/30 text-[#C8ACD6] 
                             rounded-lg text-sm border border-[#433D8B]/20 
                             hover:border-[#C8ACD6]/30 hover:text-white 
                             transition-all duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Tag className="w-4 h-4" />
                  {tag}
                </span>
              ))}
              {question.tags.length > 3 && (
                <span className="text-[#C8ACD6] text-sm px-2 py-2">
                  +{question.tags.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Answerers Preview - Right Side */}
          {question.answerers?.length > 0 && (
            <div className="flex items-center ml-auto">
              <div className="flex -space-x-2">
                {question.answerers.slice(0, 3).map((answerer) => (
                  <img
                    key={answerer.id}
                    src={answerer.profilePhoto}
                    alt={answerer.username}
                    className="w-8 h-8 rounded-full border-2 border-[#2E236C] 
                               hover:border-[#C8ACD6]/50 transition-all duration-300
                               shadow-[0_0_10px_rgba(200,172,214,0.1)]"
                    title={answerer.username}
                  />
                ))}
              </div>
              <span className="ml-3 text-[#C8ACD6] text-sm">
                {question.answerers.length} answers
              </span>
            </div>
          )}
        </div>
      </div>
      {error && <ErrorPopup message={error} onClose={() => setError("")} />}
    </motion.div>
  );
}
