import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Save, X, Upload, Trash2, Camera, Check } from "lucide-react";
import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ModifyQuestion from "./ModifyQuestions";
import ModifyAnswer from "./ModifyAnswer"; // Assuming this new component exists
import { useUser } from "./UserContext";
import Avtart from "../assets/avtart.jpg";
import ShimmerLoader from "./ShimmerLoader";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";
import { useQuestions } from "../contexts/QuestionContext";

// --- Stubs for pieces not shown ---
function DeleteModal({ type, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70">
      <div className="bg-[#2E236C] rounded-xl p-6 max-w-md w-full border border-[#433D8B]/50">
        <h3 className="text-white text-xl font-semibold mb-4">
          Confirm Delete
        </h3>
        <p className="text-[#C8ACD6] mb-6">
          Are you sure you want to delete this {type}? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-[#433D8B] text-white hover:bg-[#2E236C] transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UpdateProfile() {
  const { user, updateUser, setUser } = useUser();
  const userId = user?.user?._id;
  const { clearQuestions, setRefresh } = useQuestions();
  const navigate = useNavigate();

  // State
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(null);
  const [editMode, setEditMode] = useState({
    fullName: false,
    email: false,
  });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    avatar: null,
    previewAvatar: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState({
    show: false,
    type: null, // 'profile', 'question', 'answer'
    id: null,
  });
  const [questionToModify, setQuestionToModify] = useState(null);
  const [answerToModify, setAnswerToModify] = useState(null); // State for ModifyAnswer modal
  const fileInputRef = useRef(null);

  // Effect to disable body scroll when a modal is open
  useEffect(() => {
    const body = document.body;
    if (questionToModify || answerToModify) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }

    // Cleanup function to restore scroll on component unmount
    return () => {
      body.style.overflow = "auto";
    };
  }, [questionToModify, answerToModify]);

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/users/get-userProfile/${userId}`,
        { withCredentials: true }
      );
      setUserData(response.data);
      setFormData({
        fullName: response.data.user.fullName,
        email: response.data.user.email,
        avatar: null, // Reset on fetch
        previewAvatar: response.data.user.avatar || Avtart,
      });
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (userId) fetchUserProfile();
  }, [userId]);

  // --- Individual Update Handlers ---

  const handleFullNameUpdate = async (e) => {
    e.preventDefault();
    if (formData.fullName == "" || formData.fullName.length == 0) {
      setError("Valid FullName is Required!!");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER}/users/update-fullName`,
        { fullName: formData.fullName },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.statusCode != 200) {
        setError(response.data.message || "Something Went Wrong!!");
      } else {
        setSuccess(response.data.message || "FullName Updated Succesfully !!");
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }

    setUserData((prev) => ({
      ...prev,
      user: { ...prev.user, fullName: formData.fullName },
    }));
    setEditMode((prev) => ({ ...prev, fullName: false }));
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Valid Email is Required!!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER}/users/update-email`,
        { email: formData.email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.statusCode != 200) {
        setError(response.data.message || "Something Went Wrong!!");
      } else {
        setSuccess(response.data.message || "Email Updated Succesfully !!");
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }

    setUserData((prev) => ({
      ...prev,
      user: { ...prev.user, email: formData.email },
    }));
    setEditMode((prev) => ({ ...prev, email: false }));
  };

  const handleAvatarUpdate = async () => {
    if (!formData.avatar) return;
    const data = new FormData();
    data.append("avatar", formData.avatar);
    try {
      setLoading(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER}/users/update-avatar`,
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.statusCode != 200) {
        setError(response.data.message || "Something Went Wrong!!");
      } else {
        setSuccess(response.data.message || "Profile Updated Succesfully !!");
        const updateUsers = {
          ...user,
          user: {
            ...user.user,
            avatar: response.data.data.avatar || Avtart,
          },
        };
        updateUser(updateUsers);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }

    setUserData((prev) => ({
      ...prev,
      user: { ...prev.user, avatar: formData.previewAvatar },
    }));
    setFormData((prev) => ({ ...prev, avatar: null })); // Clear the file state
  };

  const handleRemoveAvatar = async () => {
    if (user.user.avatar == Avtart) {
      setError("No profile is there!!");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.patch(
        `${import.meta.env.VITE_SERVER}/users/remove-avatar`,
        {},
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.statusCode != 200) {
        setError(response.data.message || "Something Went Wrong!!");
      } else {
        setSuccess(response.data.message || "Profile Removed Succesfully !!");
        const updateUsers = {
          ...user,
          user: {
            ...user.user,
            avatar: Avtart,
          },
        };
        updateUser(updateUsers);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }

    const defaultAvatar = Avtart; // Replace with your actual default avatar URL
    setUserData((prev) => ({
      ...prev,
      user: { ...prev.user, avatar: defaultAvatar },
    }));
    setFormData((prev) => ({ ...prev, previewAvatar: defaultAvatar }));
  };

  // --- Delete Handler ---
  const handleDelete = async () => {
    // console.log(`DELETE ${showDeleteModal.type} id=`, showDeleteModal.id);
    if (showDeleteModal.type === "profile") {
      setLoading(true);
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_SERVER}/users/delete-userProfile`,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        if (response.data.statusCode != 200) {
          setError(response.data.message || "Something Went Wrong!!");
        } else {
          setSuccess(response.data.message || "Account Deleted Succesfully !!");
          Object.keys(localStorage).forEach((key) => {
            if (key.startsWith(`${user.user._id}`)) {
              localStorage.removeItem(key);
            }
          });

          setUserData(null);
          navigate("/");
          clearQuestions();
          setRefresh((prev) => !prev);
          sessionStorage.removeItem("user");
          setUser(null);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    } else if (showDeleteModal.type === "question") {
      setLoading(true);
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_SERVER}/questions/delete-question/${
            showDeleteModal.id
          }`,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        if (response.data.statusCode != 200) {
          setError(response.data.message || "Netwrok Error");
        } else {
          setSuccess(
            response.data.message || "Question Deleted Successfully!!"
          );

          Object.keys(localStorage).forEach((key) => {
            if (key.includes(`${showDeleteModal.id}`)) {
              localStorage.removeItem(key);
            }
          });

          clearQuestions();
          setRefresh((prev) => !prev);

          setUserData((prev) => ({
            ...prev,
            questions: prev.questions.filter(
              (q) => q._id !== showDeleteModal.id
            ),
          }));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    } else if (showDeleteModal.type === "answer") {
      setLoading(true);
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_SERVER}/answers/delete-answer/${
            showDeleteModal.id
          }`,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );

        if (response.data.statusCode != 200) {
          setError(response.data.message || "Netwrok Error");
        } else {
          setSuccess(response.data.message || "Answer Deleted Successfully!!");
          clearQuestions();
          setRefresh((prev) => !prev);

          Object.keys(localStorage).forEach((key) => {
            if (key.includes(`${showDeleteModal.id}`)) {
              localStorage.removeItem(key);
            }
          });

          setUserData((prev) => ({
            ...prev,
            answers: prev.answers.filter((a) => a._id !== showDeleteModal.id),
          }));
        }
      } catch (err) {
        setError("somthing wrong!!");
      } finally {
        setLoading(false);
      }
    }
    setShowDeleteModal({ show: false, type: null, id: null });
  };

  useEffect(() => {
    if (!userId) navigate("/signin");
  }, [userId, navigate]);

  if (loading || !userData) {
    return (
      <>
        <div className="mt-6">
          <ShimmerLoader />
        </div>
      </>
    );
  }

  const handleCancelAvatarChange = () => {
    // Revert the form data to its original state from userData
    setFormData((prev) => ({
      ...prev,
      avatar: null, // Clear the staged file to hide the save/cancel buttons
      previewAvatar: userData.user.avatar, // Revert to the original avatar URL
    }));
  };

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

  return (
    <div className="bg-transparent h-screen flex z-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <header className="flex-shrink-0 z-40">
          <Navbar />
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* --- Profile Section --- */}
            <div className="bg-[#2E236C]/20 rounded-xl p-6 mb-8 border-2 border-[#C8ACD6]/30">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <img
                    src={formData.previewAvatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#C8ACD6]"
                  />
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-[#433D8B]/80 text-white rounded-lg hover:bg-[#433D8B] transition-colors"
                      aria-label="Change Avatar"
                    >
                      <Camera className="w-4 h-4" />
                      Change
                    </button>
                    <button
                      onClick={handleRemoveAvatar}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-red-600/80 text-white rounded-lg hover:bg-red-700 transition-colors"
                      aria-label="Remove Avatar"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData({
                          ...formData,
                          avatar: file,
                          previewAvatar: URL.createObjectURL(file),
                        });
                      }
                    }}
                    className="hidden"
                    accept="image/*"
                  />
                </div>

                {/* Details Section */}
                <div className="w-full space-y-4">
                  {/* Full Name */}
                  {editMode.fullName ? (
                    <form
                      onSubmit={handleFullNameUpdate}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fullName: e.target.value,
                          })
                        }
                        className="w-full bg-[#2E236C]/30 border border-[#433D8B]/30 rounded-lg p-2 text-white"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="p-2 text-green-400 hover:text-white"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditMode((m) => ({ ...m, fullName: false }))
                        }
                        className="p-2 text-red-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl text-white font-medium">
                        {userData.user.fullName}
                      </h3>
                      <button
                        onClick={() =>
                          setEditMode((m) => ({
                            ...m,
                            fullName: true,
                            email: false,
                          }))
                        }
                        className="text-[#C8ACD6] hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Email */}
                  {editMode.email ? (
                    <form
                      onSubmit={handleEmailUpdate}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-[#2E236C]/30 border border-[#433D8B]/30 rounded-lg p-2 text-white"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="p-2 text-green-400 hover:text-white"
                      >
                        <Save className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditMode((m) => ({ ...m, email: false }))
                        }
                        className="p-2 text-red-400 hover:text-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-[#C8ACD6]">{userData.user.email}</p>
                      <button
                        onClick={() =>
                          setEditMode((m) => ({
                            ...m,
                            email: true,
                            fullName: false,
                          }))
                        }
                        className="text-[#C8ACD6] hover:text-white"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {/* Save Avatar Button - shown only when a new avatar is staged
              {formData.avatar && (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleAvatarUpdate}
                    className="bg-[#433D8B] text-white px-4 py-2 rounded-lg hover:bg-[#2E236C] transition-colors flex items-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Save Avatar
                  </button>
                </div>
              )} */}
              {/* Save/Cancel Avatar Buttons - shown only when a new avatar is staged */}
              {formData.avatar && (
                <div className="flex justify-end items-center gap-4 mt-4">
                  {/* Cancel Button */}
                  <button
                    onClick={handleCancelAvatarChange}
                    className="bg-gray-600/80 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                  {/* Save Button */}
                  <button
                    onClick={handleAvatarUpdate}
                    className="bg-[#433D8B] text-white px-4 py-2 rounded-lg hover:bg-[#2E236C] transition-colors flex items-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Save Avatar
                  </button>
                </div>
              )}
              {/* Delete Profile Button */}
              <div className="border-t border-[#433D8B]/30 mt-6 pt-4 flex justify-end">
                <button
                  onClick={() =>
                    setShowDeleteModal({
                      show: true,
                      type: "profile",
                      id: userId,
                    })
                  }
                  className="bg-red-600/80 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Delete Account
                </button>
              </div>
            </div>

            {/* Questions Section */}
            <div className="bg-[#2E236C]/20 rounded-xl p-6 mb-8 border-2 border-[#C8ACD6]/30">
              <h2 className="text-2xl font-bold text-white mb-6">
                Your Questions
              </h2>
              <div className="space-y-4">
                {userData.questions?.map((question) => (
                  <div
                    key={question._id}
                    className="bg-[#2E236C]/40 border border-[#433D8B]/30 rounded-xl p-4 flex justify-between items-center shadow-md transition-all duration-300 hover:shadow-lg w-full hover:bg-[#433D8B]/10"
                  >
                    <div className="flex-grow">
                      <h3 className="text-lg text-white font-semibold line-clamp-2">
                        {question.title}
                      </h3>
                      <p className="mt-2 text-[#C8ACD6] text-sm line-clamp-3">
                        {renderFormattedContent(question.content, 2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                      <button
                        onClick={() => setQuestionToModify(question)}
                        className="text-[#C8ACD6] hover:text-white transition-colors"
                        aria-label="Edit question"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteModal({
                            show: true,
                            type: "question",
                            id: question._id,
                          });
                        }}
                        className="text-red-400 hover:text-red-500 transition-colors"
                        aria-label="Delete question"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Answers Section */}
            <div className="bg-[#2E236C]/20 rounded-xl p-6 border-2 border-[#C8ACD6]/30">
              <h2 className="text-2xl font-bold text-white mb-6">
                Your Answers
              </h2>
              <div className="space-y-4">
                {userData.answers?.map((answer) => (
                  <div
                    key={answer._id}
                    className="bg-[#2E236C]/40 border border-[#433D8B]/30 rounded-xl p-4 flex justify-between items-center shadow-md transition-all duration-300 hover:shadow-lg w-full hover:bg-[#433D8B]/10"
                  >
                    <div className="flex-grow">
                      <h3 className="text-lg text-white font-semibold line-clamp-2">
                        {answer.questionId
                          ? `On: ${answer.questionId.title}`
                          : "On: Question not available"}
                      </h3>
                      <div
                        className="mt-2 text-[#C8ACD6] text-sm line-clamp-3 prose prose-invert max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: answer.content.slice(0, 120),
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-4 ml-4 flex-shrink-0">
                      <button
                        onClick={() => setAnswerToModify(answer)}
                        className="text-[#C8ACD6] hover:text-white transition-colors"
                        aria-label="Edit answer"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteModal({
                            show: true,
                            type: "answer",
                            id: answer._id,
                          });
                        }}
                        className="text-red-400 hover:text-red-500 transition-colors"
                        aria-label="Delete answer"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        {/* --- Modals --- */}
        {showDeleteModal.show && (
          <DeleteModal
            type={showDeleteModal.type}
            onConfirm={handleDelete}
            onCancel={() =>
              setShowDeleteModal({ show: false, type: null, id: null })
            }
          />
        )}

        {questionToModify && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="w-full max-w-3xl rounded-xl shadow-2xl border-2 border-[#433D8B]/40 bg-[#1a133a] h-[90vh] flex flex-col overflow-hidden">
              <ModifyQuestion
                question={questionToModify}
                onClose={() => {
                  setQuestionToModify(null),
                    fetchUserProfile(),
                    clearQuestions(),
                    setRefresh((prev) => !prev);
                }}
              />
            </div>
          </div>
        )}

        {answerToModify && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="w-full max-w-3xl rounded-xl shadow-2xl border-2 border-[#433D8B]/40 bg-[#1a133a] h-[90vh] flex flex-col overflow-hidden">
              <ModifyAnswer
                answer={answerToModify}
                onClose={() => {
                  setAnswerToModify(null),
                    fetchUserProfile(),
                    clearQuestions(),
                    setRefresh((prev) => !prev);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {error && <ErrorPopup message={error} onClose={() => setError("")} />}
      {success && (
        <SuccessPopup message={success} onClose={() => setSuccess("")} />
      )}
    </div>
  );
}
