import { Layers, Search, LogIn, UserPlus, LogOut, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useUser } from "./UserContext";
import { useNotifications } from "../contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";

export default function Navbar({ className = "" }) {
  const { user, logout } = useUser();
  const { notifications, markAllAsRead } = useNotifications();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const renderNotificationText = (n) => {
    const name = n?.sender?.fullName || "Someone";
    const question = n?.question?.title || "";
    const shortAnswer = n?.answer?.content
      ? stripHtml(n.answer.content).slice(0, 40)
      : "";

    switch (n.type) {
      case "like":
        return n.answer
          ? `${name} liked your answer: ${shortAnswer}`
          : `${name} liked your question: ${question}`;
      case "dislike":
        return n.answer
          ? `${name} disliked your answer: ${shortAnswer}`
          : `${name} disliked your question: ${question}`;
      case "answer":
        return `${name} answered your question: ${question}`;
      case "relatedAnswer":
        return `${name} also answered a question you answered: ${question}`;
      default:
        return `${name} sent you a notification`;
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <nav className="bg-[#17153B] text-white px-4 py-3 shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between flex-wrap">
        {/* Logo */}
        <Link to="/">
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition">
            <Layers className="text-[#C8ACD6] w-6 h-6" />
            <span className="text-[#C8ACD6] text-xl font-bold">StackLit</span>
          </div>
        </Link>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center mx-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-4 pr-10 py-2 rounded-lg bg-[#2E236C] text-white placeholder-[#C8ACD6] border-2 border-[#433D8B] focus:outline-none focus:ring-2 focus:ring-[#C8ACD6] focus:border-[#C8ACD6] transition duration-200"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-[#C8ACD6]" />
          </div>
        </div>

        {/* Right Controls */}
        <div className="hidden lg:flex items-center space-x-4 mt-2 lg:mt-0">
          {!user ? (
            <>
              <Link to="/signup">
                <button className="flex items-center gap-2 bg-[#433D8B] text-white hover:bg-[#C8ACD6] hover:text-[#2E236C] px-4 py-2 rounded-md transition-all duration-300">
                  <LogIn className="w-4 h-4" />
                  Sign Up
                </button>
              </Link>
              <Link to="/signin">
                <button className="flex items-center gap-2 bg-[#433D8B] text-white hover:bg-[#C8ACD6] hover:text-[#2E236C] px-4 py-2 rounded-md transition-all duration-300">
                  <UserPlus className="w-4 h-4" />
                  Log In
                </button>
              </Link>
            </>
          ) : (
            <>
              {/* Notifications */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen((v) => !v)}
                  className="relative p-2 rounded-full hover:bg-[#433D8B]/40 transition"
                >
                  <Bell className="w-5 h-5 text-[#C8ACD6]" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white text-black border border-gray-300 rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b">
                      <h3 className="font-semibold text-[#17153B]">
                        Notifications
                      </h3>
                      <button
                        onClick={() => {
                          markAllAsRead();
                          setNotifOpen(false);
                        }}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>

                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto divide-y">
                        {notifications.map((n) => (
                          <div
                            key={n._id}
                            className="px-4 py-3 text-sm bg-white hover:bg-gray-50"
                          >
                            <p className="text-gray-800">
                              {renderNotificationText(n)}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDistanceToNow(new Date(n.createdAt))} ago
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#C8ACD6]"
                  onClick={() => setProfileOpen((v) => !v)}
                >
                  <img
                    src={
                      user.user.avatar ||
                      "https://ui-avatars.com/api/?name=" +
                        (user.user.fullName || "U")
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-[#2E236C] rounded-lg shadow-lg py-2 z-50 border border-[#433D8B]">
                    <button
                      className="block w-full text-left px-4 py-2 text-[#C8ACD6] hover:bg-[#433D8B]/30"
                      onClick={() => alert("Update Profile (coming soon)")}
                    >
                      Update Profile
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-[#C8ACD6] hover:bg-[#433D8B]/30"
                      onClick={logout}
                    >
                      <LogOut className="inline w-4 h-4 mr-1" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Search bar (Mobile) */}
        <div className="w-full mt-4 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-4 pr-10 py-2 rounded-lg bg-[#2E236C] text-white placeholder-[#C8ACD6] border-2 border-[#433D8B] focus:outline-none focus:ring-2 focus:ring-[#C8ACD6] focus:border-[#C8ACD6] transition duration-200"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-[#C8ACD6]" />
          </div>
        </div>
      </div>
    </nav>
  );
}
