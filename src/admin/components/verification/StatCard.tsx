import React from "react";
import { Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: "increase" | "decrease" | "neutral";
  icon: "pending" | "verified" | "rejected" | "rate";
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon,
  iconColor,
}) => {
  const getIcon = () => {
    const iconSize = 20;
    switch (icon) {
      case "pending":
        return <Clock size={iconSize} className={iconColor} />;
      case "verified":
        return <CheckCircle size={iconSize} className={iconColor} />;
      case "rejected":
        return <XCircle size={iconSize} className={iconColor} />;
      case "rate":
        return <TrendingUp size={iconSize} className={iconColor} />;
      default:
        return <Clock size={iconSize} className={iconColor} />;
    }
  };

  const getChangeColor = () => {
    switch (changeType) {
      case "increase":
        return "text-green-600";
      case "decrease":
        return "text-red-600";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header with title and icon */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <div className="p-2 rounded-lg bg-gray-50">{getIcon()}</div>
      </div>

      {/* Main value */}
      <div className="mb-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>

      {/* Change indicator */}
      <div className="flex items-center">
        <p className={`text-sm ${getChangeColor()}`}>{change}</p>
      </div>
    </div>
  );
};

export default StatCard