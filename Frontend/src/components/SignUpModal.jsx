import {
  X,
  User,
  Mail,
  Lock,
  UserCheck,
  Upload,
  Image as ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import ErrorPopup from "./ErrorPopup";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SuccessPopup from "./SuccessPopup";
import ShimmerLoader from "./ShimmerLoader";
export default function SignUpModal({ isOpen, onClose }) {
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  if (!isOpen) return null;

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "fullName":
        if (!value.trim()) error = "Full name is required";
        break;
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          error = "Invalid email address";
        }
        break;
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
      case "terms":
        if (!value) error = "You must accept the terms";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

 
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    // Check image size (max 2MB)
    if (profileImage && profileImage.size > 2 * 1024 * 1024) {
      newErrors.profileImage = "Profile image must be less than 2MB";
    }

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const data = new FormData();
        data.append("fullName", formData.fullName);
        data.append("email", formData.email);
        data.append("password", formData.password);
        if (profileImage) {
          data.append("avatar", profileImage);
        }

        const res = await axios.post(
          `${import.meta.env.VITE_SERVER}/users/register`,
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials : true 
          }
        );

        setLoading(false);
        // console.log(res);
        if (res.data.statusCode !== 200) {
          setErrorMessage(res.data.message || "Signup failed");
          setTimeout(() => setErrorMessage("") , 3000);
          return;
        }
        setSuccessMessage(res.data.message || "Signup successful!");
        setTimeout(() => {
          setSuccessMessage("");
          onClose(); 
        }, 3000);
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          terms: false,
        });
        setProfileImage(null);
        setPreviewUrl(null);
      } catch (err) {
        setLoading(false);
        setErrorMessage("Signup failed");
        setTimeout(() => setErrorMessage("") , 3000);
      }
    } else {
      const firstError = Object.values(newErrors)[0];
      setErrorMessage(firstError);
      setTimeout(() => setErrorMessage("") , 3000);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="relative min-h-screen">
        <Navbar />
        <Sidebar />
      </div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17153B]/60 p-4 sm:p-6 lg:p-8">
        {loading && <ShimmerLoader />}
        {/* Modal */}
        <div className="relative bg-[#2E236C] w-full max-w-[calc(100%-2rem)] sm:max-w-md p-4 sm:p-6 md:p-8 rounded-lg shadow-xl backdrop-blur-sm animate-fadeIn max-h-[90vh] flex flex-col">
          <button
            onClick={onClose}
            className="absolute right-2 top-2 sm:right-4 sm:top-4 text-[#C8ACD6] hover:text-white"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>

          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white text-center">
            Sign Up
          </h2>

          <div className="overflow-y-auto scrollbar-hide">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="mb-3 sm:mb-4">
                <label className="block text-[#C8ACD6] mb-1.5 sm:mb-2 text-sm sm:text-base">
                  Profile Picture
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#17153B] border-2 border-[#433D8B] flex items-center justify-center overflow-hidden">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-[#C8ACD6]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="profilePicture"
                      className="flex flex-col items-center sm:items-start gap-2 p-4 border-2 border-dashed border-[#433D8B] rounded-lg bg-[#17153B] cursor-pointer hover:border-[#C8ACD6] transition-colors"
                    >
                      <Upload className="w-6 h-6 text-[#C8ACD6]" />
                      <div className="text-center sm:text-left">
                        <p className="text-[#C8ACD6] text-sm sm:text-base">
                          Click to upload
                        </p>
                        <p className="text-[#C8ACD6]/60 text-xs sm:text-sm">
                          SVG, PNG, JPG (max. 2MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        id="profilePicture"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="fullName"
                  className="block text-[#C8ACD6] mb-1.5 sm:mb-2 text-sm sm:text-base"
                >
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={"w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg bg-[#17153B] text-white border focus:outline-none focus:border-[#C8ACD6]"}
                    placeholder="Enter your full name"
                  />
                  <User className="absolute left-2.5 sm:left-3 top-2 sm:top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-[#C8ACD6]" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-[#C8ACD6] mb-1.5 sm:mb-2 text-sm sm:text-base"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={"w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg bg-[#17153B] text-white border  focus:outline-none focus:border-[#C8ACD6]"}
                    placeholder="Enter your email"
                  />
                  <Mail className="absolute left-2.5 sm:left-3 top-2 sm:top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-[#C8ACD6]" />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-[#C8ACD6] mb-1.5 sm:mb-2 text-sm sm:text-base"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={"w-full pl-9 sm:pl-10 pr-10 sm:pr-11 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg bg-[#17153B] text-white border focus:outline-none focus:border-[#C8ACD6]"}
                    placeholder="Create a password"
                  />
                  <Lock className="absolute left-2.5 sm:left-3 top-2 sm:top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-[#C8ACD6]" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 sm:right-3 top-2 sm:top-2.5 text-[#C8ACD6] hover:text-white transition-colors"
                  >
                    {showPassword ? 
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" /> : 
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    }
                  </button>
                </div>

              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-[#C8ACD6] mb-1.5 sm:mb-2 text-sm sm:text-base"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={"w-full pl-9 sm:pl-10 pr-10 sm:pr-11 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg bg-[#17153B] text-white border focus:outline-none focus:border-[#C8ACD6]"}
                    placeholder="Confirm your password"
                  />
                  <UserCheck className="absolute left-2.5 sm:left-3 top-2 sm:top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-[#C8ACD6]" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 sm:right-3 top-2 sm:top-2.5 text-[#C8ACD6] hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? 
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" /> : 
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    }
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  className={"w-4 h-4 rounded bg-[#17153B] border-[#433D8B] text-[#433D8B] focus:ring-[#433D8B] focus:ring-2 focus:ring-offset-0 focus:ring-offset-[#17153B]"}
                />
                <label
                  htmlFor="terms"
                  className="ml-2 text-[#C8ACD6] text-sm sm:text-base"
                >
                  I agree to the Terms and Privacy Policy
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#433D8B] text-white py-1.5 sm:py-2 rounded-lg hover:bg-[#2E236C] border border-[#C8ACD6] transition-all text-sm sm:text-base mt-2"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>

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