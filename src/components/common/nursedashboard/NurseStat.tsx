import { Calendar, Clock4, CreditCard, IdCard, User } from 'lucide-react';
import React from 'react'
import { Link, NavLink } from 'react-router-dom';

const NurseStat:React.FC = () => {
  return (
    <div className="sticky top-0 z-50 px-2 sm:px-4 md:px-20 lg:px-50">
      <div className="bg-green-700 my-2 md:my-4 lg:my-8 flex flex-col items-start space-y-3 md:flex-row md:items-center justify-between p-4 rounded-lg">
        <div className="flex flex-row space-x-4">
          <div className="hidden md:block">
            <img
              src="/logo.jpeg"
              alt="logo"
              className="h-15 w-15 rounded-full"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <h3 className="text-xl font-bold lg:text-2xl text-gray-100">
              Nurse Rachel Williams, RN
            </h3>
            <p className="text-base text-gray-200">
              License: RN-12345 • Specialty: General Nursing, Wound Care
            </p>
            <span className="text-gray-100 text-sm">
              ⭐ 4.9 Rating 156 Sessions Completed
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold lg:text-2xl text-gray-100">
            ₦125,000
          </h3>
          <span className="text-gray-200 text-sm">Wallet Balance</span>
        </div>
      </div>

      <div className="mb-2 md:mb-4 lg:mb-8 flex justify-between items-center bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-lg">
        <div>
          <h6 className="text-base md:text-lg text-gray-200">
            Total Appointment
          </h6>
          <h1 className="text-xl md:text-3xl lg:text-5xl font-bold my-2 text-gray-100">
            5
          </h1>
          <Link
            to="/nurse/dashboard/appointment"
            className="text-sm text-gray-200"
          >
            Click to view details
          </Link>
        </div>
        <div>
          <Calendar height={40} width={40} className="text-gray-100" />
        </div>
      </div>

      <div className="h-auto w-full bg-gray-100 mb-2 md:mb-4 lg:mb-8 flex overflow-x-auto md:flex md:items-center md:justify-between">
        <NavLink
          to="/nurse/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors w-auto ${
              isActive
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`
          }
        >
          <User height={16} width={16} />
          <span>PatientRequest</span>
        </NavLink>

        <NavLink
          to="/nurse/dashboard/active-patient"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`
          }
        >
          <Calendar height={16} width={16} />
          <span>ActivePatients</span>
        </NavLink>

        <NavLink
          to="/nurse/dashboard/appointment"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`
          }
        >
          <Clock4 height={16} width={16} />
          <span>Appointment</span>
        </NavLink>

        <NavLink
          to="/nurse/dashboard/wallet"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`
          }
        >
          <CreditCard height={16} width={16} />
          <span>Wallet</span>
        </NavLink>

        <NavLink
          to="/nurse/dashboard/id-card"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              isActive
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`
          }
        >
          <IdCard height={16} width={16} />
          <span>IDCard</span>
        </NavLink>
      </div>
    </div>
  );
}

export default NurseStat
