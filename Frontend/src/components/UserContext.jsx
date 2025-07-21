import React, { createContext, useContext, useState, useEffect } from "react";
import ShimmerLoader from "./ShimmerLoader";
import axios from "axios";
import ErrorPopup from "./ErrorPopup";
import SuccessPopup from "./SuccessPopup";
const UserContext = createContext(null);

// Provider Component
export function UserProvider({ children }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [user, setUser] = useState(() => {
    // Try loading user from sessionStorage when component initializes
    const savedUser = sessionStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  // Login: save to state and sessionStorage
  const login = (userData) => {
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout: shimmer + axios + clear state and sessionStorage
  const logout = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER}/users/logout`,
        {},
        { withCredentials: true }
      );

      if (res.data.statusCode !== 200) {
        setErrorMessage(res.data.message || "Logout failed");
        setTimeout(() => setErrorMessage(""), 2000);
        return;
      }

      setSuccessMessage(res.data.message || "Logout successful!");
      setTimeout(() => setSuccessMessage(""), 2000);
    } catch (err) {
      console.error("Logout failed:", err);
    }
    setUser(null);
    sessionStorage.removeItem("user");
    setLoading(false);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
      {loading && <ShimmerLoader />}

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
    </UserContext.Provider>
  );
}

// Custom hook
export function useUser() {
  return useContext(UserContext);
}
