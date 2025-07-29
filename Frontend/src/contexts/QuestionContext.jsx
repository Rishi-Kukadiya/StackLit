import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";

const QuestionContext = createContext();

export function QuestionProvider({ children }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [refersh, setRefresh] = useState(false);

  const fetchQuestions = useCallback(async (pageNum) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/questions/get-questions`,
        {
          params: {
            page: pageNum,
            limit: 10,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const newQuestions = response?.data?.data;

        // If it's page 1, replace existing questions
        if (pageNum === 1) {
          setQuestions(newQuestions);
        } else {
          // For subsequent pages, append only unique questions
          setQuestions((prev) => {
            const existingIds = new Set(prev.map((q) => q._id));
            const uniqueNewQuestions = newQuestions.filter(
              (q) => !existingIds.has(q._id)
            );
            return [...prev, ...uniqueNewQuestions];
          });
        }

        setHasMore(newQuestions.length === 10);
      } else {
        setError(response.data.message || "Failed to fetch questions");
      }
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // First, modify the unanswerQuestions function to handle pagination like fetchQuestions
  const unanswerQuestions = useCallback(async (pageNum) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_SERVER}/questions/get-unansweredQuestions`,
        {
          params: {
            page: pageNum,
            limit: 10,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const newQuestions = response?.data?.questions;
        console.log("Unanswered Questions:", newQuestions);
        // If it's page 1, replace existing questions
        if (pageNum === 1) {
          setQuestions(newQuestions);
        } else {
          // For subsequent pages, append only unique questions
          setQuestions((prev) => {
            const existingIds = new Set(prev.map((q) => q._id));
            const uniqueNewQuestions = newQuestions.filter(
              (q) => !existingIds.has(q._id)
            );
            return [...prev, ...uniqueNewQuestions];
          });
        }

        setHasMore(newQuestions.length === 10);
      } else {
        setError(response.data.message || "Failed to fetch questions");
      }
    } catch (err) {
      console.error("Error fetching unanswered questions:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Then, modify the useEffect to only call one function initially
  useEffect(() => {
    // Only fetch questions on initial load or refresh
    fetchQuestions(1);

    // Reset hasMore when refreshing
    setHasMore(true);
  }, [refersh]);

  const clearQuestions = useCallback(() => {
    setQuestions([]);
    setHasMore(true);
  }, [refersh]);

  const updateQuestionInContext = useCallback((questionId, updatedFields) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q._id === questionId ? { ...q, ...updatedFields } : q
      )
    );
  }, []);

  return (
    <QuestionContext.Provider
      value={{
        questions,
        loading,
        error,
        hasMore,
        setRefresh,
        fetchQuestions,
        clearQuestions,
        unanswerQuestions,
        updateQuestionInContext
      }}
    >
      {children}
    </QuestionContext.Provider>
  );
}

export function useQuestions() {
  const context = useContext(QuestionContext);
  if (!context) {
    throw new Error("useQuestions must be used within a QuestionProvider");
  }
  return context;
}
