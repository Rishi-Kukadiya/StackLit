import { Layers, Search, LogIn, UserPlus, Bell, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useUser } from "./UserContext";

export default function Navbar({ className = "" }) {
  const { user, logout } = useUser();
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const profileRef = useRef(null);

  useEffect(() => {
    if (!profileOpen) return;
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  // Unified function to execute the search
  const executeSearch = () => {
    if (query.trim() !== "") {
      navigate(`/?q=${query.trim()}`);
      setQuery(""); // Optional: clear input after search
    }
  };

  // Handler for Enter key press in the input field
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      executeSearch();
    }
  };

  return (
    <nav className="bg-[#17153B] text-white px-4 py-3 shadow-md ">
      <div className="container mx-auto flex items-center justify-between flex-wrap">
        {/* Left: Logo */}
        <Link to="/">
          <div className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition">
            <Layers className="text-[#C8ACD6] w-6 h-6" />
            <span className="text-[#C8ACD6] text-xl font-bold">StackLit</span>
          </div>
        </Link>

        {/* Middle: Search box (desktop only) */}
        <div className="hidden md:flex flex-1 justify-center mx-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown} // Changed handler name for clarity
              className="w-full pl-4 pr-10 py-2 rounded-lg bg-[#2E236C] text-white placeholder-[#C8ACD6] 
                border-2 border-[#433D8B] focus:outline-none focus:ring-2 focus:ring-[#C8ACD6] 
                focus:border-[#C8ACD6] transition duration-200"
            />
            {/* Made the icon a clickable button */}
            <Search
              className="absolute right-3 top-2.5 w-5 h-5 text-[#C8ACD6] cursor-pointer hover:text-white transition-colors"
              onClick={executeSearch}
            />
          </div>
        </div>

        {/* Right: Auth buttons */}
        <div className="hidden lg:flex items-center space-x-2 mt-2 lg:mt-0">
          {!user ? (
            <>
              <Link to="/signup">
                <button className="flex items-center gap-2 bg-[#433D8B] text-white 
                hover:bg-[#C8ACD6] hover:text-[#2E236C] px-4 py-2 rounded-md 
                transition-all duration-300 cursor-pointer">
                  <LogIn className="w-4 h-4 cursor-pointer" />
                  Sign Up
                </button>
              </Link>
              <Link to="/signin">
                <button className="flex items-center gap-2 bg-[#433D8B] text-white 
                hover:bg-[#C8ACD6] hover:text-[#2E236C] px-4 py-2 rounded-md 
                transition-all duration-300 cursor-pointer">
                  <UserPlus className="w-4 h-4 cursor-pointer" />
                  Log In
                </button>
              </Link>
            </>
          ) : (
            <>
              <button className="relative p-2 rounded-full hover:bg-[#433D8B]/40 transition">
                <Bell className="w-5 h-5 text-[#C8ACD6]" />
              </button>
              <div className="relative" ref={profileRef}>
                <button
                  className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#C8ACD6] focus:outline-none focus:ring"
                  onClick={() => setProfileOpen((v) => !v)}
                >
                  <img
                    src={
                      user.user.avatar ||
                      "https://ui-avatars.com/api/?name=" + (user.user.fullName[0] || "U")
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

        {/* Mobile: Search bar below */}
        <div className="w-full mt-4 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown} // Changed handler name for clarity
              className="w-full pl-4 pr-10 py-2 rounded-lg bg-[#2E236C] text-white placeholder-[#C8ACD6] 
                border-2 border-[#433D8B] focus:outline-none focus:ring-2 focus:ring-[#C8ACD6] 
                focus:border-[#C8ACD6] transition duration-200"
            />
            {/* Made the icon a clickable button */}
            <Search
              className="absolute right-3 top-2.5 w-5 h-5 text-[#C8ACD6] cursor-pointer active:text-white"
              onClick={executeSearch}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}