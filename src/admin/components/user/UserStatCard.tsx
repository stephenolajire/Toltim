import {UserCheck, Users, UserX } from "lucide-react";
import React from "react";

interface UserStatProps {
  text1: string,
  text2: string,
  text3: string,
  num1: number,
  num2: number,
  num3: number,
}

const PatientStatCard: React.FC<UserStatProps> = ({text1, text2, text3, num1, num2, num3}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div className="p-5 h-auto w-full border border-gray-100 shadow hover:border-gray-300 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-black">{text1}</p>
          <span className="text-blue-500">
            <Users size={16} />
          </span>
        </div>
        <div>
          <h1 className="text-blue-500 font-bold text-2xl py-1">{num1}</h1>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-500"> </p>
          {/* <button className="text-black border border-gray-200 p-2 rounded-lg flex space-x-2 items-center">
            <span>
              <Eye size={16} />
            </span>
            <span> View More</span>
          </button> */}
        </div>
      </div>

      <div className="p-5 h-auto w-full border border-gray-100 shadow hover:border-gray-300 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-black">{text2}</p>
          <span className="text-green-500">
            <UserCheck size={16} />
          </span>
        </div>
        <div>
          <h1 className="text-green-500 font-bold text-2xl py-1">{num2}</h1>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-500"></p>
          {/* <button className="text-black border border-gray-200 p-2 rounded-lg flex space-x-2 items-center">
            <span>
              <Eye size={16} />
            </span>
            <span> View More</span>
          </button> */}
        </div>
      </div>

      <div className="p-5 h-auto w-full border border-gray-100 shadow hover:border-gray-300 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-black">{text3}</p>
          <span className="text-red-500">
            <UserX size={16} />
          </span>
        </div>
        <div>
          <h1 className="text-red-500 font-bold text-2xl py-1">{num3}</h1>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-500"> </p>
          {/* <button className="text-black border border-gray-200 p-2 rounded-lg flex space-x-2 items-center">
            <span>
              <Eye size={16} />
            </span>
            <span> View More</span>
          </button> */}
        </div>
      </div>

      {/* <div className="p-5 h-auto w-full border border-gray-100 shadow hover:border-gray-300 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-black">Completed</p>
          <span className="text-green-500">
            <CheckCircle size={16} />
          </span>
        </div>
        <div>
          <h1 className="text-green-500 font-bold text-2xl py-1">67</h1>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-gray-500">vs last month</p>
          <button className="text-black border border-gray-200 p-2 rounded-lg flex space-x-2 items-center">
            <span>
              <Eye size={16} />
            </span>
            <span> View More</span>
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default PatientStatCard;
