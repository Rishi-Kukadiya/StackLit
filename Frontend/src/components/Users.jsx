import React, { useEffect, useRef, useCallback, useState } from "react";
import { User, MessageSquare, ThumbsUp, Eye, UserCheck, Search, ArrowLeft,SearchX } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, resetUsers } from "../redux/userSlice";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ShimmerLoader from "./ShimmerLoader";
import { useNavigate } from "react-router-dom";

// A simple loading spinner for search
const LoadingSpinner = () => (
  <div className="flex justify-center items-center gap-2 mt-8">
    <span className="w-3 h-3 bg-[#C8ACD6] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
    <span className="w-3 h-3 bg-[#C8ACD6] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
    <span className="w-3 h-3 bg-[#C8ACD6] rounded-full animate-bounce"></span>
  </div>
);

export default function Users() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { users, loading, error, hasMore, page } = useSelector(
    (state) => state.users
  );

  const [viewMode, setViewMode] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const observer = useRef();

  useEffect(() => {
    if (viewMode === "all") {
      dispatch(resetUsers());
      dispatch(fetchUsers({ page: 1, limit: 12 }));
    }
  }, [dispatch, viewMode]);

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

  const handleSearchSubmit = useCallback(async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER}/search/users?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to find users.");
      }
      setSearchResults(data.data || []);
      setViewMode("search");
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleBackToAllUsers = () => {
    setViewMode("all");
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const UserCard = ({ user, isLast }) => {
    const cardClass = "relative w-full rounded-2xl p-6 border-2 border-[#C8ACD6]/20 shadow-[0_0_15px_rgba(200,172,214,0.18)] flex flex-col items-center transition-transform hover:scale-105 hover:border-[#C8ACD6]/40 mx-auto";
    const statClass = "flex items-center gap-2 px-3 py-2 rounded-full font-semibold text-sm text-[#C8ACD6] bg-transparent hover:text-white border border-[#C8ACD6]/20 shadow hover:shadow-lg transition-all duration-200 cursor-default whitespace-nowrap";

    return (
      <div ref={isLast ? lastUserRef : null} className={cardClass}>
        <button
          className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C8ACD6]/10 hover:bg-[#C8ACD6]/20 transition-all duration-200 group border-2 border-[#C8ACD6]/20 shadow-[0_0_15px_rgba(200,172,214,0.18)] hover:border-[#C8ACD6]/40 hover:shadow-[0_0_20px_rgba(200,172,214,0.25)] whitespace-nowrap cursor-pointer"
          onClick={() => handleProfileClick(user._id)}
          title="View Profile"
        >
          <UserCheck className="w-4 h-4 text-[#C8ACD6] opacity-70 group-hover:opacity-100 group-hover:text-white transition-all duration-200 flex-shrink-0" />
          <span className="text-sm text-[#C8ACD6] opacity-70 group-hover:opacity-100 group-hover:text-white transition-all duration-200 font-medium ">View User</span>
        </button>
        <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.fullName}`} alt={user.fullName} className="w-20 h-20 rounded-full border-4 border-[#C8ACD6] shadow-lg mb-4 object-cover" />
        <h3 className="text-xl font-semibold text-white mb-4 text-center break-words">{user.fullName}</h3>
        <div className="flex flex-wrap justify-center gap-3 mb-3 w-full">
          <div className={statClass}><MessageSquare className="w-4 h-4" /> {user.questionCount || 0} Questions</div>
          <div className={statClass}><User className="w-4 h-4" /> {user.answerCount || 0} Answers</div>
        </div>
        <div className="flex flex-wrap justify-center gap-3 w-full">
          <div className={statClass}><ThumbsUp className="w-4 h-4" /> {user.likeCount || 0} Likes</div>
          <div className={statClass}><Eye className="w-4 h-4" /> {user.totalViews || 0} Views</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <div className="fixed top-0 w-full z-40">
        <Navbar />
      </div>
      <Sidebar />

      {/* This new div creates the correct offset for the fixed sidebar */}
      <div className="lg:pl-64">
        <main className="pt-28 sm:pt-24 pb-10 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {/* --- Header and Search Bar --- */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {viewMode === 'search' ? `Search Results` : 'All Users'}
                </h1>
                {viewMode === 'search' && (
                  <button
                    onClick={handleBackToAllUsers}
                    className="mt-2 flex items-center gap-2 text-[#C8ACD6] hover:text-white transition-colors text-sm font-semibold"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to All Users
                  </button>
                )}
              </div>
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Find users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
                  className="w-full px-4 py-2 pl-10 bg-[#2E236C]/30 border border-[#433D8B]/30 rounded-lg text-white placeholder-[#C8ACD6]/60 focus:outline-none focus:border-[#C8ACD6]/60 transition-all duration-300"
                />
                <button
                  onClick={handleSearchSubmit}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 text-[#C8ACD6]" />
                </button>
              </div>
            </div>

            {/* --- Content Grid --- */}
            {viewMode === "search" ? (
              <div>
                {isSearching && <LoadingSpinner />}
                {searchError && <div className="text-red-400 text-center p-4">{searchError}</div>}
                {/* {!isSearching && searchResults.length === 0 && (
                    <div className="text-center py-12 text-[#C8ACD6] text-lg">No users found for "{searchQuery}".</div>
                  )} */}
                {!isSearching && searchResults.length === 0 && searchQuery && (
                  <div className="flex w-full items-center justify-center pt-16">
                    <div className="flex w-full max-w-md flex-col items-center rounded-xl bg-[#2E236C]/20 p-8 text-center border-2 border-[#433D8B]/30">
                      <SearchX className="h-16 w-16 text-[#C8ACD6]/50" />
                      <h3 className="mt-4 text-xl font-bold text-white">
                        No Results Found
                      </h3>
                      <p className="mt-2 text-[#C8ACD6]">
                        We couldn't find any users matching{" "}
                        <strong className="text-white">"{searchQuery}"</strong>.
                      </p>
                      <p className="mt-4 text-sm text-[#C8ACD6]/70">
                        Please try a different name or check the spelling.
                      </p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {searchResults.map((user) => (
                    <UserCard key={user._id} user={user} />
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {error && <div className="text-red-400 text-center p-4">{error}</div>}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {users.map((user, idx) => (
                    <UserCard
                      key={user._id}
                      user={user}
                      isLast={idx === users.length - 1}
                    />
                  ))}
                </div>
                {loading && users.length === 0 && <ShimmerLoader />}
                {loading && users.length > 0 && <LoadingSpinner />}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}