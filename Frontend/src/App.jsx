import React from "react";
import CanvasBackground from "./CanvasBackground";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import SignInModal from "./Components/SignInModal";
import SignUpModal from "./Components/SignUpModal";
import ForgotPasswordModal from "./Components/ForgotPasswordModal";
import OtpVerificationPage from "./Components/OtpVerificationPage";
import ResetPasswordPage from "./Components/ResetPasswordPage";
import Home from "./Components/Home";
import AskQuestion from "./Components/AskQuestion";
import { UserProvider } from "./Components/UserContext";
import Answer from "./Components/Answer";
import QuestionPage from "./Components/QuestionPage";
import { QuestionProvider } from './contexts/QuestionContext';
import UnansweredQuestion from "./Components/UnanswerQuestion";
import Users from "./Components/Users";
import { Provider } from "react-redux";
import store from "./redux/store";
import Chatbot from "./Components/Chatbot";
import UserProfile from './components/UserProfile';

function App() {
  const navigate = useNavigate();
  return (
    <Provider store={store}>
      <UserProvider>
        <QuestionProvider>
          <CanvasBackground />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignInModal isOpen={true} onClose={() => navigate("/")} />} />
            <Route path="/signup" element={<SignUpModal isOpen={true} onClose={() => navigate("/")} />} />
            <Route path="/question/:id" element={<QuestionPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordModal isOpen={true} onClose={() => navigate("/")} />} />
            <Route path="/otp-verification" element={<OtpVerificationPage  isOpen={true} onClose={() => navigate("/")} />} />
            <Route path="/reset-password" element={<ResetPasswordPage isOpen={true} onClose={() => navigate("/")} />} />
            <Route path="/ask" element={<AskQuestion />} />
            <Route path="/answer" element={<Answer />} />
            <Route path="/users" element={<Users />} />
            <Route path="/unanswered" element={<UnansweredQuestion></UnansweredQuestion>}></Route>
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="ai-assistance" element={<Chatbot></Chatbot>}></Route>
          </Routes>
        </QuestionProvider>
      </UserProvider>
    </Provider>
  );
}

export default App;
