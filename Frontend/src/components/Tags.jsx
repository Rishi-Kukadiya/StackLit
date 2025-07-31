import React, { useState, useEffect, useCallback } from "react";
import { MessageSquare, Search } from "lucide-react";
import { FaTags } from "react-icons/fa";
import ShimmerLoader from "./ShimmerLoader";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import ErrorPopup from "./ErrorPopup";

// LoadingDots animated component
const LoadingDots = () => {
  return (
    <div className="flex justify-center items-center space-x-2 py-4">
      {[...Array(3)].map((_, i) => (
        <span
          key={i}
          className="w-3 h-3 bg-[#C8ACD6] rounded-full animate-pingDelay"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
      <style jsx>{`
        @keyframes pingDelay {
          0%,
          100% {
            transform: scale(0.7);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 1;
          }
        }
        .animate-pingDelay {
          animation: pingDelay 1.2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default function Tags() {
  const [tags, setTags] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalTags, setTotalTags] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  // Debounce search input by 300ms to reduce API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchTags = useCallback(
    async (pageNumber = 1, search = "") => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_SERVER
          }/tags/getTags?page=${pageNumber}&limit=${limit}&search=${encodeURIComponent(
            search
          )}`,
          { credentials: "include" }
        );
        const data = await response.json();
        const { tags: fetchedTags = [], totalTags: total = 0 } = data.data;

        if (pageNumber === 1) {
          setTags(fetchedTags);
        } else {
          // Prevent duplicate tags by tagName
          setTags((prev) => {
            const existing = new Set(prev.map((t) => t.tagName));
            const newTags = fetchedTags.filter((t) => !existing.has(t.tagName));
            return [...prev, ...newTags];
          });
        }
        setTotalTags(total);
        setHasMore(fetchedTags.length === limit);
        setPage(pageNumber);
      } catch (err) {
        setError("Failed to fetch tags.");
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  // Load tags initially and on debounced search changes
  useEffect(() => {
    fetchTags(1, debouncedSearch);
  }, [fetchTags, debouncedSearch]);

  // Infinite scroll handler
  useEffect(() => {
    if (!hasMore || loading) return;

    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight
      ) {
        fetchTags(page + 1, debouncedSearch);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loading, fetchTags, page, debouncedSearch]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden lg:block fixed top-0 left-0 h-full z-40">
        <Sidebar />
      </div>

      {/* Spacer to offset fixed navbar (larger on small to medium screens for better visibility) */}
      <div className="h-24 sm:h-28" />

      <div className="lg:pl-64 px-4 pb-10 max-w-7xl 2xl:max-w-[90vw] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mt-3">
              Tags
            </h1>
            <p className="text-[#C8ACD6] mt-1">{totalTags} tags available</p>
          </div>
          <div className="relative w-full sm:w-96 lg:w-[420px] xl:w-[520px]">
            <input
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full px-4 py-2 pl-10 bg-[#2E236C]/30 border border-[#433D8B]/30 rounded-lg text-white placeholder-[#C8ACD6]/60 focus:outline-none focus:border-[#C8ACD6]/60 transition-all duration-300"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#C8ACD6]" />
          </div>
        </div>

        {/* No tags message */}
        {!loading && !error && tags.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#C8ACD6] text-lg">
              No tags found matching your search.
            </p>
          </div>
        )}

        {/* Tags grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tags.map((tag) => (
            <div
              key={tag.tagName}
              className="group bg-[#2E236C]/20 rounded-lg p-6 border-2 border-[#433D8B]/30 hover:border-[#C8ACD6]/50 transition-all duration-300 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FaTags className="w-5 h-5 text-[#C8ACD6]" />
                  <h3 className="text-lg font-semibold text-white group-hover:text-[#C8ACD6] transition-colors truncate max-w-[150px] sm:max-w-full">
                    {tag.tagName}
                  </h3>
                </div>
                <span className="flex items-center gap-1 text-sm text-[#C8ACD6]">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium">Questions:</span>
                  <span className="ml-1 font-bold text-white">
                    {tag.totalQuestionsAsked}
                  </span>
                </span>
              </div>
              <p className="mt-4 text-[#C8ACD6] text-sm line-clamp-4">
                {tag.description}
              </p>
              <button
                className="mt-4 text-sm text-[#C8ACD6] hover:text-white transition-colors cursor-pointer"
                onClick={() => {
                  // Placeholder: navigate to questions by tag
                }}
              >
                View questions →
              </button>
            </div>
          ))}
        
          {loading &&
            page === 1 &&
            tags.length === 0 &&
            [...Array(6)].map((_, i) => <ShimmerLoader key={i} />)}
        </div>

        {loading && page > 1 && <LoadingDots />}


        {error && (
          <ErrorPopup
            message={error}
            onClose={() => setError("")}
          />
        )}
      </div>
    </div>
  );
}
