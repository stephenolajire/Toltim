import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, ChevronDown } from "lucide-react";
import { BiHeart } from "react-icons/bi";

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50 px-2 sm:px-4 md:px-20 lg:px-50">
      <nav className="flex items-center justify-between p-4">
        <div className="flex items-center h-auto">
          <BiHeart className="text-green-600 text-3xl md:text-4xl lg:text-6xl" />
          <span className="text-xl font-bold ml-0.5 sm:ml-2">Toltimed</span>
        </div>

        {/* Desktop Navigation - hidden on mobile */}
        <div className="hidden md:flex space-x-4">
          <Link
            to="/login"
            className="border border-gray-300 text-black px-4 py-2 rounded hover:bg-gray-50 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button - visible only on mobile */}
        <div className="md:hidden flex items-center gap-1">
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center gap-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <User className="w-6 h-6 text-gray-600" />
            <ChevronDown
              className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu Dropdown with improved animation */}
        <div
          className={`absolute top-full right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl border border-gray-100 md:hidden transition-all duration-200 ${
            isMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
        >
          <Link
            to="/login"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-50 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-50 transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
