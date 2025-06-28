import React from "react";
import { BiHeart } from "react-icons/bi";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-black shadow-md px-2 sm:px-4 md:px-20 lg:px-50 py-4 h-[40vh] overflow-hidden">
      <div className="flex flex-col items-center justify-center h-full w-full space-y-4">
        <div className="flex items-center h-auto">
          <BiHeart className="text-green-600 text-3xl md:text-4xl lg:text-6xl" />
          <span className="text-xl text-white font-bold ml-0.5 sm:ml-2">Toltimed</span>
        </div>
        <p className="text-white text-base md:text-lg lg:text-xl text-center">
          © 2024 Toltimed. Bringing healthcare home to Nigerian communities.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
