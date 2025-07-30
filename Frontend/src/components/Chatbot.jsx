import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Chatbot = () => {
  const [text, setText] = useState("");
  const [responses, setResponses] = useState(() => {
    const saved = sessionStorage.getItem("chat_responses");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (responses.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    sessionStorage.setItem("chat_responses", JSON.stringify(responses));
  }, [responses]);


  const autoResizeTextarea = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const userMessage = { type: "user", content: text };
    setResponses((prev) => [...prev, userMessage]);
    setText("");
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "42px";
    }

    try {
      const { data } = await axios.post("http://localhost:5000/api/v1/chat", {
        text,
      });

      const botContent = data.response || data.text || "No response available";
      setResponses((prev) => [...prev, { type: "bot", content: botContent }]);
    } catch (err) {
      setResponses((prev) => [
        ...prev,
        { type: "bot", content: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setResponses([]);
    sessionStorage.removeItem("chat_responses");
  };

  return (
    <div className="flex min-h-screen text-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />

        <div className="relative flex flex-col h-[calc(100vh-8rem)] sm:h-[calc(100vh-6rem)] w-full max-w-6xl mx-auto px-4 md:ml-64 ">
          {/* Scrollable Messages Only */}
          <div
            className="flex-1 overflow-y-auto pt-4 pb-4 space-y-4 pr-4 scrollbar-thin scrollbar-thumb-[#433D8B] scrollbar-track-transparent"
            style={{ scrollbarGutter: "stable" }}
          >
            {/* Clear Chat Button */}
            {responses.length > 0 && (
              <div className="flex justify-start mb-2">
                <button
                  onClick={handleClearChat}
                  className="text-md font-bold text-gray-700 border-2 bg-[#C8ACD6] cursor-pointer transition-colors px-4 py-1 rounded-lg shadow"
                >
                  Clear Chat
                </button>
              </div>
            )}

            {/* Messages */}
            {responses.map((msg, i) => (
              <div
                key={i}
                className={`w-fit max-w-full md:max-w-[80%] break-words px-4 py-3 text-sm md:text-base rounded-2xl whitespace-pre-wrap ${
                  msg.type === "user"
                    ? "bg-gradient-to-br border-2 border-[#C8ACD6] hover:border-white transition-colors text-white self-end ml-auto rounded-br-none"
                    : "bg-gradient-to-br border-2 border-[#C8ACD6] hover:border-white transition-colors text-white self-start mr-auto rounded-bl-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.1),_0_4px_20px_rgba(0,0,0,0.2)]"
                }`}
              >
                {msg.type === "bot" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="w-15 h-10 self-start mr-auto mb-3 px-4 py-2 rounded-2xl shadow-lg bg-[#c9b5e5]/90 text-white flex items-center gap-2 animate-pulse">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:0ms]" />
                  <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
                  <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Fixed Input Bar - Not inside scrollable div */}
          <form
            onSubmit={handleSubmit}
            className="sticky bottom-0 left-0 right-0 z-10 bg-[#2E236C]/60 backdrop-blur-md sm:px-3 py-3 sm:mx-6 rounded-2xl shadow-md mt-2 flex items-center gap-3 justify-center"
          >
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                autoResizeTextarea();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask me anything..."
              rows={1}
              className="flex-1 resize-none bg-transparent border-none outline-none text-white placeholder-[#C8ACD6] text-base leading-tight overflow-hidden p-3"
              style={{ minHeight: "42px", maxHeight: "84px" }}
            />
            <button
              type="submit"
              className="bg-[#C8ACD6] hover:bg-[#C8ACf1] text-black px-4 py-2 rounded-xl transition-all cursor-pointer"
              disabled={loading}
            >
              {loading ? <span className="animate-pulse">...</span> : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
import React, { useState, useRef, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Chatbot = () => {
  const [text, setText] = useState("");
  const [responses, setResponses] = useState(() => {
    const saved = sessionStorage.getItem("chat_responses");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (responses.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    sessionStorage.setItem("chat_responses", JSON.stringify(responses));
  }, [responses]);


  const autoResizeTextarea = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const userMessage = { type: "user", content: text };
    setResponses((prev) => [...prev, userMessage]);
    setText("");
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = "42px";
    }

    try {
      const { data } = await axios.post("http://localhost:5000/api/v1/chat", {
        text,
      });

      const botContent = data.response || data.text || "No response available";
      setResponses((prev) => [...prev, { type: "bot", content: botContent }]);
    } catch (err) {
      setResponses((prev) => [
        ...prev,
        { type: "bot", content: "Something went wrong. Try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setResponses([]);
    sessionStorage.removeItem("chat_responses");
  };

  return (
    <div className="flex min-h-screen text-white">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />

        <div className="relative flex flex-col h-[calc(100vh-8rem)] sm:h-[calc(100vh-6rem)] w-full max-w-6xl mx-auto px-4 md:ml-64 ">
          {/* Scrollable Messages Only */}
          <div
            className="flex-1 overflow-y-auto pt-4 pb-4 space-y-4 pr-4"
            style={{ scrollbarGutter: "stable" }}
          >
            {/* Clear Chat Button */}
            {responses.length > 0 && (
              <div className="flex justify-start mb-2">
                <button
                  onClick={handleClearChat}
                  className="text-md font-bold text-gray-700 border-2 bg-[#C8ACD6] cursor-pointer transition-colors px-4 py-1 rounded-lg shadow"
                >
                  Clear Chat
                </button>
              </div>
            )}

            {/* Messages */}
            {responses.map((msg, i) => (
              <div
                key={i}
                className={`w-fit max-w-full md:max-w-[80%] break-words px-4 py-3 text-sm md:text-base rounded-2xl whitespace-pre-wrap ${
                  msg.type === "user"
                    ? "bg-gradient-to-br border-2 border-[#C8ACD6] hover:border-white transition-colors text-white self-end ml-auto rounded-br-none"
                    : "bg-gradient-to-br border-2 border-[#C8ACD6] hover:border-white transition-colors text-white self-start mr-auto rounded-bl-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.1),_0_4px_20px_rgba(0,0,0,0.2)]"
                }`}
              >
                {msg.type === "bot" ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="w-15 h-10 self-start mr-auto mb-3 px-4 py-2 rounded-2xl shadow-lg bg-[#c9b5e5]/90 text-white flex items-center gap-2 animate-pulse">
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:0ms]" />
                  <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:150ms]" />
                  <div className="h-2 w-2 bg-white rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Fixed Input Bar - Not inside scrollable div */}
          <form
            onSubmit={handleSubmit}
            className="sticky bottom-0 left-0 right-0 z-10 bg-[#2E236C]/60 backdrop-blur-md sm:px-3 py-3 sm:mx-6 rounded-2xl shadow-md mt-2 flex items-center gap-3 justify-center"
          >
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                autoResizeTextarea();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask me anything..."
              rows={1}
              className="flex-1 resize-none bg-transparent border-none outline-none text-white placeholder-[#C8ACD6] text-base leading-tight overflow-hidden p-3"
              style={{ minHeight: "42px", maxHeight: "84px" }}
            />
            <button
              type="submit"
              className="bg-[#C8ACD6] hover:bg-[#C8ACf1] text-black px-4 py-2 rounded-xl transition-all cursor-pointer"
              disabled={loading}
            >
              {loading ? <span className="animate-pulse">...</span> : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
