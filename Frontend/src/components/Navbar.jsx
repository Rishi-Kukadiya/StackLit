import { Menu, Search, Layers } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-dark text-white px-4 py-3 shadow-md">
      <div className="container mx-auto flex items-center justify-between flex-wrap">
        
        {/* Left: Logo and Name */}
        <div className="flex items-center space-x-2">
          <Layers className="text-accent w-6 h-6" />
          <span className="text-accent text-xl font-bold">StackLit</span>
        </div>

        {/* Middle: Search Box */}
        <div className="hidden md:flex flex-1 justify-center mx-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-lg bg-purple1 text-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-accent" />
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="flex items-center space-x-4">
          <button className="bg-purple2 hover:bg-accent hover:text-purple2 text-white px-4 py-2 rounded-md transition-all">
            Sign In
          </button>
          <button className="bg-accent hover:bg-purple2 hover:text-accent text-purple2 px-4 py-2 rounded-md transition-all">
            Log In
          </button>
        </div>

        {/* Mobile: Search bar below on small screens */}
        <div className="w-full mt-4 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 rounded-lg bg-purple1 text-white placeholder-accent focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-accent" />
          </div>
        </div>
      </div>
    </nav>
  );
}
