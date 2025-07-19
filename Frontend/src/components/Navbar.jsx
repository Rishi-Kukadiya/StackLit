import { Layers, Search, LogIn, UserPlus } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-[#17153B] text-white px-4 py-3 shadow-md">
      <div className="container mx-auto flex items-center justify-between flex-wrap">

        {/* Left: Logo */}
        <div className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition">
          <Layers className="text-[#C8ACD6] w-6 h-6" />
          <span className="text-[#C8ACD6] text-xl font-bold">StackLit</span>
        </div>

        {/* Middle: Search box (desktop only) */}
        <div className="hidden md:flex flex-1 justify-center mx-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-4 pr-10 py-2 rounded-lg bg-[#2E236C] text-white placeholder-[#C8ACD6] 
                border-2 border-[#433D8B] focus:outline-none focus:ring-2 focus:ring-[#C8ACD6] 
                focus:border-[#C8ACD6] transition duration-200"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-[#C8ACD6] pointer-events-none" />
          </div>
        </div>

        {/* Right: Auth buttons */}
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          <button className="flex items-center gap-2 bg-[#433D8B] text-white 
            hover:bg-[#C8ACD6] hover:text-[#2E236C] px-4 py-2 rounded-md 
            transition-all duration-300 cursor-pointer">
            <LogIn className="w-4 h-4 cursor-pointer" />
            Sign In
          </button>
          <button className="flex items-center gap-2 bg-[#433D8B] text-white 
            hover:bg-[#C8ACD6] hover:text-[#2E236C] px-4 py-2 rounded-md 
            transition-all duration-300 cursor-pointer">
            <UserPlus className="w-4 h-4 cursor-pointer" />
            Log In
          </button>
        </div>

        {/* Mobile: Search bar below */}
        <div className="w-full mt-4 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-4 pr-10 py-2 rounded-lg bg-[#2E236C] text-white placeholder-[#C8ACD6] 
                border-2 border-[#433D8B] focus:outline-none focus:ring-2 focus:ring-[#C8ACD6] 
                focus:border-[#C8ACD6] transition duration-200"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-[#C8ACD6] pointer-events-none" />
          </div>
        </div>

      </div>
    </nav>
  );
}
