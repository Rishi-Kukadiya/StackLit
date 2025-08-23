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
      // console.log(response);

      if (response.data.success) {
        const newQuestions = response?.data?.data;

        if (pageNum === 1) {
          setQuestions(newQuestions);
        } else {
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
        // console.log("Unanswered Questions:", newQuestions);
        if (pageNum === 1) {
          setQuestions(newQuestions);
        } else {
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
  
  const searchQuestions = useCallback(async (query, pageNum) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER}/search/questions`, {
        params: {
          q: query,
          page: pageNum,
          limit: 10,
        },
        withCredentials: true, // Assuming search requires credentials too
      });
      if (response.data.success) {
        const newQuestions = response.data.questions;
        // Replace questions on page 1, otherwise append
        if (pageNum === 1) {
          setQuestions(newQuestions);
        } else {
          setQuestions((prev) => {
            const existingIds = new Set(prev.map((q) => q._id));
            const uniqueNewQuestions = newQuestions.filter(
              (q) => !existingIds.has(q._id)
            );
            return [...prev, ...uniqueNewQuestions];
          });
        }
        // Update hasMore based on the number of results
        setHasMore(newQuestions.length === 10);
      } else {
        setError(response.data.message || "Failed to search questions.");
      }
    } catch (err) {
      setError("Failed to search questions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchQuestions(1);
    setHasMore(true);
  }, [refersh]);

  const clearQuestions = useCallback(() => {
    setQuestions([]);
    setHasMore(true);
  }, []);

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
        updateQuestionInContext,
        searchQuestions,
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