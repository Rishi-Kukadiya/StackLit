import React, { useState } from "react";
import {
  Home,
  MessageSquare,
  Bot,
  Tag,
  Users,
  HelpCircle,
  PlusCircle,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext.jsx";
import { Bell, LogOut, ImageUp } from "lucide-react";
import Chatbot from "./Chatbot.jsx";
import Avtart from "../assets/avtart.jpg";

const sidebarOptions = [
  { label: "Home", icon: <Home />, to: "/" },
  { label: "AI Assistance", icon: <Bot />, to: "/ai-assistance" },
  { label: "Tags", icon: <Tag />, to: "/tags" },
  { label: "Users", icon: <Users />, to: "/users" },
  { label: "Unanswered Questions", icon: <HelpCircle />, to: "/unanswered" },
  { label: "Ask Question", icon: <PlusCircle />, to: "/ask" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  const { user, logout } = useUser();
  return (
    <>
      {/* Mobile Toggle Button (top right) */}
      <button
        className="lg:hidden fixed top-2 right-2 z-50 bg-[#2E236C]/60 backdrop-blur-xs p-2 rounded-full shadow-lg text-[#C8ACD6] hover:text-white hover:bg-[#433D8B] transition-colors"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#2E236C]/50 backdrop-blur-xs shadow-xl z-40 flex flex-col pt-6 px-3 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:flex lg:w-64`}
        style={{
          borderRight: "1.5px solid #433D8B",
          marginTop: open ? "0px" : "64px",
        }}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden flex justify-end mb-4">
          <button
            className="bg-[#433D8B]/60 p-2 rounded-full text-[#C8ACD6] hover:text-white hover:bg-[#433D8B] transition-colors"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="overflow-y-auto scrollbar-thin scrollbar-thumb-[#433D8B] scrollbar-track-transparent">
          {sidebarOptions.map((opt) => {
            return (
              <Link
                key={opt.label}
                to={opt.to}
                className="flex items-center gap-3 py-3 px-3 rounded-md text-[#C8ACD6] hover:bg-[#433D8B]/50 hover:text-white transition-all mb-0.5 font-medium text-base"
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  {opt.icon}
                </span>
                {opt.label}
              </Link>
            );
          })}
          {!user ? (
            <>
              <div className="flex flex-col gap-2 mt-2 lg:hidden">
                <Link
                  to="/signin"
                  className="flex items-center gap-2 py-2 px-2 rounded-md bg-[#433D8B]/70 text-[#C8ACD6] hover:bg-[#C8ACD6]/20 hover:text-white transition-all font-semibold"
                >
                  <LogIn className="w-5 h-5" /> Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-2 py-2 px-2 rounded-md bg-[#433D8B]/70 text-[#C8ACD6] hover:bg-[#C8ACD6]/20 hover:text-white transition-all font-semibold"
                >
                  <UserPlus className="w-5 h-5" /> Sign Up
                </Link>
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                className="flex items-center gap-3 py-3 px-3 w-full rounded-md text-[#C8ACD6] hover:bg-[#433D8B]/50 hover:text-white transition-all mb-0.5 font-medium text-base"
                onClick={() => alert("Notifications (coming soon)")}
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  <Bell />
                </span>
                Notifications
              </button>
              {/* <button
                type="button"
                className="flex items-center gap-3 py-3 px-3 w-full rounded-md text-[#C8ACD6] hover:bg-[#433D8B]/50 hover:text-white transition-all mb-0.5 font-medium text-base"
                onClick={() => alert("Update Profile (coming soon)")}
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  <ImageUp />
                </span>
                Update Profile
              </button> */}
              <Link
                to="/update-profile"
                className="flex items-center gap-3 py-3 px-3 rounded-md text-[#C8ACD6] hover:bg-[#433D8B]/50 hover:text-white transition-all mb-0.5 font-medium text-base"
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  <ImageUp />
                </span>
                Update Profile
              </Link>
              <button
                type="button"
                className="flex items-center gap-3 py-3 px-3 w-full rounded-md text-[#C8ACD6] hover:bg-[#433D8B]/50 hover:text-white transition-all mb-0.5 font-medium text-base"
                onClick={logout}
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  <LogOut />
                </span>
                Logout
              </button>
              <div className="flex flex-col items-center mt-6 gap-4 lg:hidden">
                <div className="relative">
                  <button
                    className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#C8ACD6] focus:outline-none focus:ring"
                    onClick={() => setProfileOpen((v) => !v)}
                  >
                    <img
                      src={
                        user.user.avatar || Avtart
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </button>
                </div>
              </div>
            </>
          )}
        </nav>
      </aside>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
    </>
  );
}
