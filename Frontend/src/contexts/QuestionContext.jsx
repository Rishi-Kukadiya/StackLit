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
        setQuestions((prev) => [...prev, ...newQuestions]);
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
        const newQuestions1 = response?.data?.questions;
        console.log(newQuestions1);
        setQuestions((prev) => [...prev, ...newQuestions1]);
        setHasMore(newQuestions1.length === 10);
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

  useEffect(() => {
    fetchQuestions();
    unanswerQuestions();
  }, [refersh]);

  const clearQuestions = useCallback(() => {
    setQuestions([]);
    setHasMore(true);
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
        unanswerQuestions
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
