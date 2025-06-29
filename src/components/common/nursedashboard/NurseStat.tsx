import {
  Calendar,
  Clock4,
  CreditCard,
  User,
  CreditCard as IdCard,
} from "lucide-react";
import React from "react";
import { Link, NavLink } from "react-router-dom";

const NurseStat: React.FC = () => {
  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Nurse Profile Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 my-4 lg:my-6 flex flex-col lg:flex-row lg:items-center justify-between p-6 rounded-xl shadow-lg">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="flex-shrink-0">
              <img
                src="/logo.jpeg"
                alt="Nurse Profile"
                className="h-16 w-16 lg:h-20 lg:w-20 rounded-full border-4 border-white/20 object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl lg:text-2xl font-bold text-white truncate">
                Nurse Rachel Williams, RN
              </h2>
              <p className="text-green-100 text-sm lg:text-base mt-1">
                License: RN-12345 • Specialty: General Nursing, Wound Care
              </p>
              <div className="flex items-center mt-2 text-green-100 text-sm">
                <span className="flex items-center">⭐ 4.9 Rating</span>
                <span className="mx-2">•</span>
                <span>156 Sessions Completed</span>
              </div>
            </div>
          </div>

          <div className="text-center lg:text-right">
            <div className="text-2xl lg:text-3xl font-bold text-white">
              ₦125,000
            </div>
            <div className="text-green-100 text-sm lg:text-base">
              Wallet Balance
            </div>
          </div>
        </div>

        {/* Total Appointments Card */}
        <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-100 text-base lg:text-lg font-medium">
                Total Appointments
              </h3>
              <div className="text-3xl lg:text-5xl font-bold text-white my-2">
                5
              </div>
              <Link
                to="/nurse/dashboard/appointment"
                className="inline-flex items-center text-sm text-blue-100 hover:text-white transition-colors duration-200 underline underline-offset-2"
              >
                Click to view details
              </Link>
            </div>
            <div className="flex-shrink-0">
              <div className="p-3 bg-white/10 rounded-full">
                <Calendar className="h-8 w-8 lg:h-10 lg:w-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="bg-gray-50 p-2 rounded-lg overflow-x-auto hide-scrollbar">
            <nav className="flex space-x-1 min-w-max">
              <NavLink
                to="/nurse/dashboard"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-gray-900 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`
                }
              >
                <User className="h-4 w-4" />
                <span>Patient Requests</span>
              </NavLink>

              <NavLink
                to="/nurse/dashboard/active-patient"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-gray-900 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`
                }
              >
                <Calendar className="h-4 w-4" />
                <span>Active Patients</span>
              </NavLink>

              <NavLink
                to="/nurse/dashboard/appointment"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-gray-900 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`
                }
              >
                <Clock4 className="h-4 w-4" />
                <span>Appointments</span>
              </NavLink>

              <NavLink
                to="/nurse/dashboard/wallet"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-gray-900 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`
                }
              >
                <CreditCard className="h-4 w-4" />
                <span>Wallet</span>
              </NavLink>

              <NavLink
                to="/nurse/dashboard/id-card"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "bg-gray-900 text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                  }`
                }
              >
                <IdCard className="h-4 w-4" />
                <span>ID Card</span>
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NurseStat;
