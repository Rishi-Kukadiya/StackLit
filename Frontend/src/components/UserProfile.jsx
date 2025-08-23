import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, MessageSquare, User2, ThumbsUp, ThumbsDown, Eye, ArrowLeft, Mail } from 'lucide-react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
// import formatDate from '../utils/formatDate';

export default function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('questions');
  const { userId } = useParams();
  const navigate = useNavigate();


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };  



  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVER}/users/get-userProfile/${userId}`,
          { withCredentials: true }
        );
        // console.log('response', response);
        setUserData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-[#C8ACD6] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-[#C8ACD6] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-[#C8ACD6] rounded-full animate-bounce"></div>
        </div>
      </div>
    );
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
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#C8ACD6] hover:text-white 
                     transition-all duration-300 group mb-6"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* User Profile Header */}
          <div className="bg-[#2E236C]/20 rounded-xl p-6 sm:p-8 border-2 border-[#C8ACD6]/30
                        backdrop-blur-sm shadow-[0_0_15px_rgba(200,172,214,0.15)]">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img
                src={userData?.user?.avatar}
                alt={userData?.user?.fullName}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-[#C8ACD6]
                         shadow-[0_0_15px_rgba(200,172,214,0.3)] object-cover"
              />
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  {userData?.user?.fullName}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[#C8ACD6] text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{userData?.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {formatDate(userData?.user?.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
              <StatCard
                icon={<MessageSquare className="w-5 h-5" />}
                value={userData?.questions?.length || 0}
                label="Questions"
              />
              <StatCard
                icon={<User2 className="w-5 h-5" />}
                value={userData?.answers?.length || 0}
                label="Answers"
              />
              <StatCard
                icon={<ThumbsUp className="w-5 h-5" />}
                value={userData?.questions?.reduce((acc, q) => acc + (q.likeCount || 0), 0)}
                label="Total Likes"
              />
              <StatCard
                icon={<Eye className="w-5 h-5" />}
                value={userData?.questions?.reduce((acc, q) => acc + (q.views || 0), 0)}
                label="Total Views"
              />
            </div>
          </div>

          {/* Content Tabs */}
          <div className="mt-8">
            <div className="flex gap-4 border-b border-[#433D8B]/50 mb-6">
              <TabButton
                active={activeTab === 'questions'}
                onClick={() => setActiveTab('questions')}
                icon={<MessageSquare className="w-4 h-4" />}
                label="Questions"
                count={userData?.questions?.length}
              />
              <TabButton
                active={activeTab === 'answers'}
                onClick={() => setActiveTab('answers')}
                icon={<User2 className="w-4 h-4" />}
                label="Answers"
                count={userData?.answers?.length}
              />
            </div>

            {/* Content List */}
            <div className="space-y-4">
              {activeTab === 'questions' ? (
                userData?.questions?.map(question => (
                  <QuestionCard 
                    key={question._id} 
                    question={question}
                    formatDate={formatDate}
                  />
                ))
              ) : (
                userData?.answers?.map(answer => (
                  <AnswerCard 
                    key={answer._id} 
                    answer={answer}
                    formatDate={formatDate}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper Components
function StatCard({ icon, value, label }) {
  return (
    <div className="bg-[#2E236C]/30 rounded-lg p-4 flex flex-col items-center
                   border border-[#433D8B]/30 hover:border-[#C8ACD6]/30
                   transition-all duration-300">
      <div className="text-[#C8ACD6] mb-2">{icon}</div>
      <div className="text-xl font-bold text-white">{value}</div>
      <div className="text-sm text-[#C8ACD6]">{label}</div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium
                 transition-all duration-300 border-b-2 
                 ${active 
                   ? 'text-white border-[#C8ACD6]' 
                   : 'text-[#C8ACD6] border-transparent hover:text-white'
                 }`}
    >
      {icon}
      {label}
      <span className="ml-1 text-xs">({count})</span>
    </button>
  );
}

function QuestionCard({ question, formatDate }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/question/${question._id}`)}
      className="bg-[#2E236C]/20 rounded-lg p-4 border border-[#433D8B]/30
                 hover:border-[#C8ACD6]/30 transition-all duration-300 cursor-pointer"
    >
      <h3 className="text-lg font-semibold text-white mb-2 hover:text-[#C8ACD6] transition-colors">
        {question.title}
      </h3>
      <div className="flex flex-wrap items-center gap-4 text-sm text-[#C8ACD6]">
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {formatDate(question.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <ThumbsUp className="w-4 h-4" />
          {question.likeCount || 0}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          {question.views || 0}
        </span>
      </div>
      {question.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {question.tags.map(tag => (
            <span 
              key={tag} 
              className="px-2 py-1 text-xs rounded-full bg-[#433D8B]/30
                       text-[#C8ACD6] border border-[#433D8B]/30"
              onClick={(e) => e.stopPropagation()}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function AnswerCard({ answer, formatDate }) {
  const navigate = useNavigate();

  return (
    <div className="bg-[#2E236C]/20 rounded-lg p-4 border border-[#433D8B]/30
                   hover:border-[#C8ACD6]/30 transition-all duration-300">
      {/* Question Title Section */}
      <div 
        onClick={() => navigate(`/question/${answer.questionId._id}`)}
        className="mb-4 cursor-pointer group"
      >
        <h4 className="text-sm text-[#C8ACD6] mb-1">Answered on question:</h4>
        <h3 className="text-white font-medium group-hover:text-[#C8ACD6] transition-colors">
          {answer.questionId?.title || "Question no longer available"}
        </h3>
        
        {/* Question Details */}
        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#C8ACD6]/70">
          {answer.questionId?.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {answer.questionId.tags.map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-0.5 rounded-full bg-[#433D8B]/20 
                           border border-[#433D8B]/20"
                  onClick={(e) => e.stopPropagation()}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {answer.questionId?.views || 0} views
          </span>
        </div>
      </div>

      {/* Answer Content Section */}
      <div className="border-t border-[#433D8B]/30 pt-4">
        <div 
          className="text-[#C8ACD6] mb-3 prose prose-invert max-w-none" 
          dangerouslySetInnerHTML={{ 
            __html: answer.content?.substring(0, 150) + (answer.content?.length > 150 ? '...' : '') 
          }} 
        />
        
        <div className="flex items-center gap-4 text-sm text-[#C8ACD6]">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDate(answer.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            {answer.likeCount || 0}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsDown className="w-4 h-4" />
            {answer.dislikeCount || 0}
          </span>
        </div>
      </div>
    </div>
  );
}