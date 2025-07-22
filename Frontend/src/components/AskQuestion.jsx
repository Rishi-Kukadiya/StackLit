import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
// import TiptapEditor from "./TiptapEditor";
import TiptapEditor from "./QuillEditor";
import axios from "axios";
import ShimmerLoader from "./ShimmerLoader";
import { ImagePlus, X, Tag as TagIcon } from "lucide-react";

export default function AskQuestion() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      setError("You can upload up to 5 images only.");
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
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      tags.forEach((tag) => formData.append("tags[]", tag));
      images.forEach((img) => formData.append("images", img));
      
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER}/questions`,
        formData,
        { withCredentials: true }
      );
      
      setLoading(false);
      
      if (res.data.statusCode === 200) {
        setSuccess("Question posted successfully!");
        setTitle("");
        setContent("");
        setImages([]);
        setTags([]);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(res.data.message || "Failed to post question.");
        setTimeout(() => setError(""), 3000);
      }
    } catch (err) {
      setLoading(false);
      setError("Failed to post question.");
      setTimeout(() => setError(""), 3000);
    }
  };

  //  bg-gradient-to-br from-[#0f0d2b] via-[#1a1844] to-[#2d1b69]
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
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden h-full flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#2E236C]/80 to-[#433D8B]/80 px-4 sm:px-6 py-6 sm:py-8 text-center border-b border-white/20 flex-shrink-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Ask a Question
                </h1>
                <p className="text-white/80 text-xs sm:text-sm">
                  Share your question with our community
                </p>
              </div>

              {/* Form Content - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <form id="question-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  {/* Title Field */}
                  <div className="space-y-2">
                    <label className="block text-white font-semibold text-sm">
                      Question Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-4 rounded-2xl bg-white/5 backdrop-blur-sm text-white border border-white/30 focus:outline-none focus:border-[#C8ACD6] focus:ring-2 focus:ring-[#C8ACD6]/20 transition-all duration-300 placeholder-white/60"
                      placeholder="What's your question? Be clear and specific..."
                      required
                    />
                  </div>

                  {/* Content Field */}
                  <div className="space-y-2">
                    <label className="block text-white font-semibold text-sm">
                      Question Details *
                    </label>
                    <div className="rounded-2xl border border-white/30 bg-white/5 backdrop-blur-sm overflow-hidden focus-within:border-[#C8ACD6] focus-within:ring-2 focus-within:ring-[#C8ACD6]/20 transition-all duration-300">
                      <TiptapEditor value={content} setValue={setContent} />
                    </div>
                  </div>

                  {/* Images Field */}
                  <div className="space-y-3">
                    <label className="text-white font-semibold flex items-center gap-2 text-sm">
                      <ImagePlus className="w-5 h-5 text-[#C8ACD6]" /> 
                      Images (max 5)
                    </label>
                    
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="w-full px-4 py-4 rounded-2xl bg-white/5 backdrop-blur-sm text-white border border-white/30 focus:outline-none focus:border-[#C8ACD6] transition-all duration-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#C8ACD6] file:text-[#2E236C] hover:file:bg-[#C8ACD6]/90 file:cursor-pointer"
                      disabled={images.length >= 5}
                    />
                    
                    {/* Image Previews */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {images.map((img, idx) => (
                          <div key={idx} className="relative group">
                            <div className="aspect-square rounded-xl overflow-hidden border border-white/30 bg-white/10 backdrop-blur-sm">
                              <img
                                src={URL.createObjectURL(img)}
                                alt={`preview-${idx}`}
                                className="w-full h-full object-cover"
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
                        className="flex-1 px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm text-white border border-white/30 focus:outline-none focus:border-[#C8ACD6] focus:ring-2 focus:ring-[#C8ACD6]/20 transition-all duration-300 placeholder-white/60"
                        placeholder="Add a tag (e.g., javascript, react)"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleTagAdd(e);
                          }
                        }}
                      />
                      <button 
                        type="button"
                        onClick={handleTagAdd}
                        className="bg-[#C8ACD6] hover:bg-[#C8ACD6]/90 text-[#2E236C] px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        Add
                      </button>
                    </div>
                    
                    {/* Tags Display */}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag, idx) => (
                          <span key={idx} className="inline-flex items-center gap-2 bg-[#C8ACD6]/20 text-[#C8ACD6] px-3 py-2 rounded-full font-medium text-sm border border-[#C8ACD6]/30">
                            <TagIcon className="w-3 h-3" />
                            {tag}
                            <button 
                              type="button" 
                              onClick={() => handleTagDelete(idx)} 
                              className="text-white/80 hover:text-red-400 transition-colors duration-200"
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

                {/* Messages */}
                {error && (
                  <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-200 text-center text-sm font-semibold backdrop-blur-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-2xl text-green-200 text-center text-sm font-semibold backdrop-blur-sm">
                    {success}
                  </div>
                )}
              </div>

              {/* Submit Button - Fixed at Bottom */}
              <div className="flex-shrink-0 p-4 sm:p-6 bg-gradient-to-t from-[#17153B] via-[#17153B]/95 to-transparent backdrop-blur-sm border-t border-white/10">
                <button
                  type="submit"
                  form="question-form"
                  className="w-full bg-gradient-to-r from-[#C8ACD6] to-[#433D8B] hover:from-[#C8ACD6]/90 hover:to-[#433D8B]/90 
                           text-white py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg 
                           shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] 
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={loading}
                >
                  {loading ? "Posting Question..." : "Post Question"}
                </button>
              </div>
            </div>
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
    </div>
  );
}