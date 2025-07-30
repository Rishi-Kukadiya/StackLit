import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useUser } from "./UserContext";
import TiptapEditor from "./QuillEditor";
import axios from "axios";
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";
import { useDispatch } from "react-redux";
import { fetchQuestionById } from "../redux/questionsSlice";
import ShimmerLoader from "./ShimmerLoader";
import { ImagePlus, X, Tag as TagIcon, ArrowLeft } from "lucide-react";
import { useQuestions } from "../contexts/QuestionContext";

export default function Answer() {
  const location = useLocation();
  const questionId = location.state?.questionId;
  const questionTitle = location.state?.questionTitle;
  const ownerAvatar = location.state?.ownerAvatar;
  const ownerName = location.state?.ownerName;
  const { setRefresh, clearQuestions } = useQuestions();
  const navigate = useNavigate();
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const combinedImages = [...images, ...files].slice(0, 5);
    const totalSize = combinedImages.reduce((acc, file) => acc + file.size, 0);
    if (images.length + files.length > 5) {
      setError("You can upload up to 5 images only.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (totalSize > 5 * 1024 * 1024) {
      setError("Total image size must be 5MB or less.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setImages((prev) => [...prev, ...files].slice(0, 5));
  };

  const handleImageDelete = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    const val = tagInput.trim();
    if (val && !tags.includes(val) && tags.length < 10) {
      setTags([...tags, val]);
      setTagInput("");
    }
  };

  const handleTagDelete = (idx) => {
    setTags((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in to ask a question.");
      setTimeout(() => {
        setError("");
        navigate("/signin");
      }, 2000);
      return;
    }

    if (!content.trim()) {
      setError("content are required.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("questionId", questionId);
      formData.append("content", content);
      const tagsStrings = tags.join(",");
      formData.append("tags", tagsStrings);
      images.forEach((img) => formData.append("image", img));

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER}/answers/post-answer`,
        formData,
        { withCredentials: true }
      );

      if (res.data.statusCode === 201) {
        setContent("");
        setImages([]);
        setTags([]);
        setSuccess(res.data.message || "Answer posted successfully!");
        setTimeout(() => {
          setSuccess("");
          clearQuestions();
          setRefresh((prev) => !prev);
          dispatch(fetchQuestionById(questionId));
          navigate("/");
        }, 3000);
      } else {
        setError(res.data.message || "Failed to post answer.");
        setTimeout(() => setError(""), 3000);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to post answer.");
      setTimeout(() => setError(""), 3000);
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden relative">
      {/* Fixed Navbar */}
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>

      <div className="flex h-full pt-24 sm:pt-20">
        <Sidebar />

        {/* Main Content - Centered and Responsive */}
        <main className="flex-1 overflow-hidden flex items-start justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-2xl h-[calc(100vh-8rem)] sm:h-[calc(100vh-8.5rem)] lg:h-[calc(100vh-9rem)]">
            {/* Form Container - Better Centered */}
            <motion.div
              className="relative group h-full"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Background Effects */}
              <motion.div
                className="absolute inset-0 bg-[#2E236C]/5 rounded-lg"
                initial={{ opacity: 0.5 }}
                whileHover={{ opacity: 0.8 }}
                transition={{ duration: 0.3 }}
              />

              {/* Main Content Container */}
              <motion.div
                className="relative h-full rounded-lg p-4 sm:p-6 
                         border-2 border-[#C8ACD6]/30 hover:border-[#C8ACD6]/50
                         flex flex-col w-full overflow-hidden
                         shadow-[0_0_15px_rgba(200,172,214,0.2)]
                         bg-transparent z-10"
                whileHover={{
                  boxShadow: "0 0 25px rgba(200,172,214,0.3)",
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Header */}
                <div className="flex flex-col gap-4 mb-6 border-b border-[#433D8B]/50 pb-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {(ownerAvatar || ownerName) && (
                        <div className="flex items-center gap-2 bg-[#2E236C]/30 px-3 py-2 rounded-lg border border-[#433D8B]/20">
                          <img
                            src={ownerAvatar}
                            alt={ownerName}
                            className="w-8 h-8 rounded-full border-2 border-[#C8ACD6]"
                          />
                          <span className="text-white font-medium text-sm">
                            {ownerName}
                          </span>
                        </div>
                      )}
                      <h1 className="text-2xl sm:text-3xl font-bold text-white ml-4">
                        Post an Answer
                      </h1>
                    </div>
                    <button
                      onClick={() => navigate(-1)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#2E236C]/40 
                              hover:bg-[#2E236C]/60 text-[#C8ACD6] hover:text-white 
                              transition-all duration-300 rounded-lg
                              border border-[#433D8B]/30 hover:border-[#C8ACD6]/50
                              shadow-sm hover:shadow-[0_0_10px_rgba(200,172,214,0.2)]"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span className="text-sm font-medium">Back</span>
                    </button>
                  </div>
                  {questionTitle && (
                    <p className="text-[#C8ACD6] text-base mt-2 font-semibold">
                      For question:{" "}
                      <span className="text-white">{questionTitle}</span>
                    </p>
                  )}
                  <p className="text-[#C8ACD6] text-sm mt-2">
                    Share your answer with our community
                  </p>
                </div>

                {/* Form Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <form
                    id="question-form"
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* Content Field */}
                    <div className="space-y-2">
                      <label className="block text-white font-semibold text-sm">
                        Answer Details *
                      </label>
                      <div
                        className="rounded-lg border border-[#433D8B]/20 bg-[#2E236C]/30 overflow-hidden 
                                 focus-within:border-[#C8ACD6]/30 focus-within:ring-2 focus-within:ring-[#C8ACD6]/20 
                                 transition-all duration-300"
                      >
                        <TiptapEditor value={content} setValue={setContent} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-white font-semibold flex items-center gap-2 text-sm drop-shadow-lg">
                        <ImagePlus className="w-5 h-5 text-[#C8ACD6]" />
                        Images (max 5)
                      </label>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="w-full px-4 py-4 rounded-2xl bg-gradient-to-r from-[#2E236C] to-[#433D8B] text-white border border-white/30 focus:outline-none focus:border-[#C8ACD6] transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#C8ACD6] file:text-[#2E236C] hover:file:bg-[#C8ACD6]/90 file:cursor-pointer"
                        disabled={images.length >= 5}
                      />

                      {/* Image Previews */}
                      {images.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                          {images.map((img, idx) => (
                            <div key={idx} className="relative group">
                              <div className="aspect-square rounded-xl overflow-hidden border border-white/30 bg-white/10 backdrop-blur-sm p-1">
                                <img
                                  src={URL.createObjectURL(img)}
                                  alt={`preview-${idx}`}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleImageDelete(idx)}
                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                                aria-label="Delete image"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tags Field */}
                    <div className="space-y-3">
                      <label className="text-white font-semibold flex items-center gap-2 text-sm">
                        <TagIcon className="w-5 h-5 text-[#C8ACD6]" />
                        Tags (max 10)
                      </label>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#2E236C]/90 to-[#433D8B]/90 text-white border border-white/20 focus:outline-none focus:border-[#C8ACD6] focus:ring-2 focus:ring-[#C8ACD6]/20 transition-all duration-300 placeholder-white/50 backdrop-blur-sm"
                          placeholder="Add a tag (e.g., javascript, react)"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleTagAdd(e);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleTagAdd}
                          className="flex items-center gap-2 px-4 py-3 bg-[#2E236C]/40 
                                hover:bg-[#2E236C]/60 text-[#C8ACD6] hover:text-white 
                                transition-all duration-300 rounded-lg
                                border border-[#433D8B]/30 hover:border-[#C8ACD6]/50
                                shadow-sm hover:shadow-[0_0_10px_rgba(200,172,214,0.2)]"
                        >
                          Add
                        </button>
                      </div>

                      {/* Tags Display */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-2 bg-[#C8ACD6]/10 text-[#C8ACD6] px-3 py-2 rounded-full font-medium text-sm border border-[#C8ACD6]/20 backdrop-blur-sm"
                            >
                              <TagIcon className="w-3 h-3" />
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleTagDelete(idx)}
                                className="text-white/70 hover:text-red-400 transition-colors duration-200"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </form>

                  {/* Loading State */}
                  {loading && (
                    <div className="mt-6">
                      <ShimmerLoader />
                    </div>
                  )}
                </div>

                {/* Submit Button - Fixed at Bottom */}
                <div className="flex-shrink-0 p-4 sm:p-6 border-t border-[#433D8B]/50">
                  <button
                    type="submit"
                    form="question-form"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 
                           bg-[#2E236C]/40 hover:bg-[#2E236C]/60 
                           text-[#C8ACD6] hover:text-white font-bold text-base sm:text-lg
                           transition-all duration-300 rounded-lg
                           border border-[#433D8B]/30 hover:border-[#C8ACD6]/50
                           shadow-sm hover:shadow-[0_0_10px_rgba(200,172,214,0.2)]
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={loading}
                  >
                    {loading ? "Posting Answer..." : "Post Answer"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(200, 172, 214, 0.3) rgba(46, 35, 108, 0.2);
        }

        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(46, 35, 108, 0.2);
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(200, 172, 214, 0.3);
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(200, 172, 214, 0.5);
        }

        /* For Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(200, 172, 214, 0.3) rgba(46, 35, 108, 0.2);
        }
      `}</style>

      {success && (
        <SuccessPopup message={success} onClose={() => setSuccess("")} />
      )}
      {error && <ErrorPopup message={error} onClose={() => setError("")} />}
    </div>
  );
}
