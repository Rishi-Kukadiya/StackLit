import { useState, useEffect, useRef } from "react";
import { useQuestions } from "../contexts/QuestionContext";
import Navbar from "./Navbar";
import CanvasBackground from "../CanvasBackground";
import Sidebar from "./Sidebar";
import QuestionList from "./QuestionList";
import { AnimatePresence } from "framer-motion";

export default function UnansweredQuestion() {
  const { questions, loading, error, hasMore, unanswerQuestions } = useQuestions();
  const [page, setPage] = useState(1);
  const loadingRef = useRef(null);
  useEffect(() => {
    unanswerQuestions(page);
  }, [page, unanswerQuestions]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <>
      <CanvasBackground />
      <div className="relative h-screen flex flex-col">
        <Navbar className="sticky top-0 z-50" />
        <Sidebar />

        {/* Main content area */}
        <main className="lg:ml-64 flex-1 overflow-y-auto transition-all duration-300">
          <div className="w-full px-4 py-4 md:py-6 lg:py-8">
            <div className="max-w-6xl mx-auto">
              <AnimatePresence>
                <div className="space-y-4">
                  <QuestionList questions={questions} />

                  {/* Loading indicator */}
                  <div ref={loadingRef} className="py-4 text-center">
                    {loading && (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-[#C8ACD6] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-[#C8ACD6] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-[#C8ACD6] rounded-full animate-bounce"></div>
                      </div>
                    )}
                    {!hasMore && questions.length > 0 && (
                      <p className="text-[#C8ACD6] text-sm">
                        No more questions to load
                      </p>
                    )}
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                  </div>
                </div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
