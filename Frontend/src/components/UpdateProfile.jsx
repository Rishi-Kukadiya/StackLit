import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Edit2, Save, X, Upload, Trash2, AlertCircle } from 'lucide-react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useUser } from './UserContext'; // Updated import path

export default function UpdateProfile() {
  const { user } = useUser();
  const userId = user?.user?._id;
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({
    profile: false,
    questionId: null,
    answerId: null
  });
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    avatar: null,
    previewAvatar: ''
  });

  const [editQuestion, setEditQuestion] = useState({
    title: '',
    content: '',
    images: [],
    tags: []
  });

  const [editAnswer, setEditAnswer] = useState({
    content: '',
    images: []
  });

  const [showDeleteModal, setShowDeleteModal] = useState({
    show: false,
    type: null, // 'profile', 'question', or 'answer'
    id: null
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
          previewAvatar: response.data.user.avatar
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [userId]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    // Placeholder for profile update API call
    console.log('Profile update:', formData);
    setEditMode({ ...editMode, profile: false });
  };

  const handleQuestionEdit = (question) => {
    setEditQuestion({
      title: question.title,
      content: question.content,
      images: question.images || [],
      tags: question.tags || []
    });
    setEditMode({ ...editMode, questionId: question._id });
  };

  const handleQuestionUpdate = async (questionId) => {
    // Placeholder for question update API call
    console.log('Question update:', editQuestion);
    setEditMode({ ...editMode, questionId: null });
  };

  const handleAnswerEdit = (answer) => {
    setEditAnswer({
      content: answer.content,
      images: answer.images || []
    });
    setEditMode({ ...editMode, answerId: answer._id });
  };

  const handleAnswerUpdate = async (answerId) => {
    // Placeholder for answer update API call
    console.log('Answer update:', editAnswer);
    setEditMode({ ...editMode, answerId: null });
  };

  // Delete handlers
  const handleDelete = async () => {
    try {
      switch (showDeleteModal.type) {
        case 'profile':
          // Placeholder for profile delete API call
          console.log('Deleting profile');
          navigate('/');
          break;
        case 'question':
          // Placeholder for question delete API call
          console.log('Deleting question:', showDeleteModal.id);
          setUserData(prev => ({
            ...prev,
            questions: prev.questions.filter(q => q._id !== showDeleteModal.id)
          }));
          break;
        case 'answer':
          // Placeholder for answer delete API call
          console.log('Deleting answer:', showDeleteModal.id);
          setUserData(prev => ({
            ...prev,
            answers: prev.answers.filter(a => a._id !== showDeleteModal.id)
          }));
          break;
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
    setShowDeleteModal({ show: false, type: null, id: null });
  };

  // Delete confirmation modal
  const DeleteModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#2E236C] p-6 rounded-lg max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <h3 className="text-xl font-bold text-white">Confirm Delete</h3>
        </div>
        <p className="text-[#C8ACD6] mb-6">
          {showDeleteModal.type === 'profile' 
            ? 'Are you sure you want to delete your profile? This action cannot be undone.'
            : showDeleteModal.type === 'question'
            ? 'Are you sure you want to delete this question? This action cannot be undone.'
            : 'Are you sure you want to delete this answer? This action cannot be undone.'
          }
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteModal({ show: false, type: null, id: null })}
            className="px-4 py-2 text-[#C8ACD6] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  // Add delete button to profile section
  const ProfileSection = () => (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-white">Profile Details</h2>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setEditMode({ ...editMode, profile: !editMode.profile })}
          className="text-[#C8ACD6] hover:text-white transition-colors"
        >
          {editMode.profile ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setShowDeleteModal({ show: true, type: 'profile', id: userId })}
          className="text-red-400 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  // Update Question card to include delete button
  const QuestionCard = ({ question }) => (
    <div className="flex justify-between items-start border-b border-[#433D8B]/30 pb-4">
      {editMode.questionId === question._id ? (
        <div className="space-y-4">
          <input
            type="text"
            value={editQuestion.title}
            onChange={(e) => setEditQuestion({ ...editQuestion, title: e.target.value })}
            className="w-full bg-[#2E236C]/30 border border-[#433D8B]/30 rounded-lg p-2 text-white"
          />
          <ReactQuill
            value={editQuestion.content}
            onChange={(content) => setEditQuestion({ ...editQuestion, content })}
            className="bg-[#2E236C]/30 rounded-lg text-white"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleQuestionUpdate(question._id)}
              className="flex items-center gap-2 px-3 py-1 bg-[#433D8B] text-white rounded-lg hover:bg-[#2E236C] transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={() => setEditMode({ ...editMode, questionId: null })}
              className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-start w-full">
          <h3 className="text-lg text-white">{question.title}</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleQuestionEdit(question)}
              className="text-[#C8ACD6] hover:text-white transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDeleteModal({ 
                show: true, 
                type: 'question', 
                id: question._id 
              })}
              className="text-red-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Update Answer card to include delete button
  const AnswerCard = ({ answer }) => (
    <div className="border-b border-[#433D8B]/30 pb-4">
      {editMode.answerId === answer._id ? (
        <div className="space-y-4">
          <ReactQuill
            value={editAnswer.content}
            onChange={(content) => setEditAnswer({ ...editAnswer, content })}
            className="bg-[#2E236C]/30 rounded-lg text-white"
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
              {answer.questionId ? `On: ${answer.questionId.title}` : 'Question not available'}
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
              onClick={() => setShowDeleteModal({ 
                show: true, 
                type: 'answer', 
                id: answer._id 
              })}
              className="text-red-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Redirect if no user is logged in
  useEffect(() => {
    if (!userId) {
      navigate('/signin');
    }
  }, [userId, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>
      <Sidebar />
      <div className="pt-16 min-h-screen overflow-y-auto relative z-10 
                    transition-all duration-300 mx-auto w-full
                    lg:ml-64 lg:w-[calc(100%-16rem)]">
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Profile Section */}
          <div className="bg-[#2E236C]/20 rounded-xl p-6 mb-8 border-2 border-[#C8ACD6]/30">
            <ProfileSection />
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
                            previewAvatar: URL.createObjectURL(file)
                          });
                        }
                      }}
                      className="hidden"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
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
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-[#2E236C]/30 border border-[#433D8B]/30 rounded-lg p-2 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[#C8ACD6]">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    <h3 className="text-xl text-white font-medium">{userData.user.fullName}</h3>
                    <p className="text-[#C8ACD6]">{userData.user.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Questions Section */}
          <div className="bg-[#2E236C]/20 rounded-xl p-6 mb-8 border-2 border-[#C8ACD6]/30">
            <h2 className="text-2xl font-bold text-white mb-6">Your Questions</h2>
            <div className="space-y-4">
              {userData.questions.map((question) => (
                <QuestionCard key={question._id} question={question} />
              ))}
            </div>
          </div>

          {/* Answers Section */}
          <div className="bg-[#2E236C]/20 rounded-xl p-6 border-2 border-[#C8ACD6]/30">
            <h2 className="text-2xl font-bold text-white mb-6">Your Answers</h2>
            <div className="space-y-4">
              {userData.answers.map((answer) => (
                <AnswerCard key={answer._id} answer={answer} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal.show && <DeleteModal />}
    </>
  );
}
