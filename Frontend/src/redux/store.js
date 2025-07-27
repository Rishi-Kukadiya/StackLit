import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import questionsReducer from './questionsSlice';

const store = configureStore({
  reducer: {
    users: userReducer,
    questions: questionsReducer
  },
});

export default store;
