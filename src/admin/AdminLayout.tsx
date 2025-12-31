import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";
import { Home, Menu, X } from "lucide-react";

const AdminLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <main className="w-full h-auto flex">
      <div
        className={`md:hidden fixed top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {isOpen && <Sidebar close={toggleMenu} />}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block md:w-[220px] flex-shrink-0">
        <Sidebar close={toggleMenu} />
      </div>

      
      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="px-4 md:px-10">
          <div className="flex justify-between py-3">
            <div className="flex space-x-3 text-black font-bold items-center">
              <span>
                <Home />
              </span>
              <span className="text-lg md:text-xl">Admin Dashboard</span>
            </div>

            <div className="flex space-x-3">
              {/* <div className="rounded-lg border border-gray-200 w-10 h-10 flex items-center justify-center hover:bg-gray-100">
                <Bell size={18} />
              </div>
              <div className="rounded-lg border border-gray-200 w-10 h-10 flex items-center justify-center hover:bg-gray-100">
                <Bell size={18} />
              </div> */}
              <div className="md:hidden flex rounded-lg border border-gray-200 w-10 h-10 items-center justify-center hover:bg-gray-100">
                {isOpen ? (
                  <X onClick={toggleMenu} size={18} />
                ) : (
                  <Menu onClick={toggleMenu} size={18} />
                )}
              </div>
            </div>
          </div>
          <hr className="w-full text-gray-300" />
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default AdminLayout;
