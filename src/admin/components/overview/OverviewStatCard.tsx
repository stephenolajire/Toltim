import { Calendar, CheckCircle, Clock, Eye, Plus } from "lucide-react";
import React from "react";

const OverviewStatCard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="p-5 h-auto w-full border border-gray-100 shadow hover:border-gray-300 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-black">Total New Bookings</p>
          <span className="text-green-500">
            <Plus size={16} />
          </span>
        </div>
        <div>
          <h1 className="text-blue-500 font-bold text-2xl py-1">45</h1>
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
      </div>

      <div className="p-5 h-auto w-full border border-gray-100 shadow hover:border-gray-300 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-black">Today's Bookings</p>
          <span className="text-green-500">
            <Calendar size={16} />
          </span>
        </div>
        <div>
          <h1 className="text-green-500 font-bold text-2xl py-1">45</h1>
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
      </div>

      <div className="p-5 h-auto w-full border border-gray-100 shadow hover:border-gray-300 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-black">In Progress</p>
          <span className="text-green-500">
            <Clock size={16} />
          </span>
        </div>
        <div>
          <h1 className="text-yellow-500 font-bold text-2xl py-1">8</h1>
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
      </div>

      <div className="p-5 h-auto w-full border border-gray-100 shadow hover:border-gray-300 rounded-lg">
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
      </div>
    </div>
  );
};

export default OverviewStatCard;
