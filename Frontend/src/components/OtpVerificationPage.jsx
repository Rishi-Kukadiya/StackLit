import { X, Mail, ArrowRight, KeyRound, Timer } from "lucide-react";
import Navbar from "./Navbar";
import ErrorPopup from "./ErrorPopup";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ShimmerLoader from "./ShimmerLoader";
import SuccessPopup from "./SuccessPopup";
import Sidebar from "./Sidebar";
import axios from "axios";
export default function OtpVerificationPage({ isOpen, onClose }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes = 300 seconds
  const [isClickable, setIsClickable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const userEmail = sessionStorage.getItem("email") || "user@example.com";
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown);
          setIsClickable(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);


  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  };


  const handleResubit = async() => {
      setLoading(true);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER}/users/send-otp`,
          { email: userEmail },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        setLoading(false);
        if (res.data.statusCode !== 200) {
          setErrorMessage(res.data.message || "Server error");
          setTimeout(() => setErrorMessage(""), 2000);
          return;
        }

        setSuccessMessage(res.data.message || "Otp sent successfully");
        setTimeout(() => {
          setSuccessMessage("");
          setOtp(["", "", "", "", "", ""]);
          setTimer(300); // Reset timer to 5 minutes
        }, 2000);
      } catch (err) {
        setLoading(false);
        setErrorMessage("Network error or server down");
        setTimeout(() => setErrorMessage(""), 1000);
      }
  }
  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 6) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit OTP");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    setLoading(true);
     try {
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER}/users/verify-otp`,
          {"email" : userEmail , "otp": otpValue},
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        setLoading(false);
        if (res.data.statusCode !== 200) {
          setErrorMessage(res.data.message || "Server error");
          setTimeout(() => setErrorMessage(""), 2000);
          return;
        }

        // Clear OTP input
        setOtp(["", "", "", "", "", ""]);
        setSuccessMessage(res.data.message || "Successfully verified OTP");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/reset-password");
        }, 2000);

        
      } catch (err) {
        setLoading(false);
        setErrorMessage("Network error or server down");
        setTimeout(() => setErrorMessage(""), 1000);
      }

    // For demo purposes, navigate to reset password page
    // In a real app, you would verify the OTP first
  };

  return (
    <>
      <div className="relative min-h-screen">
        <Navbar />
        <Sidebar />
      </div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17153B]/60 p-4 sm:p-6 lg:p-8">
      {loading && <ShimmerLoader />}
        <div className="relative bg-[#2E236C] w-full max-w-[calc(100%-2rem)] sm:max-w-md p-4 sm:p-6 md:p-8 rounded-lg shadow-xl backdrop-blur-sm animate-fadeIn max-h-[90vh] flex flex-col">
          <button
            onClick={onClose}
            className="absolute right-2 top-2 sm:right-4 sm:top-4 text-[#C8ACD6] hover:text-white"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white text-center">
            Verify OTP
          </h2>
          <p className="text-[#C8ACD6] text-center mb-4 sm:mb-6 text-sm sm:text-base">
            Enter the 6-digit code sent to
            <br />
            <span className="text-white font-medium">{userEmail}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4"> */}
            <div className="flex flex-nowrap justify-center gap-2 sm:gap-3 md:gap-4 w-full">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-lg sm:text-xl md:text-2xl font-bold rounded-lg bg-[#17153B] text-white border border-[#433D8B] focus:outline-none focus:border-[#C8ACD6]"
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <div className="text-center flex items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-[#C8ACD6] text-sm sm:text-base">
                <Timer className="w-4 h-4" />
                <span>{formatTime(timer)}</span>
              </div>
              <button
                type="button"
                disabled={!isClickable}
                onClick={handleResubit}
                className={`text-sm sm:text-base underline ${
                  isClickable
                    ? "text-white hover:text-[#C8ACD6]"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                Resend OTP
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-[#433D8B] text-white py-1.5 sm:py-2 rounded-lg hover:bg-[#2E236C] border border-[#C8ACD6] transition-all text-sm sm:text-base flex items-center justify-center space-x-2"
            >
              <span>Verify OTP</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </form>
        </div>

        {/* Error Popup */}
        {errorMessage && (
          <ErrorPopup
            message={errorMessage}
            onClose={() => setErrorMessage("")}
          />
        )}

        {successMessage && (
          <SuccessPopup
            message={successMessage}
            onClose={() => setSuccessMessage("")}
          />
        )}
      </div>
    </>
  );
}
