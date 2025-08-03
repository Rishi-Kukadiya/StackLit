import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { FileSearch } from "lucide-react"; // Icon import
import { useQuestions } from "../contexts/QuestionContext";
import Navbar from "./Navbar";
import CanvasBackground from "../CanvasBackground";
import Sidebar from "./Sidebar";
import QuestionList from "./QuestionList";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const {
    questions,
    loading,
    error,
    hasMore,
    fetchQuestions,
    unanswerQuestions,
    searchQuestions,
  } = useQuestions();

  const [page, setPage] = useState(1);
  const [questionType, setQuestionType] = useState("all");
  const [showLoadMore, setShowLoadMore] = useState(false);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");
  const loadMoreRef = useRef(null);

  // Effect for initial data fetching (page 1)
  useEffect(() => {
    setPage(1);
    setShowLoadMore(false);
    if (searchQuery) {
      searchQuestions(searchQuery, 1);
    } else {
      if (questionType === "all") {
        fetchQuestions(1);
      } else {
        unanswerQuestions(1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, questionType]);

  // Effect for handling pagination (pages > 1)
  useEffect(() => {
    if (page > 1) {
      if (searchQuery) {
        searchQuestions(searchQuery, page);
      } else if (questionType === "all") {
        fetchQuestions(page);
      } else {
        unanswerQuestions(page);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Observer to show the "Load More" button when user scrolls to the bottom
  useEffect(() => {
    if (!hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShowLoadMore(true);
          if (loadMoreRef.current) {
            observer.unobserve(loadMoreRef.current);
          }
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loading, questions]);

  const handleLoadMore = () => {
    setShowLoadMore(false);
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      <CanvasBackground />
      <div className="relative h-screen flex flex-col">
        <Navbar className="sticky top-0 z-50" />
        <Sidebar />

        <main className="lg:ml-64 flex-1 overflow-y-auto transition-all duration-300">
          <div className="w-full px-4 py-4 md:py-6 lg:py-8">
            <div className="max-w-6xl mx-auto">
              <AnimatePresence>
                <div className="space-y-4">
                  {searchQuery && !loading && (
                    <h2 className="text-xl font-bold text-white px-4">
                      Search Results for: "{searchQuery}"
                    </h2>
                  )}

                  {/* --- MODIFIED SECTION --- */}
                  {/* Shows "Not Found" message only on an empty search result */}
                  {!loading && searchQuery && questions.length === 0 ? (
                    <div className="flex w-full items-center justify-center pt-16">
                      <div className="flex w-full max-w-md flex-col items-center rounded-xl bg-[#2E236C]/20 p-8 text-center border-2 border-[#433D8B]/30">
                        <FileSearch className="h-16 w-16 text-[#C8ACD6]/50" />
                        <h3 className="mt-4 text-xl font-bold text-white">
                          No Questions Found
                        </h3>
                        <p className="mt-2 text-[#C8ACD6]">
                          We couldn't find any questions matching your search.
                        </p>
                        <p className="mt-4 text-sm text-[#C8ACD6]/70">
                          Try using different keywords or ask a new question!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <QuestionList questions={questions} />
                  )}
                  {/* --- END MODIFIED SECTION --- */}

                  {/* Loading indicator and other messages */}
                  <div className="py-4 text-center">
                    {loading && (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-[#C8ACD6] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-[#C8ACD6] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-[#C8ACD6] rounded-full animate-bounce"></div>
                      </div>
                    )}

                    {!loading && !hasMore && questions.length > 0 && (
                      <p className="text-[#C8ACD6] text-sm">
                        You've reached the end.
                      </p>
                    )}
                    
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                  </div>

                  <div ref={loadMoreRef} style={{ height: "1px" }} />
                </div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}