import React from "react";
import { X } from "lucide-react";

interface StatsData {
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  completed: number;
  total: number;
}

interface StatsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data?: StatsData;
}

const StatsDetailModal: React.FC<StatsDetailModalProps> = ({
  isOpen,
  onClose,
  title,
  data,
}) => {
  if (!isOpen) return null;

  const stats = [
    {
      label: "Pending",
      value: data?.pending || 0,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      label: "Approved",
      value: data?.approved || 0,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      label: "Rejected",
      value: data?.rejected || 0,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
    {
      label: "Cancelled",
      value: data?.cancelled || 0,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      label: "Completed",
      value: data?.completed || 0,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
  ];

  const calculatePercentage = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : 0;
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">{title} Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className={`p-4 rounded-lg border border-gray-200 ${stat.bgColor}`}
              >
                <p className="text-gray-600 text-sm mb-2">{stat.label}</p>
                <div className="flex items-end justify-between">
                  <h3 className={`text-3xl font-bold ${stat.color}`}>
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {calculatePercentage(stat.value, data?.total || 0)}%
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Status Distribution
            </h3>
            <div className="space-y-3">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      {stat.label}
                    </span>
                    <span className="text-sm text-gray-600">
                      {calculatePercentage(stat.value, data?.total || 0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${stat.color.replace(
                        "text",
                        "bg"
                      )}`}
                      style={{
                        width: `${calculatePercentage(
                          stat.value,
                          data?.total || 0
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-gray-700">
              <span className="font-semibold">Total {title}:</span>{" "}
              <span className="text-2xl font-bold text-blue-600">
                {data?.total || 0}
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-gray-200 bg-white">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatsDetailModal;
