import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import axios from "axios";
import ErrorPopup from "./ErrorPopup";

export default function LikeDislikeBar({
  targetId, // answer._id in this case
  likes: initialLikes,
  dislikes: initialDislikes,
  user,
  onUpdate, // function (likes, dislikes) => void
  loadingExternal, // optional: parent-driven loading spinner
  targetType = "Answer", // or "Question"
}) {
  // State for counts
  const [likesCount, setLikesCount] = useState(initialLikes || 0);
  const [dislikesCount, setDislikesCount] = useState(initialDislikes || 0);


  // State for 'did the user like/dislike THIS answer' (use unique key per answer!)
  const [liked, setLiked] = useState(
    localStorage.getItem(`${targetId}_liked`) === "like"
  );
  const [disliked, setDisliked] = useState(
    localStorage.getItem(`${targetId}_liked`) === "dislike"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ensure state stays in sync with parent updates
  useEffect(() => {
    setLikesCount(initialLikes || 0);
    setDislikesCount(initialDislikes || 0);
  }, [initialLikes, initialDislikes, targetId]);

  // Like handler
  const handleLike = async (e) => {
    e.stopPropagation();
    if (!user) {
      setError("Please login to like answers.");
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (loading || loadingExternal) return;
    setLoading(true);
    let newLikes = likesCount;
    let newDislikes = dislikesCount;
    try {
      if (liked) {
        newLikes--;
        setLiked(false);
        localStorage.removeItem(`${targetId}_liked`);
      } else {
        newLikes++;
        setLiked(true);
        localStorage.setItem(`${targetId}_liked`, "like");
        if (disliked) {
          newDislikes--;
          setDisliked(false);
        }
      }
      setLikesCount(newLikes);
      setDislikesCount(newDislikes);
      onUpdate && onUpdate(newLikes, newDislikes); // Let parent know

      // API Call
      await axios.post(
        `${import.meta.env.VITE_SERVER}/likes/toggle-like`,
        {
          targetId,
          targetType,
          isLike: true,
        },
        { withCredentials: true }
      );
    } catch (err) {
      console.error(err);
      setError("Could not react.");
    } finally {
      setLoading(false);
    }
  };

  // Dislike handler
  const handleDislike = async (e) => {
    e.stopPropagation();
    if (!user) {
      setError("Please login to dislike answers.");
      setTimeout(() => setError(""), 2000);
      return;
    }
    if (loading || loadingExternal) return;
    setLoading(true);
    let newLikes = likesCount;
    let newDislikes = dislikesCount;
    try {
      if (disliked) {
        newDislikes--;
        setDisliked(false);
        localStorage.removeItem(`${targetId}_liked`);
      } else {
        newDislikes++;
        setDisliked(true);
        localStorage.setItem(`${targetId}_liked`, "dislike");
        if (liked) {
          newLikes--;
          setLiked(false);
        }
      }
      setLikesCount(newLikes);
      setDislikesCount(newDislikes);
      onUpdate && onUpdate(newLikes, newDislikes);

      // API Call
      await axios.post(
        `${import.meta.env.VITE_SERVER}/likes/toggle-like`,
        {
          targetId,
          targetType,
          isLike: false,
        },
        { withCredentials: true }
      );
    } catch (err) {
      setError("Could not react.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center gap-3 bg-[#2E236C]/30 p-2 rounded-lg 
    border border-[#433D8B]/20 group-hover:border-[#C8ACD6]/30"
      onClick={(e) => e.stopPropagation()}
    >
      <motion.button
        whileTap={{ scale: 1.2 }}
        className={`p-1.5 rounded-full transition-colors duration-300 ${
          liked
            ? "bg-white text-green-500"
            : "text-[#C8ACD6] hover:text-white hover:bg-green-400/10"
        }`}
        onClick={handleLike}
        disabled={loading || loadingExternal}
      >
        <motion.div
          animate={
            (loading || loadingExternal) && liked ? { scale: [1, 1.3, 1] } : {}
          }
          transition={{ duration: 0.3 }}
        >
          <ThumbsUp className="w-5 h-5" />
        </motion.div>
      </motion.button>
      <span
        className="text-white text-center font-medium min-w-[2rem]"
        onClick={handleLike}
      >
        {likesCount}
      </span>
      <motion.button
        whileTap={{ scale: 1.2 }}
        className={`p-1.5 rounded-full transition-colors duration-300 ${
          disliked
            ? "bg-white text-red-500"
            : "text-[#C8ACD6] hover:text-white hover:bg-red-400/10"
        }`}
        onClick={handleDislike}
        disabled={loading || loadingExternal}
      >
        <motion.div
          animate={
            (loading || loadingExternal) && disliked
              ? { scale: [1, 1.3, 1] }
              : {}
          }
          transition={{ duration: 0.3 }}
        >
          <ThumbsDown className="w-5 h-5" />
        </motion.div>
      </motion.button>
      <span
        className="text-white text-center font-medium min-w-[2rem]"
        onClick={handleDislike}
      >
        {dislikesCount}
      </span>
      {/* {error && (
        <span className="text-xs text-red-400 ml-3">{error}</span>
      )} */}
      {error && <ErrorPopup message={error} onClose={() => setError("")} />}
    </div>
  );
}
