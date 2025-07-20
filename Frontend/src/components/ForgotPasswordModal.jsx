import { X, Mail, ArrowRight } from "lucide-react";
import Navbar from "./Navbar";
import ErrorPopup from "./ErrorPopup";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";  
export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!value) {
        error = "Email is required";
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
        error = "Invalid email address";
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    setTouched(
      Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );
    if (Object.keys(newErrors).length === 0) {
      // Form is valid, proceed with submission
      console.log("Forgot Password form valid", formData);
      // Navigate to OTP verification page
      navigate("/otp-verification");
    } else {
      const firstError = Object.values(newErrors)[0];
      setErrorMessage(firstError);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <>
      <div className="relative min-h-screen">
        <Navbar />
        <Sidebar />
      </div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17153B]/60 p-2 sm:p-4 md:p-6 lg:p-8 overflow-y-auto">
        {/* Modal */}
        <div className="relative bg-[#2E236C] w-full max-w-[calc(100%-1rem)] sm:max-w-md p-3 sm:p-5 md:p-8 rounded-lg shadow-xl backdrop-blur-sm animate-fadeIn my-4 sm:my-6">
          <button
            onClick={onClose}
            className="absolute right-2 top-2 sm:right-4 sm:top-4 text-[#C8ACD6] hover:text-white"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>

          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white text-center">
            Forgot Password?
          </h2>
          <p className="text-[#C8ACD6] text-center mb-4 sm:mb-6 text-sm sm:text-base">
            Enter your email address
          </p>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-[#C8ACD6] mb-1.5 sm:mb-2 text-sm sm:text-base"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    "w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg bg-[#17153B] text-white border  focus:outline-none focus:border-[#C8ACD6]"
                  }
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-2.5 sm:left-3 top-2 sm:top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-[#C8ACD6]" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#433D8B] text-white py-1.5 sm:py-2 rounded-lg hover:bg-[#2E236C] border border-[#C8ACD6] transition-all text-sm sm:text-base mt-2 flex items-center justify-center space-x-2"
            >
              <span>Reset Password</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            <Link to="/signin">
              <button
                type="button"
                onClick={onClose}
                className="w-full text-[#C8ACD6] hover:text-white text-center py-1.5 sm:py-2 text-sm sm:text-base"
              >
                Back to Sign In
              </button>
            </Link>
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
