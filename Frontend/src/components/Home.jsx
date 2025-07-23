import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import CanvasBackground from "../CanvasBackground";
import Sidebar from "./Sidebar";
import QuestionList from "./QuestionList";
import { AnimatePresence } from "framer-motion";

// Fallback data for development
// const mockQuestions = [
// 	{
// 		id: 1,
// 		title: "How to implement async/await in React components?",
// 		content: `I'm trying to understand the best practices for handling asynchronous operations in React components. Here's my current implementation...`,
// 		tags: ["react", "javascript", "async-await", "hooks"],
// 		views: 1234,
// 		likes: 56,
// 		dislikes: 12,
// 		createdAt: "2025-07-15T10:30:00Z",
// 		author: {
// 			id: 1,
// 			username: "techexplorer",
// 			reputation: 3240,
// 			profilePhoto:
// 				"https://api.dicebear.com/7.x/avataaars/svg?seed=techexplorer",
// 		},
// 		answerers: [
// 			{
// 				id: 2,
// 				username: "codemaster",
// 				profilePhoto:
// 					"https://api.dicebear.com/7.x/avataaars/svg?seed=codemaster",
// 			},
// 			{
// 				id: 3,
// 				username: "reactdev",
// 				profilePhoto:
// 					"https://api.dicebear.com/7.x/avataaars/svg?seed=reactdev",
// 			},
// 			{
// 				id: 4,
// 				username: "webguru",
// 				profilePhoto:
// 					"https://api.dicebear.com/7.x/avataaars/svg?seed=webguru",
// 			},
// 		],
// 	},
// 	// Add more mock questions here
// ];

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(null);

  const fetchQuestions = async (pageNum) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_SERVER}/questions/get-questions`, {
        params: {
          page: pageNum,
          limit: 10
        },
        withCredentials: true
      });
      
    //   console.log('Fetched questions:', response.data);
      if (response.data.success) {
        const newQuestions = response.data.data;
        setQuestions(prev => [...prev, ...newQuestions]);
        // If we got fewer questions than the limit, we've reached the end
        setHasMore(newQuestions.length === 10);
      } else {
        setError(response.data.message || 'Failed to fetch questions');
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions(page);
  }, [page]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (loadingRef.current) {
      observer.observe(loadingRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading]);

  console.log("Current questions state:", questions);
  console.log("Loading state:", loading);
  console.log("Error state:", error);

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
											<p className="text-[#C8ACD6] text-sm">No more questions to load</p>
										)}
										{error && (
											<p className="text-red-400 text-sm">{error}</p>
										)}
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
