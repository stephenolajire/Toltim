import React from "react";
import { BiHeart } from "react-icons/bi";
// import { Link } from 'react-router-dom'
import { ArrowRightFromLine, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-500 px-2 sm:px-4 md:px-20 lg:px-50 overflow-hidden">
      <nav className="flex items-center justify-between p-4">
        <div className="flex items-center h-auto">
          <BiHeart className="text-green-600 text-4xl md:text-4xl lg:text-6xl" />
          <div className="flex flex-col gap-0">
            <p className="text-xl text-gray-900 font-bold">Toltimed</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 lg:space-x-8">
          <div className="relative">
            <Bell className="text-gray-900 text-3xl" />
            <div className="absolute top-[-10px] right-[-6px] bg-red-700 h-5 w-5 rounded-full flex items-center justify-center text-white">
              3
            </div>
          </div>

          {/* <div className="h-auto w-auto flex items-center lg:space-x-2">
            <img className="h-10 w-10 rounded-full" src="/logo.jpeg" />
          </div> */}

          <div>
            <Link to="/">
              <button className="flex flex-row space-x-3 items-center py-2 px-4 rounded-lg text-gray-900 border border-gray-200 bg-white hover:bg-gray-200 transition-all duration 300">
                <ArrowRightFromLine height={16} width={16}/>
                <span>Logout</span>
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
