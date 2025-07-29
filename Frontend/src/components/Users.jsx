import React, { useEffect, useRef, useCallback } from "react";
import { User, MessageSquare, ThumbsUp, Eye, UserCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, resetUsers } from "../redux/userSlice";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ShimmerLoader from "./ShimmerLoader";
import avtart from "../assets/avtart.jpg";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error, hasMore, page } = useSelector(
    (state) => state.users
  );
  const observer = useRef();
  const isFirstLoad = useRef(true);
  
  useEffect(() => {
    dispatch(resetUsers());
    dispatch(fetchUsers({ page: 1, limit: 12 }));
  }, []);

  useEffect(() => {
    if (page > 1) {
      isFirstLoad.current = false;
    }
  }, [page]);

  const lastUserRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new window.IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(fetchUsers({ page, limit: 12 }));
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, dispatch]
  );

  const handleProfileClick = (userId, e) => {
    e.stopPropagation(); // Prevent any parent event bubbling
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <div className="fixed top-0 w-full z-40">
        <Navbar />
      </div>
      <Sidebar />
      <main className="flex-1 flex flex-col items-end justify-center pt-32 sm:pt-24 pb-15 mr-6 sm:mr-10 sm:ml-10">
        {error && <div className="text-red-400 text-center p-4">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-2 sm:px-0 ">
          {users.map((user, idx) => {
            const cardClass =
              "relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-2xl p-4 sm:p-6 border-2 border-[#C8ACD6]/20 shadow-[0_0_15px_rgba(200,172,214,0.18)] flex flex-col items-center transition-transform hover:scale-105 hover:border-[#C8ACD6]/40 mx-auto";
            const statClass =
              "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full font-semibold text-xs sm:text-sm text-[#C8ACD6] hover:text-white border border-[#C8ACD6]/20 shadow hover:shadow-lg transition-all duration-200 cursor-pointer whitespace-nowrap";
            
            if (idx === users.length - 1) {
              return (
                <div
                  ref={lastUserRef}
                  key={user._id || idx}
                  className={cardClass}
                >
                  <button 
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-full bg-[#C8ACD6]/10 hover:bg-[#C8ACD6]/20 transition-all duration-200 group border-2 border-[#C8ACD6]/20 shadow-[0_0_15px_rgba(200,172,214,0.18)] hover:border-[#C8ACD6]/40 hover:shadow-[0_0_20px_rgba(200,172,214,0.25)] whitespace-nowrap cursor-pointer"
                    onClick={(e) => handleProfileClick(user._id, e)}
                    title="View Profile"
                  >
                    <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 text-[#C8ACD6] opacity-70 group-hover:opacity-100 group-hover:text-white transition-all duration-200 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-[#C8ACD6] opacity-70 group-hover:opacity-100 group-hover:text-white transition-all duration-200 font-medium ">
                      View User
                    </span>
                  </button>
                  <img
                    src={user.avatar || avtart}
                    alt={user.fullName}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#C8ACD6] shadow-lg mb-3 sm:mb-4 object-cover"
                  />
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 text-center break-words">
                    {user.fullName}
                  </h3>
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-2 sm:mb-3 w-full">
                    <button className={statClass}>
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                      {user.questionCount || 0} Questions
                    </button>
                    <button className={statClass}>
                      <User className="w-4 h-4 sm:w-5 sm:h-5" />
                      {user.answerCount || 0} Answers
                    </button>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full">
                    <button className={statClass}>
                      <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                      {user.likeCount || 0} Likes
                    </button>
                    <button className={statClass}>
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                      {user.totalViews || 0} Views
                    </button>
                  </div>
                </div>
              );
            }
            return (
              <div
                key={user._id || idx}
                className={cardClass}
              >
                <button 
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-full bg-[#C8ACD6]/10 hover:bg-[#C8ACD6]/20 transition-all duration-200 group border-2 border-[#C8ACD6]/20 shadow-[0_0_15px_rgba(200,172,214,0.18)] hover:border-[#C8ACD6]/40 hover:shadow-[0_0_20px_rgba(200,172,214,0.25)] whitespace-nowrap cursor-pointer"
                    onClick={(e) => handleProfileClick(user._id, e)}
                    title="View Profile"
                  >
                    <UserCheck className="w-3 h-3 sm:w-4 sm:h-4 text-[#C8ACD6] opacity-70 group-hover:opacity-100 group-hover:text-white transition-all duration-200 flex-shrink-0" />
                    <span className="text-xs sm:text-sm text-[#C8ACD6] opacity-70 group-hover:opacity-100 group-hover:text-white transition-all duration-200 font-medium ">
                      View User
                    </span>
                  </button>
                <img
                  src={
                    user.avatar ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
                  }
                  alt={user.fullName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-[#C8ACD6] shadow-lg mb-3 sm:mb-4 object-cover"
                />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 text-center break-words">
                  {user.fullName}
                </h3>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-2 sm:mb-3 w-full">
                  <button className={statClass}>
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                    {user.questionCount || 0} Questions
                  </button>
                  <button className={statClass}>
                    <User className="w-4 h-4 sm:w-5 sm:h-5" />
                    {user.answerCount || 0} Answers
                  </button>
                </div>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full">
                  <button className={statClass}>
                    <ThumbsUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    {user.likeCount || 0} Likes
                  </button>
                  <button className={statClass}>
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    {user.totalViews || 0} Views
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {loading && isFirstLoad.current ? (
          <ShimmerLoader />
        ) : loading ? (
          <div className="flex justify-center items-center gap-1 mt-4">
            <span className="w-2 h-2 bg-[#C8ACD6] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 bg-[#C8ACD6] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 bg-[#C8ACD6] rounded-full animate-bounce"></span>
          </div>
        ) : null}
      </main>
    </div>
  );
}