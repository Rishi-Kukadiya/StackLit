import { X, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import Navbar from "./Navbar";
import ErrorPopup from "./ErrorPopup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ShimmerLoader from "./ShimmerLoader";
import SuccessPopup from "./SuccessPopup";
import axios from "axios";
export default function ResetPasswordPage({ onClose }) {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
      default:
        break;
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

  const handleSubmit = async(e) => {
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
      setLoading(true);
      try {
        const data = new FormData();
        data.append("email", formData.password);
        const res = await axios.post(
          `${import.meta.env.VITE_SERVER}/users/forget-password`,
          data,
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
          navigate("/otp-verification");
        }, 2000);

        
      } catch (err) {
        setLoading(false);
        setErrorMessage("Network error or server down");
        setTimeout(() => setErrorMessage(""), 1000);
      }

      // For demo purposes, show success message and redirect
      setErrorMessage("Password reset successful!");
      setTimeout(() => {
        setErrorMessage("");
        navigate("/signin"); // Redirect to sign in page
      }, 2000);
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
        <div className="relative bg-[#2E236C] w-full max-w-[calc(100%-1rem)] sm:max-w-md p-3 sm:p-5 md:p-8 rounded-lg shadow-xl backdrop-blur-sm animate-fadeIn my-4 sm:my-6">
          <button
            onClick={onClose}
            className="absolute right-2 top-2 sm:right-4 sm:top-4 text-[#C8ACD6] hover:text-white"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
          <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white text-center">
            Reset Password
          </h2>
          <p className="text-[#C8ACD6] text-center mb-4 sm:mb-6 text-sm sm:text-base">
            Create a new password for your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-[#C8ACD6] mb-1.5 sm:mb-2 text-sm sm:text-base"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    "w-full pl-9 sm:pl-10 pr-10 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg bg-[#17153B] text-white border  focus:outline-none focus:border-[#C8ACD6]"
                  }
                  placeholder="Enter new password"
                />
                <Lock className="absolute left-2.5 sm:left-3 top-2 sm:top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-[#C8ACD6]" />
                <button
                  type="button"
                  className="absolute right-2.5 sm:right-3 top-2 sm:top-2.5 text-[#C8ACD6] hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-[#C8ACD6] mb-1.5 sm:mb-2 text-sm sm:text-base"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    "w-full pl-9 sm:pl-10 pr-10 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg bg-[#17153B] text-white border  focus:outline-none focus:border-[#C8ACD6]"
                  }
                  placeholder="Confirm new password"
                />
                <Lock className="absolute left-2.5 sm:left-3 top-2 sm:top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-[#C8ACD6]" />
                <button
                  type="button"
                  className="absolute right-2.5 sm:right-3 top-2 sm:top-2.5 text-[#C8ACD6] hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#433D8B] text-white py-1.5 sm:py-2 rounded-lg hover:bg-[#2E236C] border border-[#C8ACD6] transition-all text-sm sm:text-base mt-2 flex items-center justify-center space-x-2"
            >
              <span>Reset Password</span>
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
