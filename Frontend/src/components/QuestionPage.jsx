import { Tag, Eye, ThumbsUp, Clock, User, ArrowRight, ChevronLeft, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

// Mock data for development
const mockQuestion = {
  id: 1,
  title: "How to implement async/await in React components?",
  content: `I'm trying to understand the best practices for handling asynchronous operations in React components. Here's my current implementation:

\`\`\`javascript
const MyComponent = () => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const result = await api.getData();
      setData(result);
    };
    fetchData();
  }, []);
  
  return <div>{data}</div>;
};
\`\`\`

Is this the correct way to handle async operations? Any suggestions for error handling?`,
  tags: ["react", "javascript", "async-await", "hooks"],
  views: 1234,
  likes: 56,
  dislikes: 12,
  createdAt: "2025-07-15T10:30:00Z",
  author: {
    id: 1,
    username: "techexplorer",
    reputation: 3240,
    profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=techexplorer"
  },
  answerers: [
    { id: 2, username: "codemaster", profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=codemaster" },
    { id: 3, username: "reactdev", profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=reactdev" },
    { id: 4, username: "webguru", profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=webguru" }
  ]
};

const mockAnswers = [
  {
    id: 1,
    content: "Here's a detailed explanation...",
    author: {
      username: "codemaster",
      profilePhoto: "https://api.dicebear.com/7.x/avataaars/svg?seed=codemaster"
    },
    createdAt: "2025-07-16T10:30:00Z",
    likes: 23,
    dislikes: 2
  },
  // ...add more mock answers
];

export default function QuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question] = useState(mockQuestion);
  const [answers] = useState(mockAnswers);
  const [showTooltip, setShowTooltip] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
  <>
    <div className="fixed top-0 w-full z-50">
      <Navbar />
    </div>
    
    {/* Update sidebar container */}
    <div className="fixed top-0 left-0 h-full z-40 lg:block">
      <Sidebar />
    </div>

    {/* Update main content container */}
    <div className="pt-16 min-h-screen overflow-y-auto relative z-10 w-full px-4 lg:pl-64 transition-all duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Add Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 text-[#C8ACD6] hover:text-white transition-all duration-300 group"
        >
          <ChevronLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Questions</span>
        </button>

        <div className="relative bg-transparent rounded-lg p-4 sm:p-6
              transform transition-all duration-300
              border-2 border-[#C8ACD6]/30 hover:border-[#C8ACD6]/50
              shadow-[0_0_15px_rgba(200,172,214,0.2)]">
          
          {/* Row 1: User Info Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 border-b border-[#433D8B]/50 pb-4">
            <div className="flex-shrink-0">
              <img 
                src={question.author.profilePhoto} 
                alt={question.author.username}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#C8ACD6] hover:border-white transition-colors"
              />
            </div>
            <div className="flex-grow w-full sm:w-auto">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-white font-medium">{question.author.username}</h3>
              </div>
              <div className="text-[#C8ACD6] text-xs sm:text-sm flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                <span className="flex items-center">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {formatDate(question.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Row 2: Question Content */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
              {question.title}
            </h1>
            <div className="text-[#C8ACD6] space-y-4 mb-6 text-sm sm:text-base">
              {question.content.split('```').map((block, index) => {
                if (index % 2 === 1) { // Code block
                  return (
                    <pre key={index} className="bg-[#17153B]/80 backdrop-blur-sm p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm border border-[#433D8B]/30">
                      <code className="text-white whitespace-pre-wrap">{block}</code>
                    </pre>
                  );
                }
                return <p key={index} className="whitespace-pre-wrap">{block}</p>;
              })}
            </div>
          </div>

          {/* Row 3: Footer Section */}
          <div className="space-y-4 pt-4 border-t border-[#433D8B]/50">
            {/* Tags and Answerers Row */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {question.tags.map((tag) => (
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

              {/* Answerers */}
              <div className="flex items-center">
                <div className="flex -space-x-3">
                  {question.answerers.map((answerer) => (
                    <div 
                      key={answerer.id}
                      className="relative"
                      onMouseEnter={() => setShowTooltip(answerer.id)}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <img
                        src={answerer.profilePhoto}
                        alt={answerer.username}
                        className="w-8 h-8 rounded-full border-2 border-[#2E236C] hover:border-[#C8ACD6]/50 transition-all duration-300"
                      />
                      {showTooltip === answerer.id && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-[#17153B]/90 text-white text-xs rounded whitespace-nowrap">
                          {answerer.username}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <span className="ml-3 text-[#C8ACD6] text-sm">
                  {question.answerers.length} answers
                </span>
              </div>
            </div>

            {/* Interaction Row: Voting and Post Answer */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Voting */}
              <div className="flex items-center gap-3 bg-[#2E236C]/60 backdrop-blur-sm p-2 rounded-lg shadow-md border border-[#433D8B]/30">
                <button className="p-1.5 text-[#C8ACD6] hover:text-white transition-colors">
                  <ThumbsUp className="w-5 h-5" />
                </button>
                <span className="text-white text-center font-medium min-w-[2rem]">
                  {question.likes}
                </span>
                <button className="p-1.5 text-[#C8ACD6] hover:text-white transition-colors">
                  <ThumbsUp className="w-5 h-5 transform rotate-180" />
                </button>
                <span className="text-white text-center font-medium min-w-[2rem]">
                  {question.dislikes}
                </span>
              </div>

              {/* Post Answer Button */}
              <button 
                onClick={() => {/* Add your answer handling logic here */}}
                className="flex items-center gap-2 px-4 py-2 bg-[#433D8B]/60 text-white rounded-lg
                         hover:bg-[#17153B]/70 transition-all duration-300 border border-[#C8ACD6]/30
                         w-full sm:w-auto justify-center sm:justify-start"
              >
                <span className="text-sm font-medium">Post Your Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>


        </div>

        {/* Add Answers Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {question.answerers.length} Answers
          </h2>

          {/* Answers List */}
          <div className="space-y-6">
            {answers.map((answer) => (
              <div 
                key={answer.id}
                className="relative bg-transparent rounded-lg p-4 sm:p-6
                          border-2 border-[#C8ACD6]/30 hover:border-[#C8ACD6]/50
                          transform transition-all duration-300
                          shadow-[0_0_15px_rgba(200,172,214,0.2)]"
              >
                {/* Answer Author Info */}
                <div className="flex items-center gap-3 mb-4">
                  <img 
                    src={answer.author.profilePhoto}
                    alt={answer.author.username}
                    className="w-8 h-8 rounded-full border-2 border-[#C8ACD6] hover:border-white transition-colors"
                  />
                  <div>
                    <h3 className="text-white font-medium">{answer.author.username}</h3>
                    <span className="text-[#C8ACD6] text-xs">
                      answered {formatDate(answer.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Answer Content */}
                <div className="text-[#C8ACD6] space-y-4 mb-4">
                  <p className="whitespace-pre-wrap">{answer.content}</p>
                </div>

                {/* Answer Footer */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-[#2E236C]/30 p-2 rounded-lg 
                                border border-[#433D8B]/20">
                    <button className="p-1.5 text-[#C8ACD6] hover:text-white transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <span className="text-white text-sm font-medium">
                      {answer.likes}
                    </span>
                    <button className="p-1.5 text-[#C8ACD6] hover:text-white transition-colors">
                      <ThumbsUp className="w-4 h-4 transform rotate-180" />
                    </button>
                    <span className="text-white text-sm font-medium">
                      {answer.dislikes}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Answer Form */}
        <div className="mt-8 mb-8">
          <button 
            className="w-full bg-[#433D8B]/60 hover:bg-[#17153B]/70 
                     text-white rounded-lg py-4 px-6
                     border border-[#C8ACD6]/30 
                     transition-all duration-300
                     flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Write Your Answer
          </button>
        </div>
      </div>
    </div>
  </>
  );
}
