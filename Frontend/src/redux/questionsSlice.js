// questionsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchQuestionById = createAsyncThunk(
  "questions/fetchById",
  async (id, { getState }) => {
    const state = getState();
    const existingQuestion = state.questions.items.find((q) => q._id === id);

    if (existingQuestion) {
      return existingQuestion;
    }

    const response = await axios.get(
      `${import.meta.env.VITE_SERVER}/questions/get-question/${id}`,
      { withCredentials: true }
    );

    return response.data.data.question;
  }
);

const questionsSlice = createSlice({
  name: "questions",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    updateQuestion(state, action) {
      const updatedQuestion = action.payload;
      const index = state.items.findIndex((q) => q._id === updatedQuestion._id);
      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...updatedQuestion,
        };
      }
    },

    updateAnswer(state, action) {
      // { questionId, answerId, changes }
      const { questionId, answerId, changes } = action.payload;
      const questionIndex = state.items.findIndex((q) => q._id === questionId);
      if (questionIndex !== -1) {
        const answerIndex = state.items[questionIndex].answers.findIndex(
          (a) => a._id === answerId
        );
        if (answerIndex !== -1) {
          // Merge the changed fields into the specific answer
          state.items[questionIndex].answers[answerIndex] = {
            ...state.items[questionIndex].answers[answerIndex],
            ...changes,
          };
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionById.fulfilled, (state, action) => {
        state.loading = false;

        // Check if question already exists
        const existing = state.items.find((q) => q._id === action.payload._id);
        if (!existing) {
          state.items.push(action.payload); // Add only if not already there
        }
      })
      .addCase(fetchQuestionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { updateQuestion , updateAnswer } = questionsSlice.actions;
export default questionsSlice.reducer;
