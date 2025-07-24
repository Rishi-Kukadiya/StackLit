import { X, Mail, Lock ,Eye,
  EyeOff,} from "lucide-react";
import Navbar from "./Navbar";
import ErrorPopup from "./ErrorPopup";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useUser } from "./UserContext";
import Sidebar from "./Sidebar";
import axios from "axios";
import SuccessPopup from "./SuccessPopup";
import ShimmerLoader from "./ShimmerLoader";
export default function SignInModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const { login } = useUser();


  if (!isOpen) return null;

  const validateField = (name, value) => {
    let error = '';
    switch (name) {
      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          error = 'Invalid email address';
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    const error = validateField(name, newValue);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key === 'remember') return;
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      // console.log('Sign In form valid', formData);

      try {
        const data = new FormData();
        data.append("email", formData.email);
        data.append("password", formData.password);

        const res = await axios.post(
          `${import.meta.env.VITE_SERVER}/users/login`,
          data,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true
          }
        );

        setLoading(false);
        if (res.data.statusCode !== 200) {
          setErrorMessage(res.data.message || "SignIn failed");
          setTimeout(() => setErrorMessage(""), 2000);
          return;
        }

        sessionStorage.setItem("user", JSON.stringify(res.data.data));
        if (res.data.data) {
          login(res.data.data);
        }
          setFormData({
          email: "",
          password: ""
        });
        setSuccessMessage(res.data.message || "SignIn successful!");
        setTimeout(() => {
          setSuccessMessage("");
          onClose();
        }, 2000);
      } catch (err) {
        setLoading(false);
        setErrorMessage("SignIn failed");
        setTimeout(() => setErrorMessage(""), 1000);
      }
    } else {
      const firstError = Object.values(newErrors)[0];
      setErrorMessage(firstError);
      setTimeout(() => setErrorMessage(""), 1000);
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
        <div className="relative bg-[#2E236C] w-full max-w-[calc(100%-2rem)] sm:max-w-md p-4 sm:p-6 md:p-8 rounded-lg shadow-xl backdrop-blur-sm animate-fadeIn">
          <button
            onClick={onClose}
            className="absolute right-2 top-2 sm:right-4 sm:top-4 text-[#C8ACD6] hover:text-white"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>

          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-white text-center">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="email" className="block text-[#C8ACD6] mb-1.5 sm:mb-2 text-sm sm:text-base">
                Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={"w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg bg-[#17153B] text-white border focus:outline-none focus:border-[#C8ACD6]"}
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-2.5 sm:left-3 top-2 sm:top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-[#C8ACD6]" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[#C8ACD6] mb-1.5 sm:mb-2 text-sm sm:text-base">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={"w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg bg-[#17153B] text-white border  focus:outline-none focus:border-[#C8ACD6]"}
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-2.5 sm:left-3 top-2 sm:top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-[#C8ACD6]" />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 sm:right-3 top-2 sm:top-2.5 text-[#C8ACD6] hover:text-white transition-colors">
                    {showPassword ? 
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" /> : 
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    }
                  </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
              <Link to="/forgot-password">
                <button type="button" className="text-[#C8ACD6] hover:text-white text-sm sm:text-base">
                  Forgot password?
                </button>
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#433D8B] text-white py-1.5 sm:py-2 rounded-lg hover:bg-[#2E236C] border border-[#C8ACD6] transition-all text-sm sm:text-base mt-2"
            >
              Sign In
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
