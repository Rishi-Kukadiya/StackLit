import {
  Tag,
  Eye,
  ThumbsUp,
  Clock,
  User,
  ArrowRight,
  ChevronLeft,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Avtart from "../assets/avtart.jpg";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuestionById } from "../redux/questionsSlice";
// Add a loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="flex gap-2">
      <div className="w-2 h-2 bg-[#C8ACD6] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-[#C8ACD6] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-[#C8ACD6] rounded-full animate-bounce"></div>
    </div>
  </div>
);

export default function QuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(null);
  const [expandedAnswers, setExpandedAnswers] = useState({});

  const { items, loading, error } = useSelector((state) => state.questions);
  const questionFromStore = items.find((q) => q._id === id);

  useEffect(() => {
    if (id && !questionFromStore) {
       dispatch(fetchQuestionById(id));
    }
  }, [id, questionFromStore, dispatch]);

  useEffect(() => {
    if (questionFromStore) {
      setQuestion(questionFromStore.question);
      if (questionFromStore.answers) {
        setAnswers(questionFromStore.answers);
      }
    }
  }, [questionFromStore]);

  // useEffect(() => {
    // const fetchQuestionData = async () => {
    //   try {
    //     setLoading(true);
    //     const response = await axios.get(`${import.meta.env.VITE_SERVER}/questions/get-question/${id}`, {
    //       withCredentials: true
    //     });

    //     // console.log('Question Content:', response.data.data);

    //     if (response.data.success) {
    //       setQuestion(response.data.data);
    //       // If your API returns answers with the question, set them here
    //       if (response.data.data.answers) {
    //         setAnswers(response.data.data.answers);
    //       }
    //     } else {
    //       setError(response.data.message || 'Failed to fetch question');
    //     }
    //   } catch (err) {
    //     console.error('Error fetching question:', err);
    //     setError(err.message || 'Failed to fetch question');
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // if (id) {
    //   fetchQuestionData();
    // }

  //   if (!questions) {
  //     dispatch(fetchQuestionById(id));
  //   }
  // }, [id, questions, dispatch]);

  // Function to truncate text to first few lines
  const truncateContent = (content) => {
    const lines = content.split("\n").filter((line) => line.trim());
    if (lines.length <= 2) return content;
    return lines.slice(0, 2).join("\n") + "...";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <Sidebar />
        <div
          className="pt-16 min-h-screen overflow-y-auto relative z-10 
                    transition-all duration-300
                    mx-auto w-full
                    lg:ml-64 lg:w-[calc(100%-16rem)]"
        >
          <LoadingSpinner />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Sidebar />
        <div
          className="pt-16 min-h-screen overflow-y-auto relative z-10 
                    transition-all duration-300
                    mx-auto w-full
                    lg:ml-64 lg:w-[calc(100%-16rem)]"
        >
          <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="text-red-400 text-center p-8">
              <p>{error}</p>
              <button
                onClick={() => navigate(-1)}
                className="mt-4 text-[#C8ACD6] hover:text-white transition-colors"
              >
                Go back to questions
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!question) {
    return (
      <>
        <Navbar />
        <Sidebar />
        <div
          className="pt-16 min-h-screen overflow-y-auto relative z-10 
                    transition-all duration-300
                    mx-auto w-full
                    lg:ml-64 lg:w-[calc(100%-16rem)]"
        >
          <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
            <div className="text-[#C8ACD6] text-center p-8">
              Question not found
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed top-0 w-full z-50">
        <Navbar />
      </div>
      <Sidebar />
      <div
        className="pt-16 min-h-screen overflow-y-auto relative z-10 
              transition-all duration-300
              mx-auto w-full
              lg:ml-64 lg:w-[calc(100%-16rem)]"
      >
        <div className="max-w-4xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="space-y-6">
            {/* Back Button - Positioned independently */}
            <div className="sticky top-16 sm:top-20 mb-15 z-[60] w-fit px-4 sm:px-0">
              {" "}
              {/* Updated positioning and padding */}
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-[#C8ACD6] hover:text-white 
                        transition-all duration-300 group
                        bg-[#2E236C]/60 backdrop-blur-sm p-2.5 rounded-lg
                        border border-[#433D8B]/30 hover:border-[#C8ACD6]/50
                        shadow-[0_0_10px_rgba(200,172,214,0.1)]"
              >
                <ChevronLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
                <span className="inline text-sm font-medium">
                  Back to Questions
                </span>
              </button>
            </div>

            {/* Question Content */}
            <div
              className="relative bg-transparent rounded-lg p-4 sm:p-6
                transform transition-all duration-300
                border-2 border-[#C8ACD6]/30 hover:border-[#C8ACD6]/50
                shadow-[0_0_15px_rgba(200,172,214,0.2)]"
            >
              {/* Row 1: User Info Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 border-b border-[#433D8B]/50 pb-4">
                <div className="flex-shrink-0">
                  <img
                    // Replace data.data.question with just question
                    src={question.question.owner?.avatar || Avtart}
                    alt={question.question.owner?.email || "User"}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#C8ACD6] hover:border-white transition-colors"
                  />
                </div>
                <div className="flex-grow w-full sm:w-auto">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-white font-medium">
                      {(question.question.owner?.fullName
                        ?.split("@")[0]
                        ?.substring(0, 5) || "Anonymous") + "..."}
                    </h3>
                  </div>
                  <div className="text-[#C8ACD6] text-xs sm:text-sm flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {formatDate(question.question.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Question Content */}
              <div className="mb-6">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
                  {question.question.title}
                </h1>
                <div
                  className="text-[#C8ACD6] space-y-4 mb-6 text-sm sm:text-base prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: question.question.content,
                  }}
                ></div>

                {/* Images Section */}
                {question.question.images &&
                  question.question.images.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {question.question.images.map((imageUrl, index) => (
                        <img
                          key={index}
                          src={imageUrl}
                          alt={`Question image ${index + 1}`}
                          className="w-full rounded-lg border border-[#433D8B]/30 hover:border-[#C8ACD6]/50 transition-all duration-300"
                        />
                      ))}
                    </div>
                  )}
              </div>

              {/* Row 3: Footer Section */}
              <div className="space-y-4 pt-4 border-t border-[#433D8B]/50">
                {/* Tags and Answerers Row */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {question &&
                      question.question.tags &&
                      question.question.tags.length > 0 &&
                      question.question.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-2 px-3 py-2 bg-[#2E236C]/30 text-[#C8ACD6] 
                               rounded-lg text-sm border border-[#433D8B]/20 
                               hover:border-[#C8ACD6]/30 hover:text-white 
                               transition-all duration-300"
                        >
                          <Tag className="w-4 h-4" />
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
                {/* Answerers */}
                <div className="flex items-center">
                  <div className="flex -space-x-3">
                    {(question.question.answeredBy || []).map((answerer) => (
                      <div
                        key={answerer._id}
                        className="relative"
                        onMouseEnter={() => setShowTooltip(answerer._id)}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        <img
                          src={answerer.avatar || Avtart}
                          alt={answerer.email || "User"}
                          className="w-8 h-8 rounded-full border-2 border-[#2E236C] hover:border-[#C8ACD6]/50 transition-all duration-300"
                        />
                        {showTooltip === answerer._id && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#17153B]/90 text-white text-xs rounded whitespace-nowrap">
                            {answerer.email?.split("@")[0] || "Anonymous"}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Interaction Row: likes and dislikes and Post Answer */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                {/* Voting */}
                <div className="flex items-center gap-3 bg-[#2E236C]/60 backdrop-blur-sm p-2 rounded-lg shadow-md border border-[#433D8B]/30">
                  <button className="p-1.5 text-[#C8ACD6] hover:text-white transition-colors">
                    <ThumbsUp className="w-5 h-5" />
                  </button>
                  <span className="text-white text-center font-medium min-w-[2rem]">
                    {question.question.likes}
                  </span>
                  <button className="p-1.5 text-[#C8ACD6] hover:text-white transition-colors">
                    <ThumbsUp className="w-5 h-5 transform rotate-180" />
                  </button>
                  <span className="text-white text-center font-medium min-w-[2rem]">
                    {question.question.dislikes}
                  </span>
                </div>

                {/* Post Answer Button */}
                <button
                  onClick={() =>
                    navigate("/answer", {
                      state: {
                        questionId: question.question._id,
                        questionTitle: question.question.title,
                        ownerAvatar: question.question.owner?.avatar || Avtart,
                        ownerName:
                          (question.question.owner?.fullName
                            ?.split("@")[0]
                            ?.substring(0, 5) || "Anonymous") + "...",
                      },
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-[#433D8B]/60 text-white rounded-lg
                  hover:bg-[#17153B]/70 transition-all duration-300 border border-[#C8ACD6]/30
                  w-full sm:w-auto justify-center sm:justify-start"
                >
                  <span className="text-sm font-medium">Post Your Answer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="ml-3 text-[#C8ACD6] text-sm">
                  {(question.question.answeredBy || []).length} answers
                </span>
              </div>
            </div>
          </div>

          {/* Answers Section - Newly Added */}
          <div className="mt-12 space-y-8">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              {answers.length} Answers
            </h2>

            {answers.map((answer) => (
              <div
                key={answer.id}
                className="relative bg-transparent rounded-lg p-4 sm:p-6
                          transform transition-all duration-300
                          border-2 border-[#C8ACD6]/30 hover:border-[#C8ACD6]/50
                          shadow-[0_0_15px_rgba(200,172,214,0.2)]"
              >
                {/* Answer Author Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={answer.owner.avatar}
                    alt={answer.owner.fullName}
                    className="w-8 h-8 rounded-full border-2 border-[#C8ACD6] hover:border-white transition-colors"
                  />
                  <div>
                    <h3 className="text-white font-medium">
                      {answer.owner.fullName}
                    </h3>
                    <span className="text-[#C8ACD6] text-xs">
                      answered {formatDate(answer.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Answer Content */}
                <div className="text-[#C8ACD6] space-y-4 mb-6 text-sm sm:text-base">
                  <div
                    className={`relative ${
                      !expandedAnswers[answer.id]
                        ? "max-h-32 overflow-hidden"
                        : ""
                    }`}
                  >
                    {answer.content.split("```").map((block, index) => {
                      if (index % 2 === 1) {
                        // Code block
                        return (
                          <pre
                            key={index}
                            className="bg-[#17153B]/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm border border-[#433D8B]/30"
                          >
                            <code className="text-white whitespace-pre-wrap">
                              {block}
                            </code>
                          </pre>
                        );
                      }
                      return (
                        <p key={index} className="whitespace-pre-wrap">
                          {block}
                        </p>
                      );
                    })}

                    {!expandedAnswers[answer.id] && (
                      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#17153B] to-transparent"></div>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setExpandedAnswers((prev) => ({
                        ...prev,
                        [answer.id]: !prev[answer.id],
                      }))
                    }
                    className="text-[#C8ACD6] hover:text-white text-sm transition-colors mt-2 flex items-center gap-2"
                  >
                    {expandedAnswers[answer.id] ? "Show less" : "Read more"}
                    <ChevronLeft
                      className={`w-4 h-4 transform transition-transform ${
                        expandedAnswers[answer.id] ? "rotate-90" : "-rotate-90"
                      }`}
                    />
                  </button>
                </div>

                {/* Answer Footer */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3 bg-[#2E236C]/60 backdrop-blur-sm p-2 rounded-lg shadow-md border border-[#433D8B]/30">
                    <button className="p-1.5 text-[#C8ACD6] hover:text-white transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <span className="text-white text-center font-medium min-w-[2rem]">
                      {answer.likes}
                    </span>
                    <button className="p-1.5 text-[#C8ACD6] hover:text-white transition-colors">
                      <ThumbsUp className="w-4 h-4 transform rotate-180" />
                    </button>
                    <span className="text-white text-center font-medium min-w-[2rem]">
                      {answer.dislikes}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* No answers message */}
            {answers.length === 0 && (
              <div className="text-center text-[#C8ACD6] text-sm sm:text-base py-4">
                No answers yet. Be the first to answer this question!
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
