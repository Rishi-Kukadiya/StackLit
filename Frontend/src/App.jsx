import React from "react";
import CanvasBackground from "./CanvasBackground";
import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import SignInModal from "./components/SignInModal";
import SignUpModal from "./components/SignUpModal";
import ForgotPasswordModal from "./components/ForgotPasswordModal";
import OtpVerificationPage from "./components/OtpVerificationPage";
import ResetPasswordPage from "./components/ResetPasswordPage";
import Home from "./components/Home";
import AskQuestion from "./components/AskQuestion";
import { UserProvider } from "./components/UserContext";
import Answer from "./components/Answer";
import QuestionPage from "./components/QuestionPage";
import { QuestionProvider } from "./contexts/QuestionContext";
import UnansweredQuestion from "./components/UnanswerQuestion";
import Users from "./components/Users";
import { Provider } from "react-redux";
import store from "./redux/store";
import Chatbot from "./components/Chatbot";
import UserProfile from "./components/UserProfile";
import UpdateProfile from "./components/UpdateProfile";
import Tags from "./components/Tags";
import { SocketProvider } from "./contexts/SocketContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import NotificationBell from "./components/Notification";

function App() {
  const navigate = useNavigate();
  return (
    <Provider store={store}>
      <UserProvider>
        <QuestionProvider>
          <SocketProvider>
            <NotificationProvider>
              <CanvasBackground />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route
                  path="/signin"
                  element={
                    <SignInModal isOpen={true} onClose={() => navigate("/")} />
                  }
                />
                <Route
                  path="/signup"
                  element={
                    <SignUpModal isOpen={true} onClose={() => navigate("/")} />
                  }
                />
                <Route path="/question/:id" element={<QuestionPage />} />
                <Route
                  path="/forgot-password"
                  element={
                    <ForgotPasswordModal
                      isOpen={true}
                      onClose={() => navigate("/")}
                    />
                  }
                />
                <Route
                  path="/otp-verification"
                  element={
                    <OtpVerificationPage
                      isOpen={true}
                      onClose={() => navigate("/")}
                    />
                  }
                />
                <Route
                  path="/reset-password"
                  element={
                    <ResetPasswordPage
                      isOpen={true}
                      onClose={() => navigate("/")}
                    />
                  }
                />
                <Route path="/ask" element={<AskQuestion />} />
                <Route path="/answer" element={<Answer />} />
                <Route path="/users" element={<Users />} />
                <Route
                  path="/unanswered"
                  element={<UnansweredQuestion></UnansweredQuestion>}
                ></Route>
                <Route path="/profile/:userId" element={<UserProfile />} />
                <Route
                  path="ai-assistance"
                  element={<Chatbot></Chatbot>}
                ></Route>
                <Route path="/tags" element={<Tags />} />
                <Route path="/notification" element={<NotificationBell/>}/>
                <Route path="/update-profile" element={<UpdateProfile />} />
              </Routes>
            </NotificationProvider>
          </SocketProvider>
        </QuestionProvider>
      </UserProvider>
    </Provider>
  );
}

export default App;
