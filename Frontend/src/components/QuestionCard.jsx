import { Tag, Clock, ThumbsUp, MessageCircle, ThumbsDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import avtart from "../assets/avtart.jpg";
import { useState } from "react";
import ErrorPopup from "./ErrorPopup";
import { useUser } from "./UserContext";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from "axios";
export default function QuestionCard({ question }) {
  function decodeHTMLEntities(text) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  }

  function renderFormattedContent(content, maxLines = 2) {
    if (!content) return null;

    let processedContent = decodeHTMLEntities(content);

    // If content contains <pre><code>...</code></pre> or ``` blocks, handle code blocks
    const codeBlockRegex =
      /(```[\w\s]*?\n[\s\S]*?```)|(<pre><code>[\s\S]*?<\/code><\/pre>)/g;
    const parts = processedContent.split(codeBlockRegex);

    let lineCount = 0;
    const formattedParts = parts
      .map((part, index) => {
        if (!part) return null;

        // Markdown-style code block
        if (part.startsWith("```") && part.endsWith("```")) {
          const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
          if (match) {
            const language = match[1] || "cpp";
            const code = match[2].trim();
            return (
              <div key={`code-block-${index}`} className="my-2">
                <SyntaxHighlighter
                  language={language}
                  style={atomDark}
                  customStyle={{
                    background: "#2E236C",
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    border: "1px solid rgba(67, 61, 139, 0.3)",
                    fontSize: "0.8rem",
                    margin: "0",
                    maxHeight: "120px",
                    overflow: "hidden",
                  }}
                  wrapLongLines={true}
                  showLineNumbers={false}
                  codeTagProps={{
                    style: {
                      fontFamily:
                        'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                    },
                  }}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            );
          }
        }
        // HTML-style code block
        if (part.startsWith("<pre><code>") && part.endsWith("</code></pre>")) {
          const codeMatch = part.match(/<pre><code>([\s\S]*?)<\/code><\/pre>/);
          if (codeMatch) {
            const code = codeMatch[1].trim();
            return (
              <div key={`code-block-${index}`} className="my-2">
                <SyntaxHighlighter
                  language="cpp"
                  style={atomDark}
                  customStyle={{
                    background: "#2E236C",
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    border: "1px solid rgba(67, 61, 139, 0.3)",
                    fontSize: "0.8rem",
                    margin: "0",
                    maxHeight: "120px",
                    overflow: "hidden",
                  }}
                  wrapLongLines={true}
                  showLineNumbers={false}
                  codeTagProps={{
                    style: {
                      fontFamily:
                        'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                    },
                  }}
                >
                  {code}
                </SyntaxHighlighter>
              </div>
            );
          }
        }
        // For all other HTML, render as HTML (supports bold, italic, underline, headings, lists, quotes, etc.)
        // Limit to maxLines for preview
        const lines = part.split("\n");
        if (lineCount >= maxLines) return null;
        const linesToShow = lines.slice(0, maxLines - lineCount);
        lineCount += linesToShow.length;
        return (
          <div
            key={`text-block-${index}`}
            className="prose prose-invert max-w-none
          prose-p:text-[#C8ACD6] prose-p:my-2
          prose-strong:text-white prose-strong:font-semibold
          prose-em:text-[#C8ACD6] prose-em:italic
          prose-u:underline prose-u:text-[#C8ACD6]
          prose-blockquote:border-l-4 prose-blockquote:border-[#C8ACD6] prose-blockquote:pl-4 prose-blockquote:text-[#C8ACD6]
          prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h1:text-white prose-h2:text-white prose-h3:text-white
          prose-li:marker:text-[#C8ACD6] prose-code:text-[#C8ACD6] prose-code:bg-[#2E236C]/50
          prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-transparent prose-pre:p-0"
            dangerouslySetInnerHTML={{ __html: linesToShow.join("<br/>") }}
          />
        );
      })
      .filter(Boolean);

    return <div className="space-y-1">{formattedParts}</div>;
  }
  const [liked, setLiked] = useState(
    localStorage.getItem(`${question._id}_liked`) === "like"
  );
  const [disliked, setDisliked] = useState(
    localStorage.getItem(`${question._id}_liked`) === "dislike"
  );
  const [likesCount, setLikesCount] = useState(question.likes || 0);
  const [dislikesCount, setDislikesCount] = useState(question.dislikes || 0);
  const [loadingReaction, setLoadingReaction] = useState(false);
  const { user } = useUser();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAnswer = (e) => {
    e.stopPropagation();
    navigate("/answer", {
      state: {
        questionId: question._id,
        questionTitle: question.title,
        ownerAvatar: question.owner?.avatar || avtart,
        ownerName:
          (question.owner?.fullName?.split("@")[0]?.substring(0, 5) ||
            "Anonymous") + "...",
      },
    });
  };

  const handleLike = async (e) => {
    e.stopPropagation();

    if (!user) {
      setError("Please Login for posting  your answer!!");
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
        localStorage.removeItem(`${question._id}_liked`);
      } else {
        // Add like
        setLiked(true);
        setDisliked(false);
        setLikesCount((prev) => prev + 1);
        if (disliked) setDislikesCount((prev) => prev - 1);
        localStorage.setItem(`${question._id}_liked`, "like");
      }

      await axios.post(
        `${import.meta.env.VITE_SERVER}/likes/toggle-like`,
        {
          targetId: question?._id,
          targetType: "Question",
          isLike: true,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.error("Failed to react:", err);
      setError("Failed to react");
    } finally {
      setLoadingReaction(false);
    }
  };

  const handleDislike = async (e) => {
    e.stopPropagation();

    if (!user) {
      setError("You must be logged in to react.");
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
        localStorage.removeItem(`${question._id}_liked`);
      } else {
        setDisliked(true);
        setLiked(false);
        setDislikesCount((prev) => prev + 1);
        if (liked) setLikesCount((prev) => prev - 1);
        localStorage.setItem(`${question._id}_liked`, "dislike");
      }

      await axios.post(
        `${import.meta.env.VITE_SERVER}/likes/toggle-like`,
        {
          targetId: question?._id,
          targetType: "Question",
          isLike: false,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      console.error("Failed to react:", err);
      setError("Failed to react");
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
    <>
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
            onClick={handleAnswer}
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
        {/* <p className="text-[#C8ACD6] mb-4 line-clamp-2">{truncatedContent}</p> */}
        <div className="text-[#C8ACD6] mb-4 line-clamp-2">
          {renderFormattedContent(question.content, 2)}
        </div>

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
                      ? "bg-white text-green-500"
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

                <span
                  className="text-white text-center font-medium min-w-[2rem]"
                  onClick={handleDislike}
                >
                  {dislikesCount}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {question.tags.slice(0, 3).map((tag , index) => (
                  <span
                    key={index}
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
            {question.answerAvatars?.length > 0 && (
              <div className="flex items-center ml-auto">
                <div className="flex -space-x-2">
                  {question.answerAvatars.slice(0, 3).map((answerer , index) => (
                    <img
                      key={index}
                      src={answerer || avtart}
                      alt={"User"}
                      className="w-8 h-8 rounded-full border-2 border-[#2E236C] 
                               hover:border-[#C8ACD6]/50 transition-all duration-300
                               shadow-[0_0_10px_rgba(200,172,214,0.1)]"
                    />
                  ))}
                </div>
                <span className="ml-3 text-[#C8ACD6] text-sm">
                  {question.answerAvatars.length} answers
                </span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      {error && <ErrorPopup message={error} onClose={() => setError("")} />}
    </>
  );
}
