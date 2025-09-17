import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Bell, Home, Menu, X, AlertCircle, Clock } from "lucide-react";
import NurseStat from "./components/NurseStat";

const NurseLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const kyc = localStorage.getItem("kyc");
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleKycClick = () => {
    if (kyc === "pending") {
      navigate("/kyc-nurse");
    } else if (kyc === "submitted") {
      navigate("/nurse/kyc-status");
    }
  };

  const renderKycNotification = () => {
    if (kyc === "pending") {
      return (
        <div
          onClick={handleKycClick}
          className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg cursor-pointer hover:bg-yellow-200 transition-colors duration-200 animate-pulse flex items-center space-x-2"
        >
          <AlertCircle size={20} className="text-yellow-600" />
          <span className="font-medium">
            Complete your KYC verification to access all features
          </span>
        </div>
      );
    } else if (kyc === "submitted") {
      return (
        <div
          onClick={handleKycClick}
          className="bg-blue-100 border border-blue-400 text-blue-800 px-4 py-3 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors duration-200 animate-pulse flex items-center space-x-2"
        >
          <Clock size={20} className="text-blue-600" />
          <span className="font-medium">
            KYC verification in progress - Click to check status
          </span>
        </div>
      );
    }
    return null;
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
      <div className="hidden md:block md:w-[250px] flex-shrink-0">
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
              <span className="text-lg md:text-xl">Nurse Dashboard</span>
            </div>

            <div className="flex space-x-3">
              <div className="rounded-lg border border-gray-200 w-10 h-10 flex items-center justify-center hover:bg-gray-100">
                <Bell size={18} />
              </div>
              <div className="rounded-lg border border-gray-200 w-10 h-10 flex items-center justify-center hover:bg-gray-100">
                <Bell size={18} />
              </div>
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

          {/* KYC Notification */}
          {renderKycNotification() && (
            <div className="mt-4 mb-4">{renderKycNotification()}</div>
          )}

          <NurseStat />
          <Outlet />
        </div>
      </div>
    </main>
  );
};

export default NurseLayout;
