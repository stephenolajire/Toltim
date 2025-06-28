import {
  Bell,
  CreditCard,
  Heart,
  HeartHandshake,
  Stethoscope,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const RecentData = [
  {
    id: 1,
    recent: "New patient assigned: Mary Johnson",
  },
  {
    id: 2,
    recent: "New patient assigned: Mary Johnson",
  },
];

const Notification: React.FC = () => {
  return (
    <div className="h-auto w-full pb-1 md:pb-10 rounded-lg">
      <div className="flex flex-col space-y-2 text-gray-200 bg-gradient-to-r from-purple-600 to-purple-950 w-full py-6 px-4 rounded-t-lg">
        <div className="flex space-x-4 items-center">
          <Bell className="text-lg lg:text-xl" />
          <h3 className="text-lg lg:text-xl font-bold">
            Notifications & Services
          </h3>
        </div>
        <p className="text-base text-gray-200">
          Recent updates and specialized care
        </p>
      </div>
      <div className="space-y-4">
        <div className="bg-white px-6 pt-6 pb-3">
          <div className="w-full pb-4 h-auto">
            <div className="flex space-x-2 items-center">
              <Bell height={16} width={16} className="text-purple-900" />
              <span className="text-base font-bold text-purple-900">
                Recent Alerts
              </span>
            </div>
            <div className="pt-4">
              {RecentData.map((data) => (
                <div
                  key={data.id}
                  className="flex space-x-3 bg-purple-50 border border-purple-200 items-center p-2 rounded-lg hover:bg-gray-200 mb-3"
                >
                  <p className="text-base text-gray-500 pl-3">{data.recent}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full pb-4 h-auto">
            <div className="flex space-x-2 items-center">
              <Stethoscope height={16} width={16} className="text-green-500" />
              <span className="text-base font-bold text-green-500">
                Quick Services
              </span>
            </div>
            <div className="pt-4">
              <Link to="/dashboard/surgery-care">
                <div className="flex space-x-3 bg-green-100 border border-green-300 items-center p-3 rounded-lg hover:bg-green-200 mb-3">
                  <Heart height={16} width={16} className="text-green-500" />
                  <span className="text-sm font-bold text-green-500">
                    Post Surgery Care
                  </span>
                </div>
              </Link>
              <Link to="/dashboard/vital-signs">
                <div className="flex space-x-3 bg-blue-100 border border-blue-300 items-center p-3 rounded-lg hover:bg-blue-200 mb-3">
                  <TrendingUp
                    height={16}
                    width={16}
                    className="text-blue-500"
                  />
                  <span className="text-sm font-bold text-blue-500">
                    Vital Signs Check
                  </span>
                </div>
              </Link>
              <Link to="/dashboard/elder-care">
                <div className="flex space-x-3 bg-lime-100 border border-lime-300 items-center p-3 rounded-lg hover:bg-lime-200 mb-3">
                  <HeartHandshake
                    height={16}
                    width={16}
                    className="text-lime-500"
                  />
                  <span className="text-sm font-bold text-lime-500">
                    Elder Care
                  </span>
                </div>
              </Link>
              <Link to="/dashboard/fund-wallet">
                <div className="flex space-x-3 bg-yellow-100 border border-yellow-300 items-center p-3 rounded-lg hover:bg-yellow-200 mb-3">
                  <CreditCard
                    height={16}
                    width={16}
                    className="text-yellow-500"
                  />
                  <span className="text-sm font-bold text-yellow-500">
                    Payment History
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
