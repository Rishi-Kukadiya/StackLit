import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import CanvasBackground from "../CanvasBackground";
import Sidebar from "./Sidebar";
import QuestionCard from "./QuestionCard";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_SERVER}/questions/get-questions`, {
          withCredentials: true
        });
        
        console.log('Fetched questions:', response.data);
        if (response.data.success) {
          setQuestions(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch questions');
          // Use mock data if API fails
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(err.message);
        // Use mock data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

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
									{questions.map((question) => (
										<QuestionCard key={question.id} question={question} />
									))}
								</div>
							</AnimatePresence>
						</div>
					</div>
				</main>
			</div>
		</>
	);
}
