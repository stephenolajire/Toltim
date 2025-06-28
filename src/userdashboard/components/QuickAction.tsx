import { CreditCard, Heart, HeartHandshake, NotebookPen, Stethoscope, TrendingUp, User } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const QuickAction: React.FC = () => {
  return (
    <div className="h-auto w-full pb-1 md:pb-10 rounded-lg">
      <div className="flex flex-col space-y-2 text-gray-200 bg-green-600 w-full py-6 px-4 rounded-t-lg">
        <div className="flex space-x-4 items-center">
          <TrendingUp className="text-lg lg:text-xl" />
          <h3 className="text-lg lg:text-xl font-bold">Quick Actions</h3>
        </div>
        <p className="text-base text-gray-200">
          Navigate to important sections
        </p>
      </div>
      <div className="space-y-4">
        <div className="bg-white px-6 pt-6 pb-3">
          <Link to="/dashboard/profile">
            <div className="flex space-x-3 bg-blue-100 border border-blue-300 items-center p-3 rounded-lg hover:bg-blue-200 mb-3">
              <User height={16} width={16} className="text-blue-500" />
              <span className="text-sm font-bold text-blue-500">
                Profile
              </span>
            </div>
          </Link>

          <Link to="/dashboard/health">
            <div className="flex space-x-3 bg-green-100 border border-green-300 items-center p-3 rounded-lg hover:bg-green-200 mb-3">
              <Stethoscope height={16} width={16} className="text-green-500" />
              <span className="text-sm font-bold text-green-500">
                Health Assessment
              </span>
            </div>
          </Link>

          <Link to="/dashboard/nursing">
            <div className="flex space-x-3 bg-red-100 border border-red-300 items-center p-3 rounded-lg hover:bg-red-200 mb-3">
              <Heart height={16} width={16} className="text-red-500" />
              <span className="text-sm font-bold text-red-500">
                Book Nursing Procedure
              </span>
            </div>
          </Link>

          <Link to="/dashboard/test">
            <div className="flex space-x-3 bg-purple-100 border border-purple-300 items-center p-3 rounded-lg hover:bg-purple-200 mb-3">
              <NotebookPen height={16} width={16} className="text-purple-500" />
              <span className="text-sm text-purple-500">
                Test Recommendation
              </span>
            </div>
          </Link>

          <Link to="/dashboard/caregiver">
            <div className="flex space-x-3 bg-lime-100 border border-lime-300 items-center p-3 rounded-lg hover:bg-lime-200 mb-3">
              <HeartHandshake height={16} width={16} className="text-lime-500" />
              <span className="text-sm font-bold text-lime-500">
                Book Caregiver
              </span>
            </div>
          </Link>

          <Link to="/dashboard/payment">
            <div className="flex space-x-3 bg-yellow-100 border border-yellow-300 items-center p-3 rounded-lg hover:bg-yellow-200 mb-3">
              <CreditCard height={16} width={16} className="text-yellow-500" />
              <span className="text-sm font-bold text-yellow-500">
                Payment History
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickAction;
