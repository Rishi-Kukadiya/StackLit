import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Edit2, Save, X, Upload, Trash2 } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import TiptapEditor from "./QuillEditor";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useUser } from "./UserContext";

// --- Stubs for pieces not shown  ---
function ProfileSection() {
  return null; // Your real ProfileSection implementation here
}
function DeleteModal() {
  return null; // Your real DeleteModal implementation here
}

export default function UpdateProfile() {
  const { user } = useUser();
  const userId = user?.user?._id;
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({
    profile: false,
    questionId: null,
    answerId: null,
  });
  const [content, setContent] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    avatar: null,
    previewAvatar: "",
  });
  const [editQuestion, setEditQuestion] = useState({
    title: "",
    content: "",
    images: [],
    tags: [],
  });
  const [editAnswer, setEditAnswer] = useState({
    content: "",
    images: [],
  });
  const [showDeleteModal, setShowDeleteModal] = useState({
    show: false,
    type: null, // "profile", "question", "answer"
    id: null,
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
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
          previewAvatar: response.data.user.avatar,
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    if (userId) fetchUserProfile();
  }, [userId]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    // Placeholder for profile update API call
    // You can add image upload logic here if needed
    setEditMode({ ...editMode, profile: false });
  };

  const handleQuestionEdit = (question) => {
    setEditQuestion({
      title: question.title,
      content: question.content,
      images: question.images || [],
      tags: question.tags || [],
    });
    setEditMode({ ...editMode, questionId: question._id });
  };

  const handleQuestionUpdate = async (questionId) => {
    // Placeholder for question update API call
    setEditMode({ ...editMode, questionId: null });
  };

  const handleAnswerEdit = (answer) => {
    setEditAnswer({
      content: answer.content,
      images: answer.images || [],
      tags: answer.tags || [],
    });
    setEditMode({ ...editMode, answerId: answer._id });
  };

  const handleAnswerUpdate = async (answerId) => {
    // Placeholder for answer update API call
    setEditMode({ ...editMode, answerId: null });
  };

  // Delete handlers
  const handleDelete = async () => {
    try {
      switch (showDeleteModal.type) {
        case "profile":
          // Placeholder for profile delete API
          navigate("/");
          break;
        case "question":
          setUserData((prev) => ({
            ...prev,
            questions: prev.questions.filter((q) => q._id !== showDeleteModal.id),
          }));
          break;
        case "answer":
          setUserData((prev) => ({
            ...prev,
            answers: prev.answers.filter((a) => a._id !== showDeleteModal.id),
          }));
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
    setShowDeleteModal({ show: false, type: null, id: null });
  };

  // QuestionCard Component
  function QuestionCard({ question, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValues, setEditValues] = useState({
      title: question.title,
      content: question.content,
      tags: question.tags || [],
      images: question.images || [],
      newTag: "",
    });

    useEffect(() => {
      setEditValues({
        title: question.title,
        content: question.content,
        tags: question.tags || [],
        images: question.images || [],
        newTag: "",
      });
      setIsEditing(false);
    }, [question]);

    // Highlight code blocks in content
    function renderContentWithCode(content) {
      if (!content) return null;
      const codeBlockRegex = /``````/g;
      let lastIndex = 0;
      const elements = [];
      let match;
      while ((match = codeBlockRegex.exec(content))) {
        if (match.index > lastIndex) {
          elements.push(
            <div
              key={lastIndex}
              className="prose prose-invert max-w-none text-white mb-2"
              dangerouslySetInnerHTML={{
                __html: content.slice(lastIndex, match.index),
              }}
            />
          );
        }
        elements.push(
          <SyntaxHighlighter
            key={match.index}
            language={match[1] || "text"}
            style={atomDark}
            customStyle={{
              background: "#2E236C",
              borderRadius: "0.5rem",
              fontSize: "0.95em",
              margin: 0,
              padding: "1em",
            }}
            wrapLongLines
          >
            {match[2]}
          </SyntaxHighlighter>
        );
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < content.length) {
        elements.push(
          <div
            key={lastIndex}
            className="prose prose-invert max-w-none text-white mb-2"
            dangerouslySetInnerHTML={{ __html: content.slice(lastIndex) }}
          />
        );
      }
      return elements;
    }

    return (
      <div className="bg-[#2E236C]/40 border border-[#433D8B]/30 rounded-xl p-4 flex flex-col gap-3 shadow-md transition-all duration-300 hover:shadow-lg w-full">
        <div className="flex items-center justify-between gap-2 cursor-pointer" onClick={() => setIsEditing(true)}>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg text-white font-semibold line-clamp-2">{question.title}</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {question.tags && question.tags.map((tag, idx) => (
                <span key={idx} className="bg-[#C8ACD6]/10 text-[#C8ACD6] px-3 py-1 rounded-full text-xs font-medium border border-[#C8ACD6]/20">{tag}</span>
              ))}
            </div>
          </div>
          <button
            onClick={e => {
              e.stopPropagation();
              onDelete(question._id);
            }}
            className="ml-auto text-red-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        <div className="mt-2 text-[#C8ACD6] text-sm line-clamp-3">
          {renderContentWithCode(question.content)}
        </div>
        {question.images && question.images.length > 0 &&
          <div className="flex flex-wrap gap-2 mt-2">
            {question.images.map((img, idx) => (
              <img
                key={idx}
                src={typeof img === "string" ? img : URL.createObjectURL(img)}
                alt={`img-${idx}`}
                className="w-14 h-14 object-cover rounded-lg border border-[#C8ACD6]/30"
              />
            ))}
          </div>
        }
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-[#2E236C] rounded-xl p-6 max-w-lg w-full mx-2 flex flex-col gap-4 border-2 border-[#433D8B]/40 shadow-2xl">
              <input
                type="text"
                value={editValues.title}
                onChange={e => setEditValues(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-[#2E236C]/30 border border-[#433D8B]/30 rounded-lg p-2 text-white mb-2"
                placeholder="Title"
              />
              <TiptapEditor
                value={editValues.content}
                setValue={val => setEditValues(prev => ({ ...prev, content: val }))}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {editValues.tags.map((tag, idx) => (
                  <span key={idx} className="bg-[#C8ACD6]/10 text-[#C8ACD6] px-3 py-1 rounded-full text-xs font-medium border border-[#C8ACD6]/20">{tag}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {editValues.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={typeof img === "string" ? img : URL.createObjectURL(img)}
                    alt={`img-${idx}`}
                    className="w-14 h-14 object-cover rounded-lg border border-[#C8ACD6]/30"
                  />
                ))}
              </div>
              <div className="flex gap-2 mt-4 justify-end">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save logic here
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 bg-[#433D8B] text-white rounded-lg hover:bg-[#2E236C] transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // AnswerCard Component
  function AnswerCard({ answer, onDelete }) {
    return (
      <div className="border-b border-[#433D8B]/30 pb-4">
        {editMode.answerId === answer._id ? (
          <div className="space-y-4">
            <TiptapEditor
              value={editAnswer.content}
              setValue={(val) => setEditAnswer((prev) => ({ ...prev, content: val }))}
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleAnswerUpdate(answer._id)}
                className="flex items-center gap-2 px-3 py-1 bg-[#433D8B] text-white rounded-lg hover:bg-[#2E236C] transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => setEditMode({ ...editMode, answerId: null })}
                className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-start w-full">
            <div>
              <p className="text-sm text-[#C8ACD6] mb-2">
                {answer.questionId
                  ? `On: ${answer.questionId.title}`
                  : "Question not available"}
              </p>
              <div
                className="text-white prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: answer.content }}
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleAnswerEdit(answer)}
                className="text-[#C8ACD6] hover:text-white transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(answer._id)}
                className="text-red-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Redirect if no user is logged in
  useEffect(() => {
    if (!userId) {
      navigate("/signin");
    }
  }, [userId, navigate]);

  if (loading || !userData) {
    return <div>Loading...</div>;
  }

  // Main Render
  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>
      <Sidebar />
      <div className="pt-16 min-h-screen overflow-y-auto relative z-10
                  transition-all duration-300 mx-auto w-full
                  lg:ml-64 lg:w-[calc(100%-16rem)]"
      >
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Profile Section */}
          <div className="bg-[#2E236C]/20 rounded-xl p-6 mb-8 border-2 border-[#C8ACD6]/30">
            {/* ProfileSection would show normal info.
                The editMode/profile check decides if it's edit or view. */}
            {editMode.profile ? (
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={formData.previewAvatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#C8ACD6]"
                  />
                  <div>
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
                    <button
                      type="button"
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      className="text-[#C8ACD6] hover:text-white transition-colors flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Change Avatar
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[#C8ACD6]">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full bg-[#2E236C]/30 border border-[#433D8B]/30 rounded-lg p-2 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[#C8ACD6]">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-[#2E236C]/30 border border-[#433D8B]/30 rounded-lg p-2 text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#433D8B] text-white px-4 py-2 rounded-lg hover:bg-[#2E236C] transition-colors"
                >
                  Save Changes
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={userData.user.avatar}
                    alt={userData.user.fullName}
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#C8ACD6]"
                  />
                  <div>
                    <h3 className="text-xl text-white font-medium">
                      {userData.user.fullName}
                    </h3>
                    <p className="text-[#C8ACD6]">{userData.user.email}</p>
                  </div>
                </div>
                <button
                  className="bg-[#433D8B] text-white px-4 py-2 rounded-lg hover:bg-[#2E236C] transition-colors"
                  onClick={() => setEditMode({ ...editMode, profile: true })}
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>

          {/* Questions Section */}
          <div className="bg-[#2E236C]/20 rounded-xl p-6 mb-8 border-2 border-[#C8ACD6]/30">
            <h2 className="text-2xl font-bold text-white mb-6">Your Questions</h2>
            <div className="space-y-4">
              {userData.questions &&
                userData.questions.map((question) => (
                  <QuestionCard
                    key={question._id}
                    question={question}
                    onDelete={(id) =>
                      setShowDeleteModal({ show: true, type: "question", id })
                    }
                  />
                ))}
            </div>
          </div>

          {/* Answers Section */}
          <div className="bg-[#2E236C]/20 rounded-xl p-6 border-2 border-[#C8ACD6]/30">
            <h2 className="text-2xl font-bold text-white mb-6">Your Answers</h2>
            <div className="space-y-4">
              {userData.answers &&
                userData.answers.map((answer) => (
                  <AnswerCard
                    key={answer._id}
                    answer={answer}
                    onDelete={(id) =>
                      setShowDeleteModal({ show: true, type: "answer", id })
                    }
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      {/* Modal (replace stub with real modal for delete) */}
      {showDeleteModal.show && <DeleteModal />}
    </>
  );
}
