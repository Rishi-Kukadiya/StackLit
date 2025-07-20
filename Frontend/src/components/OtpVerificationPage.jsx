import { X, Mail, ArrowRight, KeyRound } from "lucide-react";
import Navbar from "./Navbar";
import ErrorPopup from "./ErrorPopup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
export default function OtpVerificationPage() {
  const [otp, setOtp] = useState(['', '', '', '','','']);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  
  // For demo purposes - you'll replace this with actual email from your state management
  const userEmail = "user@example.com";
  
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
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit OTP");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    // Here you would verify the OTP with your backend
    console.log('OTP submitted:', otpValue);
    
    // For demo purposes, navigate to reset password page
    // In a real app, you would verify the OTP first
    navigate('/reset-password');
  };

  return (
    <>
      <div className="relative min-h-screen">
        <Navbar />
        <Sidebar />
      </div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17153B]/60 p-4 sm:p-6 lg:p-8">
        <div className="relative bg-[#2E236C] w-full max-w-[calc(100%-2rem)] sm:max-w-md p-4 sm:p-6 md:p-8 rounded-lg shadow-xl backdrop-blur-sm animate-fadeIn max-h-[90vh] flex flex-col">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white text-center">Verify OTP</h2>
          <p className="text-[#C8ACD6] text-center mb-4 sm:mb-6 text-sm sm:text-base">
            Enter the 6-digit code sent to<br />
            <span className="text-white font-medium">{userEmail}</span>
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4"> */}
            <div className="flex flex-nowrap justify-center gap-2 sm:gap-3 md:gap-4 w-full">
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
            
            <div className="text-center">
              <p className="text-[#C8ACD6] text-sm sm:text-base mb-2">Didn't receive the code?</p>
              <button 
                type="button" 
                className="text-white underline text-sm sm:text-base hover:text-[#C8ACD6]"
                onClick={() => {
                  console.log('Resend OTP');
                  // Here you would call your API to resend the OTP
                }}
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
      </div>
    </>
  );
}