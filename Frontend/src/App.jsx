import React from "react";
import CanvasBackground from "./CanvasBackground";
import { useNavigate } from "react-router-dom";
import {Routes ,  Route} from "react-router-dom";
import SignInModal from "./Components/SignInModal";
import SignUpModal from "./Components/SignUpModal";
import ForgotPasswordModal from "./Components/ForgotPasswordModal";
import OtpVerificationPage from "./Components/OtpVerificationPage";
import ResetPasswordPage from "./Components/ResetPasswordPage";
import Home from "./Components/Home";
import { UserProvider } from "./Components/UserContext";
function App() {
  const navigate = useNavigate();
  return (
    <UserProvider>
      <CanvasBackground />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignInModal isOpen={true} onClose={() => navigate("/")} />} />
        <Route path="/signup" element={<SignUpModal isOpen={true} onClose={() => navigate("/")} />} />
        <Route path="/forgot-password" element={<ForgotPasswordModal isOpen={true} onClose={() => navigate("/")} />} />
        <Route path="/otp-verification" element={<OtpVerificationPage  isOpen={true} onClose={() => navigate("/")} />} />
        <Route path="/reset-password" element={<ResetPasswordPage isOpen={true} onClose={() => navigate("/")} />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
